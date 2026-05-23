"use client";

import { useData } from "@/context/DataProvider";

import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Clock, 
  LineChart, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Star, 
  Tractor, 
  Users 
} from "lucide-react";
import Link from "next/link";

export default function APropos() {
  const { experts } = useData();
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[550px] lg:min-h-[700px] flex flex-col pt-24 lg:pt-28 font-sans bg-white overflow-hidden">
        {/* Background Graphic Left-Fade */}
        <div className="absolute inset-0 w-full h-full lg:w-[65%] ml-auto z-0">
          <img 
            src="/equiment-hero.png" // Fallback to the equipment hero since it's an excavator
            alt="Excavator on construction site" 
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          <div className="absolute inset-0 bg-white/20 sm:hidden"></div> {/* Extra fade on mobile */}
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex-1 flex flex-col justify-center pb-20">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-10 text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">À propos</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
              Votre partenaire de <span className="text-primary relative inline-block">
                confiance
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span> pour tous vos chantiers.
            </h1>
            
            <p className="text-sm lg:text-base font-semibold text-gray-500 leading-relaxed max-w-xl mb-12">
              AANDILIK est la plateforme de référence pour la location de matériel de construction lourd au Maroc.
            </p>

            {/* Feature Mini-Grid */}
            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
              <div className="flex items-center gap-3">
                <Tractor size={20} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900">Matériel</span>
                  <span className="text-[10px] font-bold text-gray-500">récent et entretenu</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900">Service</span>
                  <span className="text-[10px] font-bold text-gray-500">rapide et fluide</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star size={20} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900">Experts</span>
                  <span className="text-[10px] font-bold text-gray-500">disponibles 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VALUES SECTION */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">NOTRE MISSION</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-6 relative inline-block">
              Simplifier la location de matériel lourd pour construire l&apos;avenir.
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
            </h2>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 leading-relaxed mt-10 max-w-2xl mx-auto">
              Nous mettons à votre disposition une large gamme de machines performantes, entretenues avec rigueur et disponibles partout au Maroc. Notre objectif : vous offrir une expérience de location simple, rapide et sécurisée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Fiabilité",
                desc: "Des machines contrôlées et entretenues régulièrement pour garantir performance et sécurité.",
                icon: <ShieldCheck size={24} />
              },
              {
                title: "Réactivité",
                desc: "Une équipe disponible et réactive pour répondre à vos besoins dans les meilleurs délais.",
                icon: <Clock size={24} />
              },
              {
                title: "Engagement",
                desc: "Nous nous engageons à vous accompagner à chaque étape de vos projets.",
                icon: <Users size={24} />
              },
              {
                title: "Croissance",
                desc: "Nous investissons continuellement pour vous offrir le meilleur matériel et service.",
                icon: <LineChart size={24} />
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9EA] text-primary flex items-center justify-center mb-2">
                  {value.icon}
                </div>
                <h3 className="text-sm font-black text-gray-900">{value.title}</h3>
                <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. METRICS RIBBON */}
      <section className="bg-[#151719] w-[95%] lg:w-[90%] max-w-[1600px] mx-auto rounded-[24px] lg:rounded-[32px] overflow-hidden my-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 p-10 lg:p-14 divide-white/5 relative z-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 text-center lg:text-left lg:border-r border-white/5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-1">500+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matériels disponibles</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 text-center lg:text-left lg:border-r border-white/5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
              <Tractor size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-1">1200+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projets réalisés</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 text-center lg:text-left lg:border-r border-white/5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-1">850+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clients satisfaits</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 text-center lg:text-left">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-1">20+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US - SPLIT LAYOUT */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-5/12 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">POURQUOI NOUS CHOISIR ?</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight mb-10">
                Une expérience pensée pour les <span className="text-primary">professionnels</span> du BTP.
              </h2>
              
              <ul className="flex flex-col gap-5 mb-10">
                {[
                  "Large choix de machines adaptées à tous vos besoins",
                  "Tarifs transparents et compétitifs",
                  "Réservation simple et rapide en ligne",
                  "Support client dédié 24/7",
                  "Livraison rapide sur vos chantiers"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-primary" strokeWidth={3} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/equipment" className="w-fit bg-primary hover:bg-[#f0ad00] text-black px-8 py-4 rounded-xl text-xs font-black transition-colors flex items-center gap-3">
                Louer maintenant <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            <div className="w-full lg:w-7/12 flex gap-4 lg:gap-6">
              {/* Left tall image */}
              <div className="w-1/2 rounded-[24px] overflow-hidden shadow-lg relative h-[400px] lg:h-[500px]">
                <img src="/last.png" alt="Bulldozer placeholder" className="absolute w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-0.5"></div>
                  <span className="text-[10px] font-black text-gray-900">Disponibilité rapide</span>
                </div>
              </div>
              {/* Right stacked images */}
              <div className="w-1/2 flex flex-col gap-4 lg:gap-6 h-[400px] lg:h-[500px]">
                <div className="flex-1 rounded-[24px] overflow-hidden shadow-lg relative">
                  <img src="/last.png" alt="Bulldozer top" className="absolute w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-0.5"></div>
                    <span className="text-[10px] font-black text-gray-900">Matériel vérifié</span>
                  </div>
                </div>
                <div className="flex-1 rounded-[24px] overflow-hidden shadow-lg relative">
                  <img src="/equiment-hero.png" alt="Excavator bottom" className="absolute w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-0.5"></div>
                    <span className="text-[10px] font-black text-gray-900">Performance garantie</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-xl mx-auto text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">NOTRE ÉQUIPE</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-6 relative inline-block">
              Des experts à votre service
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
            </h2>
          </div>

          {experts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center col-span-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF9EA] flex items-center justify-center mb-4">
                <Users size={28} className="text-[#FFB800]" />
              </div>
              <p className="text-sm font-black text-gray-400">Aucun expert enregistré pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {experts.map((member) => (
                <div key={member.id} className="group flex flex-col bg-[#f8f9fa] rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden w-full">
                    <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5 bg-white flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-black text-gray-900">{member.name}</h4>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.role}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 hover:text-[#0A66C2] cursor-pointer transition-colors shrink-0">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="py-12 bg-white">
        <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-6 mb-12 relative z-10">
          <div className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden bg-[#111315] flex flex-col justify-center min-h-[280px]">
            {/* Background Image Setup */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="/equiment-hero.png" 
                alt="Construction Equipment Background" 
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#151719] via-[#151719]/90 to-[#151719]/40"></div>
            </div>
            
            <div className="relative z-10 p-10 lg:p-14 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-5 tracking-tight">
                  Prêt à démarrer votre prochain projet ?
                </h2>
                <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                  Rejoignez des centaines de professionnels qui nous font déjà confiance.
                </p>
              </div>
              <button className="bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-8 py-5 rounded-xl text-xs font-black transition-colors flex items-center gap-4 group w-fit shrink-0">
                Publier une demande
                <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
