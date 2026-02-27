import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface StatProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
}

const useCountUp = (end: number, decimals: number, started: boolean, duration = 2000) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [started, end, decimals, duration]);

  return value;
};

const StatCard = ({ end, decimals = 0, prefix = "", suffix = "", label, delay }: StatProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(end, decimals, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const formatted = decimals > 0
    ? count.toFixed(decimals).replace(".", ",")
    : count.toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-3xl sm:text-5xl md:text-7xl font-black font-oswald text-gradient">
        {prefix}{formatted}{suffix}
      </div>
      <p className="mt-1 sm:mt-3 text-xs sm:text-sm md:text-base text-muted-foreground font-medium uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section id="stats" className="relative py-10 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-8 sm:mb-16"
        >
          Resultados Reais
        </motion.p>

        <div className="grid grid-cols-3 gap-4 sm:gap-16">
          <StatCard end={60} prefix="+" label="Participantes" delay={0} />
          <StatCard end={102.6} decimals={1} suffix=" kg" label="Perdidos" delay={0.15} />
          <StatCard end={30} label="Dias de Transformação" delay={0.3} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
