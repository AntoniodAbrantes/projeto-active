import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Student } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, DollarSign, Mail, Phone, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditStudentModalProps {
    student: Student;
    isOpen: boolean;
    onClose: () => void;
}

export function EditStudentModal({ student, isOpen, onClose }: EditStudentModalProps) {
    const [formData, setFormData] = useState({
        nome: student.nome || student.name || "",
        email: student.email || "",
        whatsapp: student.whatsapp || student.phone || "",
        amount: student.amount?.toString() || "0",
        paid: student.paid || false,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const studentRef = doc(db, "leads", student.id);
            await updateDoc(studentRef, {
                nome: formData.nome,
                name: formData.nome, // Save back to name as fallback if needed
                email: formData.email,
                whatsapp: formData.whatsapp,
                phone: formData.whatsapp, // Save back to phone as fallback
                amount: parseFloat(formData.amount) || 0,
                paid: formData.paid
            });

            toast.success("Dados do aluno atualizados com sucesso!");
            onClose();
        } catch (error) {
            console.error("Error updating student:", error);
            toast.error("Erro ao salvar alterações no banco de dados.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="relative w-full max-w-md bg-secondary/90 border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/20">
                        <h3 className="text-xl font-bold text-white font-oswald">Editar Aluno</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Telefone (WhatsApp)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Valor Pago (R$)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 pb-2">
                            <label className="text-sm font-semibold text-white">Status de Pagamento</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.paid}
                                    onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                            </label>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-black/30 hover:bg-black/50 border border-white/10 rounded-lg text-sm font-semibold text-white transition-colors"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
