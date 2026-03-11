import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Star, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

export interface PricingPlan {
    name: string;
    price: string;
    installmentPrice: string;
    period: string;
    installmentPeriod: string;
    features: string[];
    description: string;
    buttonText: string;
    isPopular: boolean;
    hasKit?: boolean;
}


const plans: PricingPlan[] = [
    {
        name: "ACTIVE ELITE",
        price: "169.90",
        installmentPrice: "18.29",
        period: "à vista",
        installmentPeriod: "12x",
        features: [
            "Tudo do plano Start",
            "Kit exclusivo Projeto Active",
            "1 Camisa Dry-fit Prime Active",
            "1 Bolsa bag Active oficial",
        ],
        description: "Para quem quer vestir a camisa e viver a experiência premium.",
        buttonText: "Garantir Vaga Elite",
        isPopular: true,
        hasKit: true,
    },
    {
        name: "ACTIVE START",
        price: "119.90",
        installmentPrice: "12.91",
        period: "à vista",
        installmentPeriod: "12x",
        features: [
            "Acesso completo ao Projeto Active",
            "Participação em todas as dinâmicas e desafios",
            "Acesso à comunidade e conteúdos do projeto",
        ],
        description: "O passaporte perfeito para começar a sua transformação.",
        buttonText: "Começar Agora",
        isPopular: false,
    },
];

const PricingSection = () => {
    const [isInstallment, setIsInstallment] = useState(false);
    const isMobile = useIsMobile();
    const switchRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    const handleToggle = (checked: boolean) => {
        setIsInstallment(checked);
        if (checked && switchRef.current) {
            const rect = switchRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            confetti({
                particleCount: 50,
                spread: 60,
                origin: {
                    x: x / window.innerWidth,
                    y: y / window.innerHeight,
                },
                colors: [
                    "hsl(var(--primary))",
                    "hsl(var(--accent))",
                    "hsl(var(--secondary))",
                    "hsl(var(--muted))",
                ],
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["circle"],
            });
        }
    };

    const handleSelectPlan = (index: number) => {
        const planPath = index === 0 ? "elite" : "start"; // Since Elite is index 0
        navigate(`/inscricao?plano=${planPath}`);
    };

    const scrollToForm = () => {
        document.querySelector("#registration")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div id="pricing" className="container py-20 lg:py-32 relative bg-background overflow-hidden">
            {/* Background Subtle Gradient */}
            <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
                <div className="w-full max-w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-10" />
            </div>

            <div className="text-center space-y-4 mb-8 sm:mb-12 relative z-10 w-full px-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
                    Últimas vagas disponíveis
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-oswald tracking-tight uppercase text-white">
                    Escolha o seu <span className="text-gradient">Plano</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg whitespace-pre-line max-w-xl mx-auto">
                    A decisão de transformar seu corpo e mente só depende de você. Escolha o passaporte ideal para o Projeto Active.
                </p>
            </div>

            <div className="flex justify-center items-center mb-12 relative z-10">
                <span className={cn("mr-3 text-sm font-semibold transition-colors", !isInstallment ? "text-white" : "text-muted-foreground")}>
                    Preço à Vista
                </span>
                <label className="relative items-center cursor-pointer flex">
                    <Label>
                        <Switch
                            ref={switchRef as any}
                            checked={isInstallment}
                            onCheckedChange={handleToggle}
                            className="relative data-[state=checked]:bg-primary"
                        />
                    </Label>
                </label>
                <span className={cn("ml-3 text-sm font-semibold flex items-center gap-1.5 transition-colors", isInstallment ? "text-white" : "text-muted-foreground")}>
                    Mostrar Parcelado <span className="text-primary text-xs ml-1 hidden sm:inline">(em até 12x)</span>
                </span>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-6 lg:gap-0 max-w-5xl mx-auto perspective-[1200px] relative z-10 px-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={
                            !isMobile
                                ? {
                                    y: plan.isPopular ? -20 : 0,
                                    opacity: 1,
                                    x: index === 0 ? 30 : -30,
                                    scale: plan.isPopular ? 1.05 : 0.95,
                                    rotateY: index === 0 ? 8 : -8,
                                    z: plan.isPopular ? 10 : -40,
                                }
                                : { y: 0, opacity: 1, x: 0, scale: 1, rotateY: 0, z: 0 }
                        }
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 1.2,
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: index * 0.1,
                        }}
                        className={cn(
                            `rounded-3xl border p-5 sm:p-8 text-center flex flex-col relative card-glass w-full max-w-md mx-auto lg:max-w-none lg:w-1/2`,
                            plan.isPopular ? "border-primary/50 border-2 glow-primary-sm bg-background/90 z-20" : "border-white/10 bg-secondary/80 z-0",
                            !isMobile && index === 0 ? "origin-right" : "origin-left"
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-primary py-1 sm:py-1.5 px-3 sm:px-4 rounded-full flex items-center shadow-[0_0_20px_rgba(255,107,0,0.5)] border border-primary/50 whitespace-nowrap z-30">
                                <Star className="text-primary-foreground h-3.5 w-3.5 fill-current" />
                                <span className="text-primary-foreground ml-1.5 font-bold text-xs uppercase tracking-widest">
                                    Mais Popular
                                </span>
                            </div>
                        )}

                        <div className="flex-1 flex flex-col items-center">
                            <h3 className={cn("text-2xl font-black font-oswald uppercase relative z-10", plan.isPopular ? "text-gradient" : "text-white/90")}>
                                {plan.name}
                            </h3>

                            <div className="mt-6 mb-2 sm:mb-4 h-20 sm:h-24 flex items-center justify-center gap-x-1 relative z-10">
                                <span className="text-base sm:text-2xl font-bold text-muted-foreground self-start mt-1 sm:mt-2">R$</span>
                                <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-oswald text-white tracking-tight flex items-baseline">
                                    <NumberFlow
                                        value={
                                            !isInstallment ? Number(plan.price.split('.')[0]) : Number(plan.installmentPrice.split('.')[0])
                                        }
                                        transformTiming={{ duration: 500, easing: "ease-out" }}
                                        willChange
                                        className="font-variant-numeric: tabular-nums"
                                    />
                                    <span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground flex">
                                        ,<NumberFlow
                                            value={!isInstallment ? Number(plan.price.split('.')[1]) : Number(plan.installmentPrice.split('.')[1])}
                                            format={{ minimumIntegerDigits: 2 }}
                                            transformTiming={{ duration: 500, easing: "ease-out" }}
                                            className="font-variant-numeric: tabular-nums"
                                        />
                                    </span>
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold tracking-wide text-primary h-6 flex items-center justify-center relative z-10">
                                {isInstallment ? `12x de R$ ${plan.installmentPrice.replace('.', ',')}*` : "Pagamento único (PIX)"}
                            </p>

                            {/* Kit Preview only for Plan 2 */}
                            {plan.hasKit && (
                                <div className="w-full mt-4 sm:mt-6 mb-2 flex items-center justify-center gap-3 sm:gap-4 bg-black/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 relative z-10">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                            <img src="/LogoJPEG/camisaActive.png" alt="Camisa Active" className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground mt-1 font-bold">Camisa Prime</span>
                                    </div>
                                    <div className="font-bold text-white/20 text-sm sm:text-lg">+</div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                            <img src="/LogoJPEG/bolsaActive.png" alt="Bolsa Active" className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground mt-1 font-bold">Bolsa Active</span>
                                    </div>
                                </div>
                            )}

                            <ul className={cn("mt-6 sm:mt-8 gap-3 sm:gap-4 flex flex-col w-full text-left relative z-10", plan.hasKit ? "" : "mb-6 sm:mb-8 flex-grow")}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
                                        <div className={cn("mt-1 flex-shrink-0 p-1 rounded-full", plan.isPopular ? "bg-primary/20 text-primary" : "bg-white/10 text-white/50")}>
                                            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-white/80 font-medium leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="w-full mt-auto pt-6 sm:pt-8 relative z-10">
                                <button
                                    onClick={() => handleSelectPlan(index)}
                                    className={cn(
                                        "w-full py-3.5 sm:py-5 rounded-xl uppercase tracking-wider font-bold text-xs sm:text-sm transition-all duration-300 border",
                                        plan.isPopular
                                            ? "bg-primary text-primary-foreground border-primary glow-primary hover:bg-transparent hover:text-primary hover:border-primary"
                                            : "bg-transparent text-white border-white/20 hover:bg-white/10"
                                    )}
                                >
                                    {plan.buttonText}
                                </button>
                                <p className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] lg:text-xs text-muted-foreground px-1 sm:px-2 leading-relaxed h-8 flex items-center justify-center">
                                    {plan.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 sm:mt-24 text-center relative z-10 flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500/70" />
                    Ambiente 100% seguro. Sucesso absoluto em edições anteriores.
                </p>
                <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto px-4 italic">
                    * Os juros das parcelas variam quanto menor for o número de prestações. Caso prefira parcelar, preencha o formulário abaixo e nos contate no WhatsApp para tirarmos suas dúvidas.
                </p>
            </div>
        </div>
    );
};

export default PricingSection;
