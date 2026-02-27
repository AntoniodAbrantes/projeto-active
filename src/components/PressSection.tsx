import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PressSection = () => {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Na Mídia
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-oswald uppercase">
            O Projeto Active é <span className="text-gradient">notícia</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-glass rounded-2xl overflow-hidden hover:border-glow transition-all duration-300"
        >
          <a
            href="https://noticiadeprimeira.com.br/noticia/150/orla-de-joao-pessoa-se-transforma-em-espaco-de-saude-bem-estar-e-qualidade-de-vida"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row group"
          >
            <div className="md:w-1/2">
              <img
                src="/Midia/noticia-jornal.png"
                alt="Notícia sobre o Projeto Active no jornal"
                className="w-full h-48 sm:h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Notícia de Primeira • Paraíba
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                "Orla de João Pessoa se transforma em espaço de saúde, bem-estar
                e qualidade de vida"
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O Projeto Active foi destaque na mídia local como referência em
                treinos funcionais ao ar livre na orla de João Pessoa, promovendo
                saúde e qualidade de vida para a comunidade.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                <ExternalLink className="w-4 h-4" />
                Ler matéria completa
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PressSection;
