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
    const stickyContainerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Performance Optimization: Use refs for mutable values
    const currentFrameRef = useRef(0);

    // Determine active config based on viewport
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const activeBaseUrl = (isMobile && mobileBaseUrl) ? mobileBaseUrl : baseUrl;
    const activePrefix = (isMobile && mobilePrefix) ? mobilePrefix : prefix;
    const activeCount = (isMobile && mobileCount) ? mobileCount : frameCount;

    // Correctly check absolute loaded state against active target
    const isFullyLoaded = loadedCount === activeCount && images.length === activeCount;

    // Preload images
    useEffect(() => {
        let isActive = true;
        setImages([]);
        setLoadedCount(0);
        setError(null);

        const loadedImages: HTMLImageElement[] = [];
        let count = 0;
        let hasError = false;

        console.log(`[HeroScrollSequence] Loading ${activeCount} frames from ${activeBaseUrl}/${activePrefix}...`);

        for (let i = 0; i < activeCount; i++) {
            const img = new Image();
            const frameIndex = i.toString().padStart(3, '0');
            const src = `${activeBaseUrl}/${activePrefix}${frameIndex}.${extension}`;

            img.src = src;

            img.onload = () => {
                if (!isActive) return;
                count++;
                setLoadedCount(count);
                if (count === activeCount && !hasError) {
                    setImages(loadedImages);
                    console.log('[HeroScrollSequence] All frames loaded successfully');
                }
            };

            img.onerror = (e) => {
                if (!isActive) return;
                console.error(`[HeroScrollSequence] Failed to load frame ${i}: ${src}`, e);
                hasError = true;
                setError(`Failed to load frame ${i} (${src})`);
            };

            loadedImages[i] = img;
        }

        return () => {
            isActive = false;
        };
    }, [activeCount, activeBaseUrl, activePrefix, extension]);

    // Draw frame function - Optimized
    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[index];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Maintain aspect ratio (Object-fit: cover equivalent)
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        const r = Math.max(cw / iw, ch / ih);
        const nw = iw * r;
        const nh = ih * r;
        const cx = (cw - nw) / 2;
        const cy = (ch - nh) / 2;

        ctx.drawImage(img, cx, cy, nw, nh);
    }, [images]);

    // Initial draw
    useEffect(() => {
        if (isFullyLoaded) {
            drawFrame(0);
        }
    }, [isFullyLoaded, drawFrame]);

    // Handle Scroll - Native implementation with sticky positioning
    useEffect(() => {
        if (!isFullyLoaded) return;

        const handleScroll = () => {
            const container = containerRef.current;
            const stickyRect = stickyContainerRef.current?.getBoundingClientRect();

            if (!container) return;

            // Calculate progress based on container position relative to viewport
            const containerRect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Total scrollable distance within the container
            // We want the animation to start when container top hits 0
            // And end when container bottom hits window bottom (or logical end)

            // Distance the user scrolls while the element is sticky
            const scrollDistance = containerRect.height - windowHeight;

            // How far have we scrolled?
            // containerRect.top is negative as we scroll down
            const scrolled = -containerRect.top;

            // Clamp progress between 0 and 1
            const rawProgress = Math.max(0, Math.min(1, scrolled / scrollDistance));

            // Map progress to frame index
            const frameIndex = Math.min(
                activeCount - 1,
                Math.floor(rawProgress * activeCount)
            );

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                requestAnimationFrame(() => {
                    drawFrame(frameIndex);

                    // Fade out overlay
                    const overlay = document.getElementById('hero-content-overlay');
                    if (overlay) {
                        // Fade out quickly (by 10% progress)
                        const opacity = Math.max(0, 1 - (frameIndex / (activeCount * 0.1)));
                        overlay.style.opacity = opacity.toString();
                        // Hide strictly to avoid clicks when invisible
                        overlay.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
                    }
                });
            }
        };

        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                drawFrame(currentFrameRef.current);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        handleResize(); // Init size

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [isFullyLoaded, activeCount, drawFrame]);

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: '400vh' }} // Taller container for scroll distance
        >
            <div
                ref={stickyContainerRef}
                className="sticky top-0 left-0 w-full h-screen overflow-hidden"
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />

                {/* Loading overlay - Absolute on top */}
                {!isFullyLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-1000">
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-gradient-to-r from-fire to-ice transition-all duration-300"
                                    style={{ width: `${(loadedCount / activeCount) * 100}%` }}
                                />
                            </div>
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/40">
                                Initializing Hero Sequence {Math.round((loadedCount / activeCount) * 100)}%
                            </p>
                        </div>
                    </div>
                )}

                {/* Error overlay */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-fire text-xs uppercase tracking-widest font-bold z-50">
                        Protocol Error: {error}
                    </div>
                )}

                {/* Content Overlay */}
                <div
                    id="hero-content-overlay"
                    className="absolute inset-0 z-10 transition-opacity duration-300 ease-out flex flex-col"
                    style={{ opacity: 1 }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default HeroScrollSequence;
