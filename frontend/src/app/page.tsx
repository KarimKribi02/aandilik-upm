"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { PublishDemandModal } from "@/components/ui/PublishDemandModal";
import { Input } from "@/components/ui/FormElements";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { 
  Search, 
  ArrowRight, 
  Construction, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  MapPin, 
  CheckCircle2,
  Play,
  Star,
  Users,
  CreditCard,
  Headphones
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockPartners } from "@/data/mockData";

export default function Home() {
  const { equipment, articles, partners } = useData();
  
  // Get latest 3 articles
  const latestArticles = articles.length > 0 
    ? [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
    : [];
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const featured = (equipment || []).filter(e => e.status === "active").slice(0, 3);

  const categories = [
    { name: "Terrassement", count: 124, img: "/terrassement_category_1779494862306.png" },
    { name: "Levage", count: 45, img: "/levage_category_1779494969604.png" },
    { name: "Gros Œuvre", count: 88, img: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Béton", count: 32, img: "https://images.pexels.com/photos/699252/pexels-photo-699252.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Manutention", count: 56, img: "https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Énergie", count: 21, img: "https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=800" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/equipment?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col gap-0 pb-0 overflow-x-hidden pt-0 mt-0">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[750px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-section.png" 
            alt="Hero Construction" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-10">
          <div className="flex flex-col gap-10">
            {/* Tag */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-md w-fit"
            >
              <span className="text-[10px] text-white/90 font-bold uppercase tracking-widest">Plateforme n°1 au Maroc</span>
            </motion.div>
            
            {/* Headlines */}
            <div className="flex flex-col gap-6 max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
              >
                Louez le matériel <br />
                de construction lourd <br />
                <span className="text-primary">en toute confiance</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-white/70 max-w-xl font-medium"
              >
                AANDILIK connecte les professionnels du BTP avec les meilleurs propriétaires de matériel lourd.
              </motion.p>
            </div>

            {/* Advanced Search Bar Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col gap-6 w-full max-w-6xl mt-4"
            >
              <div className="bg-black/40 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  {/* Location */}
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Où ?</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]" size={18} />
                      <input 
                        type="text" 
                        placeholder="Ville, région..."
                        className="w-full h-14 pl-12 pr-10 bg-white rounded-lg text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all placeholder:text-gray-400"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Quoi ?</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </div>
                      <select className="w-full h-14 pl-12 pr-10 bg-white rounded-lg text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all appearance-none cursor-pointer">
                        <option>Toutes catégories</option>
                        <option>Gros Oeuvre</option>
                        <option>Levage</option>
                        <option>Béton</option>
                        <option>Terrassement</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Date Start */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Date début</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <input 
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        placeholder="Choisir une date"
                        className="w-full h-14 pl-12 pr-4 bg-white rounded-lg text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Date End */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Date fin</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB800]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <input 
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        placeholder="Choisir une date"
                        className="w-full h-14 pl-12 pr-4 bg-white rounded-lg text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="md:col-span-2">
                    <Button className="w-full h-14 rounded-lg bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                      <Search size={18} /> Rechercher
                    </Button>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Features Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Item 1 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-[#FFB800]" size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-base">Sécurisé & Fiable</h3>
                <p className="text-gray-500 text-xs leading-snug">Réservations sécurisées et paiements protégés</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-[#FFB800]" size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-base">Matériel vérifié</h3>
                <p className="text-gray-500 text-xs leading-snug">Tous les équipements sont contrôlés et approuvés</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                <Zap className="text-[#FFB800]" size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-base">Support 24/7</h3>
                <p className="text-gray-500 text-xs leading-snug">Notre équipe est là pour vous accompagner</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                <Users className="text-[#FFB800]" size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-base">Des milliers d'utilisateurs</h3>
                <p className="text-gray-500 text-xs leading-snug">Rejoignez une communauté en pleine croissance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Compact Light Premium Style */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col gap-8 mb-16 px-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-[#FFB800] rounded-full" />
              <span className="text-[#FFB800] text-xs font-black uppercase tracking-[0.3em]">Catégories</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-none tracking-tight">
                NOS <span className="text-[#FFB800]">MATÉRIELS</span>
              </h2>
              <p className="text-gray-400 text-base font-medium max-w-sm">
                Une flotte performante adaptée à tous vos projets de construction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {categories.map((cat, i) => (
              <CategoryCard key={i} item={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment - Split Layout */}
      <section className="bg-[#f8f8f8] py-32 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Left Content */}
            <div className="lg:w-1/3 flex flex-col gap-8 justify-center">
              <div className="flex flex-col gap-4">
                <span className="text-[#FFB800] font-black uppercase tracking-[0.3em] text-xs">Matériel Lourd</span>
                <h2 className="text-5xl font-black text-gray-900 leading-tight">
                  Les machines <br /> les plus demandées
                </h2>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                Découvrez notre sélection des engins de construction les plus loués par les professionnels.
              </p>
              <Link href="/equipment">
                <Button className="h-16 px-10 rounded-2xl bg-white text-gray-900 font-black flex items-center gap-4 shadow-xl shadow-gray-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFB800]/20 hover:-translate-y-1 group/btn border border-gray-100/50">
                  <span className="text-base tracking-tight">Voir tous les matériels</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FFB800] flex items-center justify-center text-black shadow-lg shadow-[#FFB800]/20 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:rotate-12">
                    <ArrowRight size={18} />
                  </div>
                </Button>
              </Link>
            </div>

            {/* Right Cards Slider Area */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(featured || []).slice(0, 3).map((item, i) => (
                  <FeaturedMachineCard key={item.id} item={item} index={i} />
                ))}
              </div>
              
              {/* Slider Nav */}
              <div className="flex justify-end gap-3 mt-12">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed">
                  <ArrowRight size={20} className="rotate-180" />
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center text-black shadow-lg shadow-[#FFB800]/20 cursor-pointer hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Aandilik Banner - Premium Light Version */}
      <section className="bg-[#f8f8f8] pb-32">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="bg-white rounded-[3rem] p-12 lg:p-24 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24 items-center">
              {/* Left Side */}
              <div className="xl:col-span-4 flex flex-col gap-6 text-center xl:text-left">
                <div className="flex items-center gap-3 justify-center xl:justify-start">
                  <div className="w-8 h-[2px] bg-[#FFB800]" />
                  <span className="text-[#FFB800] font-black uppercase tracking-[0.3em] text-[10px]">L'excellence Aandilik</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Une expérience <br /> de location <br /> <span className="text-gray-300">SANS COMPROMIS</span>
                </h2>
              </div>

              {/* Right Side - Grid Items */}
              <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
                {/* Item 1 */}
                <div className="flex flex-col items-center xl:items-start gap-6 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-500 group-hover:bg-[#FFB800] group-hover:text-black group-hover:shadow-2xl group-hover:shadow-[#FFB800]/20 group-hover:-translate-y-1">
                    <ShieldCheck size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-3 text-center xl:text-left">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Sécurité totale</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed px-4 xl:px-0">Vérification certifiée des machines et des comptes propriétaires.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center xl:items-start gap-6 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-500 group-hover:bg-[#FFB800] group-hover:text-black group-hover:shadow-2xl group-hover:shadow-[#FFB800]/20 group-hover:-translate-y-1">
                    <Zap size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-3 text-center xl:text-left">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Récupération Express</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed px-4 xl:px-0">Processus de réservation optimisé pour un gain de temps maximal.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col items-center xl:items-start gap-6 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-500 group-hover:bg-[#FFB800] group-hover:text-black group-hover:shadow-2xl group-hover:shadow-[#FFB800]/20 group-hover:-translate-y-1">
                    <CreditCard size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-3 text-center xl:text-left">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Paiement Garanti</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed px-4 xl:px-0">Système de transaction sécurisé avec séquestre bancaire.</p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex flex-col items-center xl:items-start gap-6 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-500 group-hover:bg-[#FFB800] group-hover:text-black group-hover:shadow-2xl group-hover:shadow-[#FFB800]/20 group-hover:-translate-y-1">
                    <Headphones size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-3 text-center xl:text-left">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Assistance 24/7</h3>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed px-4 xl:px-0">Une équipe dédiée d'experts à votre écoute en permanence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Sector Area */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="flex flex-col gap-12 mb-16 px-4">
            <div className="flex flex-col gap-4">
              <span className="text-[#FFB800] font-black uppercase tracking-[0.3em] text-[10px]">Pour tous vos projets</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Des solutions adaptées <br /> à chaque chantier
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
            {[
              { name: "Bâtiment & résidentiel", img: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800" },
              { name: "Travaux publics", img: "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800" },
              { name: "Carrières & mines", img: "https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=800" },
              { name: "Industrie", img: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=800" },
              { name: "Infrastructures", img: "https://images.pexels.com/photos/1098935/pexels-photo-1098935.jpeg?auto=compress&cs=tinysrgb&w=800" },
            ].map((sector, i) => (
              <SectorCard key={i} item={sector} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-20">
            <Link href="/equipment" className="flex items-center gap-3 text-gray-400 font-bold hover:text-[#FFB800] transition-colors group">
              Voir tous les secteurs <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Slider */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10 px-4">Nos partenaires</p>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div className="flex gap-16 items-center animate-marquee whitespace-nowrap">
              {/* Double the list for seamless loop */}
              {[...(partners.length > 0 ? partners : mockPartners), ...(partners.length > 0 ? partners : mockPartners)].map((p, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center min-w-[140px] h-16 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="max-h-10 max-w-[120px] object-contain" />
                  ) : (
                    <span className="text-xl font-black tracking-tight text-gray-800" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                      {p.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner - High Impact Version */}
      <section className="bg-white pb-32">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="relative h-[480px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
            {/* Background Image */}
            <img 
              src="/img.png" 
              alt="Final CTA Background" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            
            {/* Lighted Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 gap-6 max-w-2xl">
              <div className="flex flex-col gap-2">
                <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  Vous ne trouvez pas le matériel qu'il vous faut ?
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                  Publiez votre <span className="text-primary">demande</span>
                </h2>
              </div>
              <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-md">
                Indiquez vos besoins et recevez des offres personnalisées de nos propriétaires.
              </p>
              
              <div className="pt-4">
                <Button 
                  onClick={() => setIsDemandModalOpen(true)}
                  className="h-16 px-10 rounded-2xl bg-[#FFB800] text-black font-black flex items-center gap-4 shadow-2xl transition-all duration-500 hover:scale-105 group/btn"
                >
                  <span className="text-base tracking-tight">Publier une demande</span>
                  <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-[#FFB800] transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:rotate-12">
                    <ArrowRight size={18} />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog Section */}
      <section className="bg-[#fcfcfc] py-32">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="flex justify-between items-end mb-16 px-4">
            <div className="flex flex-col gap-4">
              <span className="text-[#FFB800] font-black uppercase tracking-[0.3em] text-[10px]">Conseils & Actualités</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Nos derniers articles
              </h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-3 text-gray-400 font-bold hover:text-[#FFB800] transition-colors group mb-2">
              Voir tous les articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {latestArticles.map((article, i) => (
              <BlogCard key={article.id} item={article} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-12 md:hidden">
            <Link href="/blog" className="flex items-center gap-3 text-gray-400 font-bold hover:text-[#FFB800] transition-colors group">
              Voir tous les articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <PublishDemandModal 
        isOpen={isDemandModalOpen} 
        onClose={() => setIsDemandModalOpen(false)} 
      />
    </div>
  );
}

function CategoryCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href="/equipment" className="group relative block h-[320px] rounded-[2rem] overflow-hidden shadow-lg shadow-gray-100 hover:shadow-2xl transition-all duration-500">
        <img 
          src={item.img} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Floating Title Card */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                {item.name}
              </h3>
              <span className="text-[9px] font-bold text-[#FFB800] uppercase tracking-widest leading-none mt-1">
                {item.count} items
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#FFB800] flex items-center justify-center text-black shadow-lg shadow-[#FFB800]/20 transform group-hover:rotate-12 transition-transform">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EquipmentCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      viewport={{ once: true }}
    >
      <Card variant="lowest" className="group flex flex-col border border-surface-container shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-1000 rounded-[3.5rem] overflow-hidden bg-white">
        <Link href={`/equipment/${item.id}`} className="relative aspect-[16/11] overflow-hidden m-4 rounded-[2.5rem]">
          <img 
            src={item.image} 
            alt={item.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute top-6 left-6 glass-light px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">{item.category}</div>
          <div className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-center text-secondary hover:text-primary hover:scale-110 transition-all duration-500 cursor-pointer shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
            <ArrowRight size={24} />
          </div>
        </Link>
        <div className="p-12 pt-6 flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
              <div className="text-secondary/40 text-xs font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                <MapPin size={14} className="text-primary" /> {item.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-surface-container">
            {Object.entries(item.specs).slice(0, 2).map(([key, val]: [string, any]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="text-[10px] font-black uppercase text-secondary/30 tracking-[0.2em]">{key}</div>
                <div className="text-base font-bold text-secondary tracking-tight">{val}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-surface-low/50 p-6 rounded-3xl">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">${item.pricePerDay}</span>
                <span className="text-xs font-black text-secondary/30 uppercase tracking-widest">/ jour</span>
              </div>
            </div>
            <Link href={`/equipment/${item.id}`}>
              <Button variant="primary" size="sm" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-[10px]">
                Réserver
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FeaturedMachineCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/equipment/${item.id}`} className="group relative block h-[380px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end gap-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
            {item.name}
          </h3>
          
          <div className="flex flex-col">
            <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">À partir de</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#FFB800] text-xl font-black">{item.pricePerDay} DH</span>
              <span className="text-white/40 text-[9px] font-bold tracking-widest">/ jour</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SectorCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <img 
        src={item.img} 
        alt={item.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white tracking-tight leading-tight group-hover:translate-x-2 transition-transform duration-500">
          {item.name}
        </h3>
      </div>
    </motion.div>
  );
}

function BlogCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href="/blog" className="group relative block h-[420px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-surface-container transition-transform duration-[1500ms] group-hover:scale-110" />
        )}
        
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end gap-5">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit px-3 py-1 rounded-lg bg-[#FFB800] text-black text-[9px] font-black tracking-widest uppercase shadow-lg shadow-[#FFB800]/20">
              {item.category}
            </span>
            <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-white leading-tight tracking-tight group-hover:text-[#FFB800] transition-colors duration-500">
              {item.title}
            </h3>
            <p className="text-white/50 text-xs font-medium leading-relaxed line-clamp-2">
              {item.content}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
