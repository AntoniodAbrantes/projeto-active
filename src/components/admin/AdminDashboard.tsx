import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black font-oswald uppercase flex items-center gap-3">
                        <Users className="text-primary w-8 h-8" />
                        Admin <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Gerencie dados reais de alunos, matrículas e pagamentos.</p>
                </motion.div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground">Carregando painel...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    <StatsCards students={students} />
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
