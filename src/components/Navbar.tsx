import { useState, useEffect } from "react";
import { Home, Trophy, Users, Info, Zap } from "lucide-react";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Início", url: "#hero", icon: Home },
  { name: "Resultados", url: "#stats", icon: Trophy },
  { name: "Depoimentos", url: "#testimonials", icon: Users },
  { name: "Sobre", url: "#experience", icon: Info },
  { name: "Inscreva-se", url: "#pricing", icon: Zap },
];

const Navbar = () => {
  return (
    <>
      <TubelightNavbar items={navItems} />

      {/* Desktop Logo Floating Left */}
      <div className="fixed top-0 left-0 p-6 z-50 pointer-events-none hidden md:block">
        <button
          onClick={() => document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" })}
          className="pointer-events-auto"
        >
          <img
            src="/LogoJPEG/logo-transparent.png"
            alt="Projeto Active"
            className="h-12 object-contain drop-shadow-lg hover:opacity-80 transition-opacity"
          />
        </button>
      </div>
    </>
  );
};

export default Navbar;
