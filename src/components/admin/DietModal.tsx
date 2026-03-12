import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Student, Diet, Meal } from "./types";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import {
  X, Plus, Trash2, Clock, Utensils, Link2, MessageCircle,
  FlameKindling, ChevronDown, ChevronUp, Salad, FileDown
} from "lucide-react";
import { DietPDFTemplate } from "./DietPDFTemplate";
import { generateDietPDF } from "@/lib/generateDietPDF";

const DEFAULT_MEALS: Meal[] = [
  { id: "1", name: "Café da Manhã", time: "07:00", foods: [""] },
  { id: "2", name: "Lanche da Manhã", time: "10:00", foods: [""] },
  { id: "3", name: "Almoço", time: "12:30", foods: [""] },
  { id: "4", name: "Lanche da Tarde", time: "15:30", foods: [""] },
  { id: "5", name: "Jantar", time: "19:00", foods: [""] },
];

interface DietModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function DietModal({ student, isOpen, onClose }: DietModalProps) {
  const studentName = student.nome || student.name || "Aluno";
  const weightNum = parseFloat(student.weight || "70");
  const calories = Math.round(weightNum * 20);
  const dietLink = `${window.location.origin}/dieta/${student.id}`;

  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);
  const [notes, setNotes] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [expandedMeal, setExpandedMeal] = useState<string | null>("1");

  useEffect(() => {
    if (!isOpen) return;
    setFetching(true);
    getDoc(doc(db, "diets", student.id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as Diet;
        setMeals(data.meals?.length ? data.meals : DEFAULT_MEALS);
        setNotes(data.notes || "");
        setPublished(data.published || false);
      } else {
        setMeals(DEFAULT_MEALS);
        setNotes("");
        setPublished(false);
      }
    }).finally(() => setFetching(false));
  }, [isOpen, student.id]);

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const cleanMeals = meals.map(m => ({
        ...m, foods: m.foods.filter(f => f.trim() !== "")
      }));
      const diet: Diet = {
        studentId: student.id, studentName, weight: weightNum, calories,
        meals: cleanMeals, notes, published: publish,
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, "diets", student.id), diet, { merge: true });
      setPublished(publish);
      toast.success(publish ? "Dieta publicada! Link já está disponível." : "Dieta salva como rascunho.");
    } catch (e) {
      toast.error("Erro ao salvar a dieta.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dietLink);
    toast.success("Link copiado! Envie para o aluno.");
  };

  const handleSendWhatsApp = () => {
    const phone = student.whatsapp?.replace(/\D/g, "");
    const ddiBrazil = phone?.startsWith("55") ? phone : `55${phone}`;
    const msg = encodeURIComponent(
      `Olá ${studentName}! 🥗\n\nSua dieta personalizada do *Projeto Active* está disponível!\n\nAcesse pelo link abaixo:\n${dietLink}\n\nQualquer dúvida, estamos à disposição! 💪`
    );
    window.open(`https://wa.me/${ddiBrazil}?text=${msg}`, "_blank");
  };

  const handleGeneratePDF = async () => {
    const cleanMeals = meals.map(m => ({ ...m, foods: m.foods.filter(f => f.trim() !== "") }));
    const diet: Diet = {
      studentId: student.id, studentName, weight: weightNum, calories,
      meals: cleanMeals, notes, published,
    };
    await generateDietPDF(diet);
  };

  // Meal helpers
  const updateMealFood = (mealId: string, foodIdx: number, value: string) => {
    setMeals(prev => prev.map(m => m.id === mealId
      ? { ...m, foods: m.foods.map((f, i) => i === foodIdx ? value : f) } : m));
  };
  const addFood = (mealId: string) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, foods: [...m.foods, ""] } : m));
  };
  const removeFood = (mealId: string, foodIdx: number) => {
    setMeals(prev => prev.map(m => m.id === mealId
      ? { ...m, foods: m.foods.filter((_, i) => i !== foodIdx) } : m));
  };
  const updateMealProp = (mealId: string, field: keyof Meal, value: string) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, [field]: value } : m));
  };
  const addMeal = () => {
    const newId = Date.now().toString();
    setMeals(prev => [...prev, { id: newId, name: "Nova Refeição", time: "00:00", foods: [""] }]);
    setExpandedMeal(newId);
  };
  const removeMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
    if (expandedMeal === mealId) setExpandedMeal(null);
  };

  // Current diet object for the hidden PDF template
  const currentDiet: Diet = {
    studentId: student.id, studentName, weight: weightNum, calories,
    meals, notes, published,
  };

  return (
    <>
      {/* Hidden PDF template rendered off-screen for html2canvas */}
      <DietPDFTemplate diet={currentDiet} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-4 px-2"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="bg-[#0d0d0d] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-transparent border-b border-white/10 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Salad className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">{studentName}</h2>
                    <p className="text-xs text-muted-foreground">Plano Alimentar Personalizado</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {fetching ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">

                  {/* Calorie Calculator */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Peso do Aluno</p>
                      <p className="text-2xl font-black text-white">{weightNum} <span className="text-base font-normal text-muted-foreground">kg</span></p>
                    </div>
                    <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4">
                      <p className="text-xs text-primary uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
                        <FlameKindling className="w-3.5 h-3.5" /> Meta Calórica
                      </p>
                      <p className="text-2xl font-black text-white">{calories} <span className="text-base font-normal text-muted-foreground">kcal</span></p>
                      <p className="text-xs text-muted-foreground mt-1">{weightNum} kg × 20 kcal</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${published
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${published ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                    {published ? "Dieta publicada — link ativo para o aluno" : "Rascunho — aluno ainda não pode ver"}
                  </div>

                  {/* Meals */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5" /> Refeições
                    </label>

                    {meals.map((meal) => (
                      <div key={meal.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="font-semibold text-sm text-white">{meal.name}</span>
                            <span className="text-xs text-muted-foreground">{meal.time}</span>
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-muted-foreground">
                              {meal.foods.filter(f => f.trim()).length} itens
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); }}
                              className="p-1 text-red-500/50 hover:text-red-500 transition-colors rounded-md">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {expandedMeal === meal.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedMeal === meal.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/5"
                            >
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Nome da refeição</label>
                                    <input value={meal.name} onChange={e => updateMealProp(meal.id, "name", e.target.value)}
                                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> Horário
                                    </label>
                                    <input type="time" value={meal.time} onChange={e => updateMealProp(meal.id, "time", e.target.value)}
                                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs text-muted-foreground">Alimentos</label>
                                  {meal.foods.map((food, fi) => (
                                    <div key={fi} className="flex gap-2 items-center">
                                      <span className="text-muted-foreground text-sm w-4 text-center">•</span>
                                      <input value={food} onChange={e => updateMealFood(meal.id, fi, e.target.value)}
                                        placeholder="Ex: 2 ovos mexidos com azeite"
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
                                      <button type="button" onClick={() => removeFood(meal.id, fi)} className="p-1.5 text-red-500/40 hover:text-red-500 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={() => addFood(meal.id)}
                                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1">
                                    <Plus className="w-3.5 h-3.5" /> Adicionar alimento
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    <button type="button" onClick={addMeal}
                      className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-muted-foreground hover:border-primary/50 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Adicionar refeição
                    </button>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-2">Observações do Nutricionista</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Ex: Beba pelo menos 2L de água por dia. Evite alimentos ultraprocessados..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none" />
                  </div>

                  {/* Share tools (only when published) */}
                  {published && (
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3">Compartilhar dieta</p>
                      <div className="flex gap-2">
                        <input readOnly value={dietLink} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-muted-foreground" />
                        <button onClick={handleCopyLink} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                          <Link2 className="w-3.5 h-3.5" /> Copiar
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSendWhatsApp}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                          <MessageCircle className="w-4 h-4" /> Enviar via WhatsApp
                        </button>
                        <button onClick={handleGeneratePDF}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                          <FileDown className="w-4 h-4" /> Baixar PDF
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Save / Publish actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleSave(false)} disabled={loading}
                      className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm font-bold text-muted-foreground hover:text-white hover:border-white/30 transition-colors disabled:opacity-50">
                      {loading ? "Salvando..." : "Salvar Rascunho"}
                    </button>
                    <button onClick={() => handleSave(true)} disabled={loading}
                      className="flex-1 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(255,122,0,0.3)]">
                      {loading ? "Publicando..." : "Publicar Dieta ✓"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
