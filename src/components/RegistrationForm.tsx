import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { ShieldCheck, Users } from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  email: z.string().trim().email("Email inválido").max(255),
  objetivo: z.string().optional(),
  lesao: z.string().optional(),
  _honey: z.string().optional(), // Honeypot prevent bot submissions
});

type FormData = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    nome: "",
    whatsapp: "",
    email: "",
    objetivo: "",
    lesao: "",
    _honey: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSelectGoal = (goal: string) => {
    handleChange("objetivo", goal);
    setTimeout(nextStep, 300);
  };

  const handleSelectInjury = (injury: string) => {
    handleChange("lesao", injury);
    setTimeout(nextStep, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check (Silent rejection for bots)
    if (form._honey) {
      setSubmitted(true);
      return;
    }

    // 1. Validate Form (Only validating contact info on the final step)
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Save to Firebase Firestore
      const { _honey, ...submissionData } = form; // Strip honeypot before saving
      await addDoc(collection(db, "leads"), {
        ...submissionData,
        createdAt: serverTimestamp(),
        status: "novo",
        origem: "site_quiz"
      });

      // 3. Show Success & Format WhatsApp Message
      setSubmitted(true);
      toast.success("Inscrição prévia enviada com sucesso! 🔥");

      const numeroWhatsappAtendimento = "5583994051754";
      const mensagemWhatsApp = `Olá, vim pelo site do Projeto Active e gostaria de garantir minha vaga!\n\n*Meus dados:*\nNome: ${form.nome}\nObjetivo: ${form.objetivo}\nLesão/Restrição: ${form.lesao}`;
      const urlWhatsApp = `https://wa.me/${numeroWhatsappAtendimento}?text=${encodeURIComponent(mensagemWhatsApp)}`;

      // Abre o WhatsApp em uma nova aba
      setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast.error("Ocorreu um erro ao enviar sua inscrição. Tente novamente ou nos chame no WhatsApp.");
    } finally {
      setIsSubmitting(false);
      setStep(1); // Reset step on completion or error
    }
  };

  if (submitted) {
    return (
      <section id="registration" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">🔥</div>
            <h2 className="text-3xl md:text-5xl font-black font-oswald uppercase mb-4">
              Você está <span className="text-gradient">dentro!</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Sua inscrição foi recebida. Em breve entraremos em contato pelo
              WhatsApp. Prepare-se para a transformação.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 section-gradient">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Turma Ouro - Vagas Esgotando
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-oswald uppercase leading-tight">
            Não Deixe Para <span className="text-gradient">Depois</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            A sua transformação física e mental começa no momento em que você decide entrar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT: Offer Stack */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 order-2 lg:order-1"
          >
            <div className="card-glass rounded-2xl p-6 sm:p-8 border border-white/5">
              <h3 className="text-2xl font-oswald font-bold uppercase mb-6 flex items-center gap-3">
                <span className="bg-primary/20 text-primary p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                O que você vai receber
              </h3>

              <ul className="space-y-4">
                {[
                  "Acompanhamento e suporte diário com o time Active",
                  "Prescrição de treinos focados nos seus objetivos",
                  "Ajuste e planejamento nutricional personalizado",
                  "Acesso exclusivo à comunidade de participantes",
                  "Concorrer a prêmios incríveis de até R$ 2.000"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/80 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-glass rounded-2xl p-6 border border-white/5 bg-secondary/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black/50 overflow-hidden flex-shrink-0 border-2 border-primary/50">
                <img src="/Midia/luciano-nutri.png" alt="Luciano" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="italic text-sm text-gray-300">"Nossa equipe está pronta para segurar a sua mão nesses 35 dias. Você só precisa dar o primeiro passo."</p>
                <div className="mt-2 text-xs font-bold text-primary uppercase tracking-wider">Time Projeto Active</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Optimized Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="card-glass rounded-3xl p-6 sm:p-10 space-y-5 lg:order-2 border-primary/20 shadow-[0_0_50px_rgba(255,107,0,0.1)] relative overflow-hidden"
          >
            {/* Dynamic Scarcity Bar inside Form */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-secondary">
              <div
                className="h-full bg-red-500 relative transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-6 pt-2">
              <h3 className="text-xl font-bold font-oswald uppercase mb-2">
                {step === 1 && "Passo 1 de 3"}
                {step === 2 && "Passo 2 de 3"}
                {step === 3 && "Último Passo"}
              </h3>
              <p className="text-sm text-red-400 font-semibold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Vagas Esgotando
              </p>
            </div>

            <div className="relative overflow-hidden min-h-[320px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <label className="block text-lg font-bold mb-4 text-center text-white">Qual o seu objetivo principal?</label>
                    {["Perder Peso / Emagrecimento", "Ganhar Massa Muscular", "Definição e Secar", "Saúde e Disposição", "Ainda não sei"].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleSelectGoal(goal)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all font-medium ${form.objetivo === goal
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-black/40 border-white/10 hover:border-primary/50 text-white/90"
                          }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <label className="block text-lg font-bold mb-4 text-center text-white">Possui alguma lesão ou restrição médica?</label>
                    {["Nenhuma (100% saudável)", "Problemas no Joelho", "Problemas na Coluna/Lombar", "Ombro ou Articulações", "Outra restrição médica"].map((injury) => (
                      <button
                        key={injury}
                        type="button"
                        onClick={() => handleSelectInjury(injury)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all font-medium ${form.lesao === injury
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-black/40 border-white/10 hover:border-primary/50 text-white/90"
                          }`}
                      >
                        {injury}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full mt-4 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      ← Voltar
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <label className="block text-lg font-bold mb-4 text-center text-primary">Excelente! Onde enviamos os próximos passos?</label>

                    {/* HONEYPOT - Hidden from real users */}
                    <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                      <input type="text" name="_honey" tabIndex={-1} value={form._honey} onChange={(e) => handleChange('_honey', e.target.value)} />
                    </div>

                    {([
                      { field: "nome" as const, label: "Como devemos te chamar?", type: "text", placeholder: "Seu nome completo" },
                      { field: "whatsapp" as const, label: "Seu melhor WhatsApp", type: "tel", placeholder: "(00) 00000-0000" },
                      { field: "email" as const, label: "Seu melhor Email", type: "email", placeholder: "seu@email.com" },
                    ]).map(({ field, label, type, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-bold mb-2 text-white/90">{label}</label>
                        <input
                          type={type}
                          value={form[field] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                        />
                        {errors[field] && (
                          <p className="text-sm text-red-400 mt-1.5 font-medium">{errors[field]}</p>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm text-muted-foreground hover:text-white transition-colors block mt-2"
                    >
                      ← Voltar e editar perfil
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2">
              <AnimatePresence>
                {step === 3 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-black font-oswald tracking-wide uppercase glow-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,107,0,0.3)] mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Aguarde...
                      </>
                    ) : (
                      "Garantir Vaga Agora"
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Trust & Social Proof Microcopy */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
                  <ShieldCheck className="w-4 h-4 text-green-500/80" />
                  <span>Seus dados são 100% seguros e não fazemos spam.</span>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
