"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Construction, Globe, Link2, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white pt-32 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Construction size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                Aandil<span className="text-primary italic">ik</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-8 max-w-sm font-medium">
              La plateforme digitale de référence pour la location de matériel professionnel. 
              Simplifiez vos chantiers avec notre expertise industrielle.
            </p>
            <div className="flex gap-4">
              {["facebook", "twitter", "linkedin", "instagram"].map(social => (
                <div key={social} className="w-10 h-10 rounded-xl bg-surface-low border border-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer">
                  <Globe size={18} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-widest text-[10px] mb-8">Partenaires</h4>
            <ul className="space-y-4">
              {["Nos Clients", "Gros Oeuvre", "Levage", "Béton", "Terrassement", "Outillage"].map((item) => (
                <li key={item}>
                  <Link href="/equipment" className="text-secondary text-xs font-bold hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-widest text-[10px] mb-8">Utiles</h4>
            <ul className="space-y-4">
              {["Équipements", "Fonctionnement", "Devenir Partenaire", "Mentions Légales", "Cookies", "Privacy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-secondary text-xs font-bold hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground uppercase tracking-widest text-[10px] mb-8">Support</h4>
            <ul className="space-y-4">
              {["Contact", "FAQ", "Assistance 24/7"].map((item) => (
                <li key={item}>
                  <Link href="/contact" className="text-secondary text-xs font-bold hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-surface-container flex flex-col md:flex-row justify-between gap-8 text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
          <span>© 2026 Aandilik - construit avec passion pour l'industrie.</span>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary">Conditions Générales</Link>
            <Link href="#" className="hover:text-primary">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
