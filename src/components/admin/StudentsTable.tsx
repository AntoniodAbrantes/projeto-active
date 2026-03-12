import { useState } from "react";
import { Student } from "./types";
import { Search, Filter } from "lucide-react";
import { StudentRow } from "./StudentRow";
import { StudentCard } from "./StudentCard";

export function StudentsTable({ students, onEdit }: { students: Student[], onEdit: (student: Student) => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

    const filteredStudents = students.filter(s => {
        const studentName = s.nome || s.name || "";
        const studentEmail = s.email || "";
        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "paid") return matchesSearch && s.paid;
        if (filter === "pending") return matchesSearch && !s.paid;
        return matchesSearch;
    });

    return (
        <div className="bg-secondary/20 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Table Header Controls */}
            <div className="p-4 md:p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-muted-foreground/70"
                    />
                </div>

                <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 w-full md:w-auto overflow-x-auto font-medium no-scrollbar">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 md:flex-none px-4 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${filter === "all" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white/80"
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter("paid")}
                        className={`flex-1 md:flex-none px-4 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${filter === "paid" ? "bg-green-500/20 text-green-400 shadow-sm" : "text-muted-foreground hover:text-white/80"
                            }`}
                    >
                        ✅ Pagos
                    </button>
                    <button
                        onClick={() => setFilter("pending")}
                        className={`flex-1 md:flex-none px-4 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${filter === "pending" ? "bg-red-500/20 text-red-400 shadow-sm" : "text-muted-foreground hover:text-white/80"
                            }`}
                    >
                        ⏳ Pendentes
                    </button>
                </div>
            </div>

            {/* Table Data (Desktop) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/40 text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Aluno</th>
                            <th className="px-6 py-4">Contato</th>
                            <th className="px-6 py-4">Data de Registro</th>
                            <th className="px-6 py-4 text-right">Valor</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <StudentRow key={student.id} student={student} onEdit={() => onEdit(student)} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                    Nenhum aluno encontrado para os filtros atuais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-4 p-4">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <StudentCard key={student.id} student={student} onEdit={() => onEdit(student)} />
                    ))
                ) : (
                    <div className="py-12 text-center text-muted-foreground bg-black/20 rounded-xl border border-white/5">
                        Nenhum aluno encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
