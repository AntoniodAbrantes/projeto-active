import { motion } from "framer-motion";
import { Award } from "lucide-react";

const PrizesSection = () => {
  return (
    <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 section-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Award className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Premiação
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase mb-4 sm:mb-6">
            Sua evolução{" "}
            <span className="text-gradient">vale prêmios</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            No Active, o seu esforço é recompensado literalmente. Os alunos que
            apresentarem as transformações mais impactantes ao final do projeto
            serão premiados.
          </p>
        </motion.div>

        {/* Prize images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto"
        >
          <div className="card-glass rounded-2xl overflow-hidden hover:border-glow transition-all duration-300">
            <img
              src="/Midia/ganhadora1.jpeg"
              alt="Ganhadora premiada"
              className="w-full h-40 sm:h-52 object-cover"
            />
          </div>
          <div className="card-glass rounded-2xl overflow-hidden hover:border-glow transition-all duration-300">
            <img
              src="/Midia/ganhadora2.jpeg"
              alt="Ganhadora premiada"
              className="w-full h-40 sm:h-52 object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 text-base sm:text-lg md:text-xl font-bold text-foreground"
        >
          Pare de adiar o corpo e a mente que você sempre quis.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-2 text-sm sm:text-base text-muted-foreground"
        >
          O Projeto Active é o seu passaporte para uma nova realidade.
        </motion.p>
      </div>
    </section>
  );
};

export default PrizesSection;
