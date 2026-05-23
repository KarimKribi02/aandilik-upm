"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Activity, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Package,
  AlertCircle,
  Tractor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const steps = [
  { id: "requested", label: "Demande reçue", icon: <Clock size={16} />, time: "Aujourd'hui, 10:42" },
  { id: "verified", label: "Validé par expert", icon: <ShieldCheck size={16} />, time: "Aujourd'hui, 11:15" },
  { id: "transit", label: "En transit", icon: <Truck size={16} />, time: "En cours" },
  { id: "onsite", label: "Livré sur site", icon: <MapPin size={16} />, time: "Estimé 14:00" },
  { id: "completed", label: "Session terminée", icon: <CheckCircle2 size={16} />, time: "--" },
];

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsTracking(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 flex flex-col font-sans"
    >
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-white overflow-hidden pt-28 pb-20 min-h-[480px] flex items-center border-b border-slate-100">
        <div className="absolute inset-0 w-full h-full lg:w-[65%] ml-auto z-0 opacity-10 lg:opacity-100">
          <img 
            src="/last.png" 
            alt="Tracking logistics" 
            className="w-full h-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-surface-low)_0%,_transparent_50%)] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-10 text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900">Suivi matériel</span>
          </div>

          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-5 block">TÉLÉMÉTRIE EN DIRECT</span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.0] tracking-tight mb-8">
              Suivez votre<br />
              <span className="text-primary">matériel.</span>
            </h1>
            <p className="text-sm lg:text-base font-semibold text-slate-500 leading-relaxed max-w-lg">
              Entrez votre code de suivi unique pour accéder à la télémétrie en temps réel de votre équipement loué.
            </p>

            <form onSubmit={handleTrack} className="mt-12 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="ID de déploiement (ADL-XXXX)"
                  className="w-full h-16 pl-14 pr-6 bg-slate-50 rounded-2xl outline-none text-sm font-bold tracking-widest placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 border border-slate-100 transition-all uppercase"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="h-16 px-10 bg-primary hover:bg-primary-dark text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shrink-0 shadow-md shadow-primary/20 active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Initialiser le suivi <ArrowRight size={14} strokeWidth={2.5} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. TRACKING RESULTS AREA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          {isTracking ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Left Column — Machine & Stats */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                  <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm transition-transform duration-700 group-hover:scale-105">
                      <img 
                        src="https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                        alt="Machine"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white tracking-widest bg-primary px-3 py-1.5 rounded-lg w-fit shadow-sm shadow-primary/10">
                        <Activity size={12} className="animate-pulse" /> Déploiement Actif
                      </div>
                      <h3 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Caterpillar 320 GC</h3>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-accent" /> Opérateur Certifié</span>
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-accent" /> Performance Maximale</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative background logo */}
                  <Tractor className="absolute -bottom-8 -right-8 w-40 h-40 text-slate-50 opacity-[0.4] rotate-12" />
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Carburant", val: "84%", color: "text-accent" },
                    { label: "Heures", val: "1,242h", color: "text-slate-900" },
                    { label: "Température", val: "72°C", color: "text-slate-900" },
                    { label: "Charge", val: "Normal", color: "text-slate-900" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2">{stat.label}</div>
                      <div className={cn("text-xl font-black", stat.color)}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                {/* Map Display */}
                <div className="rounded-3xl bg-slate-900 h-[400px] overflow-hidden border border-slate-800 relative group">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Casablanca&zoom=13&size=600x400&style=feature:all|element:all|saturation:-100|lightness:0')] bg-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 animate-bounce text-white">
                        <MapPin size={24} strokeWidth={2.5} />
                      </div>
                      <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700/50 text-center">
                        <div className="text-white text-xs font-black">Zone Industrielle 4, Casablanca</div>
                        <div className="text-[9px] text-accent font-bold uppercase tracking-[0.2em] mt-1">Positionnement GPS Actif</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — Timeline */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Chronologie</h4>
                    <div className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-lg uppercase tracking-widest">En transit</div>
                  </div>

                  <div className="relative">
                    {steps.map((step, idx) => {
                      const isActive = idx === 2;
                      const isDone = idx < 2;
                      
                      return (
                        <div key={step.id} className="relative pl-12 pb-12 last:pb-0">
                          {/* Line Connector */}
                          {idx !== steps.length - 1 && (
                            <div className={cn(
                              "absolute left-2.5 top-5 w-[2px] h-full",
                              isDone ? "bg-accent" : "bg-slate-100"
                            )} />
                          )}
                          
                          {/* Dot Indicator */}
                          <div className={cn(
                            "absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500",
                            isDone ? "bg-accent border-accent text-white" : 
                            isActive ? "bg-white border-accent text-accent shadow-md shadow-accent/20 scale-110" : 
                            "bg-white border-slate-200 text-slate-300"
                          )}>
                            {isDone ? <CheckCircle2 size={12} strokeWidth={3} /> : isActive ? <div className="w-2 h-2 bg-accent rounded-full animate-ping" /> : <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />}
                          </div>

                          <div className="flex flex-col gap-1">
                            <h5 className={cn(
                              "font-black text-sm transition-all duration-500",
                              isActive || isDone ? "text-slate-900" : "text-slate-300"
                            )}>
                              {step.label}
                            </h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex flex-col gap-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Support Logistique</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" alt="Operator" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-slate-900">Mohamed Tazi</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coordinateur Site</div>
                      </div>
                      <button className="h-10 px-5 rounded-xl border border-slate-200 hover:border-primary hover:text-primary text-[10px] font-black uppercase tracking-widest transition-all">
                        Appeler
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-3xl p-8 flex flex-col gap-4 border border-slate-800 relative overflow-hidden group">
                  <div className="flex items-center gap-3 text-accent relative z-10">
                    <AlertCircle size={20} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Note de déploiement</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 leading-relaxed relative z-10">
                    Disponibilité du site prévue dans 120 minutes. Veuillez vous assurer que la zone de déchargement est dégagée.
                  </p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                <Package size={32} className="text-slate-300" />
              </div>
              <p className="text-sm font-black text-slate-400 max-w-sm mx-auto leading-relaxed">
                Entrez votre code de suivi unique reçu lors de la confirmation de votre location pour activer la télémétrie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tight">
                Une technologie au service de <br className="hidden lg:block" />
                votre <span className="text-primary">productivité.</span>
              </h2>
              <p className="text-sm font-semibold text-slate-400 leading-relaxed mb-12 max-w-xl mx-auto">
                Grâce au suivi en temps réel et à notre support logistique, gardez le contrôle total sur vos chantiers.
              </p>
              <Link href="/equipment" className="inline-flex items-center gap-4 bg-accent hover:bg-accent-dark text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20 active:scale-95">
                Louer du matériel <ArrowRight size={18} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {/* Background Decor */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>

    </motion.div>
  );
}
