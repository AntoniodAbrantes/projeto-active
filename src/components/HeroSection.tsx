import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const TOTAL_FRAMES = 120;
const FRAME_PATH = "/sequence1/ezgif-frame-";

const getFrameSrc = (index: number) => {
  const padded = String(index).padStart(3, "0");
  return `${FRAME_PATH}${padded}.jpg`;
};

const HeroSection = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [hasFrames, setHasFrames] = useState(true);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number>();

  // Use a plain MotionValue for scroll progress (manually driven from window scroll)
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { damping: 50, stiffness: 300 });

  // Text animations tied to scroll
  // The coconut sequence gets close to the camera around 65% of the scroll.
  // We fade the text in precisely at this moment (0.65 -> 0.8) so it hits 100% visibility right as the coconut impacts
  const heroOpacity = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);
  const heroY = useTransform(smoothProgress, [0.65, 0.8], [40, 0]);
  const subOpacity = useTransform(smoothProgress, [0.7, 0.85], [0, 1]);
  const subY = useTransform(smoothProgress, [0.7, 0.85], [30, 0]);
  const ctaOpacity = useTransform(smoothProgress, [0.75, 0.9], [0, 1]);
  const ctaScale = useTransform(smoothProgress, [0.75, 0.9], [0.95, 1]);
  const bridgeOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  // Scroll indicator fades out at the very start
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  // Overlay darkens exactly as the text appears to improve contrast, making it cinematic
  const overlayOpacity = useTransform(smoothProgress, [0.6, 0.85], [0.15, 0.65]);

  // On mobile, skip frame sequence entirely — go straight to video
  const useFrames = !isMobile;

  // Drive rawProgress from a continuous RAF loop — reads DOM position every frame.
  // This bypasses Lenis/scroll event ordering issues entirely.
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const sectionHeight = el.offsetHeight - window.innerHeight;
        if (sectionHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
          rawProgress.set(progress);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rawProgress]);

  useEffect(() => {
    if (!useFrames) {
      setHasFrames(false);
      setImagesLoaded(true);
      return;
    }

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let errors = 0;

    const timeout = setTimeout(() => {
      if (!imagesLoaded) {
        console.warn("Frame loading timed out. Falling back to video.");
        setHasFrames(false);
        setImagesLoaded(true);
      }
    }, 10000);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.floor((loaded / TOTAL_FRAMES) * 100));
        if (loaded + errors >= TOTAL_FRAMES) {
          clearTimeout(timeout);
          setHasFrames(loaded > 0);
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        errors++;
        if (loaded + errors >= TOTAL_FRAMES) {
          clearTimeout(timeout);
          setHasFrames(loaded > 0);
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => clearTimeout(timeout);
  }, [useFrames, imagesLoaded]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    if (currentFrameRef.current === index) return;
    currentFrameRef.current = index;

    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, []);

  // Update canvas when smoothProgress changes
  useEffect(() => {
    if (!imagesLoaded || !hasFrames) return;
    const unsubscribe = smoothProgress.on("change", (latest) => {
      // The video sequence finishes its timeline at 85% of the scroll (0.85)
      // This gives the user the remaining 15% of the scroll to read the text 
      // while the background stays perfectly frozen and beautiful, eliminating any black gap feeling.
      const frameProgress = Math.min(1, latest / 0.85);
      const frameIndex = Math.min(
        Math.floor(frameProgress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    });

    drawFrame(Math.min(
      Math.floor((smoothProgress.get() / 0.85) * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    ));

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, hasFrames, smoothProgress, drawFrame]);

  const scrollToRegistration = () => {
    document.querySelector("#registration")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" ref={containerRef} className={`relative ${hasFrames ? "h-[400vh]" : "h-screen"}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas for frame sequence (desktop only) */}
        {hasFrames && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        )}

        {/* Video background (mobile always, desktop fallback) */}
        {!hasFrames && imagesLoaded && (
          <div className="absolute inset-0">
            <video
              src="/Midia/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Loading state (desktop only) */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-4">
            <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Carregando experiência
            </p>
          </div>
        )}

        {/* Cinematic gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: hasFrames ? overlayOpacity : 1,
            background: `linear-gradient(
              to bottom,
              hsl(0 0% 2% / 0.5) 0%,
              hsl(0 0% 2% / 0.3) 20%,
              hsl(0 0% 2% / 0.4) 50%,
              hsl(0 0% 2% / 0.8) 80%,
              hsl(0 0% 2%) 100%
            )`,
          }}
        />

        {/* Vignette effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 2% / 0.6) 100%)",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-20 md:pb-28 px-4 sm:px-6 text-center z-10">
          <motion.h1
            key={hasFrames ? "frames" : "video"}
            {...(hasFrames
              ? { style: { opacity: heroOpacity, y: heroY } }
              : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.3 } }
            )}
            className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black font-oswald uppercase leading-[1.1] tracking-normal max-w-5xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
          >
            Chegou a hora de se tornar{" "}
            <span className="text-gradient">quem você admira.</span>
          </motion.h1>

          <motion.p
            key={hasFrames ? "frames-p" : "video-p"}
            {...(hasFrames
              ? { style: { opacity: subOpacity, y: subY } }
              : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.7 } }
            )}
            className="mt-3 sm:mt-6 md:mt-8 text-xs sm:text-base md:text-xl text-muted-foreground max-w-2xl leading-relaxed px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
          </motion.p>

          <motion.button
            key={hasFrames ? "frames-btn" : "video-btn"}
            {...(hasFrames
              ? { style: { opacity: ctaOpacity, scale: ctaScale } }
              : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 1.1 } }
            )}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToRegistration}
            className="mt-5 sm:mt-10 md:mt-12 bg-primary text-primary-foreground px-8 sm:px-12 py-3 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base md:text-lg font-bold animate-pulse-glow cursor-pointer"
          >
            Aceitar o desafio!
          </motion.button>

          {/* Scroll Down Bridge */}
          <motion.div
            key={hasFrames ? "frames-bridge" : "video-bridge"}
            {...(hasFrames
              ? { style: { opacity: bridgeOpacity } }
              : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 1.5 } }
            )}
            className="mt-6 sm:mt-8 flex flex-col items-center gap-1.5 text-muted-foreground/60 hover:text-white transition-colors cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight * 4, behavior: 'smooth' })}
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold font-oswald text-primary/80">Veja Nossos Resultados</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="m6 9 6 6 6-6" /></svg>
            </motion.div>
          </motion.div>

          {/* Scroll indicator — hidden on mobile */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="mt-8 sm:mt-12 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
