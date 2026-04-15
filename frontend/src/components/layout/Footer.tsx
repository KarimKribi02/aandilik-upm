import Link from "next/link";
import { Construction, Globe, Link2, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface-container py-24 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white">
                <Construction size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Equipment<span className="text-primary">Catalog</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-8">
              The Digital Architect for modern construction rental. Precision, structural integrity, and premium service for the world's master builders.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-secondary hover:text-primary transition-colors">
                <Globe size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-secondary hover:text-primary transition-colors">
                <Link2 size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-8">Equipment</h4>
            <ul className="space-y-4">
              {["Earthmoving", "Lifting", "Concrete", "Materials", "Small Tools"].map((item) => (
                <li key={item}>
                  <Link href="/equipment" className="text-secondary text-sm hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-8">Platform</h4>
            <ul className="space-y-4">
              {["How it works", "Safety First", "Pricing", "Support", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-secondary text-sm hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-8">Support & Legal</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-secondary text-sm">
                <MapPin size={16} className="text-primary" />
                Casablanca, Morocco
              </li>
              <li className="flex items-center gap-3 text-secondary text-sm">
                <Phone size={16} className="text-primary" />
                +212 522 00 00 00
              </li>
              <li className="flex items-center gap-3 text-secondary text-sm">
                <Mail size={16} className="text-primary" />
                contact@equipmentcatalog.ma
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8 text-secondary text-xs">
          <span>© 2026 Equipment Catalog. Built with Industrial Sophistication.</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
