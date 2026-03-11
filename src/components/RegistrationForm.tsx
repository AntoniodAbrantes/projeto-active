import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { ShieldCheck, Copy, CreditCard, QrCode } from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  email: z.string().trim().email("Email inválido").max(255),
  objetivo: z.string().optional(),
  lesao: z.string().optional(),
  weight: z.string().optional(),
  tamanho_camisa: z.string().optional(),
  _honey: z.string().optional(), // Honeypot prevent bot submissions
});

type FormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  selectedPlan: "start" | "elite";
}

const RegistrationForm = ({ selectedPlan }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    nome: "",
    whatsapp: "",
    email: "",
    objetivo: "",
    lesao: "",
    weight: "70",
    tamanho_camisa: "M",
    _honey: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Payment Flow States
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | null>(null);

  // Plan Details
  const planDetails = {
    start: {
      name: "Active Start",
      price: "119,90",
      pixCode: "00020126350014BR.GOV.BCB.PIX0113+5583940517545204000053039865406119.905802BR5901N6001C62170513ProjetoActive63047F6F",
      qrImage: "/LogoJPEG/qrcode-pix.png"
    },
    elite: {
      name: "Active Elite",
      price: "169,90",
      pixCode: "00020126360014BR.GOV.BCB.PIX0114+55839940517545204000053039865406169.905802BR5901N6001C62170513ProjetoActive63048820",
      qrImage: "/LogoJPEG/qrcode-pixplanokit.png"
    }
  };

  const currentPlan = planDetails[selectedPlan];

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
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
      setIsPaymentStep(true);
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
        selectedPlan, // save chosen plan
        createdAt: serverTimestamp(),
        status: "novo_no_checkout",
        origem: "site_quiz"
      });

      // 3. Move to Payment Step
      setIsPaymentStep(true);
      toast.success("Dados salvos! Quase lá...");

    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast.error("Ocorreu um erro ao enviar sua inscrição. Tente novamente ou nos chame no WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(currentPlan.pixCode)
      .then(() => toast.success("Código PIX copiado!"))
      .catch(() => toast.error("Falha ao copiar o código"));
  };

  const handleCardCheckout = () => {
    const numeroWhatsappAtendimento = "5583994051754";
    const mensagemWhatsApp = `Olá Pedro, já reservei minha vaga no plano *${currentPlan.name}* e gostaria do link para pagamento via *Cartão de Crédito*.\n\nMeus dados:\nNome: ${form.nome}\nEmail: ${form.email}`;
    const urlWhatsApp = `https://wa.me/${numeroWhatsappAtendimento}?text=${encodeURIComponent(mensagemWhatsApp)}`;

    toast.info("Redirecionando para o WhatsApp do Pedro...");
    setTimeout(() => {
      window.open(urlWhatsApp, '_blank');
    }, 1000);
  };

  const handlePixSelection = () => {
    setPaymentMethod("pix");
    setTimeout(() => {
      document.querySelector("#pix-details")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200); // Wait for the enter animation to complete before scrolling
  };


  if (isPaymentStep) {
    return (
      <section id="registration" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-glass rounded-3xl p-6 sm:p-10 border border-primary/20 shadow-[0_0_50px_rgba(255,107,0,0.1)] relative overflow-hidden"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-black font-oswald uppercase mb-2">
                Finalize seu <span className="text-gradient">Pagamento</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sua vaga no plano <strong className="text-white">{currentPlan.name}</strong> está reservada.<br />
                Escolha como deseja pagar o valor de <strong className="text-primary text-xl">R$ {currentPlan.price}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handlePixSelection}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all",
                  paymentMethod === "pix"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-black/40 hover:border-white/30"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">Pagar com PIX</span>
                <span className="text-xs text-muted-foreground text-center">Aprovação imediata</span>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("card");
                  handleCardCheckout();
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all",
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-black/40 hover:border-white/30"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">Cartão de Crédito</span>
                <span className="text-xs text-muted-foreground text-center">Parcelamento em até 12x</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === "pix" && (
                <motion.div
                  id="pix-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/50 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                >
                  <h3 className="font-bold text-lg mb-2">Escaneie o QR Code</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Abra o app do seu banco, escolha a opção PIX, escaneie o código abaixo ou copie o código Pix Copia e Cola.
                  </p>

                  <div className="bg-white p-3 rounded-xl mb-6 relative group">
                    <img
                      src={currentPlan.qrImage}
                      alt="QR Code PIX"
                      className="w-48 h-48 object-contain"
                    />
                    <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    </div>
                  </div>

                  <div className="w-full max-w-md">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 block text-left">
                      Ou Pix Copia e Cola
                    </label>
                    <div className="flex bg-black border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                      <input
                        type="text"
                        readOnly
                        value={currentPlan.pixCode}
                        className="flex-1 bg-transparent text-sm text-foreground px-4 py-3 outline-none"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground px-4 flex items-center justify-center transition-colors border-l border-white/10"
                        title="Copiar código PIX"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-green-400 font-medium flex items-center gap-1.5 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Aguardando confirmação do pagamento...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </section>
    );
  }

  // STANDARD FORM VIEW
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
                  "Concorrer a prêmios incríveis de até R$ 2.300"
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
                style={{ width: `${(step / 4) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-6 pt-2">
              <h3 className="text-xl font-bold font-oswald uppercase mb-2">
                {step === 1 && "Passo 1 de 4"}
                {step === 2 && "Passo 2 de 4"}
                {step === 3 && "Passo 3 de 4"}
                {step === 4 && "Último Passo"}
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
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <label className="block text-lg font-bold mb-2 text-white">Qual é o seu peso atual?</label>
                      <p className="text-primary font-bold text-3xl font-oswald tracking-wide mt-2">
                        {form.weight} kg
                      </p>
                    </div>

                    <div className="px-4 pb-4 pt-2">
                      <input
                        type="range"
                        min="40"
                        max="150"
                        step="1"
                        value={form.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                        <span>40 kg</span>
                        <span>150 kg</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                      Continuar
                    </button>
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

                {step === 4 && (
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

                    {selectedPlan === "elite" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden"
                      >
                        <label className="block text-sm font-bold mb-2 text-white/90">Tamanho da Camisa (Inclusa no Plano)</label>
                        <select
                          value={form.tamanho_camisa || "M"}
                          onChange={(e) => handleChange("tamanho_camisa", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium appearance-none"
                        >
                          <option value="P">P</option>
                          <option value="M">M</option>
                          <option value="G">G</option>
                          <option value="GG">GG</option>
                          <option value="XG">XG</option>
                        </select>
                      </motion.div>
                    )}

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
                {step === 4 && (
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
