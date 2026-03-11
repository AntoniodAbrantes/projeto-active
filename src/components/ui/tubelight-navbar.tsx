import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function TubelightNavbar({ items, className }: NavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const scrollTo = (href: string) => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div
            className={cn(
                "fixed top-0 left-1/2 -translate-x-1/2 z-[100] pt-4 sm:pt-6",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-black/60 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-lg">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <button
                            key={item.name}
                            onClick={() => {
                                setActiveTab(item.name)
                                scrollTo(item.url)
                            }}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-colors",
                                "text-muted-foreground hover:text-white",
                                isActive && "text-white",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-400 rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-orange-400/30 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-orange-400/30 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-orange-400/30 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
