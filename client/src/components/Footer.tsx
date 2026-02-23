import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary">Safari Private Tours</h3>
            <p className="text-muted-foreground leading-relaxed">
              Curating exceptional African safari journeys. Experience Kenya in unmatched comfort and style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/packages" className="text-muted-foreground hover:text-primary transition-colors">Tour Packages</Link></li>
              <li><Link href="/fleet" className="text-muted-foreground hover:text-primary transition-colors">Our Fleet</Link></li>
              <li><Link href="/testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>125-00100 Ongata Rongai</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+254701034782</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>ochiengpeter146a@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 Safari Private Tours. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/admin" className="hover:text-primary opacity-50">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
