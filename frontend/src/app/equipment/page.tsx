"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PublishDemandModal } from "@/components/ui/PublishDemandModal";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  ChevronDown,
  LayoutGrid,
  Star,
  Settings2,
  ArrowRight,
  ChevronRight,
  ShieldCheck, 
  CalendarCheck, 
  CreditCard, 
  Headset,
  X,
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ListingPage() {
  const { equipment, categories } = useData();
  const dynamicSidebarCategories = [
    { key: "Tous", label: "Tous les matériels" },
    ...categories.map(cat => ({ key: cat.name, label: cat.name }))
  ];
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeCity, setActiveCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPower, setMaxPower] = useState(2000);
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse query parameters on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get("search");
      const cat = urlParams.get("category");
      const loc = urlParams.get("location");
      const maxP = urlParams.get("maxPrice");

      if (search) setSearchQuery(search);
      if (cat) setActiveCategory(cat);
      if (loc) setActiveCity(loc);
      if (maxP) setMaxPrice(Number(maxP));
    }
  }, []);

  const getCategoryCount = (key: string) => {
    if (!equipment) return 0;
    if (key === "Tous") return equipment.filter((e: any) => e.status === "active").length;
    return equipment.filter((e: any) => e.status === "active" && (e.category || "").toLowerCase() === key.toLowerCase()).length;
  };

  const filtered = (equipment || []).filter((item: any) => {
    if (item.status !== "active") return false;

    // Category filter
    const matchesCategory =
      activeCategory === "Tous" ||
      (item.category || "").toLowerCase() === activeCategory.toLowerCase();

    // Search query
    const matchesSearch = 
      !searchQuery.trim() ||
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    // City / Location
    const matchesCity =
      !activeCity.trim() ||
      (item.location || "").toLowerCase().includes(activeCity.toLowerCase());

    // Max Price
    const matchesPrice = (item.pricePerDay || 0) <= maxPrice;

    // Power (kW) (Simulated: if not explicitly in DB, we use weights to represent size)
    const power = (item.poids_operationnel || 15) * 10;
    const matchesPower = power <= maxPower;

    // Capacity (m³)
    const capNum = parseFloat(item.capacite_godet || "0") || 1.2;
    const matchesCapacity = capNum <= maxCapacity;

    // Availability
    const matchesAvailable = !onlyAvailable || item.availability;

    return matchesCategory && matchesSearch && matchesCity && matchesPrice && matchesPower && matchesCapacity && matchesAvailable;
  });

  const handleResetFilters = () => {
    setActiveCategory("Tous");
    setActiveCity("");
    setSearchQuery("");
    setMaxPower(2000);
    setMaxCapacity(100);
    setMaxPrice(50000);
    setOnlyAvailable(false);
  };

  const filtersContent = (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-5 px-1 flex items-center justify-between">
          <span>Catégories</span>
        </h3>
        <div className="flex flex-col gap-2">
          {dynamicSidebarCategories.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <button 
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-zinc-950 shadow-sm border border-primary/20' 
                    : 'text-zinc-600 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${isActive ? 'bg-zinc-950 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                  {getCategoryCount(cat.key)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prix par jour Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Prix Max (DH/jour)</h3>
          <span className="text-xs font-black text-primary bg-zinc-950 px-2 py-0.5 rounded">{maxPrice} DH</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="100"
            max="50000"
            step="100"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full accent-primary bg-zinc-100 rounded-lg appearance-none h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-1 uppercase">
            <span>100 DH</span>
            <span>50,000 DH</span>
          </div>
        </div>
      </div>

      {/* Puissance Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Puissance Max (kW)</h3>
          <span className="text-xs font-black text-primary bg-zinc-950 px-2 py-0.5 rounded">{maxPower} kW</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="20"
            max="2000"
            step="10"
            value={maxPower}
            onChange={e => setMaxPower(Number(e.target.value))}
            className="w-full accent-primary bg-zinc-100 rounded-lg appearance-none h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-1 uppercase">
            <span>20 kW</span>
            <span>2000 kW</span>
          </div>
        </div>
      </div>

      {/* Capacité Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Capacité Max (m³)</h3>
          <span className="text-xs font-black text-primary bg-zinc-950 px-2 py-0.5 rounded">{maxCapacity} m³</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="0.5"
            max="100"
            step="0.5"
            value={maxCapacity}
            onChange={e => setMaxCapacity(Number(e.target.value))}
            className="w-full accent-primary bg-zinc-100 rounded-lg appearance-none h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-1 uppercase">
            <span>0.5 m³</span>
            <span>100 m³</span>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between px-1 border-t border-slate-100 pt-5">
        <span className="text-xs font-bold text-zinc-700">Afficher uniquement disponible</span>
        <input 
          type="checkbox"
          checked={onlyAvailable}
          onChange={e => setOnlyAvailable(e.target.checked)}
          className="w-4 h-4 accent-primary rounded cursor-pointer"
        />
      </div>

      {/* Reset */}
      <button 
        onClick={handleResetFilters}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-zinc-600 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <RotateCcw size={14} /> Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-32">
      {/* Header section with cover image */}
      <section className="relative bg-white pt-10 pb-32">
        <div className="absolute right-0 top-0 bottom-0 w-[85%] lg:w-[95%] pointer-events-none hidden md:block overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute inset-y-0 left-0 w-1/2 lg:w-[60%] bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <img 
            src="/equiment-hero.png" 
            alt="Hero Flotte" 
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]" 
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 via-white/20 to-transparent z-10" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-20">
          <div className="max-w-3xl py-10 md:py-20 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>&rsaquo;</span>
              <span className="text-slate-900">Matériels</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Notre gamme de <br />
              matériels de chantier <br />
              <span className="text-primary">puissants et certifiés</span>
            </h1>

            <p className="text-slate-600 font-semibold text-base leading-relaxed max-w-md">
              Louez en toute sérénité. Des engins validés techniquement par AANDILIK et prêts à travailler partout au Maroc.
            </p>
          </div>
        </div>

        {/* Search bar inputs overlapping the hero */}
        <div className="container mx-auto px-6 max-w-7xl relative z-30 -mb-48 md:-mb-[13rem]">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row items-end flex-wrap xl:flex-nowrap gap-4">
            
            {/* Search Input */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-[240px]">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Recherche</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un matériel..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl outline-none text-xs font-bold text-slate-800 border border-transparent focus:border-primary/20 focus:bg-white transition-all" 
                />
              </div>
            </div>

            {/* City / Location Input */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-[180px]">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Localisation</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Casablanca, Rabat..." 
                  value={activeCity} 
                  onChange={e => setActiveCity(e.target.value)}
                  className="w-full h-14 px-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl outline-none text-xs font-bold text-slate-800 border border-transparent focus:border-primary/20 focus:bg-white transition-all" 
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              </div>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200"
            >
              <SlidersHorizontal size={16} /> Affiner la recherche
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="container mx-auto px-6 max-w-7xl mt-48 md:mt-32 xl:mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
            {filtersContent}
          </aside>

          {/* Cards Area */}
          <main className="lg:col-span-9 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {filtered.map((item: any) => (
                <EquipmentResultCard key={item.id} item={item} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-24 bg-white rounded-3xl border border-slate-200/50 flex flex-col items-center justify-center text-center p-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Aucun résultat</h3>
                <p className="text-slate-400 text-xs font-medium max-w-sm mt-2 leading-relaxed">
                  Nous n&apos;avons trouvé aucun équipement correspondant à vos critères de recherche. Essayez d&apos;élargir vos filtres.
                </p>
                <Button 
                  variant="secondary" 
                  className="mt-8 px-6" 
                  onClick={handleResetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Responsive Filter Drawer for Mobile */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 p-6 flex flex-col overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <span className="text-sm font-black uppercase tracking-wider text-slate-900">Filtres</span>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1">
                {filtersContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WHY CHOOSE SECTION */}
      <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-24 relative z-10">
        <div className="bg-white rounded-[32px] p-10 lg:p-14 shadow-sm border border-slate-200/50 flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start">
          
          <div className="flex flex-col gap-4 max-w-xs shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">POURQUOI CHOISIR AANDILIK ?</span>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">
              La meilleure expérience de location pour vos chantiers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full lg:ml-8">
            
            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-primary/10 rounded-full"></div>
                <ShieldCheck size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Matériel vérifié</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Tous nos matériels sont contrôlés et entretenus régulièrement.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-primary/10 rounded-full"></div>
                <CalendarCheck size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Réservation rapide</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Réservez en ligne en toute sécurité avec confirmation rapide.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-primary/10 rounded-full"></div>
                <CreditCard size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Paiement protégé</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Transactions sécurisées et paiement en ligne 100% fiable.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-primary/10 rounded-full"></div>
                <Headset size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Support de chantier</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Notre équipe est disponible pour vous accompagner et résoudre vos urgences.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* PUBLISH DEMAND BANNER */}
      <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-12 mb-12 relative z-10">
        <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden bg-zinc-950 flex flex-col justify-center min-h-[280px] border border-zinc-900">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/last.png" 
              alt="Construction Equipment Background" 
              className="w-full h-full object-cover object-center opacity-65" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-10 lg:p-16 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-4 block">
              VOUS NE TROUVEZ PAS LE MATÉRIEL QU&apos;IL VOUS FAUT ?
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Publiez votre demande
            </h2>
            <p className="text-xs font-semibold text-zinc-400 mb-8 max-w-sm leading-relaxed">
              Indiquez vos besoins et recevez des offres personnalisées de nos propriétaires partenaires.
            </p>
            <button 
              onClick={() => setIsDemandModalOpen(true)}
              className="bg-primary hover:bg-amber-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-4 group w-fit cursor-pointer shadow-lg shadow-primary/20"
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
    <Card variant="lowest" className="group rounded-[20px] overflow-hidden border border-slate-200/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white flex flex-col h-full">
      <Link href={`/equipment/${item.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        {/* Availability Badge */}
        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[9px] font-black tracking-wide uppercase shadow-sm ${
          isAvailable ? 'bg-green-950 text-green-400 border border-green-900/50' : 'bg-red-950 text-red-400 border border-red-900/50'
        }`}>
          {isAvailable ? 'Disponible' : 'Maintenance'}
        </div>
      </Link>

      <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
        <h3 className="text-sm font-black tracking-tight leading-snug text-slate-900 group-hover:text-amber-500 transition-colors flex-1">
          {item.name}
        </h3>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Poids</span>
            <span className="text-xs font-bold text-slate-800">{item.poids_operationnel || 22.5} t</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Godet</span>
            <span className="text-xs font-bold text-slate-800">{item.capacite_godet || "1.2 m³"}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-slate-900 text-xl font-black leading-none">{item.pricePerDay}</span>
            <span className="text-[10px] font-black text-slate-500 ml-0.5">MAD / jour</span>
          </div>
          <Link href={`/equipment/${item.id}`}>
            <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:bg-primary hover:text-zinc-950 transition-all cursor-pointer">
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
