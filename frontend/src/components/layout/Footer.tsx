"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { useData } from "@/context/DataProvider";

export const Footer = () => {
  const { categories } = useData();
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-24 pb-12 border-t border-zinc-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Logo & Description Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Link href="/" className="flex items-center">
              <img 
                src="/aandilik.png" 
                alt="AANDILIK Logo" 
                className="h-16 w-auto object-contain invert"
              />
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm font-medium pr-8">
              AANDILIK OPS est la plateforme digitale de référence pour la location de matériel professionnel et d&apos;engins de chantier au Maroc. Communauté de confiance entre propriétaires et locataires.
            </p>
            <div className="flex gap-4">
              {[
                { name: "Facebook", href: "https://facebook.com" },
                { name: "Twitter", href: "https://twitter.com" },
                { name: "Linkedin", href: "https://linkedin.com" },
                { name: "Instagram", href: "https://instagram.com" }
              ].map(social => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <Globe size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Découvrir</h4>
            <ul className="space-y-4">
              {[
                { label: "Accueil", href: "/" },
                { label: "Notre Catalogue", href: "/equipment" },
                { label: "Comment ça marche", href: "/how-it-works" },
                { label: "À propos de nous", href: "/about" },
                { label: "Contactez-nous", href: "/contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column - Dynamic */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Catégories</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/equipment?category=${cat.name}`} className="text-zinc-500 text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors"></span>
                    {cat.name}
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors"></span>Terrassement</Link></li>
                  <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors"></span>Levage</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Espace Client</h4>
            <ul className="space-y-4">
              {[
                { label: "Suivre commande", href: "/track" },
                { label: "Centre d'aide", href: "/contact" },
                { label: "Devenir Partenaire", href: "/contact" },
                { label: "Support Technique", href: "/contact" },
                { label: "FAQ", href: "/how-it-works" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Contact Direct</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3.5 text-zinc-500 text-xs font-bold leading-relaxed">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>Siège Social, Quartier Maârif, <br />Casablanca 20000, Maroc</span>
              </li>
              <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+212 522 34 56 78</span>
              </li>
              <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@aandilik.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright section */}
        <div className="pt-10 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600 text-[9px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>© 2026 AANDILIK GROUP. TOUS DROITS RÉSERVÉS.</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-zinc-800"></span>
            <span>RÉSEAU NATIONAL CERTIFIÉ</span>
          </div>
          <div className="flex gap-8">
            <Link href="/legal/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link href="/legal/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
