import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";

// List all web-compatible files from public/Midia (29 items — HEIC removed)
const allFiles = [
  { name: "IMG_3799.mp4", span: "row-span-2 col-span-2" },
  { name: "IMG_3795.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_4764.MP4", span: "row-span-2 col-span-2" },
  { name: "FotoGanhadora1.jpeg", span: "" },
  { name: "IMG_3810.mp4", span: "" },
  { name: "IMG_3863.mp4", span: "row-span-2" },
  { name: "IMG_3840.mp4", span: "col-span-2" },
  { name: "IMG_4418.mp4", span: "row-span-2" },
  { name: "IMG_5127.mp4", span: "row-span-2 col-span-2" },
  { name: "FotoGanhadora2.jpeg", span: "" },
  { name: "IMG_4467.mp4", span: "col-span-2 row-span-2" },
  { name: "IMG_5510.mp4", span: "row-span-2 col-span-2" },
  { name: "IMG_4435.mp4", span: "row-span-2" },
  { name: "IMG_3882.JPG.jpeg", span: "" },
  { name: "IMG_4826.PNG", span: "" },
  { name: "IMG_4463.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_4752.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_4821.PNG", span: "col-span-2" },
  { name: "IMG_4751.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_5052.JPG.jpeg", span: "row-span-2 col-span-2" },
  { name: "IMG_5128.JPG.jpeg", span: "" },
  { name: "IMG_4753.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_4468.JPG.jpeg", span: "" },
  { name: "IMG_4817.JPG.jpeg", span: "" },
  { name: "IMG_5129.PNG", span: "" },
  { name: "IMG_5050.JPG.jpeg", span: "" },
  { name: "PrintJornalNoticia.png", span: "col-span-2" },
  { name: "IMG_5133.JPG.jpeg", span: "" },
  { name: "IMG_5143.JPG.jpeg", span: "" },
];

const mediaItems = allFiles.map((file) => {
  const isVideo = file.name.toLowerCase().endsWith(".mov") || file.name.toLowerCase().endsWith(".mp4");
  return {
    src: `/Midia/${file.name}`,
    alt: `Momento Projeto Active - ${file.name}`,
    span: file.span,
    type: isVideo ? "video" : "image"
  };
});

const MOBILE_INITIAL = 6;
const INCR = 10;

const MediaSection = () => {
  const isMobile = useIsMobile();
  const [showCount, setShowCount] = useState(MOBILE_INITIAL);

  const visibleItems = isMobile
    ? mediaItems.slice(0, showCount)
    : mediaItems;

  const remaining = mediaItems.length - showCount;

  return (
    <section id="media" className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 section-gradient">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Galeria
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-oswald uppercase">
            Momentos que <span className="text-gradient">transformam</span>
          </h2>
        </motion.div>

        {/* Masonry CSS Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[200px] grid-flow-dense">
          {visibleItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min((i % 10) * 0.05, 0.25) }}
              className={`relative overflow-hidden rounded-xl group bg-secondary/20 ${item.span}`}
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* "Ver mais" button on mobile */}
        {isMobile && remaining > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCount(prev => Math.min(prev + INCR, mediaItems.length))}
            className="mx-auto mt-8 flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 rounded-xl px-6 py-3 hover:bg-primary/10 transition-colors"
          >
            Ver mais fotos ({remaining})
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default MediaSection;
