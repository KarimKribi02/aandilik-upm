"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
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
  Settings2
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

  const filtered = (equipment || []).filter(item => {
    const matchesCategory = activeCategory === "Tous" || item.category === activeCategory || (activeCategory === "Excavateurs" && item.category === "Earthmoving");
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = !onlyAvailable || item.status === "active";
    // Simplified city/price matching for UI demo
    return matchesCategory && matchesSearch && matchesAvailable;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] pb-32">
      {/* Hero Header with Background Image */}
      <section className="relative h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/digfptrqs/image/upload/v1776790326/2d5e03265a3b5c2c510dadd57382a04d_wpqveb.jpg" 
            alt="Chantier" 
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1118]/80 via-[#0a1118]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-20">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Solutions de Levage & Terrassement</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Réservez la <br />
              <span className="text-primary italic">puissance</span>.
            </h1>
            <div className="flex items-center gap-6 mt-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex flex-col">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Flotte Active</span>
                <span className="text-xl font-black text-white leading-none">{filtered.length} Machines</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex flex-col">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Disponibilité</span>
                <span className="text-xl font-black text-green-400 leading-none">Immédiate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Header Toolbar */}
      <section className="bg-white border-b border-surface-container sticky top-32 z-40 py-4 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-6 bg-surface-low rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" className="h-12 px-6 flex items-center gap-3 bg-white border border-surface-container">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-secondary">
                <LayoutGrid size={14} /> Pertinence
              </div>
              <ChevronDown size={14} />
            </Button>
            <Button variant="secondary" className="h-12 px-6 flex items-center gap-2 bg-white border border-surface-container">
              <Settings2 size={16} className="text-primary" />
              <span className="text-xs font-black uppercase text-secondary">Filtres</span>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-10">
            {/* Categories */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-6 px-1">Catégorie</h3>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-secondary hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-6 px-1">Ville</h3>
              <div className="flex flex-col gap-1">
                {cities.map(city => (
                  <button 
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeCity === city 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-secondary hover:bg-surface-container'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Per Day */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-6 px-1">Prix par jour</h3>
              <div className="flex flex-col gap-1">
                {priceRanges.map(price => (
                  <button 
                    key={price}
                    onClick={() => setActivePrice(price)}
                    className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activePrice === price 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-secondary hover:bg-surface-container'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-6 border-t border-surface-container">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-6 px-1">Disponibilité</h3>
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-secondary">Disponibles uniquement</span>
                <button 
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${onlyAvailable ? 'bg-primary' : 'bg-surface-container'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${onlyAvailable ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            <button 
              onClick={() => {
                setActiveCategory("Tous");
                setActiveCity("Toutes les villes");
                setActivePrice("Tous les prix");
                setOnlyAvailable(false);
                setSearchQuery("");
              }}
              className="text-xs font-bold text-primary italic hover:underline w-fit"
            >
              Réinitialiser les filtres
            </button>
          </aside>

          {/* Grid Content */}
          <main className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item) => (
                <EquipmentResultCard key={item.id} item={item} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <Search size={48} className="text-secondary/20 mb-6" />
                <h3 className="text-2xl font-black tracking-tight">Aucun résultat</h3>
                <p className="text-secondary font-medium">Nous n'avons pas trouvé de matériel correspondant à vos critères.</p>
                <Button variant="tertiary" className="mt-8" onClick={() => setSearchQuery("")}>Réinitialiser la recherche</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function EquipmentResultCard({ item }: { item: any }) {
  const isAvailable = item.status === "active";
  
  return (
    <Card variant="lowest" className="group rounded-[32px] overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white flex flex-col h-full">
      <Link href={`/equipment/${item.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </div>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-secondary hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </Link>

      <div className="p-8 flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-primary/10 w-fit px-3 py-1 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">
            <Settings2 size={12} /> {item.category}
          </div>
          <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-secondary">
            <span className="flex items-center gap-1 opacity-60"><MapPin size={12} /> {item.location}</span>
            <span className="flex items-center gap-1 text-primary"><Star size={12} fill="currentColor" /> 4.9 (47)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-surface-container">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Poids</div>
            <div className="text-xs font-black">22t</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Puissance</div>
            <div className="text-xs font-black">124KW</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">Portée</div>
            <div className="text-xs font-black">9.8m</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-2xl font-black text-foreground">{item.pricePerDay * 10} <span className="text-sm">MAD/j</span></span>
          </div>
          <Link href={`/equipment/${item.id}`}>
            <Button variant="secondary" className="bg-[#0a1118] text-white hover:bg-black rounded-xl h-10 px-6 font-black text-xs uppercase tracking-widest">
              Voir +
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
