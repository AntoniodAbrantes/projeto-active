import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";

const transformations = [
    {
        src: "/Midia/imagemantesedepois.jpeg",
        tag: "Perda de Gordura e Definição",
    },
    {
        src: "/Midia/imagem1antesedepois.jpeg",
        tag: "Ganho Acelerado de Massa",
    },
    {
        src: "/Midia/imagem2antesedepois.jpeg",
        tag: "Transformação Completa em 35 Dias",
    },
];

const TransformationSection = () => {
    return (
        <section id="transformations" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
            {/* Background Decorators */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -left-40 top-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -right-40 bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
                            <Trophy className="w-4 h-4" />
                            Resultados Reais
                        </div>

                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-oswald uppercase tracking-tight mb-6">
                            A Sua <span className="text-gradient">Melhor Versão</span> Começa Aqui.
                        </h2>

                        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Resultados de pessoas reais. Veja a transformação física e mental de quem já viveu a experiência Projeto Active na última edição.
                            Estas imagens não mentem – a metodologia funciona.
                        </p>
                    </motion.div>
                </div>

                {/* Masonry / Grid Layout for Pre-Processed Antes/Depois Assets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                    {transformations.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black/40 border border-white/5 flex flex-col"
                        >
                            {/* Asset Display */}
                            <img
                                src={item.src}
                                alt={`Inspiração de Transformação ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105 opacity-90"
                            />

                            {/* Overlay Gradient (Bottom fade) */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                            {/* Tag / Description overlay */}
                            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center text-center">
                                <span className="bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md mb-3 transform scale-95 group-hover:scale-100 transition-transform">
                                    {item.tag}
                                </span>
                                <p className="text-white/80 text-xs sm:text-sm flex items-center gap-1">
                                    Resultados da Edição Passada <ArrowRight className="w-3 h-3" />
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Optional Call to Action to scroll down to Registration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground/60 text-sm font-medium">
                        Você é o próximo? O <strong className="text-primary/80">#TeamActive</strong> te aguarda.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default TransformationSection;
