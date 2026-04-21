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
    <div className="flex flex-col gap-0 pb-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover brightness-[0.5] contrast-[1.1] scale-105"
          >
            <source src="https://res.cloudinary.com/digfptrqs/video/upload/v1776780453/Commercial_FPV_video_for_construction_company_bxmzk9.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Développement Durable & Innovation
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Louez le bon <br />
                <span className="text-primary italic">matériel</span> pour <br />
                votre chantier
              </h1>
              
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                La plateforme de référence pour la location de matériel professionnel. 
                Sécurité, performance et fiabilité pour vos projets d'infrastructure.
              </p>

              {/* Search Bar */}
              <GlassContainer className="p-2 rounded-3xl border-none shadow-2xl backdrop-blur-2xl">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary" size={20} />
                    <input 
                      type="text" 
                      placeholder="Quel matériel cherchez-vous ?"
                      className="w-full h-16 pl-16 pr-8 bg-white/90 rounded-2xl outline-none text-sm font-bold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="lg" className="h-16 px-10 text-sm font-black uppercase tracking-widest">
                    Rechercher
                  </Button>
                </form>
              </GlassContainer>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="flex flex-col gap-4">
              <div className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">Catégories</div>
              <h2 className="text-5xl font-black tracking-tighter">Trouvez l'équipement <br /> qu'il vous faut</h2>
            </div>
            <p className="text-secondary max-w-xs text-sm font-medium leading-relaxed">
              Explorez notre flotte diversifiée conçue pour tous types de terrains et d'exigences techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:row-span-2 lg:col-span-1">
              <CategoryCard item={categories[0]} large />
            </div>
            {categories.slice(1).map((cat, i) => (
              <CategoryCard key={i} item={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="bg-surface-low py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20 flex flex-col items-center gap-4">
            <div className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">Notre Sélection</div>
            <h2 className="text-5xl font-black tracking-tighter">Équipements à la une</h2>
            <div className="w-20 h-1 bg-primary rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featured.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center mt-20">
            <Link href="/equipment">
              <Button variant="secondary" className="h-16 px-12 rounded-2xl group overflow-hidden relative">
                <span className="relative z-10 transition-colors group-hover:text-white">Voir tout le catalogue</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="mb-24">
            <div className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Fonctionnement</div>
            <h2 className="text-6xl font-black tracking-tighter">Comment ça <span className="text-primary italic">fonctionne ?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {[
              { id: "01", label: "Recherche", desc: "Trouvez le matériel adapté via nos filtres avancés." },
              { id: "02", label: "Réservation", desc: "Planifiez les dates et validez les spécifications." },
              { id: "03", label: "Livraison", desc: "Le matériel est acheminé directement sur site." },
              { id: "04", label: "Construction", desc: "Exécutez vos travaux avec sérénité et puissance." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-6 items-center">
                <div className="text-8xl font-black text-surface-container/50 relative">
                  {step.id}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold">{step.label}</h3>
                <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-6 max-w-7xl py-12">
        <div className="bg-[#0a1118] rounded-[60px] p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Vous avez du matériel <br /> à louer ?</h2>
            <p className="text-white/50 text-lg">Optimisez vos actifs immobiliers et machines industrielles dès maintenant.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Button size="lg" className="h-16 px-10 rounded-2xl font-black">Déposer une annonce</Button>
            <Button variant="glass" size="lg" className="h-16 px-10 rounded-2xl font-black text-white border-white/20">En savoir plus</Button>
          </div>
          <Construction className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-low py-32">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="mb-20">
            <div className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Témoignages</div>
            <h2 className="text-5xl font-black tracking-tighter italic">Ils nous font confiance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} variant="lowest" className="p-10 text-left flex flex-col gap-6 border-none shadow-sm hover:translate-y-[-10px] transition-all duration-500">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#ff8c00" color="#ff8c00" />)}
                </div>
                <p className="text-secondary leading-relaxed italic">
                  "Une expérience de location inégalée. Le matériel était impeccable et la livraison d'une ponctualité exemplaire. Un vrai partenaire pour nos chantiers."
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-surface-container">
                  <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden" />
                  <div>
                    <div className="font-bold">Jean-Marc Dupuis</div>
                    <div className="text-[10px] uppercase font-black text-secondary tracking-widest">Architecte Senior</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Footer Stats */}
      <section className="bg-white py-24 border-y border-surface-container">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-black mb-2">500+</div>
              <div className="text-xs uppercase font-black text-secondary tracking-[0.2em]">Machines Louées</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">1,000+</div>
              <div className="text-xs uppercase font-black text-secondary tracking-[0.2em]">Annonces Actives</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">98%</div>
              <div className="text-xs uppercase font-black text-secondary tracking-[0.2em]">Clients Satisfaits</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">24/7</div>
              <div className="text-xs uppercase font-black text-secondary tracking-[0.2em]">Support Technique</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ item, large = false }: { item: any; large?: boolean }) {
  return (
    <Link href="/equipment" className={`relative block rounded-[40px] overflow-hidden group w-full ${large ? 'h-full aspect-[4/5]' : 'aspect-video'}`}>
      <img 
        src={item.img} 
        alt={item.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
            <Star size={18} />
          </div>
          <div className="text-[10px] font-black uppercase text-white tracking-[0.3em] bg-primary px-3 py-1 rounded-full">{item.count} items</div>
        </div>
        <div>
          <h3 className={`font-black text-white leading-none tracking-tighter ${large ? 'text-4xl' : 'text-2xl'}`}>{item.name}</h3>
        </div>
      </div>
    </Link>
  );
}

function EquipmentCard({ item }: { item: any }) {
  return (
    <Card variant="lowest" className="group flex flex-col border-none shadow-sm hover:shadow-2xl transition-all duration-700 rounded-[40px] overflow-hidden">
      <Link href={`/equipment/${item.id}`} className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 glass px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">{item.category}</div>
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer">
          <Star size={16} />
        </div>
      </Link>
      <div className="p-10 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
            <div className="text-secondary text-xs font-bold flex items-center gap-1 mt-1 opacity-60">
              <MapPin size={12} /> {item.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-surface-container">
          {Object.entries(item.specs).slice(0, 2).map(([key, val]: [string, any]) => (
            <div key={key}>
              <div className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">{key}</div>
              <div className="text-sm font-bold text-secondary">{val}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-black text-foreground">${item.pricePerDay}</span>
            <span className="text-[10px] font-black text-secondary/50 uppercase tracking-widest block">par jour</span>
          </div>
          <Link href={`/equipment/${item.id}`}>
            <Button variant="secondary" size="sm" className="rounded-xl px-6 h-12 font-black">Détails</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
