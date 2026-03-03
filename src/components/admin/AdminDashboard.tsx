import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "./types";
import { StatsCards } from "./StatsCards";
import { StudentsTable } from "./StudentsTable";
import { EditStudentModal } from "./EditStudentModal";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        // Setup real-time listener
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Student[] = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Student);
            });
            setStudents(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching students:", error);
            toast.error("Erro ao carregar os alunos. Verifique a conexão com o banco.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Sessão encerrada com sucesso.");
        } catch (error) {
            toast.error("Erro ao encerrar sessão.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 pb-24">

            {/* Sticky Mobile Header Area */}
            <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl -mx-4 px-4 pt-4 pb-2 mb-6 md:static md:bg-transparent md:backdrop-blur-none md:mx-0 md:px-0 md:pt-0 md:mb-8 border-b border-white/5 md:border-none">
                <div className="flex flex-row justify-between items-center mb-4 md:mb-8 gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-xl md:text-3xl font-black font-oswald uppercase flex items-center gap-2 md:gap-3">
                            <Users className="text-primary w-6 h-6 md:w-8 md:h-8 shrink-0" />
                            <span>Admin <span className="text-primary">Dashboard</span></span>
                        </h1>
                        <p className="hidden md:block text-muted-foreground mt-1 text-sm">Gerencie dados reais de alunos, matrículas e pagamentos.</p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-black/40 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all text-xs md:text-sm font-medium shrink-0"
                    >
                        Sair
                    </motion.button>
                </div>

                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <StatsCards students={students} />
                    </motion.div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground text-sm">Carregando painel...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <StudentsTable students={students} onEdit={setEditingStudent} />
                </motion.div>
            )}

            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    isOpen={!!editingStudent}
                    onClose={() => setEditingStudent(null)}
                />
            )}
        </div>
    );
}
