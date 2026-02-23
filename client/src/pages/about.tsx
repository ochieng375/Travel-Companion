import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Award, Users, MapPin, Shield, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const stats = [
    { icon: Users, value: "10K+", label: "Happy Travelers" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: MapPin, value: "50+", label: "Destinations" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      desc: "Your security is paramount. We maintain the highest safety standards with fully insured vehicles and certified wilderness first aid guides."
    },
    {
      icon: Award,
      title: "Expert Guides",
      desc: "Our guides are born and raised in Kenya. They know every hidden watering hole and the best times to spot the Big Five."
    },
    {
      icon: Star,
      title: "Luxury Experience",
      desc: "Hand-selected lodges and premium 4x4 vehicles with WiFi, charging ports, and refreshments. Comfort meets adventure."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navigation />
      
      {/* Hero */}
      <div className="relative bg-stone-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop"
            alt="Safari"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">
              About Safari Private Tours
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Crafting unforgettable African adventures since 2014. We are Kenya's premier luxury safari operator.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-stone-200">
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
                <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                <div className="text-stone-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop"
                alt="Safari Guide"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-700 font-bold tracking-widest uppercase text-sm">Our Story</span>
              <h2 className="text-4xl font-serif font-bold mt-3 text-stone-900 mb-6">
                Born from a Passion for Kenya's Wilderness
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                Safari Private Tours was founded by Peter Ochieng, a Kenya native who grew up 
                exploring the Maasai Mara. What started as sharing his backyard with curious 
                travelers has grown into Kenya's most trusted luxury safari operator.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                We believe that experiencing Africa's wildlife should be comfortable, safe, and 
                deeply personal. Every itinerary we craft is tailored to your dreams, whether 
                that's witnessing the Great Migration or finding solitude in the remote bush.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&auto=format&fit=crop"
            alt="Pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-serif font-bold mt-3">The Safari Private Tours Difference</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Contact CTA */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">Meet Your Guides</h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto mb-12">
            Our team of certified safari guides brings decades of combined experience and 
            an infectious passion for Kenya's wildlife and culture.
          </p>
          
          <div className="bg-white rounded-3xl p-12 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700">
                PO
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-stone-900">Peter Ochieng</h3>
                <p className="text-amber-600">Founder & Lead Guide</p>
              </div>
            </div>
            <blockquote className="text-xl text-stone-700 italic mb-8">
              "Every safari is a story waiting to be told. Let us help you write yours."
            </blockquote>
            <a href="/contact">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-10 rounded-full">
                Start Your Journey
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}