import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HeroScrollSequenceProps {
    frameCount: number;
    baseUrl: string;
    prefix: string;
    extension: string;
    mobileBaseUrl?: string;
    mobilePrefix?: string;
    mobileCount?: number;
    children?: React.ReactNode;
}

const HeroScrollSequence: React.FC<HeroScrollSequenceProps> = ({
    frameCount,
    baseUrl,
    prefix,
    extension,
    mobileBaseUrl,
    mobilePrefix,
    mobileCount,
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(-1);

    const [loadedCount, setLoadedCount] = useState(0);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Calculate content opacity based on scroll progress
    // Visible at start (0-5%), fade out during scroll (5-15%), hidden during animation (15-85%), fade in at end (85-100%)
    const getContentOpacity = () => {
        if (scrollProgress < 0.05) return 1; // Fully visible at start
        if (scrollProgress < 0.15) return 1 - ((scrollProgress - 0.05) / 0.1); // Fade out
        if (scrollProgress < 0.85) return 0; // Hidden during animation
        return (scrollProgress - 0.85) / 0.15; // Fade in at end
    };

    const contentOpacity = getContentOpacity();

    const activeCount = isMobile ? (mobileCount || frameCount) : frameCount;
    const activeBaseUrl = isMobile ? (mobileBaseUrl || baseUrl) : baseUrl;
    const activePrefix = isMobile ? (mobilePrefix || prefix) : prefix;

    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const idx = Math.max(0, Math.min(activeCount - 1, index));
        const img = imagesRef.current[idx];

        if (!img || !img.complete) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        const r = Math.max(cw / iw, ch / ih);
        const nw = iw * r;
        const nh = ih * r;
        const cx = (cw - nw) / 2;
        const cy = (ch - nh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, cx, cy, nw, nh);
    }, [activeCount]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            if (mobile !== isMobile) setIsMobile(mobile);

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                drawFrame(currentFrameRef.current === -1 ? 0 : currentFrameRef.current);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile, drawFrame]);

    useEffect(() => {
        let isActive = true;
        imagesRef.current = [];
        setLoadedCount(0);
        setIsFullyLoaded(false);

        const total = activeCount;
        let count = 0;

        for (let i = 0; i < total; i++) {
            const img = new Image();
            const frameStr = i.toString().padStart(3, '0');
            img.src = `${activeBaseUrl}/${activePrefix}${frameStr}.${extension}`;

            img.onload = () => {
                if (!isActive) return;
                imagesRef.current[i] = img;
                count++;
                setLoadedCount(count);
                if (i === 0 && currentFrameRef.current === -1) {
                    currentFrameRef.current = 0;
                    requestAnimationFrame(() => drawFrame(0));
                }
                if (count === total) setIsFullyLoaded(true);
            };

            img.onerror = () => {
                if (!isActive) return;
                count++;
                setLoadedCount(count);
                if (count === total) setIsFullyLoaded(true);
            };
        }

        return () => { isActive = false; };
    }, [activeCount, activeBaseUrl, activePrefix, extension, drawFrame]);

    useEffect(() => {
        let rafId: number | null = null;
        let lastScrollTime = 0;
        const targetFPS = 60; // Target 60 FPS for smooth animation
        const frameInterval = 1000 / targetFPS;

        const handleScroll = () => {
            const now = performance.now();

            // Throttle to target FPS for consistent smooth playback
            if (now - lastScrollTime < frameInterval) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => handleScroll());
                return;
            }
            lastScrollTime = now;

            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollDistance = rect.height - windowHeight;
            const scrollOffset = -rect.top;

            const progress = Math.max(0, Math.min(1, scrollOffset / scrollDistance));
            const frameIndex = Math.min(activeCount - 1, Math.floor(progress * activeCount));

            // Update scroll progress for content opacity
            setScrollProgress(progress);

            // Always update frame for smoother motion
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [activeCount, drawFrame]);

    // Force scroll lock during initial load
    useEffect(() => {
        if (!isFullyLoaded) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFullyLoaded]);

    return (
        <section
            ref={containerRef}
            className="relative w-full overflow-visible"
            style={{ height: '300vh', backgroundColor: '#000' }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: 0,
                    overflow: 'hidden',
                    backgroundColor: '#000'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                />

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: contentOpacity,
                        transition: 'opacity 0.3s ease-out'
                    }}
                >
                    <div style={{ pointerEvents: contentOpacity > 0.5 ? 'auto' : 'none', flex: 1 }}>
                        {children}
                    </div>
                </div>

                {!isFullyLoaded && (
                    <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center">
                        <div className="text-center px-10">
                            <div className="w-64 h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-ice shadow-[0_0_15px_rgba(0,198,255,1)] transition-all duration-300"
                                    style={{ width: `${(loadedCount / activeCount) * 100}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-ice uppercase tracking-[0.5em] font-bold animate-pulse">
                                Syncing Odyssey {Math.round((loadedCount / activeCount) * 100)}%
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroScrollSequence;
