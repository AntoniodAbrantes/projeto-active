import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { ShieldCheck, Users } from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  email: z.string().trim().email("Email inválido").max(255),
  instagram: z.string().trim().max(100).optional(),
  objetivo: z.string().trim().min(5, "Conte-nos um pouco mais").max(500),
});

type FormData = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [form, setForm] = useState<FormData>({
    nome: "",
    whatsapp: "",
    email: "",
    instagram: "",
    objetivo: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Form
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
      await addDoc(collection(db, "leads"), {
        ...form,
        createdAt: serverTimestamp(),
        status: "novo",
        origem: "site"
      });

      // 3. Show Success & Format WhatsApp Message
      setSubmitted(true);
      toast.success("Inscrição prévia enviada com sucesso! 🔥");

      const numeroWhatsappAtendimento = "5511999999999"; // TODO: Substituir pelo número real
      const mensagemWhatsApp = `Olá, vim pelo site do Projeto Active e gostaria de garantir minha vaga!\n\n*Meus dados:*\nNome: ${form.nome}\nObjetivo: ${form.objetivo}`;
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
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Turma Ouro - Apenas 3 vagas
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase">
            Garanta sua <span className="text-gradient">vaga</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Preencha o formulário e dê o primeiro passo.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card-glass rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-5"
        >
          {([
            { field: "nome" as const, label: "Nome completo", type: "text", placeholder: "Seu nome" },
            { field: "whatsapp" as const, label: "WhatsApp", type: "tel", placeholder: "(00) 00000-0000" },
            { field: "email" as const, label: "Email", type: "email", placeholder: "seu@email.com" },
            { field: "instagram" as const, label: "Instagram (opcional)", type: "text", placeholder: "@seuperfil" },
          ]).map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type={type}
                value={form[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors[field] && (
                <p className="text-sm text-destructive mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2">
              Qual seu objetivo?
            </label>
            <textarea
              value={form.objetivo}
              onChange={(e) => handleChange("objetivo", e.target.value)}
              placeholder="Conte-nos o que você busca..."
              rows={3}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
            {errors.objetivo && (
              <p className="text-sm text-destructive mt-1">{errors.objetivo}</p>
            )}
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-lg font-bold uppercase glow-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Garantir Minha Vaga Agora"
              )}
            </motion.button>

            {/* Trust & Social Proof Microcopy */}
            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500/80" />
                <span>Suas informações são 100% seguras.</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/40 px-3 py-1.5 rounded-full border border-white/5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  <strong className="text-foreground">+60 pessoas</strong> já tomaram essa decisão.
                </span>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default RegistrationForm;
