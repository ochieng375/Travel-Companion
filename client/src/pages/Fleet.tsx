import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useVehicles } from "@/hooks/use-vehicles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Wifi, Snowflake, Shield, Check, ArrowRight, MessageCircle, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, Component, ReactNode } from "react";
import { Link } from "wouter";

/* -------------------- Error Boundary -------------------- */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <h1 className="text-2xl font-bold text-red-600"> Something went wrong. </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------- Vehicle Booking Dialog -------------------- */
function VehicleBookingOptions({ vehicle, children }: { vehicle: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const whatsappNumbers = ["254701034782", "254748847572", "254748122276"];
  const getRandomWhatsAppLink = () => {
    const randomNumber = whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    return `https://wa.me/${randomNumber}?text=Hi!%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(vehicle.name)}%20(${encodeURIComponent(vehicle.capacity)})%20for%20a%20safari.%20Please%20provide%20availability%20and%20pricing.`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white">
        <div className="relative h-48 bg-stone-900 overflow-hidden">
          {vehicle.imageUrl ? (
            <img 
              src={vehicle.imageUrl} 
              alt={vehicle.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-stone-800 flex items-center justify-center">
              <Users className="w-16 h-16 text-stone-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <h3 className="text-2xl font-serif font-bold">{vehicle.name}</h3>
            <p className="text-white/80 text-sm">{vehicle.capacity}</p>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-stone-900">Pricing</h4>
                <p className="text-sm text-stone-600">Per day rental rate</p>
              </div>
              <div className="text-2xl font-bold text-amber-700">
                KES {vehicle.price}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {vehicle.features?.slice(0, 3).map((feature: string, idx: number) => (
                <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full text-stone-600 border border-amber-200">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-900 text-sm uppercase tracking-wide">Book This Vehicle</h4>
            
            <a 
              href={getRandomWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">WhatsApp Booking</div>
                <div className="text-sm text-green-100">Instant confirmation & fastest response</div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <Link href="/contact">
              <a 
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-stone-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">Send Inquiry</div>
                  <div className="text-sm text-stone-500">Custom quote within 24 hours</div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500 text-center">
              All vehicles include professional driver/guide, fuel, and insurance
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- Fleet Page -------------------- */
export default function Fleet() {
  const { data: vehicles, isLoading } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const features = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Snowflake, label: "Air Conditioned" },
    { icon: Shield, label: "Insured" },
    { icon: Users, label: "Expert Driver" },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navigation />

        {/* ---------------- Hero Section ---------------- */}
        <div className="relative bg-stone-900 py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=1600&auto=format&fit=crop"
              alt="Safari Vehicle"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">
                Premium Transportation
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">
                Our Safari Fleet
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Travel in style and comfort with our collection of high-end 4x4 vehicles, specially
                modified for wildlife viewing and photography.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ---------------- Features Bar ---------------- */}
        <div className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-stone-900">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Fleet List ---------------- */}
        <main className="container mx-auto px-4 py-16 flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] bg-stone-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {vehicles?.map((vehicle, idx) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 ${
                      selectedVehicle === vehicle.id ? "ring-2 ring-amber-500" : ""
                    }`}
                    onClick={() =>
                      setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)
                    }
                  >
                    <div className="grid md:grid-cols-5">
                      {/* Image */}
                      <div className="md:col-span-2 h-64 md:h-full relative bg-stone-100">
                        {vehicle.imageUrl ? (
                          <motion.img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-stone-400">
                            <Users className="w-12 h-12 opacity-40" />
                          </div>
                        )}
                        <Badge
                          className={`absolute top-4 left-4 text-white ${
                            vehicle.status === "available"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {vehicle.status}
                        </Badge>
                      </div>

                      {/* Content */}
                      <CardContent className="md:col-span-3 p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                            {vehicle.name}
                          </h3>
                          <p className="text-stone-600 mb-6">{vehicle.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {vehicle.features?.map((feature, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-stone-50 border-stone-200"
                              >
                                <Check className="w-3 h-3 mr-1 text-amber-600" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between border-t pt-6">
                          <div>
                            <p className="text-2xl font-bold text-stone-900">KES{vehicle.price}</p>
                            <p className="text-sm text-stone-500">per day</p>
                          </div>
                          
                          {/* FUNCTIONAL BOOK NOW BUTTON */}
                          <VehicleBookingOptions vehicle={vehicle}>
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                              Book Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </VehicleBookingOptions>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}