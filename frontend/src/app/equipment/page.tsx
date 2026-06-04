"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PublishDemandModal } from "@/components/ui/PublishDemandModal";
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CalendarCheck, 
  CreditCard, 
  Headset,
  X,
  RotateCcw,
  SlidersHorizontal,
  Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import dynamic from 'next/dynamic';

const EquipmentCard = dynamic(() => import('@/components/EquipmentCard'), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-gray-100 rounded-2xl" />
});

export default function ListingPage() {
  const { equipment = [], categories = [], reservations = [] } = useData() || {};
  
  const dynamicSidebarCategories = [
    { key: "Tous", label: "Tous les matériels" },
    ...(Array.isArray(categories) 
      ? categories.map(cat => ({ key: cat?.name || "", label: cat?.name || "" })) 
      : [])
  ];

  const categoriesList = Array.isArray(categories) 
    ? categories.map(cat => {
        let imageSrc = cat?.image;
        if (!imageSrc || imageSrc === "" || imageSrc === "null") {
          imageSrc = "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800";
        }
        return {
          name: cat?.name || "",
          key: cat?.name || "",
          img: imageSrc,
          count: getCategoryCount(cat?.name || "")
        };
      }) 
    : [];

  // Immediate UI states (for instant slider movement and typing feedback)
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [maxPower, setMaxPower] = useState(2000);
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Debounced states (for calling the backend API)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("Tous");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(50000);
  const [debouncedMaxPower, setDebouncedMaxPower] = useState(2000);
  const [debouncedMaxCapacity, setDebouncedMaxCapacity] = useState(100);
  const [debouncedOnlyAvailable, setDebouncedOnlyAvailable] = useState(false);

  const [filteredEquipment, setFilteredEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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

      setTimeout(() => {
        if (search) {
          setSearchQuery(search);
          setDebouncedSearchQuery(search);
        }
        if (cat) {
          setActiveCategory(cat);
          setDebouncedCategory(cat);
        }
        if (loc) {
          setActiveCity(loc);
          setDebouncedCity(loc);
        }
        if (maxP) {
          setMaxPrice(Number(maxP));
          setDebouncedMaxPrice(Number(maxP));
        }
      }, 0);
    }
  }, []);

  // Debounce logic (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setDebouncedCity(activeCity);
      setDebouncedCategory(activeCategory);
      setDebouncedMaxPrice(maxPrice);
      setDebouncedMaxPower(maxPower);
      setDebouncedMaxCapacity(maxCapacity);
      setDebouncedOnlyAvailable(onlyAvailable);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, activeCity, activeCategory, maxPrice, maxPower, maxCapacity, onlyAvailable]);

  // Fetch filtered data from API when debounced values change
  useEffect(() => {
    let active = true;
    const fetchFilteredData = async () => {
      setIsLoading(true);
      try {
        const queryParams: any = {};
        if (debouncedSearchQuery.trim()) queryParams.search = debouncedSearchQuery.trim();
        if (debouncedCity.trim()) queryParams.localisation = debouncedCity.trim();
        if (debouncedCategory !== "Tous") queryParams.categorie = debouncedCategory;
        if (debouncedMaxPrice < 50000) queryParams.prixMax = debouncedMaxPrice;
        if (debouncedMaxPower < 2000) queryParams.puissanceMax = debouncedMaxPower;
        if (debouncedMaxCapacity < 100) queryParams.capaciteMax = debouncedMaxCapacity;

        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, val]) => {
          searchParams.append(key, String(val));
        });

        const url = `/materiel?${searchParams.toString()}`;
        const rawData = await apiFetch(url);
        
        if (active) {
          const transformed = Array.isArray(rawData) ? rawData.map((item: any) => {
            const rawImage = (item?.images || item?.image || "") as string;
            const secureImage = rawImage.startsWith('http://api.aandilik.com')
              ? rawImage.replace('http://api.aandilik.com', 'https://api.aandilik.com')
              : rawImage;

            const isValidImage = secureImage && 
                                secureImage !== "null" && 
                                secureImage !== "undefined" && 
                                secureImage.length > 10;
            const imageUrl = isValidImage 
              ? secureImage 
              : "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800";

            return {
              id: item?.id?.toString() || "",
              ownerId: item?.proprietaire?.id?.toString() || "",
              name: item?.nom_equipement || "",
              category: (item?.categorie || "Earthmoving"),
              pricePerDay: item?.prix_location || 0,
              location: item?.localisation || "",
              availability: true,
              image: imageUrl,
              description: item?.description || "",
              specs: {},
              status: (item?.status === 'active' || item?.status === 'pending' || item?.status === 'rejected' ? item?.status : "pending") as any,
              poids_operationnel: item?.poids_operationnel,
              capacite_godet: item?.capacite_godet
            };
          }) : [];

          // Apply active filter and availability filter
          const activeOnly = transformed.filter((item: any) => item?.status === "active");
          const finalData = activeOnly.filter((item: any) => {
            const isRented = Array.isArray(reservations) && reservations.some((r: any) => r?.equipmentId === item?.id && r?.status === "In Progress");
            return !debouncedOnlyAvailable || !isRented;
          });

          setFilteredEquipment(finalData);
        }
      } catch (err) {
        console.error("Error fetching filtered equipment:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchFilteredData();

    return () => {
      active = false;
    };
  }, [debouncedSearchQuery, debouncedCity, debouncedCategory, debouncedMaxPrice, debouncedMaxPower, debouncedMaxCapacity, debouncedOnlyAvailable, reservations]);

  const getCategoryCount = (key: string) => {
    if (!equipment || !Array.isArray(equipment)) return 0;
    const items = equipment.filter((e: any) => e?.status === "active");
    const counts = items.filter((item: any) => {
      const isRented = Array.isArray(reservations) && reservations.some(r => r?.equipmentId === item?.id && r?.status === "In Progress");
      if (key === "Tous") return !isRented;
      return !isRented && (item?.category || "").toLowerCase() === key.toLowerCase();
    });
    return counts.length;
  };

  const handleResetFilters = () => {
    // Reset immediate UI states
    setSearchQuery("");
    setActiveCity("");
    setActiveCategory("Tous");
    setMaxPrice(50000);
    setMaxPower(2000);
    setMaxCapacity(100);
    setOnlyAvailable(false);

    // Reset debounced states immediately to trigger instant refresh
    setDebouncedSearchQuery("");
    setDebouncedCity("");
    setDebouncedCategory("Tous");
    setDebouncedMaxPrice(50000);
    setDebouncedMaxPower(2000);
    setDebouncedMaxCapacity(100);
    setDebouncedOnlyAvailable(false);
  };

  // Slider background track gradients calculation
  const pricePercent = ((maxPrice - 100) / (50000 - 100)) * 100;
  const powerPercent = ((maxPower - 20) / (2000 - 20)) * 100;
  const capacityPercent = ((maxCapacity - 0.5) / (100 - 0.5)) * 100;

  const filtersContent = (
    <div className="flex flex-col gap-8">
      {/* Categories block */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
          Catégories
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(dynamicSidebarCategories) ? dynamicSidebarCategories.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <button 
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isActive 
                    ? 'bg-[#f7941d] border-[#f7941d] text-white shadow-md shadow-orange-500/20 scale-[1.02]' 
                    : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-colors ${
                  isActive ? 'bg-white text-[#f7941d]' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {getCategoryCount(cat.key)}
                </span>
              </button>
            );
          }) : null}
        </div>
      </div>

      {/* Prix par jour Slider */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Prix Max (DH/jour)</h3>
          <span className="text-[10px] font-black text-[#f7941d] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100/50">{maxPrice} DH</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="100"
            max="50000"
            step="100"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #f7941d 0%, #f7941d ${pricePercent}%, #e2e8f0 ${pricePercent}%, #e2e8f0 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#f7941d] focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-2 uppercase tracking-wider">
            <span>100 DH</span>
            <span>50,000 DH</span>
          </div>
        </div>
      </div>

      {/* Puissance Slider */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Puissance Max (kW)</h3>
          <span className="text-[10px] font-black text-[#f7941d] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100/50">{maxPower} kW</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="20"
            max="2000"
            step="10"
            value={maxPower}
            onChange={e => setMaxPower(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #f7941d 0%, #f7941d ${powerPercent}%, #e2e8f0 ${powerPercent}%, #e2e8f0 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#f7941d] focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-2 uppercase tracking-wider">
            <span>20 kW</span>
            <span>2000 kW</span>
          </div>
        </div>
      </div>

      {/* Capacité Slider */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Capacité Max (m³)</h3>
          <span className="text-[10px] font-black text-[#f7941d] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100/50">{maxCapacity} m³</span>
        </div>
        <div className="px-1">
          <input 
            type="range"
            min="0.5"
            max="100"
            step="0.5"
            value={maxCapacity}
            onChange={e => setMaxCapacity(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #f7941d 0%, #f7941d ${capacityPercent}%, #e2e8f0 ${capacityPercent}%, #e2e8f0 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#f7941d] focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
          />
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-2 uppercase tracking-wider">
            <span>0.5 m³</span>
            <span>100 m³</span>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <span className="text-xs font-bold text-slate-700">Afficher uniquement disponible</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            checked={onlyAvailable}
            onChange={e => setOnlyAvailable(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f7941d]"></div>
        </label>
      </div>

      {/* Reset Button */}
      <button 
        onClick={handleResetFilters}
        className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
      >
        <RotateCcw size={14} className="text-[#f7941d]" /> Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-32">
      {/* Mobile Top Header (only on mobile viewports) */}
      <div className="md:hidden sticky top-0 bg-white z-40 border-b border-slate-100 px-4 py-3 flex flex-col gap-3">
        {/* Top Title Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-600 hover:text-[#f7941d] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-gray-900">
                {activeCategory === "Tous" ? "Tous les matériels" : activeCategory}
              </h1>
              <span className="text-[10px] font-bold text-gray-400">
                {(filteredEquipment && Array.isArray(filteredEquipment)) ? filteredEquipment.length : 0} équipement{((filteredEquipment && Array.isArray(filteredEquipment)) ? filteredEquipment.length : 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Search Input on Mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un équipement..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#f7941d]/30 transition-all" 
          />
        </div>

        {/* Sticky horizontal filter triggers */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 h-11 border border-gray-100 bg-white rounded-xl px-4 flex items-center justify-between text-left text-xs font-semibold text-gray-700 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none">Trier par</span>
              <span className="text-[10px] font-black text-gray-900 mt-0.5">Popularité</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 h-11 border border-gray-100 bg-white rounded-xl px-4 flex items-center justify-between text-left text-xs font-semibold text-gray-700 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider leading-none">Filtrer</span>
              <span className="text-[10px] font-black text-gray-900 mt-0.5">Tous les filtres</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Header section with cover image */}
      <section className="relative bg-white pt-10 pb-32 hidden md:block">
        <div className="absolute right-0 top-0 bottom-0 w-[85%] lg:w-[95%] pointer-events-none hidden md:block overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute inset-y-0 left-0 w-1/2 lg:w-[60%] bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <Image 
            src="/equiment-hero.png" 
            alt="Hero Flotte" 
            fill
            className="object-cover object-[70%_center]" 
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
              <span className="text-[#f7941d]">puissants et certifiés</span>
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un matériel..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/50 rounded-xl outline-none text-xs font-bold text-slate-800 focus:border-orange-500/30 focus:bg-white transition-all" 
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
                  className="w-full h-14 pl-4 pr-10 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/50 rounded-xl outline-none text-xs font-bold text-slate-800 focus:border-orange-500/30 focus:bg-white transition-all" 
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-colors" size={18} />
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

      {/* Categories chips horizontal carousel (only on mobile viewports) */}
      <div className="md:hidden px-4 mt-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">
            Catégories
          </h2>
          <button 
            onClick={() => {
              setActiveCategory("Tous");
              setDebouncedCategory("Tous");
            }} 
            className="text-[10px] font-bold text-[#f7941d]"
          >
            Voir tout
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {Array.isArray(categoriesList) ? categoriesList.map((cat, i) => (
            <button 
              key={i}
              onClick={() => {
                setActiveCategory(cat.key);
                setDebouncedCategory(cat.key);
              }}
              className={`flex flex-col items-center p-3 rounded-2xl bg-white border min-w-[120px] snap-start transition-all ${
                activeCategory === cat.key 
                  ? 'border-[#f7941d] shadow-sm shadow-orange-500/10' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-12 h-10 relative mb-2 flex items-center justify-center">
                {cat?.img ? (
                  <Image 
                    src={cat.img} 
                    alt={cat?.name || "Catégorie"} 
                    fill 
                    className="object-contain" 
                  />
                ) : null}
              </div>
              <span className="text-[10px] font-black text-gray-900 leading-tight text-center truncate w-full">{cat.name}</span>
              <span className="text-[8px] font-bold text-gray-400 mt-0.5">{cat.count} équipement{cat.count > 1 ? 's' : ''}</span>
            </button>
          )) : null}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-6 md:mt-32 xl:mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 h-fit bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm">
            {filtersContent}
          </aside>

          {/* Cards Area */}
          <main className="lg:col-span-8 xl:col-span-9 flex flex-col relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-3xl z-20 transition-all">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#f7941d]/30 border-t-[#f7941d] rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mise à jour...</span>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-12 w-full">
              {filteredEquipment && Array.isArray(filteredEquipment) && filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8 w-full">
                  {filteredEquipment.filter((item: any) => item && item.id).map((item: any) => {
                    const isCurrentlyRented = Array.isArray(reservations) && reservations.some(r => r?.equipmentId === item?.id && r?.status === "In Progress");
                    return (
                      <EquipmentCard 
                        key={`equip-card-${item.id}`} 
                        item={item} 
                        isRented={isCurrentlyRented} 
                      />
                    );
                  })}
                </div>
              ) : (
                (!filteredEquipment || !Array.isArray(filteredEquipment) || filteredEquipment.length === 0) && isLoading ? (
                  <div className="py-12 text-center text-gray-500 w-full col-span-3">
                    Chargement en cours...
                  </div>
                ) : (
                  <div className="py-24 bg-white rounded-3xl border border-slate-200/50 flex flex-col items-center justify-center text-center p-8 shadow-sm w-full">
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
                )
              )}
            </div>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-[#f7941d]">POURQUOI CHOISIR AANDILIK ?</span>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">
              La meilleure expérience de location pour vos chantiers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full lg:ml-8">
            
            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-orange-500/10 rounded-full"></div>
                <ShieldCheck size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Matériel vérifié</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Tous nos matériels sont contrôlés et entretenus régulièrement.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-orange-500/10 rounded-full"></div>
                <CalendarCheck size={28} strokeWidth={1.5} className="relative z-10 text-slate-900" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Réservation rapide</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Réservez en ligne en toute sécurité avec confirmation rapide.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-orange-500/10 rounded-full"></div>
                <CreditCard size={28} strokeWidth={1.5} className="relative z-10 text-slate-950" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Paiement protégé</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Transactions sécurisées et paiement en ligne 100% fiable.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute -left-2 -bottom-2 w-10 h-10 bg-orange-500/10 rounded-full"></div>
                <Headset size={28} strokeWidth={1.5} className="relative z-10 text-slate-950" />
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
            {/* Background image visual */}
            <Image 
              src="/last.png" 
              alt="Construction Equipment Background" 
              fill
              className="object-cover object-center opacity-65" 
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
              className="bg-[#f7941d] hover:bg-amber-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] flex items-center gap-4 group w-fit cursor-pointer shadow-lg shadow-orange-500/20"
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


