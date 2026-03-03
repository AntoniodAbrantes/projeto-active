import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Para quem é o Projeto Active?",
    answer:
      "Para qualquer pessoa que deseja transformar seu corpo e sua mente com acompanhamento profissional. Não importa seu nível atual — iniciantes e avançados são bem-vindos.",
  },
  {
    question: "Quanto tempo dura o projeto?",
    answer:
      "O projeto tem duração de 35 dias, com treinos diários, acompanhamento nutricional e suporte completo da comunidade.",
  },
  {
    question: "Preciso ter experiência com treino?",
    answer:
      "Não! Os treinos são adaptáveis para todos os níveis. O importante é ter vontade de evoluir.",
  },
  {
    question: "O que está incluso na inscrição?",
    answer:
      "Planejamento de treino com Pedro Montenegro, estratégia nutricional com o nutricionista Luciano, acesso à comunidade exclusiva, avaliações físicas, ranking de treino, desafios diários e aulões presenciais ao ar livre.",
  },
  {
    question: "Como funcionam os prêmios?",
    answer:
      "Os alunos com as transformações mais impactantes ao final do projeto são premiados. Quanto mais dedicação, maiores as suas chances!",
  },
  {
    question: "Os treinos são presenciais ou online?",
    answer:
      "Os treinos diários são enviados de forma online para você fazer na sua academia. Além disso, todo final de semana temos aulões presenciais ao ar livre em João Pessoa.",
  },
];

const FAQSection = () => {
  return (
    <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Dúvidas
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="card-glass rounded-xl border-none px-5 sm:px-6"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-left hover:text-primary transition-colors py-4 sm:py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 sm:pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
