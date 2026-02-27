import { motion } from "framer-motion";

const differentials = [
  {
    image: "/Midia/IMG_5510.mp4",
    title: "Comunidade Blindada",
    description: "Entre em um grupo focado em evoluir, com suporte mútuo e energia imparável.",
  },
  {
    image: "/Midia/ganhadora1.jpeg",
    title: "Ranking de Treino",
    description: "Premiação e reconhecimento para os alunos mais assíduos e disciplinados.",
  },
  {
    image: "/Midia/treino-pneu.png",
    title: "Desafios Diários",
    description: "Testamos seus limites todos os dias para forjar uma nova mentalidade.",
  },
  {
    image: "/Midia/treino-barra.jpeg",
    title: "Avaliações Físicas",
    description: "Medimos cada centímetro da sua evolução para que você veja, em dados, o seu progresso.",
  },
  {
    image: "/Midia/grupo-praia1.jpeg",
    title: "Aulões ao Ar Livre",
    description: "Todo final de semana, treinos presenciais para motivar e conectar você aos nossos parceiros.",
  },
];

const DifferentialsSection = () => {
  return (
    <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Nosso Arsenal
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase">
            O que <span className="text-gradient">separa você</span> da média
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {differentials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.1, 0.4) }}
              className={`relative overflow-hidden rounded-xl group min-h-[300px] sm:min-h-[380px] flex items-end p-6 border border-white/5 hover:border-primary/30 transition-all duration-300 ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                } ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              {/* Background Media */}
              {item.image.endsWith('.mp4') ? (
                <video
                  src={item.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              {/* Dark Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl sm:text-2xl font-black font-oswald uppercase text-white mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
