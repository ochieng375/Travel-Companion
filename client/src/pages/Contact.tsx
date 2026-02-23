import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useCreateContact } from "@/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const { mutate, isPending } = useCreateContact();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // WhatsApp numbers
  const whatsappNumbers = ["254701034782", "254748847572", "254748122276"];
  const getRandomWhatsAppLink = () => {
    const randomNumber =
      whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    return `https://wa.me/${randomNumber}?text=Hi!%20I'm%20interested%20in%20booking%20a%20safari%20tour.`;
  };

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertContact) => {
    mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    });

    // Optional: if using frontend mailto (not recommended for production)
    // const subject = "Safari Inquiry";
    // const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
    // window.location.href = `mailto:mattjoe787@gmail.com,ochiengpeter146a@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      content: "125-00100 Ongata Rongai",
      subContent: "Nairobi, Kenya",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+254 701 034 782 / +254 748 847 572 / +254 748 122 276",
      subContent: "Mon-Fri, 8am-6pm EAT",
      color: "bg-green-50 text-green-600",
      href: "tel:+254701034782"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "ochiengpeter146a@gmail.com / mattjoe787@gmail.com",
      subContent: "We reply within 24 hours",
      color: "bg-amber-50 text-amber-600",
      href: "mailto:ochiengpeter146a@gmail.com,mattjoe787@gmail.com"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Fri: 8am - 6pm",
      subContent: "EAT (Kenyan Time)",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navigation />

      {/* Hero */}
      <div className="relative bg-stone-900 py-24">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&auto=format&fit=crop"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white">Let's Plan Your Safari</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have questions? We're here to help craft your perfect African adventure.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 flex-1 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-stone-700 hover:text-amber-600 transition-colors font-medium block">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-stone-700 font-medium">{item.content}</p>
                  )}
                  <p className="text-stone-500 text-sm mt-1">{item.subContent}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">Send us a Message</h2>
                <p className="text-stone-500 text-sm">We'll get back to you within 24 hours</p>
              </div>
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
                <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-stone-700 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      className="h-12 rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="Peter Ochieng"
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-700 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="h-12 rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="dutty@example.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-stone-700 font-medium">Your Message</Label>
                  <Textarea
                    id="message"
                    {...form.register("message")}
                    className="min-h-[150px] rounded-xl border-stone-200 focus:border-amber-500 focus:ring-amber-500 resize-none"
                    placeholder="Tell us about your dream safari, preferred dates, number of travelers..."
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-green-500 rounded-3xl p-8 text-white text-center shadow-xl">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Prefer WhatsApp?</h3>
              <p className="text-green-50 mb-6 text-lg">
                Chat with us directly for faster responses and instant booking confirmations.
              </p>
              <a
                href={getRandomWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50 rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  Chat on WhatsApp
                </Button>
              </a>
            </div>

            <div className="bg-stone-100 rounded-3xl p-8">
              <h4 className="font-bold text-stone-900 mb-4 text-lg">Why Book Direct?</h4>
              <ul className="space-y-3">
                {[
                  "Best price guarantee - no middleman fees",
                  "Free itinerary customization",
                  "24/7 in-country support during your safari",
                  "Flexible payment options"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-stone-700">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}