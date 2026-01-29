import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GALLERY_IMAGES = [
    '/gallery/gallery-1.jpg',
    '/gallery/gallery-2.jpg',
    '/gallery/gallery-3.jpg'
];

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen) return null;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-300 pointer-events-none">
                {/* Controls */}
                <div className="absolute top-0 right-0 p-4 z-50 pointer-events-auto flex items-center gap-4">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm group"
                    >
                        <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Main Image Container */}
                <div className="pointer-events-auto relative w-full h-[80vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black/50 border border-white/10 group">
                    <img
                        src={GALLERY_IMAGES[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        className="w-full h-full object-contain"
                    />

                    {/* Internal Navigation (visible on hover/mobile) */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="p-3 md:p-4 rounded-full bg-black/50 hover:bg-fire/80 text-white transition-all backdrop-blur-sm border border-white/10 hover:border-fire/50 hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="p-3 md:p-4 rounded-full bg-black/50 hover:bg-ice/80 text-white transition-all backdrop-blur-sm border border-white/10 hover:border-ice/50 hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-widest uppercase shadow-lg">
                        Image {currentIndex + 1} / {GALLERY_IMAGES.length}
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="pointer-events-auto mt-6 flex items-center space-x-3 overflow-x-auto max-w-full p-2 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 scrollbar-hide">
                    {GALLERY_IMAGES.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 shrink-0 ${idx === currentIndex
                                    ? 'ring-2 ring-white scale-110 opacity-100'
                                    : 'opacity-50 hover:opacity-100 hover:scale-105 ring-1 ring-white/20'
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
