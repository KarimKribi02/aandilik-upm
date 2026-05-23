"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-24 pb-12 border-t border-zinc-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          
          {/* Logo & Description Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center">
              <img 
                src="/aandilik.png" 
                alt="AANDILIK Logo" 
                className="h-7 w-auto object-contain invert brightness-0" 
              />
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm font-medium">
              La plateforme digitale de référence pour la location de matériel professionnel et d&apos;engins de chantier au Maroc. Simplifiez vos chantiers avec notre expertise industrielle et notre flotte validée.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "linkedin", "instagram"].map(social => (
                <div 
                  key={social} 
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                >
                  <Globe size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Liens Rapides</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Accueil", href: "/" },
                { label: "À propos", href: "/about" },
                { label: "Comment ça marche", href: "/how-it-works" },
                { label: "Contact", href: "/contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-semibold hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Catégories</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Earthmoving", href: "/equipment?category=Earthmoving" },
                { label: "Lifting", href: "/equipment?category=Lifting" },
                { label: "Concrete", href: "/equipment?category=Concrete" },
                { label: "Tools", href: "/equipment?category=Tools" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-semibold hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-2.5 text-zinc-500 text-xs font-semibold">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Casablanca, Maroc</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-500 text-xs font-semibold">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+212 522 00 00 00</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-500 text-xs font-semibold">
                <Mail size={14} className="text-primary shrink-0" />
                <span>contact@aandilik.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright section */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
          <span>© 2026 AANDILIK. Tous droits réservés.</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Conditions Générales</Link>
            <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
