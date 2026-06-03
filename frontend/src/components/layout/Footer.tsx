"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe, ChevronDown } from "lucide-react";
import { useData } from "@/context/DataProvider";
import { motion, AnimatePresence } from "framer-motion";

export const Footer = () => {
  const { categories } = useData();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/signup"
  ) {
    return null;
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const discoverLinks = [
    { label: "Accueil", href: "/" },
    { label: "Notre Catalogue", href: "/equipment" },
    { label: "Comment ça marche", href: "/how-it-works" },
    { label: "À propos de nous", href: "/about" },
    { label: "Contactez-nous", href: "/contact" }
  ];

  const clientLinks = [
    { label: "Suivre commande", href: "/track" },
    { label: "Centre d'aide", href: "/contact" },
    { label: "Devenir Partenaire", href: "/contact" },
    { label: "Support Technique", href: "/contact" },
    { label: "FAQ", href: "/how-it-works" }
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-12 border-t border-zinc-900">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Main Grid for Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Description Column (Always Visible) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center">
              <img 
                src="/aandilik.png" 
                alt="AANDILIK Logo" 
                className="h-14 w-auto object-contain"
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
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-[#f7941d] hover:border-[#f7941d]/30 transition-all cursor-pointer group"
                >
                  <Globe size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop/Tablet Link Columns (hidden on mobile) */}
          <div className="hidden md:flex flex-col gap-6">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Découvrir</h4>
            <ul className="space-y-4">
              {discoverLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#f7941d] transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex flex-col gap-6">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Catégories</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/equipment?category=${cat.name}`} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#f7941d] transition-colors"></span>
                    {cat.name}
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#f7941d] transition-colors"></span>Terrassement</Link></li>
                  <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#f7941d] transition-colors"></span>Levage</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="hidden md:flex flex-col gap-6">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Espace Client</h4>
            <ul className="space-y-4">
              {clientLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#f7941d] transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex flex-col gap-6">
            <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Contact Direct</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3.5 text-zinc-500 text-xs font-bold leading-relaxed">
                <MapPin size={16} className="text-[#f7941d] shrink-0 mt-0.5" />
                <span>Siège Social, Quartier Maârif, <br />Casablanca 20000, Maroc</span>
              </li>
              <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                <Phone size={16} className="text-[#f7941d] shrink-0" />
                <span>+212 522 34 56 78</span>
              </li>
              <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                <Mail size={16} className="text-[#f7941d] shrink-0" />
                <span>support@aandilik.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mobile Accordion Menu (hidden on desktop/tablet) */}
        <div className="md:hidden flex flex-col gap-2 mb-12 border-t border-zinc-900 pt-6">
          
          {/* Accordion 1: Découvrir */}
          <div className="border-b border-zinc-900/60 pb-2">
            <button 
              onClick={() => toggleSection("discover")}
              className="w-full flex items-center justify-between py-3 text-left font-black text-white uppercase tracking-widest text-[10px] cursor-pointer"
            >
              <span>Découvrir</span>
              <ChevronDown size={14} className={`text-[#f7941d] transition-transform duration-300 ${openSection === "discover" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "discover" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-3 pt-2 pb-4 pl-2">
                    {discoverLinks.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors block">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 2: Catégories */}
          <div className="border-b border-zinc-900/60 pb-2">
            <button 
              onClick={() => toggleSection("categories")}
              className="w-full flex items-center justify-between py-3 text-left font-black text-white uppercase tracking-widest text-[10px] cursor-pointer"
            >
              <span>Catégories</span>
              <ChevronDown size={14} className={`text-[#f7941d] transition-transform duration-300 ${openSection === "categories" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "categories" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-3 pt-2 pb-4 pl-2">
                    {categories.length > 0 ? categories.slice(0, 5).map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/equipment?category=${cat.name}`} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors block">
                          {cat.name}
                        </Link>
                      </li>
                    )) : (
                      <>
                        <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors block">Terrassement</Link></li>
                        <li><Link href="/equipment" className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors block">Levage</Link></li>
                      </>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 3: Espace Client */}
          <div className="border-b border-zinc-900/60 pb-2">
            <button 
              onClick={() => toggleSection("client")}
              className="w-full flex items-center justify-between py-3 text-left font-black text-white uppercase tracking-widest text-[10px] cursor-pointer"
            >
              <span>Espace Client</span>
              <ChevronDown size={14} className={`text-[#f7941d] transition-transform duration-300 ${openSection === "client" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "client" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-3 pt-2 pb-4 pl-2">
                    {clientLinks.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-zinc-500 text-xs font-bold hover:text-[#f7941d] transition-colors block">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 4: Contact Direct */}
          <div className="border-b border-zinc-900/60 pb-2">
            <button 
              onClick={() => toggleSection("contact")}
              className="w-full flex items-center justify-between py-3 text-left font-black text-white uppercase tracking-widest text-[10px] cursor-pointer"
            >
              <span>Contact Direct</span>
              <ChevronDown size={14} className={`text-[#f7941d] transition-transform duration-300 ${openSection === "contact" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {openSection === "contact" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-4 pt-2 pb-4 pl-2">
                    <li className="flex items-start gap-3.5 text-zinc-500 text-xs font-bold leading-relaxed">
                      <MapPin size={16} className="text-[#f7941d] shrink-0 mt-0.5" />
                      <span>Siège Social, Quartier Maârif, <br />Casablanca 20000, Maroc</span>
                    </li>
                    <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                      <Phone size={16} className="text-[#f7941d] shrink-0" />
                      <span>+212 522 34 56 78</span>
                    </li>
                    <li className="flex items-center gap-3.5 text-zinc-500 text-xs font-bold">
                      <Mail size={16} className="text-[#f7941d] shrink-0" />
                      <span>support@aandilik.com</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
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
