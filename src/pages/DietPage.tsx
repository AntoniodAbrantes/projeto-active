import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Diet } from "@/components/admin/types";
import { motion } from "framer-motion";
import { FlameKindling, Clock, AlertCircle, ChefHat, FileDown } from "lucide-react";
import { DietPDFTemplate } from "@/components/admin/DietPDFTemplate";
import { generateDietPDF } from "@/lib/generateDietPDF";

export default function DietPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!studentId) { setNotFound(true); setLoading(false); return; }
    getDoc(doc(db, "diets", studentId)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as Diet;
        if (data.published) {
          setDiet(data);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    }).finally(() => setLoading(false));
  }, [studentId]);

  const handleDownloadPDF = async () => {
    if (!diet) return;
    await generateDietPDF(diet);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !diet) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-primary/50 mb-4" />
        <h1 className="text-2xl font-black font-oswald uppercase text-white mb-2">Dieta não encontrada</h1>
        <p className="text-muted-foreground">Este link pode estar inativo ou a dieta ainda não foi publicada pelo nutricionista.</p>
        <p className="text-sm text-muted-foreground mt-4">Entre em contato com sua equipe do Projeto Active pelo WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Hidden PDF template — captured by html2canvas on download */}
      <DietPDFTemplate diet={diet} />
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/20 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,122,0,0.15)_0%,_transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mx-auto w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mb-6"
          >
            <span style={{ fontSize: "32px" }}>🥗</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Projeto Active — Plano Alimentar
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-oswald uppercase leading-tight mb-2">
              Olá, <span className="text-primary">{diet.studentName.split(" ")[0]}!</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Sua dieta personalizada foi preparada pelo nutricionista da equipe Active.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto px-4 -mt-2 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seu peso</p>
            <p className="text-3xl font-black font-oswald text-white">{diet.weight} <span className="text-base font-normal text-muted-foreground">kg</span></p>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4">
            <p className="text-xs text-primary uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
              <FlameKindling className="w-3.5 h-3.5" /> Meta Calórica
            </p>
            <p className="text-3xl font-black font-oswald text-white">{diet.calories} <span className="text-base font-normal text-muted-foreground">kcal</span></p>
          </div>
        </motion.div>

        {/* Meals */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <ChefHat className="w-5 h-5 text-primary" /> Suas Refeições
          </h2>

          {diet.meals.filter(m => m.foods.length > 0).map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary/20 to-transparent border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-bold text-sm">{meal.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-black/30 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> {meal.time}
                </div>
              </div>
              <ul className="px-4 py-3 space-y-2">
                {meal.foods.map((food, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    {food}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Notes */}
        {diet.notes?.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/50 border border-primary/20 rounded-2xl p-5 mb-6"
          >
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
              <ChefHat className="w-4 h-4" /> Observações do Nutricionista
            </h3>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{diet.notes}</p>
          </motion.div>
        )}

        {/* Download PDF */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl text-base uppercase tracking-wide hover:bg-primary/90 transition-colors shadow-[0_10px_30px_rgba(255,122,0,0.3)] mb-8"
        >
          <FileDown className="w-5 h-5" /> Baixar Minha Dieta em PDF
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-8">
          Dieta preparada exclusivamente para você pelo time do <strong className="text-white">Projeto Active</strong>.<br />
          Em caso de dúvidas, entre em contato com seu nutricionista.
        </p>
      </div>
    </div>
  );
}
