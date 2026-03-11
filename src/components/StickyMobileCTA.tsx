import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StickyMobileCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show the sticky CTA only after scrolling past the hero section (roughly 100vh)
            // and hide it when reaching the very end where the actual form is.
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight;

            // Calculate how close to bottom we are to hide it when form is visible
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.innerHeight + scrollY;
            const distanceToBottom = documentHeight - scrollPosition;

            // Show if past hero AND not at the very bottom (hide 800px from bottom to avoid overlapping form)
            if (scrollY > heroHeight && distanceToBottom > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToRegistration = () => {
        document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 p-4 z-50 md:hidden bg-background/80 backdrop-blur-md border-t border-white/10"
                >
                    <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Vagas Esgotando
                            </span>
                            <span className="text-sm font-semibold text-white/90">Faça parte do time</span>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={scrollToRegistration}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold uppercase glow-primary shadow-lg flex-shrink-0"
                        >
                            Garantir Vaga
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyMobileCTA;
