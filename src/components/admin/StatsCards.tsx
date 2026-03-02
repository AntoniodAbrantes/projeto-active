import { Student } from "./types";
import { Users, CheckCircle, DollarSign } from "lucide-react";

export function StatsCards({ students }: { students: Student[] }) {
    const totalStudents = students.length;
    const paidStudents = students.filter((s) => s.paid).length;
    const totalAmount = students.filter(s => s.paid).reduce((sum, s) => sum + (s.amount || 0), 0);

    const cards = [
        {
            title: "Alunos Registrados",
            value: totalStudents,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Alunos Pagos",
            value: paidStudents,
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "Valor Arrecadado",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount),
            icon: DollarSign,
            color: "text-primary",
            bg: "bg-primary/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, i) => (
                <div key={i} className="flex items-center p-6 bg-secondary/30 border border-white/5 rounded-2xl shadow-lg backdrop-blur-sm">
                    <div className={`p-4 rounded-xl ${card.bg} mr-4`}>
                        <card.icon className={`w-8 h-8 ${card.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">{card.title}</p>
                        <h3 className="text-3xl font-bold font-oswald text-foreground tracking-tight">{card.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
