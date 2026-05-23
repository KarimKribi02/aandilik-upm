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
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-white overflow-hidden pt-24 pb-24 min-h-[500px] flex items-center">
        <div className="absolute inset-0 w-full h-full lg:w-[65%] ml-auto z-0 opacity-10 lg:opacity-100">
          <img 
            src="/last.png" 
            alt="Tracking logistics" 
            className="w-full h-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#FFF9EA_0%,_transparent_50%)] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-10 text-gray-400">
            <Link href="/" className="hover:text-[#FFB800] transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Suivi matériel</span>
          </div>

          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800] mb-5 block">TÉLÉMÉTRIE EN DIRECT</span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.0] tracking-tight mb-8">
              Suivez votre<br />
              <span className="text-[#FFB800]">matériel.</span>
            </h1>
            <p className="text-sm lg:text-base font-semibold text-gray-500 leading-relaxed max-w-lg">
              Entrez votre code de suivi unique pour accéder à la télémétrie en temps réel de votre équipement loué.
            </p>

            <form onSubmit={handleTrack} className="mt-12 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFB800] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="ID de déploiement (ADL-XXXX)"
                  className="w-full h-16 pl-14 pr-6 bg-gray-50 rounded-2xl outline-none text-sm font-bold tracking-widest placeholder:text-gray-400 focus:ring-4 focus:ring-[#FFB800]/10 border border-gray-100 transition-all uppercase"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="h-16 px-10 bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shrink-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                ) : (
                  <>Initialiser le suivi <ArrowRight size={14} strokeWidth={2.5} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. TRACKING RESULTS AREA */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-7xl">
          {isTracking ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Left Column — Machine & Stats */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)] overflow-hidden relative group">
                  <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="w-48 h-48 rounded-[24px] overflow-hidden shrink-0 border border-gray-100 shadow-sm transition-transform duration-700 group-hover:scale-105">
                      <img 
                        src="https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                        alt="Machine"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#FFB800] tracking-widest bg-[#FFF9EA] px-3 py-1 rounded-lg w-fit">
                        <Activity size={12} className="animate-pulse" /> Déploiement Actif
                      </div>
                      <h3 className="text-3xl font-black tracking-tight text-gray-900 leading-none">Caterpillar 320 GC</h3>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FFB800]" /> Opérateur Certifié</span>
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#FFB800]" /> Performance Maximale</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative background logo */}
                  <Tractor className="absolute -bottom-8 -right-8 w-40 h-40 text-gray-50 opacity-[0.4] rotate-12" />
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Carburant", val: "84%", color: "text-[#FFB800]" },
                    { label: "Heures", val: "1,242h", color: "text-gray-900" },
                    { label: "Température", val: "72°C", color: "text-gray-900" },
                    { label: "Charge", val: "Normal", color: "text-gray-900" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-6 text-center border border-gray-100 shadow-sm">
                      <div className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mb-2">{stat.label}</div>
                      <div className={cn("text-xl font-black", stat.color)}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                {/* Map Display */}
                <div className="rounded-[32px] bg-[#151719] h-[400px] overflow-hidden border border-white/5 relative group">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Casablanca&zoom=13&size=600x400&style=feature:all|element:all|saturation:-100|lightness:0')] bg-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-[#FFB800] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.4)] animate-bounce text-gray-900">
                        <MapPin size={24} strokeWidth={2.5} />
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
                        <div className="text-white text-xs font-black">Zone Industrielle 4, Casablanca</div>
                        <div className="text-[9px] text-[#FFB800] font-bold uppercase tracking-[0.2em] mt-1">Positionnement GPS Actif</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — Timeline */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)] flex flex-col gap-10">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-gray-400">Chronologie</h4>
                    <div className="px-3 py-1 bg-[#FFF9EA] text-[#FFB800] text-[10px] font-black rounded-lg uppercase tracking-widest">En transit</div>
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
                              isDone ? "bg-[#FFB800]" : "bg-gray-100"
                            )} />
                          )}
                          
                          {/* Dot Indicator */}
                          <div className={cn(
                            "absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500",
                            isDone ? "bg-[#FFB800] border-[#FFB800] text-gray-900" : 
                            isActive ? "bg-white border-[#FFB800] text-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.2)] scale-110" : 
                            "bg-white border-gray-200 text-gray-300"
                          )}>
                            {isDone ? <CheckCircle2 size={12} strokeWidth={3} /> : isActive ? <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-ping" /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />}
                          </div>

                          <div className="flex flex-col gap-1">
                            <h5 className={cn(
                              "font-black text-sm transition-all duration-500",
                              isActive || isDone ? "text-gray-900" : "text-gray-300"
                            )}>
                              {step.label}
                            </h5>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-10 border-t border-gray-100 flex flex-col gap-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#FFB800]">Support Logistique</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" alt="Operator" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-gray-900">Mohamed Tazi</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coordinateur Site</div>
                      </div>
                      <button className="h-10 px-5 rounded-xl border border-gray-200 hover:border-[#FFB800] hover:text-[#FFB800] text-[10px] font-black uppercase tracking-widest transition-all">
                        Appeler
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151719] rounded-[32px] p-8 flex flex-col gap-4 border border-white/5 relative overflow-hidden group">
                  <div className="flex items-center gap-3 text-[#FFB800] relative z-10">
                    <AlertCircle size={20} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Note de déploiement</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 leading-relaxed relative z-10">
                    Disponibilité du site prévue dans 120 minutes. Veuillez vous assurer que la zone de déchargement est dégagée.
                  </p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <div className="w-24 h-24 rounded-[32px] bg-white flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                <Package size={32} className="text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400 max-w-sm mx-auto leading-relaxed">
                Entrez votre code de suivi unique reçu lors de la confirmation de votre location pour activer la télémétrie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-[#151719] rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tight">
                Une technologie au service de <br className="hidden lg:block" />
                votre <span className="text-[#FFB800]">productivité.</span>
              </h2>
              <p className="text-sm font-semibold text-gray-400 leading-relaxed mb-12 max-w-xl mx-auto">
                Grâce au suivi en temps réel et à notre support logistique, gardez le contrôle total sur vos chantiers.
              </p>
              <Link href="/equipment" className="inline-flex items-center gap-4 bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all group-hover:scale-105">
                Louer du matériel <ArrowRight size={18} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {/* Background Decor */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FFB800]/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>

    </div>
  );
}
