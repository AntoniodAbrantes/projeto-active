import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Dumbbell, Zap, Gift, Smartphone } from "lucide-react";

const FinalCTA = () => {
    return (
        <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#030303] border-t border-white/5">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 sm:mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/20">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Turma Ouro - Vagas Esgotando
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-oswald uppercase leading-tight mb-4">
                        Não Deixe Para <span className="text-gradient">Depois</span>
                    </h2>
                    <p className="text-base sm:text-xl text-muted-foreground w-full max-w-2xl mx-auto">
                        A sua transformação física e mental começa no momento em que você decide entrar.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
                        <Link
                            to="/inscricao"
                            className="w-full sm:w-auto relative py-5 sm:py-6 px-8 sm:px-12 rounded-xl text-lg sm:text-xl font-black uppercase text-center overflow-hidden group bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                        >
                            <span className="relative z-10 w-full flex items-center justify-center">
                                Garantir Minha Vaga Agora
                            </span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out skew-x-12" />
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Compra 100% Segura
                        </p>
                        <span className="hidden md:inline text-white/20">|</span>
                        <p className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" /> Acesso Imediato
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
