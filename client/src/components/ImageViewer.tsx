// components/ImageViewer.tsx
import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react'; // o cualquier ícono
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

const ImageViewer: React.FC<Props> = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
    const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
    const [touchEndX, setTouchEndX] = React.useState<number | null>(null);
    const [direction, setDirection] = React.useState<"left" | "right">("right");

    /* Funciones para el swipe en mobiles */
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setTouchEndX(e.changedTouches[0].clientX);
    };

    const handleNext = () => {
        setDirection("right");
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection("left");
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const variants = {
        enter: (direction: "left" | "right") => ({
            x: direction === "right" ? 200 : -200,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: "left" | "right") => ({
            x: direction === "right" ? -200 : 200,
            opacity: 0,
        }),
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    useEffect(() => {
        if (touchStartX !== null && touchEndX !== null) {
            const distance = touchStartX - touchEndX;

            if (distance > 50) {
                handleNext(); // Swipe izquierda
            } else if (distance < -50) {
                handlePrev(); // Swipe derecha
            }

            // Reiniciar para evitar múltiples triggers
            setTouchStartX(null);
            setTouchEndX(null);
        }
    }, [touchEndX]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Cerrar */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white cursor-pointer z-50 cursor-pointer"
            >
                <X size={32} />
            </button>

            {/* Imagen */}
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence custom={direction} mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Imagen ${currentIndex + 1}`}
                        className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-xl absolute"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={direction}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>
            </div>

            {images.length > 1 && (
                <button onClick={handlePrev} className="absolute left-4 text-white cursor-pointer">
                    <ChevronLeft size={40} />
                </button>
            )}

            {images.length > 1 && (
                <button onClick={handleNext} className="absolute right-4 text-white cursor-pointer">
                    <ChevronRight size={40} />
                </button>
            )}

        </div>
    );
};

export default ImageViewer;
