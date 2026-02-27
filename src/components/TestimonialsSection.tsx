import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";

const testimonials = [
  { src: "/FeedbacksPrints/feedback-tereza.jpeg", alt: "Depoimento Tereza Raquel" },
  { src: "/FeedbacksPrints/feedback-romildo.jpeg", alt: "Depoimento Romildo Junior" },
  { src: "/FeedbacksPrints/feedback-elizabeth.jpeg", alt: "Depoimento Elizabeth" },
  { src: "/FeedbacksPrints/feedback-marianne.jpeg", alt: "Depoimento Marianne Oliveira" },
  { src: "/FeedbacksPrints/feedback-mayane.jpeg", alt: "Depoimento Mayane França" },
  { src: "/FeedbacksPrints/feedback-thais.jpeg", alt: "Depoimento Thaishy" },
  { src: "/FeedbacksPrints/feedback-larissa.jpeg", alt: "Depoimento Larissa Santos" },
  { src: "/FeedbacksPrints/feedback-anapaula.jpeg", alt: "Depoimento Ana Paula" },
  { src: "/FeedbacksPrints/feedback-maria.jpeg", alt: "Depoimento Maria das Graças" },
  { src: "/FeedbacksPrints/feedback-lucas.jpeg", alt: "Depoimento Lucas da Silva" },
  { src: "/FeedbacksPrints/feedback-matheus.jpeg", alt: "Depoimento Matheus Ribeiro" },
  { src: "/FeedbacksPrints/feedback-anapaula-alves.jpeg", alt: "Depoimento Ana Paula Alves" },
  { src: "/FeedbacksPrints/feedback-larissa-nobrega.jpeg", alt: "Depoimento Larissa de Nóbrega" },
  { src: "/FeedbacksPrints/feedback-bruna.jpeg", alt: "Depoimento Bruna Melo" },
  { src: "/FeedbacksPrints/feedback-wogran.jpeg", alt: "Depoimento Wogran Correia" },
  { src: "/FeedbacksPrints/feedback-erick.jpeg", alt: "Depoimento Erick Lima" },
  { src: "/FeedbacksPrints/feedback-suzanna.jpeg", alt: "Depoimento Suzanna" },
  { src: "/FeedbacksPrints/feedback-cristiani.jpeg", alt: "Depoimento Cristiani Grisi" },
];

const MOBILE_INITIAL = 6;

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);

  const visibleItems = isMobile && !showAll
    ? testimonials.slice(0, MOBILE_INITIAL)
    : testimonials;

  const remaining = testimonials.length - MOBILE_INITIAL;

  return (
    <section id="testimonials" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Depoimentos
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase">
            O que nossos participantes{" "}
            <span className="text-gradient">dizem</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {visibleItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className="card-glass rounded-xl sm:rounded-2xl overflow-hidden hover:border-glow transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.parentElement!.classList.add("bg-secondary", "min-h-[120px]", "sm:min-h-[200px]", "flex", "items-center", "justify-center");
                  target.style.display = "none";
                  const placeholder = document.createElement("p");
                  placeholder.textContent = "Depoimento em breve";
                  placeholder.className = "text-muted-foreground text-xs sm:text-sm";
                  target.parentElement!.appendChild(placeholder);
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* "Ver mais" button on mobile */}
        {isMobile && !showAll && remaining > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAll(true)}
            className="mx-auto mt-6 flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 rounded-xl px-6 py-3 hover:bg-primary/10 transition-colors"
          >
            Ver mais {remaining} depoimentos
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
