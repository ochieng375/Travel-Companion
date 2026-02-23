import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { usePhotos } from "@/hooks/use-photos";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { SafariPhoto } from "@shared/schema";

export default function Gallery() {
  const { data: photos, isLoading } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<SafariPhoto | null>(null);
  const [filter, setFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract unique categories
  const categories = ["all", ...new Set(photos?.map(p => p.category).filter(Boolean) || [])];

  const filteredPhotos = photos?.filter(photo => 
    filter === "all" || photo.category === filter
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") setSelectedPhoto(null);
      if (e.key === "ArrowLeft") navigatePhoto(-1);
      if (e.key === "ArrowRight") navigatePhoto(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentIndex, filteredPhotos]);

  const navigatePhoto = (direction: number) => {
    if (!filteredPhotos) return;
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < filteredPhotos.length) {
      setCurrentIndex(newIndex);
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  };

  const openLightbox = (photo: SafariPhoto, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-stone-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop"
            alt="Safari"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-900/70 to-stone-900" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">
              Travel Memories
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
              Safari Gallery
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Captured moments from our extraordinary journeys across Kenya's wilderness. 
              Real experiences from real travelers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Camera className="w-5 h-5 text-stone-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  filter === cat 
                    ? "bg-amber-600 text-white shadow-lg" 
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat === "all" ? "All Photos" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-16 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredPhotos?.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 mx-auto mb-4 text-stone-300" />
            <p className="text-stone-500 text-lg">No photos in this category yet</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPhotos?.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(photo, idx)}
                >
                  <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl">
                    <div className="aspect-square relative overflow-hidden">
                      <motion.img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-bold text-lg mb-1">{photo.title}</h3>
                        {photo.location && (
                          <div className="flex items-center gap-1 text-white/80 text-sm">
                            <MapPin className="w-4 h-4" />
                            {photo.location}
                          </div>
                        )}
                      </div>

                      {/* Category Badge */}
                      {photo.category && (
                        <Badge className="absolute top-4 left-4 bg-white/90 text-stone-900 backdrop-blur-sm">
                          {photo.category}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white z-50 p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto(-1); }}
              className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto(1); }}
              className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors disabled:opacity-30"
              disabled={currentIndex === (filteredPhotos?.length || 0) - 1}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl max-h-[85vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
                
                {/* Info Bar */}
                <div className="p-6 bg-stone-900 border-t border-stone-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h2>
                      <p className="text-stone-300 leading-relaxed">{selectedPhoto.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                      {selectedPhoto.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedPhoto.location}
                        </div>
                      )}
                      {selectedPhoto.takenDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(selectedPhoto.takenDate), "MMMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Counter */}
              <div className="text-center mt-4 text-white/50 text-sm">
                {currentIndex + 1} / {filteredPhotos?.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}