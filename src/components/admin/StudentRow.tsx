import { Student } from "./types";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Mail, Phone, Edit, Trash2, Crosshair, HeartPulse, Activity, Shirt, Salad } from "lucide-react";

interface StudentRowProps {
    student: Student;
    onEdit: (student: Student) => void;
    onDiet: (student: Student) => void;
}

export function StudentRow({ student, onEdit, onDiet }: StudentRowProps) {
    const handleTogglePayment = async () => {
        try {
            const studentRef = doc(db, "leads", student.id);
            const newPaidStatus = !student.paid;

            await updateDoc(studentRef, {
                paid: newPaidStatus
            });
            const displayName = student.nome || student.name;
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
        const displayName = student.nome || student.name;
        if (!window.confirm(`Tem certeza que deseja excluir o aluno ${displayName}? Isso não pode ser desfeito.`)) {
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
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(dateObj);
        }
    } catch (e) { }

    // Format currency
    const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(student.amount || 0);

    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-4 w-20">
                <label className="flex items-center cursor-pointer relative">
                    <input
                        type="checkbox"
                        checked={student.paid || false}
                        onChange={handleTogglePayment}
                        className="peer sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${student.paid ? 'bg-primary border-primary' : 'bg-black/50 border-white/20 peer-hover:border-primary/50'}`}>
                        {student.paid && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </label>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <p className="font-medium text-white group-hover:text-primary transition-colors text-base">{student.nome || student.name || 'Sem nome'}</p>

                    {(student.objetivo || student.lesao || student.weight || student.tamanho_camisa) && (
                        <div className="flex flex-col gap-1 text-xs mt-1">
                            {student.weight && (
                                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 w-fit">
                                    <Activity className="w-3 h-3 text-emerald-400" /> {student.weight} kg
                                </span>
                            )}
                            {student.objetivo && (
                                <span className="flex items-center gap-1 text-muted-foreground bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-fit">
                                    <Crosshair className="w-3 h-3 text-primary" /> {student.objetivo}
                                </span>
                            )}
                            {student.lesao && student.lesao !== "Nenhuma" && student.lesao !== "Sem lesões" && (
                                <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 w-fit">
                                    <HeartPulse className="w-3 h-3 text-red-400" /> {student.lesao}
                                </span>
                            )}
                            {student.tamanho_camisa && student.selectedPlan !== 'start' && (
                                <span className="flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20 w-fit">
                                    <Shirt className="w-3 h-3 text-purple-400" /> Camisa: {student.tamanho_camisa}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-sm">{student.email || 'Sem email'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-sm">{student.whatsapp || student.phone || 'Sem número'}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-muted-foreground text-sm">
                {formattedDate}
            </td>
            <td className="px-6 py-4 text-right">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${student.paid ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {formattedAmount}
                </span>
            </td>
            <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onDiet(student)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Dieta"
                    >
                        <Salad className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(student)}
                        className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
