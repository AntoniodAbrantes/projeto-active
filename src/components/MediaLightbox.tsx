import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type MediaType = "image" | "video";

export interface MediaItem {
    id: string; // Add a unique ID for React keys
    src: string;
    alt: string;
    type: MediaType;
    span?: string;
}

interface MediaLightboxProps {
    item: MediaItem | null;
    onClose: () => void;
}

export const MediaLightbox = ({ item, onClose }: MediaLightboxProps) => {
    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (item) {
            window.addEventListener("keydown", handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [item, onClose]);

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
                >
                    {/* Backdrop Blur Overlay */}
                    <div
                        className="absolute inset-0 bg-background/90 backdrop-blur-sm cursor-pointer"
                        onClick={onClose}
                    />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[101] p-2 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>

                    {/* Media Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="relative z-[101] w-full max-w-5xl max-h-[85vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the media itself
                    >
                        {item.type === "video" ? (
                            <video
                                src={item.src}
                                controls // Show native controls in full screen explicitly
                                autoPlay
                                playsInline
                                className="w-full h-full max-h-[85vh] object-contain bg-black/50"
                            />
                        ) : (
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full max-h-[85vh] object-contain bg-black/50"
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
