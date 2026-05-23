"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  MessageSquare, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const offices = [
  { 
    city: "Casablanca", 
    title: "Siège Social HQ", 
    address: "42 Boulevard d'Anfa, 20000 Casablanca", 
    phone: "+212 522 00 11 22", 
    email: "casablanca@aandilik.ma",
    hours: "Lun - Ven: 08:00 - 18:30"
  },
  { 
    city: "Marrakech", 
    title: "Centre Régional Sud", 
    address: "Zone Industrielle Sidi Ghanem, 40000 Marrakech", 
    phone: "+212 524 33 44 55", 
    email: "marrakech@aandilik.ma",
    hours: "Lun - Ven: 08:30 - 18:00"
  },
];

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans pt-32">
      
      {/* 1. MAIN CONTENT GRID */}
      <section className="pb-24 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Breadcrumb Integration */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-12 text-gray-400">
            <Link href="/" className="hover:text-[#FFB800] transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Contact</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Info Column */}
            <div className="lg:col-span-5 flex flex-col gap-12">
              
              <div className="flex flex-col gap-8">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Nos bureaux</h3>
                <div className="flex flex-col gap-6">
                  {offices.map((office, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#FFF9EA] text-[#FFB800] flex items-center justify-center">
                          <MapPin size={16} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-black text-sm text-gray-900">{office.title}</h4>
                      </div>
                      <div className="flex flex-col gap-4">
                        <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-3">
                          <Globe size={14} className="text-gray-300" />
                          {office.address}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-3">
                          <Phone size={14} className="text-gray-300" />
                          {office.phone}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-3">
                          <Clock size={14} className="text-gray-300" />
                          {office.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#151719] rounded-[32px] p-10 flex flex-col gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#FFB800]">
                  <MessageSquare size={24} />
                </div>
                <h4 className="font-black text-lg text-white">Support Technique</h4>
                <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
                  Des questions complexes sur la mécanique ou la logistique lourde ? Contactez directement nos ingénieurs.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#FFB800] uppercase tracking-widest mt-2">
                  <Mail size={12} /> support-tech@aandilik.ma
                </div>
              </div>

            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 md:p-14 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Envoyez-nous un message</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-12">Remplissez le formulaire ci-dessous et nous vous répondrons sous 2 heures ouvrables.</p>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom complet</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ex: Ahmed Benani"
                          className="w-full h-14 bg-gray-50 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#FFB800]/20 border border-gray-100 transition-all text-sm font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail professionnel</label>
                        <input 
                          type="email" 
                          required
                          placeholder="ahmed@entreprise.ma"
                          className="w-full h-14 bg-gray-50 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#FFB800]/20 border border-gray-100 transition-all text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type de demande</label>
                      <select className="w-full h-14 bg-gray-50 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#FFB800]/20 border border-gray-100 transition-all text-sm font-semibold appearance-none cursor-pointer">
                        <option>Location de matériel</option>
                        <option>Support technique</option>
                        <option>Partenariat</option>
                        <option>Facturation & Paiements</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                      <textarea 
                        rows={5}
                        required
                        placeholder="Dites-nous en plus sur vos besoins..."
                        className="w-full bg-gray-50 rounded-xl p-5 outline-none focus:ring-2 focus:ring-[#FFB800]/20 border border-gray-100 transition-all text-sm font-semibold resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading || isSent}
                      className={cn(
                        "h-16 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 overflow-hidden relative",
                        isSent ? "bg-green-500 text-white" : "bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900"
                      )}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                      ) : isSent ? (
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={18} /> Message Envoyé
                        </div>
                      ) : (
                        <>
                          Envoyer le message <ArrowRight size={14} strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF9EA] rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAP PLACEHOLDER / CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative rounded-[40px] overflow-hidden min-h-[400px] bg-gray-100 border border-gray-100">
            {/* Dark Overlay with Content */}
            <div className="absolute inset-0 bg-[#151719]/40 backdrop-blur-[2px] z-10 flex items-center justify-center text-center p-10">
              <div className="max-w-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#FFB800] text-gray-900 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <MapPin size={32} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Notre réseau au Maroc</h3>
                <p className="text-sm font-semibold text-white/90 leading-relaxed mb-8">
                  Nous couvrons plus de 20 villes à travers le royaume pour vous garantir une livraison rapide et un support de proximité.
                </p>
                <Link href="/equipment" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#FFB800] hover:text-white transition-colors group">
                  Voir les matériels par ville <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* Background "Map" visual */}
            <img 
              src="/last.png" 
              alt="Map Background" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-30"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
