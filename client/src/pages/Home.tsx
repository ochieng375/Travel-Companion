import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Map, Shield, Clock, Award, Users, ChevronDown } from "lucide-react";
import { usePackages } from "@/hooks/use-packages";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: packages, isLoading } = usePackages();
  const [scrollY, setScrollY] = useState(0);
  const featuredPackages = packages?.filter(p => p.isPopular).slice(0, 3) || [];
  
  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroY = useTransform(() => scrollY * 0.5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const stats = [
    { icon: Users, value: "2.5K+", label: "Happy Travelers" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Map, value: "50+", label: "Destinations" }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section - Cinematic with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop" 
            alt="African Safari Landscape" 
            className="w-full h-[120%] object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-900/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase">
                <Award className="w-4 h-4 text-amber-400" />
                Kenya's Premier Safari Experience
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight leading-tight"
            >
              Discover the
              <span className="block text-amber-400 italic">Extraordinary</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl font-light mb-10 max-w-2xl mx-auto text-white/90 leading-relaxed"
            >
              Curated journeys through Kenya's untamed wilderness. 
              Experience luxury travel redefined with expert guides and exclusive access.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/packages">
                <Button 
                  size="lg" 
                  className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-600/30 hover:-translate-y-1 transition-all duration-300 font-semibold"
                >
                  Explore Safaris
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white hover:text-stone-900 text-lg px-10 py-7 rounded-full transition-all duration-300 font-semibold"
                >
                  Plan Your Trip
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900 to-transparent p-8"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white/80">
              {[
                { icon: Shield, text: "Certified Guides" },
                { icon: Star, text: "5-Star Rated" },
                { icon: Award, text: "Award Winning" },
                { icon: Clock, text: "24/7 Support" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-stone-900 mb-1">{stat.value}</div>
                <div className="text-stone-600 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-700 font-bold tracking-widest uppercase text-sm">Exclusive Offers</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-stone-900">Featured Safari Destinations</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6 rounded-full" />
            <p className="mt-6 text-stone-600 max-w-2xl mx-auto text-lg">
              Hand-crafted itineraries designed for the discerning traveler seeking authentic African experiences.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[500px] bg-stone-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href="/packages">
                    <div className="group relative h-[550px] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                      <div className="absolute inset-0">
                        <img 
                          src={pkg.imageUrl || "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop"} 
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-90" />
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <span className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-full shadow-lg">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                        <h3 className="text-3xl font-serif font-bold mb-3 group-hover:text-amber-400 transition-colors">{pkg.name}</h3>
                        <p className="text-white/80 line-clamp-2 mb-6 text-lg leading-relaxed">{pkg.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <div>
                            <span className="text-sm text-white/60 block mb-1">Starting from</span>
                            <span className="text-2xl font-bold text-amber-400">{pkg.price}</span>
                          </div>
                          <span className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
                            View Details <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/packages">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300"
              >
                View All Destinations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&auto=format&fit=crop" 
            alt="Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">Why Travel With Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3">The Safari Private Tours Difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Safety First", 
                desc: "Your security is paramount. We maintain the highest safety standards with fully insured vehicles and certified wilderness first aid guides." 
              },
              { 
                icon: Star, 
                title: "Luxury Redefined", 
                desc: "Hand-selected lodges and premium 4x4 vehicles with WiFi, charging ports, and refreshments. Comfort meets adventure." 
              },
              { 
                icon: Map, 
                title: "Local Expertise", 
                desc: "Our guides are born and raised in Kenya. They know every hidden watering hole and the best times to spot the Big Five." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <span className="text-amber-700 font-bold tracking-widest uppercase text-sm">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-stone-900 mb-16">What Our Guests Say</h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-xl relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-serif italic text-stone-700 mb-8 leading-relaxed">
              "An absolutely life-changing experience. The attention to detail, the knowledgeable guides, and the breathtaking wildlife encounters exceeded every expectation."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=random" alt="Guest" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-900">Sarah Johnson</div>
                <div className="text-stone-600 text-sm">United Kingdom • Maasai Mara Safari</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href="/testimonials">
              <Button variant="outline" className="border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white rounded-full px-8">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&auto=format&fit=crop" 
            alt="Sunset Safari" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Ready for Your Adventure?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Let us craft your perfect safari experience. From luxury lodges to intimate bush camps, we create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-600/30 transition-all duration-300"
              >
                Start Planning Now
              </Button>
            </Link>
            <a href="https://wa.me/254701034782" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-stone-900 text-lg px-10 py-7 rounded-full transition-all duration-300"
              >
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}