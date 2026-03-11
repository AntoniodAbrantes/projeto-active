import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";

const Registration = () => {
    const [searchParams] = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState<"start" | "elite">("elite");

    useEffect(() => {
        // Rola para o topo ao acessar o checkout
        window.scrollTo(0, 0);
        const plan = searchParams.get("plano");
        if (plan === "start") {
            setSelectedPlan("start");
        } else {
            setSelectedPlan("elite"); // Default to elite
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
            {/* Checkout Navbar Simples e Focada */}
            <header className="w-full py-4 px-6 border-b border-white/5 bg-black/60 backdrop-blur-xl flex justify-center sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src="/LogoJPEG/logo-transparent.png" alt="Projeto Active" className="h-8 md:h-10 object-contain" />
                </Link>
            </header>

            {/* Formulário de CheckOut */}
            <main className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full">
                    <RegistrationForm selectedPlan={selectedPlan} />
                </div>
            </main>

            {/* Checkout Footer Simples */}
            <footer className="w-full py-6 text-center text-xs text-white/40 border-t border-white/5 bg-black/50">
                <div className="flex justify-center gap-4 mb-2">
                    <span className="flex items-center gap-1 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                        Ambiente 100% Seguro
                    </span>
                </div>
                <p>© {new Date().getFullYear()} Projeto Active. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Registration;
