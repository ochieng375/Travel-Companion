import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingDialog } from "@/components/BookingDialogg"; // Updated import

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Tour Packages" },
    { href: "/fleet", label: "Our Fleet" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-tighter">
            Safari Private Tours<span className="text-foreground">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Button 
              onClick={() => setIsBookingOpen(true)}
              className="font-semibold px-6 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-foreground" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b"
            >
              <div className="flex flex-col p-4 space-y-4">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={cn(
                      "text-lg font-medium py-2 px-4 rounded-md hover:bg-secondary transition-colors",
                      location === link.href ? "text-primary bg-secondary/50" : "text-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Booking Dialog */}
      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>
  );
}