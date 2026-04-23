"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { useData } from "@/context/DataProvider";
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
  Star
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { equipment } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  const featured = (equipment || []).filter(e => e.status === "active").slice(0, 3);

  const categories = [
    { name: "Gros Oeuvre", icon: <Construction />, count: 124, img: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Levage", icon: <Construction />, count: 45, img: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Béton", icon: <Construction />, count: 32, img: "https://images.pexels.com/photos/699252/pexels-photo-699252.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Terrassement", icon: <Construction />, count: 88, img: "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Outillage", icon: <Construction />, count: 210, img: "https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Manutention", icon: <Construction />, count: 56, img: "https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=800" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/equipment?search=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <div className="flex flex-col gap-0 pb-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-[#0c0c0c]">
        {/* Deep background video with sophisticated mask */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover brightness-[0.4] contrast-[1.2] scale-[1.02]"
          >
            <source src="https://res.cloudinary.com/digfptrqs/video/upload/v1776780453/Commercial_FPV_video_for_construction_company_bxmzk9.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 hero-mask" />
          <div className="absolute inset-0 bg-radial-[at_50%_50%,rgba(245,158,11,0.05)_0%,transparent_100%]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="max-w-4xl flex flex-col gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl w-fit px-5 py-2.5 rounded-full border border-white/10 shadow-2xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse" />
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em]">Excellence Industrielle & Innovation</span>
              </motion.div>
              
              <div className="flex flex-col gap-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-[-0.04em]"
                >
                  ENGINEERING <br />
                  <span className="text-gradient">TOMORROW</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed font-light"
                >
                  Accédez à une flotte d'élite de machines industrielles. Performance brute, fiabilité absolue et support d'experts pour vos projets d'envergure.
                </motion.p>
              </div>

              {/* Advanced Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <form 
                  onSubmit={handleSearch} 
                  className="group relative flex flex-col md:flex-row items-center gap-3 p-3 bg-white/5 hover:bg-white/[0.08] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 transition-all duration-500 premium-shadow"
                >
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={22} />
                    <input 
                      type="text" 
                      placeholder="Cherchez une machine, une catégorie..."
                      className="w-full h-16 pl-16 pr-8 bg-transparent rounded-full outline-none text-white text-lg font-medium placeholder:text-white/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="lg" className="h-16 px-12 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
                    Explorer le Parc
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.4em]">Découvrir</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Categories Grid - Editorial Style */}
      <section className="bg-surface py-48 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-32">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Notre Expertise</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-[-0.03em] leading-tight">
                DOMAINES <br /> <span className="text-surface-highest/30">D'INTERVENTION</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-secondary text-lg leading-relaxed font-medium border-l-2 border-surface-container pl-10">
                Une sélection rigoureuse couvrant l'intégralité du cycle de construction. Des équipements de dernière génération entretenus selon les standards les plus exigeants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat, i) => (
              <CategoryCard key={i} item={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment - Gallery Style */}
      <section className="bg-surface-low py-48">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-32 gap-6">
            <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">La Sélection Premium</span>
            <h2 className="text-6xl font-black tracking-tighter">FLEET HIGHLIGHTS</h2>
            <div className="w-32 h-1 bg-primary rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featured.map((item, i) => (
              <EquipmentCard key={item.id} item={item} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-32">
            <Link href="/equipment">
              <Button variant="secondary" className="h-20 px-16 rounded-[2.5rem] group overflow-hidden relative border-2 border-surface-container bg-transparent transition-all duration-500 hover:border-primary">
                <span className="relative z-10 transition-colors group-hover:text-white text-lg font-black uppercase tracking-widest">Voir le catalogue complet</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Elevated Glass */}
      <section className="bg-surface py-48 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-32">
            <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-6">Expertise & Confiance</span>
            <h2 className="text-6xl font-black tracking-tighter italic text-center leading-none">PAROLES D'EXPERT</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Card variant="lowest" className="p-12 text-left flex flex-col gap-10 border border-surface-container premium-shadow hover:translate-y-[-15px] transition-all duration-700 rounded-[3rem] bg-white/50 backdrop-blur-xl">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <blockquote className="text-secondary text-xl leading-relaxed italic font-medium">
                    "Une synergie technique et logistique exceptionnelle. Aandilik redéfinit les standards de la location industrielle."
                  </blockquote>
                  <div className="flex items-center gap-5 pt-10 border-t border-surface-container">
                    <div className="w-16 h-16 bg-surface-container rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl" />
                    <div>
                      <div className="font-black text-lg tracking-tight">Jean-Marc Dupuis</div>
                      <div className="text-[10px] uppercase font-black text-primary tracking-[0.3em] mt-1">Directeur de Chantier</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats - Architectural Layout */}
      <section className="bg-[#0c0c14] py-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 divide-x divide-white/5">
            {[
              { val: "500+", label: "UNITÉS DISPONIBLES" },
              { val: "1,200+", label: "CLIENTS CORPORATE" },
              { val: "99.2%", label: "TAUX DE DISPONIBILITÉ" },
              { val: "24/7", label: "SUPPORT MONITORÉ" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 px-10">
                <div className="text-6xl md:text-7xl font-black tracking-tighter text-gradient">{stat.val}</div>
                <div className="text-[10px] uppercase font-black text-white/40 tracking-[0.4em] text-center">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href="/equipment" className="group relative block rounded-[2.5rem] overflow-hidden aspect-[4/5] premium-shadow">
        <img 
          src={item.img} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/10 transition-all duration-700" />
        <div className="absolute inset-0 p-10 flex flex-col justify-between">
          <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <div className="text-[10px] font-black uppercase text-white tracking-[0.3em] bg-primary px-4 py-1.5 rounded-full shadow-2xl">
              {item.count} UNITÉS
            </div>
          </div>
          <div>
            <h3 className="font-black text-4xl text-white leading-none tracking-tight mb-2 group-hover:text-primary transition-colors duration-500">{item.name}</h3>
            <div className="w-0 group-hover:w-16 h-1 bg-primary transition-all duration-500 rounded-full" />
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
