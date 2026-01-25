import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HeroScrollSequenceProps {
    frameCount: number;
    baseUrl: string;
    prefix: string;
    extension: string;
    mobileBaseUrl?: string; // Optional: separate path for mobile assets
    mobilePrefix?: string;  // Optional: separate prefix for mobile assets
    mobileCount?: number;   // Optional: different frame count for mobile
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
    const overlayRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isInView, setIsInView] = useState(true);

    // Performance Optimization: Use refs for mutable values to avoid re-renders
    const currentFrameRef = useRef(0);
    const accumulatedDelta = useRef(0);

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

    // Draw frame function - Optimized to run outside React render cycle
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

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (isFullyLoaded) {
                drawFrame(currentFrameRef.current);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [isFullyLoaded, drawFrame]);

    // Draw initial frame when loaded
    useEffect(() => {
        if (isFullyLoaded) {
            drawFrame(0);
        }
    }, [isFullyLoaded, drawFrame]);

    // Scroll lock logic using wheel event - Optimized
    useEffect(() => {
        if (!isFullyLoaded) return;

        const SCROLL_SENSITIVITY = 22;

        const handleWheel = (e: WheelEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const isHeroInView = rect.top <= 0 && rect.bottom > 0;

            if (!isHeroInView) {
                setIsInView(false);
                return;
            }

            setIsInView(true);

            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;
            const atFirstFrame = currentFrameRef.current === 0;
            const atLastFrame = currentFrameRef.current >= activeCount - 1;

            if ((atLastFrame && scrollingDown) || (atFirstFrame && scrollingUp && rect.top >= 0)) {
                setIsLocked(false);
                return;
            }

            e.preventDefault();
            setIsLocked(true);

            accumulatedDelta.current += e.deltaY;
            const framesToMove = Math.floor(accumulatedDelta.current / SCROLL_SENSITIVITY);

            if (framesToMove !== 0) {
                accumulatedDelta.current = accumulatedDelta.current % SCROLL_SENSITIVITY;

                // Update frame index directly via ref
                const newFrame = Math.max(0, Math.min(activeCount - 1, currentFrameRef.current + framesToMove));

                if (newFrame !== currentFrameRef.current) {
                    currentFrameRef.current = newFrame;

                    // Draw directly via requestAnimationFrame
                    requestAnimationFrame(() => {
                        drawFrame(newFrame);

                        // Update overlay opacity directly via ref (bypass React render)
                        if (overlayRef.current) {
                            // Fade out quickly (10% progress)
                            const opacity = Math.max(0, 1 - (newFrame / (activeCount * 0.1)));
                            overlayRef.current.style.opacity = opacity.toString();
                        }
                    });
                }
            }
        };

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();

            if (rect.bottom > window.innerHeight && rect.top < window.innerHeight) {
                if (currentFrameRef.current >= activeCount - 1) {
                    currentFrameRef.current = activeCount - 1;
                    setIsLocked(true);
                    setIsInView(true);
                }
            }

            if (rect.bottom <= 0) {
                setIsInView(false);
            }
        };

        // Touch handling state
        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const isHeroInView = rect.top <= 0 && rect.bottom > 0;

            if (!isHeroInView) {
                setIsInView(false);
                return;
            }

            setIsInView(true);

            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY; // Calculate delta like wheel (drag up = scroll down = positive delta)
            touchStartY = touchY; // Update for next move event

            const scrollingDown = deltaY > 0;
            const scrollingUp = deltaY < 0;
            const atFirstFrame = currentFrameRef.current === 0;
            const atLastFrame = currentFrameRef.current >= activeCount - 1;

            if ((atLastFrame && scrollingDown) || (atFirstFrame && scrollingUp && rect.top >= 0)) {
                setIsLocked(false);
                return;
            }

            // Lock scroll if inside animation
            if (e.cancelable) {
                e.preventDefault();
            }
            setIsLocked(true);

            accumulatedDelta.current += deltaY * 3; // Multiplier to match touch sensitivity
            const framesToMove = Math.floor(accumulatedDelta.current / SCROLL_SENSITIVITY);

            if (framesToMove !== 0) {
                accumulatedDelta.current = accumulatedDelta.current % SCROLL_SENSITIVITY;

                const newFrame = Math.max(0, Math.min(activeCount - 1, currentFrameRef.current + framesToMove));

                if (newFrame !== currentFrameRef.current) {
                    currentFrameRef.current = newFrame;
                    requestAnimationFrame(() => {
                        drawFrame(newFrame);
                        if (overlayRef.current) {
                            const opacity = Math.max(0, 1 - (newFrame / (activeCount * 0.1)));
                            overlayRef.current.style.opacity = opacity.toString();
                        }
                    });
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isFullyLoaded, activeCount, drawFrame]);

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: '100vh' }}
        >
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden" style={{ zIndex: isInView && isFullyLoaded ? 0 : -1, opacity: isInView ? 1 : 0 }}>
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Loading overlay */}
            {!isFullyLoaded && (
                <div className="fixed inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-1000">
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
                <div className="fixed inset-0 flex items-center justify-center bg-black/80 text-fire text-xs uppercase tracking-widest font-bold z-50">
                    Protocol Error: {error}
                </div>
            )}

            {/* Content overlay - Fades out as you scroll */}
            <div
                ref={overlayRef}
                className="relative z-10 h-full transition-opacity duration-300 ease-out"
                style={{
                    // Initial opacity
                    opacity: 1
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default HeroScrollSequence;
