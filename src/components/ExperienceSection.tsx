import { motion } from "framer-motion";

const ExperienceSection = () => {
  return (
    <section id="experience" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 section-gradient">
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-24"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            O Projeto
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase max-w-4xl mx-auto leading-tight">
            O ecossistema definitivo para quem{" "}
            <span className="text-gradient">decidiu conquistar.</span>
          </h2>
          <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Se você sente que está estagnado ou que falta um método real para
            mudar seu corpo e sua mente, nós somos o seu próximo nível.
          </p>
        </motion.div>

        {/* O Método */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-14"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
            O Método
          </p>
          <h3 className="text-xl sm:text-2xl md:text-4xl font-black font-oswald uppercase">
            Ciência, Suor e Direcionamento
          </h3>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-muted-foreground max-w-xl mx-auto">
            Unimos as duas maiores autoridades para garantir que seu esforço não
            seja desperdiçado.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 sm:gap-16 mt-8 sm:mt-16">
          {/* Pedro */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-gradient-to-br from-secondary/80 to-background border border-white/5 group"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 h-[350px] md:h-[500px] relative overflow-hidden">
                <img
                  src="/Midia/pedro-montenegro.png"
                  alt="Pedro Montenegro"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.9) contrast(1.1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-background/50 md:to-background" />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-12 lg:p-16 relative z-10 -mt-20 md:mt-0 flex flex-col justify-center text-left">
                <p className="text-primary font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
                  Pedro Montenegro
                </p>
                <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black font-oswald uppercase mb-4 sm:mb-6 text-white leading-tight drop-shadow-md">
                  Treinamento <br />de <span className="text-gradient">Elite</span>
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed font-medium">
                  Mais do que suar a camisa. <span className="text-white font-bold">Pedro Montenegro</span> estrutura
                  a ciência do seu resultado. Metodologia de ponta voltada para hipertrofia e emagrecimento real. Sem mimimi, com técnica.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Luciano */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-gradient-to-bl from-secondary/80 to-background border border-white/5 group"
          >
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="w-full md:w-1/2 h-[350px] md:h-[500px] relative overflow-hidden">
                <img
                  src="/Midia/luciano-nutri.png"
                  alt="Nutricionista Luciano"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.9) contrast(1.1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-background/50 md:to-background" />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-12 lg:p-16 relative z-10 -mt-20 md:mt-0 flex flex-col justify-center text-left md:text-right">
                <p className="text-primary font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
                  Luciano Nutricionista
                </p>
                <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black font-oswald uppercase mb-4 sm:mb-6 text-white leading-tight drop-shadow-md">
                  Nutrição <br /><span className="text-gradient">Estratégica</span>
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed font-medium">
                  Dieta não é passar fome, é combustível. <span className="text-white font-bold">Luciano</span> desenha
                  a sua estratégia alimentar para maximizar a performance, preservar massa e derreter gordura de forma
                  absolutamente sustentável.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-6 sm:mt-12 text-xs sm:text-base text-muted-foreground italic max-w-lg mx-auto"
        >
          "Aqui, você não treina sozinho. Você é guiado por quem entende de
          transformação."
        </motion.p>
      </div>
    </section>
  );
};

export default ExperienceSection;
