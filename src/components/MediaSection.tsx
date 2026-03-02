import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, Play, Image as ImageIcon, Film } from "lucide-react";
import { MediaLightbox, MediaItem, MediaType } from "./MediaLightbox";

// List highly curated, lightweight and visually appealing files from public/Midia
// Extremely reduced to exactly 15 core assets to guarantee 0 lag on any mobile device.
const allFiles = [
  { name: "IMG_3799.mp4", span: "row-span-2 col-span-2" },
  { name: "grupo-praia1.jpeg", span: "row-span-2 col-span-2" },
  { name: "treino-casal.jpg", span: "col-span-2" },
  { name: "IMG_4418.mp4", span: "row-span-2" },
  { name: "ganhadora1.jpeg", span: "" },
  { name: "treino-barra.jpeg", span: "row-span-2" },
  { name: "IMG_4467.mp4", span: "col-span-2 row-span-2" },
  { name: "ganhadora2.jpeg", span: "" },
  { name: "noticia-jornal.png", span: "col-span-2" },
  { name: "IMG_3823.jpg", span: "row-span-2" },
  { name: "IMG_4369.jpg", span: "" },
  { name: "IMG_4706.jpg", span: "" },
  { name: "IMG_4751.JPG.jpeg", span: "row-span-2" },
  { name: "IMG_5052.JPG.jpeg", span: "row-span-2 col-span-2" },
  { name: "IMG_3796.jpg", span: "" },
];

const parsedItems: MediaItem[] = allFiles.map((file, i) => {
  const isVideo =
    file.name.toLowerCase().endsWith(".mov") ||
    file.name.toLowerCase().endsWith(".mp4");
  return {
    id: `media-${i}`,
    src: `/Midia/${file.name}`,
    alt: `Momento Projeto Active - ${file.name}`,
    span: file.span,
    type: isVideo ? "video" : "image",
  };
});

const MOBILE_INITIAL = 6;
const INCR = 10;

const MediaSection = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Pagination states
  const [photosCount, setPhotosCount] = useState(MOBILE_INITIAL);
  const [videosCount, setVideosCount] = useState(MOBILE_INITIAL);

  const photos = useMemo(() => parsedItems.filter((m) => m.type === "image"), []);
  const videos = useMemo(() => parsedItems.filter((m) => m.type === "video"), []);

  const visiblePhotos = isMobile ? photos.slice(0, photosCount) : photos;
  const visibleVideos = isMobile ? videos.slice(0, videosCount) : videos;

  const currentItems = activeTab === "photos" ? visiblePhotos : visibleVideos;
  const totalItems = activeTab === "photos" ? photos.length : videos.length;
  const currentCount = activeTab === "photos" ? photosCount : videosCount;
  const remaining = totalItems - currentCount;

  const handleLoadMore = () => {
    if (activeTab === "photos") {
      setPhotosCount((prev) => Math.min(prev + INCR, photos.length));
    } else {
      setVideosCount((prev) => Math.min(prev + INCR, videos.length));
    }
  };

  return (
    <section
      id="media"
      className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-6 section-gradient"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3 sm:mb-4">
            Galeria
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-oswald uppercase">
            Momentos que <span className="text-gradient">transformam</span>
          </h2>
        </motion.div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="inline-flex bg-secondary/30 backdrop-blur-sm p-1.5 rounded-2xl ring-1 ring-white/10">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${activeTab === "photos"
                ? "bg-primary text-primary-foreground shadow-lg scale-100"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 scale-95"
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Fotos
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${activeTab === "videos"
                ? "bg-primary text-primary-foreground shadow-lg scale-100"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 scale-95"
                }`}
            >
              <Film className="w-4 h-4" />
              Vídeos
            </button>
          </div>
        </div>

        {/* Masonry CSS Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab} // Forces re-animation when tab changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 auto-rows-[120px] sm:auto-rows-[180px] md:auto-rows-[220px] grid-flow-dense"
          >
            {currentItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min((i % 10) * 0.05, 0.25),
                }}
                onClick={() => setSelectedItem(item)}
                onMouseEnter={(e) => {
                  if (item.type === "video") {
                    const video = e.currentTarget.querySelector("video");
                    video?.play().catch(() => { });
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.type === "video") {
                    const video = e.currentTarget.querySelector("video");
                    video?.pause();
                  }
                }}
                className={`cursor-pointer relative overflow-hidden rounded-2xl group bg-secondary/30 ring-1 ring-white/10 hover:ring-primary/50 hover:shadow-[0_0_30px_rgba(255,122,0,0.15)] transition-all duration-500 ${item.span}`}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Play Icon Overlay for Videos */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 opacity-70 group-hover:scale-110 group-hover:opacity-100 group-hover:bg-primary/90 transition-all duration-500">
                        <Play className="w-5 h-5 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                    {/* Zoom icon/glow for images on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button (Mobile) */}
        {isMobile && remaining > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 rounded-full px-8 py-3 hover:bg-primary/10 transition-all duration-300 hover:border-primary/60"
            >
              Ver mais {activeTab === "photos" ? "fotos" : "vídeos"} ({remaining})
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <MediaLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

export default MediaSection;
