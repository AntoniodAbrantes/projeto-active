import { Student } from "./types";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Mail, Phone, Edit, Trash2, Crosshair, HeartPulse, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface StudentCardProps {
    student: Student;
    onEdit: (student: Student) => void;
}

export function StudentCard({ student, onEdit }: StudentCardProps) {
    const handleTogglePayment = async () => {
        try {
            const studentRef = doc(db, "leads", student.id);
            const newPaidStatus = !student.paid;
            await updateDoc(studentRef, { paid: newPaidStatus });
            const displayName = student.nome || student.name || "Sem Nome";
            if (newPaidStatus) {
                toast.success(`${displayName} marcado como PAGO!`);
            } else {
                toast.info(`Pagamento de ${displayName} revertido.`);
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Erro ao atualizar o status de pagamento.");
        }
    };

    const handleDelete = async () => {
        const displayName = student.nome || student.name || "Sem Nome";
        if (!window.confirm(`Tem certeza que deseja excluir o aluno ${displayName}?`)) {
            return;
        }
        try {
            await deleteDoc(doc(db, "leads", student.id));
            toast.success("Aluno excluído com sucesso.");
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Erro ao excluir o aluno.");
        }
    };

    // Format date safely with native JS
    let formattedDate = "Desconhecida";
    try {
        const dateObj = student.createdAt?.toDate ? student.createdAt.toDate() : (student.createdAt instanceof Date ? student.createdAt : null);
        if (dateObj) {
            formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit', month: '2-digit', year: '2-digit'
            }).format(dateObj);
        }
    } catch (e) { }

    const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(student.amount || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-secondary/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm group shadow-lg"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer relative z-10 p-1 -m-1">
                        <input
                            type="checkbox"
                            checked={student.paid || false}
                            onChange={handleTogglePayment}
                            className="peer sr-only"
                        />
                        <div className={`w-8 h-8 rounded-md border-2 flex items-center justify-center transition-all ${student.paid ? 'bg-primary border-primary' : 'bg-black/50 border-white/20 peer-hover:border-primary/50'}`}>
                            {student.paid && (
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </label>
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors truncate max-w-[180px]">
                        {student.nome || student.name || 'Sem nome'}
                    </h3>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${student.paid ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {formattedAmount}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3">

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground bg-black/20 p-2.5 rounded-lg border border-white/5 truncate">
                        <Mail className="w-4 h-4 text-white/50 shrink-0" />
                        <span className="truncate">{student.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground bg-black/20 p-2.5 rounded-lg border border-white/5 truncate">
                        <Phone className="w-4 h-4 text-white/50 shrink-0" />
                        <span className="truncate">{student.whatsapp || student.phone || '—'}</span>
                    </div>
                </div>

                {/* Additional Info (Goals, Restrictions) */}
                {(student.objetivo || student.lesao) && (
                    <div className="flex flex-col gap-2 mt-1">
                        {student.objetivo && (
                            <div className="flex items-center gap-2 text-white/70 text-sm bg-primary/5 p-2 rounded-lg border border-primary/10">
                                <Crosshair className="w-4 h-4 text-primary shrink-0" />
                                <span className="truncate" title={student.objetivo}><strong>Objetivo:</strong> {student.objetivo}</span>
                            </div>
                        )}
                        {student.lesao && student.lesao !== "Sem lesões" && student.lesao !== "Nenhuma" && (
                            <div className="flex items-center gap-2 text-white/70 text-sm bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                                <HeartPulse className="w-4 h-4 text-red-400 shrink-0" />
                                <span className="truncate" title={student.lesao}><strong>Atenção:</strong> {student.lesao}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 px-4 bg-black/40 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-4 h-4 text-white/30" />
                    {formattedDate}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(student)}
                        className="p-3 text-muted-foreground hover:text-white hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                        title="Editar"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 active:bg-red-500/20 rounded-xl transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                        title="Excluir"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
