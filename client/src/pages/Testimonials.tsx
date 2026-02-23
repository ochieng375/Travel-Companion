import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useTestimonials, useCreateTestimonial } from "@/hooks/use-testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Quote, Star, Award, PenLine, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTestimonialSchema, type InsertTestimonial } from "@shared/schema";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const { mutate: createTestimonial, isPending } = useCreateTestimonial();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertTestimonial>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      clientName: "",
      content: "",
      rating: "5", // String to match schema
      imageUrl: ""
    }
  });

  const onSubmit = (data: InsertTestimonial) => {
    console.log("Submitting testimonial:", data);
    
    createTestimonial(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
        setTimeout(() => {
          setIsSubmitted(false);
          setShowForm(false);
        }, 3000);
      },
      onError: (error) => {
        console.error("Submission failed:", error);
        alert(error.message || "Failed to submit testimonial. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navigation />
      
      {/* Hero */}
      <div className="relative bg-stone-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop" 
            alt="Safari" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">Client Stories</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Real experiences from travelers who've explored Kenya with us.
            </p>
            
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PenLine className="w-5 h-5 mr-2" />
              {showForm ? "Close Form" : "Share Your Experience"}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Expandable Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-12 max-w-2xl">
              <Card className="border-none shadow-xl bg-stone-50">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <Quote className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-stone-900">Write Your Review</h3>
                        <p className="text-stone-500 text-sm">Share your safari experience with future travelers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-stone-400" />
                    </button>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-green-900 mb-2">Thank You!</h4>
                      <p className="text-green-700">Your testimonial has been submitted for review.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="clientName" className="text-stone-700 font-medium">Your Name</Label>
                          <Input
                            id="clientName"
                            {...form.register("clientName")}
                            className="h-12 rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                            placeholder="John Smith"
                          />
                          {form.formState.errors.clientName && (
                            <p className="text-xs text-red-500">{form.formState.errors.clientName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imageUrl" className="text-stone-700 font-medium">Photo URL (optional)</Label>
                          <Input
                            id="imageUrl"
                            {...form.register("imageUrl")}
                            className="h-12 rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                            placeholder="https://example.com/your-photo.jpg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-stone-700 font-medium">Your Rating</Label>
                        <div className="flex gap-2">
                          {["1", "2", "3", "4", "5"].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => form.setValue("rating", star)}
                              className="p-2 hover:scale-110 transition-transform"
                            >
                              <Star 
                                className={`w-8 h-8 ${parseInt(star) <= parseInt(form.watch("rating") || "5") ? "text-amber-400 fill-current" : "text-stone-300"}`} 
                              />
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...form.register("rating")} />
                        {form.formState.errors.rating && (
                          <p className="text-xs text-red-500">{form.formState.errors.rating.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-stone-700 font-medium">Your Experience</Label>
                        <Textarea
                          id="content"
                          {...form.register("content")}
                          className="min-h-[120px] rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500 resize-none"
                          placeholder="Tell us about your safari experience. What did you love? What made it special?"
                        />
                        {form.formState.errors.content && (
                          <p className="text-xs text-red-500">{form.formState.errors.content.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Submit Testimonial <PenLine className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "500+", label: "Happy Clients" },
              { value: "98%", label: "Recommend Us" },
              { value: "150+", label: "5-Star Reviews" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-1">{stat.value}</div>
                <div className="text-stone-600 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <main className="container mx-auto px-4 py-16 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="relative h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl group">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                  
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <Quote className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                        {[...Array(parseInt(t.rating) || 5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-stone-700 mb-8 italic text-lg leading-relaxed">
                      "{t.content}"
                    </p>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-stone-100">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-200 ring-2 ring-amber-100">
                        <img 
                          src={t.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=random&size=128`} 
                          alt={t.clientName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-lg">{t.clientName}</h4>
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Verified Traveler</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}