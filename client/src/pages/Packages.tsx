import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { usePackages } from "@/hooks/use-packages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, MapPin, Users, Star, Filter } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingOptions } from "@/components/BookingOptions";

export default function Packages() {
  const { data: packages, isLoading } = usePackages();
  const [filter, setFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filters = [
    { id: "all", label: "All Safaris" },
    { id: "popular", label: "Most Popular" },
    { id: "short", label: "Short Trips" },
    { id: "long", label: "Extended Tours" }
  ];

  const filteredPackages = packages?.filter(pkg => {
    if (filter === "all") return true;
    if (filter === "popular") return pkg.isPopular;
    if (filter === "short") return pkg.duration.includes("3") || pkg.duration.includes("4");
    if (filter === "long") return pkg.duration.includes("7") || pkg.duration.includes("10") || pkg.duration.includes("14");
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative bg-stone-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&auto=format&fit=crop" 
            alt="Safari" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">Curated Journeys</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">Safari Packages</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover our hand-crafted itineraries through Kenya's most spectacular wildlife destinations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-stone-400 shrink-0" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  filter === f.id 
                    ? "bg-amber-600 text-white shadow-lg" 
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[600px] bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPackages?.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredId(pkg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white rounded-2xl">
                    <div className="relative h-72 overflow-hidden">
                      <motion.img 
                        src={pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop"} 
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredId === pkg.id ? 1.1 : 1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {pkg.isPopular && (
                        <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-none px-3 py-1">
                          <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                        </Badge>
                      )}
                      
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          {pkg.duration}
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                        {pkg.name}
                      </h3>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <p className="text-stone-600 mb-6 line-clamp-3 leading-relaxed">{pkg.description}</p>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-stone-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-600" /> Highlights
                        </h4>
                        <ul className="space-y-2">
                          {pkg.itinerary.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                              <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex items-center gap-4 text-sm text-stone-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Max 6 guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span>4.9 (120 reviews)</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex items-center justify-between border-t border-stone-100 pt-6 mt-auto bg-stone-50/50">
                      <div>
                        <span className="text-xs text-stone-500 block mb-1">Starting from</span>
                        <span className="text-3xl font-bold text-amber-700">{pkg.price}</span>
                        <span className="text-stone-500 text-sm"> / person</span>
                      </div>
                      
                      {/* REPLACED: WhatsApp link with BookingOptions dialog */}
                      <BookingOptions pkg={pkg}>
                        <Button 
                          className="bg-stone-900 hover:bg-amber-600 text-white px-6 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Book Now
                        </Button>
                      </BookingOptions>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && filteredPackages?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">No packages found for this filter.</p>
            <Button onClick={() => setFilter("all")} variant="outline" className="mt-4">
              View All Packages
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}