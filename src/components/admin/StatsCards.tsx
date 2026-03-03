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
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 md:mx-0 md:grid md:grid-cols-3 gap-4 md:gap-6 hide-scrollbar md:pb-0 snap-x">
            {cards.map((card, i) => (
                <div key={i} className="flex-none w-64 md:w-auto flex items-center p-4 md:p-6 bg-secondary/30 border border-white/5 rounded-2xl shadow-lg backdrop-blur-sm snap-start">
                    <div className={`p-3 md:p-4 rounded-xl ${card.bg} mr-3 md:mr-4 shrink-0`}>
                        <card.icon className={`w-6 h-6 md:w-8 md:h-8 ${card.color}`} />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium mb-0.5 md:mb-1 whitespace-nowrap">{card.title}</p>
                        <h3 className="text-xl md:text-3xl font-bold font-oswald text-foreground tracking-tight">{card.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
