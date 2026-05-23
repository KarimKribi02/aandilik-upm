"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { PublishDemandModal } from "@/components/ui/PublishDemandModal";
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpRight, 
  Heart, 
  ChevronDown,
  LayoutGrid,
  List,
  Star,
  Settings2,
  ArrowRight,
  Calendar,
  RotateCcw,
  Truck,
  Grip,
  ChevronRight,
  ShieldCheck, 
  CalendarCheck, 
  CreditCard, 
  Headset
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Tous",
  "Excavateurs",
  "Grues & Levage",
  "Béton & Maçonnerie",
  "Compactage",
  "Générateurs",
  "Échafaudages"
];

const cities = [
  "Toutes les villes",
  "Casablanca",
  "Marrakech",
  "Rabat",
  "Agadir",
  "Fès",
  "Tanger",
  "Meknès"
];

const priceRanges = [
  "Tous les prix",
  "Moins de 500 MAD/j",
  "500 - 1 000 MAD/j",
  "1 000 - 2 000 MAD/j",
  "Plus de 2 000 MAD/j"
];

export default function ListingPage() {
  const { equipment } = useData();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeCity, setActiveCity] = useState("Toutes les villes");
  const [activePrice, setActivePrice] = useState("Tous les prix");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);

  const filtered = (equipment || []).filter((item: any) => {
    // Only show active (certified) equipment on public page
    if (item.status !== "active") return false;

    const matchesCategory = activeCategory === "Tous" || item.category === activeCategory || (activeCategory === "Excavateurs" && item.category === "Earthmoving");
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = !onlyAvailable || item.availability;
    
    return matchesCategory && matchesSearch && matchesAvailable;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] pb-32">
      {/* New Desktop Split-Hero Section */}
      <section className="relative bg-white pt-10 pb-32">
        {/* Right Half Image with Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-[85%] lg:w-[95%] max-w-none pointer-events-none hidden md:block overflow-hidden" style={{ zIndex: 0 }}>
          {/* Restored gradient fade to cover the extended left side of the image */}
          <div className="absolute inset-y-0 left-0 w-1/2 lg:w-[60%] bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          
          <img 
            src="/equiment-hero.png?v=125" 
            alt="Hero Equipment" 
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]" 
          />
          
          {/* Softer Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-20">
          <div className="max-w-3xl py-10 md:py-20 flex flex-col gap-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>&rsaquo;</span>
              <span className="text-gray-900">Matériels</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-black text-[#1b1c1c] leading-[1.05] tracking-tight">
              Notre gamme de <br />
              matériels de construction <br />
              <span className="text-[#FFB800]">puissants et fiables</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 font-semibold text-base leading-relaxed max-w-md">
              Trouvez le matériel idéal pour vos chantiers.<br />
              Disponible partout au Maroc.
            </p>

            {/* Hero Stats */}
            <div className="flex flex-wrap items-center gap-10 mt-4">
              <div className="flex items-center gap-4">
                <div className="text-[#FFB800]">
                  <Settings2 size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 leading-none">500+</span>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Matériels disponibles</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-[#FFB800]">
                  <LayoutGrid size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 leading-none">1200+</span>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Projets réalisés</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[#FFB800]">
                  <Star size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 leading-none">850+</span>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Propriétaires actifs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlapping Floating Multi-Filter Bar */}
        <div className="container mx-auto px-6 max-w-7xl relative z-30 -mb-48 md:-mb-[13rem]">
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row items-end flex-wrap xl:flex-nowrap gap-4">
            
            {/* Search Input */}
            <div className="flex flex-col gap-3 flex-1 min-w-[240px]">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Recherche</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un matériel..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl outline-none text-sm font-bold text-gray-900 border border-transparent focus:border-primary/20 transition-all" 
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Catégorie</label>
              <div className="relative">
                <select 
                  value={activeCategory} 
                  onChange={e => setActiveCategory(e.target.value)}
                  className="w-full h-14 px-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl outline-none text-sm font-bold text-gray-900 border border-transparent focus:border-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Location Input */}
            <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Localisation</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ville, région..." 
                  value={activeCity} 
                  onChange={e => setActiveCity(e.target.value)}
                  className="w-full h-14 px-4 pr-10 bg-gray-50/50 hover:bg-gray-50 rounded-xl outline-none text-sm font-bold text-gray-900 border border-transparent focus:border-primary/20 transition-all" 
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              </div>
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
              <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">Prix max. (DH/jour)</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Prix maximum" 
                  value={activePrice === "Tous les prix" ? "" : activePrice} 
                  onChange={e => setActivePrice(e.target.value)}
                  className="w-full h-14 px-4 pr-10 bg-gray-50/50 hover:bg-gray-50 rounded-xl outline-none text-sm font-bold text-gray-900 border border-transparent focus:border-primary/20 transition-all" 
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex-shrink-0 w-full xl:w-auto">
              <Button className="w-full h-14 px-8 bg-[#FFB800] hover:bg-[#FFB800]/90 hover:scale-105 active:scale-95 text-black font-black flex items-center justify-center gap-3 rounded-xl transition-all shadow-lg shadow-[#FFB800]/20">
                Rechercher <ArrowRight size={16} />
              </Button>
            </div>

          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl mt-48 md:mt-32 xl:mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-10">
            {/* Categories */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 mb-6 px-1">Catégories</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Tous les matériels", count: 124, icon: <LayoutGrid size={16} /> },
                  { name: "Pelles hydrauliques", count: 28, icon: <Settings2 size={16} /> },
                  { name: "Bulldozers", count: 14, icon: <Truck size={16} /> },
                  { name: "Chargeuses", count: 18, icon: <Settings2 size={16} /> },
                  { name: "Tombereaux", count: 16, icon: <Truck size={16} /> },
                  { name: "Niveleuses", count: 12, icon: <Settings2 size={16} /> },
                  { name: "Compacteurs", count: 9, icon: <Truck size={16} /> },
                  { name: "Autres", count: 27, icon: <Grip size={16} /> },
                ].map(cat => {
                  const isActive = activeCategory === cat.name || (activeCategory === "Tous" && cat.name === "Tous les matériels");
                  return (
                    <button 
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name === "Tous les matériels" ? "Tous" : cat.name)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[#FFF6E5] text-gray-900 shadow-sm border border-[#FFB800]/20' 
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${isActive ? 'text-[#FFB800] opacity-80' : 'text-gray-400'}`}>
                          {cat.icon}
                        </div>
                        <span>{cat.name}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${isActive ? 'bg-[#FFEDC2] text-[#B8860B]' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Puissance Slider */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800">Puissance</h3>
              </div>
              <div className="px-2 pb-2">
                <div className="relative h-1.5 w-full bg-gray-100 rounded-full mt-4 mb-3">
                  <div className="absolute top-0 bottom-0 left-0 right-10 bg-[#FFB800] rounded-full"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-8 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-2">
                  <span>0 kW</span>
                  <span>500+ kW</span>
                </div>
              </div>
            </div>

            {/* Capacité Slider */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800">Capacité</h3>
              </div>
              <div className="px-2 pb-2">
                <div className="relative h-1.5 w-full bg-gray-100 rounded-full mt-4 mb-3">
                  <div className="absolute top-0 bottom-0 left-0 right-8 bg-[#FFB800] rounded-full"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-2">
                  <span>0 m³</span>
                  <span>50+ m³</span>
                </div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800">Prix par jour (DH)</h3>
              </div>
              <div className="px-2 pb-2">
                <div className="relative h-1.5 w-full bg-gray-100 rounded-full mt-4 mb-3">
                  <div className="absolute top-0 bottom-0 left-0 right-4 bg-[#FFB800] rounded-full"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 bg-white border-2 border-[#FFB800] rounded-full shadow-sm cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-2">
                  <span>0 DH</span>
                  <span>10,000+ DH</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button 
              onClick={() => {
                setActiveCategory("Tous");
                setActiveCity("Toutes les villes");
                setActivePrice("Tous les prix");
                setSearchQuery("");
                setOnlyAvailable(false);
              }}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Réinitialiser les filtres <RotateCcw size={14} />
            </button>
          </aside>

          {/* Grid Content */}
          <main className="lg:col-span-9 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-gray-500">Trier par</span>
                 <div className="px-4 py-2 border border-gray-200 rounded-[10px] flex items-center gap-3 text-xs font-bold text-gray-800 bg-white cursor-pointer shadow-sm">
                    Plus récents <ChevronDown size={14} className="text-gray-400" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {filtered.map((item: any) => (
                <EquipmentResultCard key={item.id} item={item} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center flex-1">
                <Search size={48} className="text-secondary/20 mb-6" />
                <h3 className="text-2xl font-black tracking-tight">Aucun résultat</h3>
                <p className="text-secondary font-medium mt-2">Nous n&apos;avons pas trouvé de matériel correspondant à vos critères.</p>
                <Button variant="tertiary" className="mt-8 bg-gray-100/50 hover:bg-gray-100 text-gray-900 border-none" onClick={() => setSearchQuery("")}>Réinitialiser la recherche</Button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-16 mb-8 flex items-center justify-center gap-2">
                 <button className="w-10 h-10 rounded-full bg-[#FFB800] text-black font-black text-[13px] flex items-center justify-center shadow-[0_4px_12px_rgba(255,184,0,0.3)] hover:scale-105 transition-all">1</button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-bold text-[13px] flex items-center justify-center hover:bg-gray-50 transition-colors">2</button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-bold text-[13px] flex items-center justify-center hover:bg-gray-50 transition-colors">3</button>
                 <span className="text-gray-400 font-black text-xs px-2">...</span>
                 <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-bold text-[13px] flex items-center justify-center hover:bg-gray-50 transition-colors">8</button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-bold text-[13px] flex items-center justify-center hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* POURQUOI CHOISIR AANDILIK SECTION */}
      <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-24 relative z-10">
        <div className="bg-white rounded-[32px] p-10 lg:p-14 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start">
          
          {/* Header block */}
          <div className="flex flex-col gap-4 max-w-xs shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB800]">POURQUOI CHOISIR AANDILIK ?</span>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-[1.1] tracking-tight">
              La meilleure expérience de location pour vos chantiers
            </h2>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full lg:ml-8">
            
            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-[#FFB800]/15 rounded-full"></div>
                <ShieldCheck size={28} strokeWidth={1.5} className="relative z-10 text-gray-900" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Matériel vérifié</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Tous nos matériels sont contrôlés et entretenus régulièrement.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-[#FFB800]/15 rounded-full"></div>
                <CalendarCheck size={28} strokeWidth={1.5} className="relative z-10 text-gray-900" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Réservation sécurisée</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Réservez en ligne en toute sécurité avec confirmation rapide.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-[#FFB800]/15 rounded-full"></div>
                <CreditCard size={28} strokeWidth={1.5} className="relative z-10 text-gray-900" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Paiement protégé</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Transactions sécurisées et paiement en ligne 100% fiable.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-[#FFB800]/15 rounded-full"></div>
                <Headset size={28} strokeWidth={1.5} className="relative z-10 text-gray-900" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Support 24/7</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Notre équipe est disponible 24h/24 et 7j/7 pour vous aider.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* PUBLISH DEMAND BANNER */}
      <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-12 mb-12 relative z-10">
        <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden bg-[#111315] flex flex-col justify-center min-h-[280px]">
          {/* Background Image Setup */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/last.png" 
              alt="Construction Equipment Background" 
              className="w-full h-full object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#151719] via-[#151719]/90 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-10 lg:p-16 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4 block">
              VOUS NE TROUVEZ PAS LE MATÉRIEL QU&apos;IL VOUS FAUT ?
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Publiez votre demande
            </h2>
            <p className="text-xs font-semibold text-gray-400 mb-10 max-w-sm leading-relaxed">
              Indiquez vos besoins et recevez des offres personnalisées de nos propriétaires.
            </p>
            <button 
              onClick={() => setIsDemandModalOpen(true)}
              className="bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-6 py-4 rounded-xl text-xs font-black transition-colors flex items-center gap-4 group w-fit"
            >
              Publier une demande
              <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <PublishDemandModal 
        isOpen={isDemandModalOpen} 
        onClose={() => setIsDemandModalOpen(false)} 
      />
    </div>
  );
}

function EquipmentResultCard({ item }: { item: any }) {
  const isAvailable = item.status === "active";
  
  return (
    <Card variant="lowest" className="group rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 bg-white flex flex-col h-full">
      <Link href={`/equipment/${item.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&q=80&w=800";
          }}
        />
        {/* Dark Green Badge */}
        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-black tracking-wide shadow-sm ${
          isAvailable ? 'bg-[#004d33] text-[#00ff88]' : 'bg-red-900 text-red-300'
        }`}>
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </div>
        {/* Heart */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors">
          <Heart size={14} strokeWidth={2.5} />
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1 bg-white">
        <h3 className="text-[13px] font-black tracking-tight leading-snug text-gray-900 group-hover:text-primary transition-colors flex-1">{item.name}</h3>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-400">Poids opérationnel</span>
            <span className="text-xs font-bold text-gray-800">{item.poids_operationnel || 22.5} t</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-400">Capacité godet</span>
            <span className="text-xs font-bold text-gray-800">{item.capacite_godet || "1.2 m³"}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50/50">
          <div className="flex items-baseline gap-1">
            <span className="text-[#FFB800] text-lg font-black leading-none">{item.pricePerDay * 10}</span>
            <span className="text-[11px] font-black text-[#FFB800] ml-0.5">DH</span>
            <span className="text-[10px] font-bold text-gray-400">/jour</span>
          </div>
          <Link href={`/equipment/${item.id}`}>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#FFB800] transition-colors">
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
