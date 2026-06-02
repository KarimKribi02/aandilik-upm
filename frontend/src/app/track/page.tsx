"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  Wrench,
  ShieldCheck,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findReservationByCode, TrackedReservation } from "@/lib/tracking";
import { apiFetch } from "@/lib/api";

const STEPS = [
  {
    key: "Pending",
    label: "En attente",
    desc: "Demande reçue et en cours de traitement.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    key: "Confirmed",
    label: "Confirmée",
    desc: "Matériel réservé et prêt pour service.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    border: "border-emerald-600/20"
  },
  {
    key: "In Progress",
    label: "En Livraison",
    desc: "L'engin est en cours d'acheminement vers le site.",
    icon: Truck,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    key: "Completed",
    label: "Terminée",
    desc: "Fin du contrat de location.",
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    border: "border-blue-600/20"
  }
];

function getActiveStepIndex(status: string) {
  switch (status) {
    case "Pending": return 0;
    case "Confirmed": return 1;
    case "In Progress": return 2;
    case "Completed": return 3;
    default: return 0;
  }
}

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchReservationDetails = async (trackingCode: string) => {
    if (!trackingCode.trim()) return;
    setLoading(true);
    setNotFound(false);
    setReservation(null);

    try {
      const data = await apiFetch(
        `/reservations/track/${trackingCode.trim().toUpperCase()}?t=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        }
      );
      if (data) {
        setReservation({
          id: data.id.toString(),
          trackingCode: data.tracking_code,
          equipmentName: data.materiel?.nom_equipement || "Matériel Aandilik",
          equipmentImage: data.materiel?.images || "",
          clientNom: data.client_nom,
          clientEmail: data.client_email,
          clientTelephone: data.client_telephone,
          startDate: new Date(data.date_debut).toISOString().split('T')[0],
          endDate: new Date(data.date_fin).toISOString().split('T')[0],
          totalPrice: data.prix_total,
          status: data.status === "PENDING" ? "Pending" :
                  data.status === "APPROVED" ? "Confirmed" :
                  data.status === "IN PROGRESS" ? "In Progress" :
                  data.status === "COMPLETED" ? "Completed" :
                  data.status === "REJECTED" ? "Cancelled" : "Pending",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend fetch failed, trying local storage fallback:", err);
    }

    const local = findReservationByCode(trackingCode);
    if (local) {
      setReservation(local);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
      fetchReservationDetails(urlCode);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/track?code=${code.trim().toUpperCase()}`);
  };

  const handleReset = () => {
    setCode("");
    setReservation(null);
    setNotFound(false);
    router.push("/track");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden">
      {/* Soft Ambient Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl py-32 flex-1 flex flex-col justify-center relative z-10">
        
        {/* STATE A: BEFORE SEARCH / INPUT CODE */}
        <AnimatePresence mode="wait">
          {!reservation && !loading && (
            <motion.div
              key="search-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mx-auto flex flex-col gap-8"
            >
              <div className="text-center flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7941d]">Télémétrie en Direct</span>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Suivre votre réservation</h1>
                <p className="text-slate-500 text-sm">Entrez votre code de suivi unique (ex: ADK-2026-XXXX) pour suivre l&apos;évolution de votre demande.</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50">
                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f7941d] transition-all" size={18} />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="ADK-2026-XXXX"
                      className="w-full h-14 pl-12 pr-4 bg-white rounded-xl outline-none text-sm font-black tracking-widest placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] border border-slate-200 text-slate-900 font-mono transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 bg-[#f7941d] hover:bg-[#e08316] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10"
                  >
                    Rechercher
                  </button>
                </form>

                {notFound && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Le code saisi ne correspond à aucun dossier. Veuillez vérifier l&apos;orthographe.</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <motion.div
              key="loading-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-12 h-12 border-4 border-slate-200 border-t-[#f7941d] rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-500 animate-pulse">Recherche du dossier en cours...</span>
            </motion.div>
          )}

          {/* STATE B: DISPLAY RESULTS */}
          {reservation && !loading && (() => {
            const activeStep = getActiveStepIndex(reservation.status);
            const isCancelled = reservation.status === "Cancelled";

            return (
              <motion.div
                key="results-box"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8 w-full"
              >
                {/* Top Actions navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all bg-white border border-slate-200 px-4 py-2.5 rounded-xl active:scale-95 shadow-sm"
                  >
                    <ArrowLeft size={14} /> Suivre un autre code
                  </button>

                  <div className="font-mono text-xs font-black text-[#f7941d] bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                    {reservation.trackingCode}
                  </div>
                </div>

                {/* Timeline Stepper Container */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/30">
                  <div className="flex flex-col gap-1.5 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7941d]">Avancement logistique</span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chronologie de livraison</h2>
                  </div>

                  {isCancelled ? (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600">
                      <XCircle size={24} className="shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">Commande Annulée / Refusée</h4>
                        <p className="text-xs text-red-500/80">Cette demande a été clôturée ou rejetée par le propriétaire de l&apos;engin.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                      {STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isDone = idx < activeStep;
                        const isActive = idx === activeStep;

                        return (
                          <div key={step.key} className="flex flex-col gap-3 relative">
                            {/* Horizontal Line connector */}
                            {idx < STEPS.length - 1 && (
                              <div className="hidden md:block absolute left-9 top-4 w-[calc(100%-1.5rem)] h-0.5 bg-slate-100 z-0">
                                <div className={`h-full bg-[#f7941d] transition-all duration-500 ${isDone ? "w-full" : "w-0"}`} />
                              </div>
                            )}

                            {/* Timeline node */}
                            <div className="flex items-center gap-3 md:flex-col md:items-start z-10">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                isDone ? "bg-[#f7941d] border-[#f7941d] text-white" :
                                isActive ? "bg-white border-[#f7941d] text-[#f7941d] shadow-lg shadow-orange-500/20 scale-105" :
                                "bg-white border-slate-200 text-slate-300"
                              }`}>
                                <StepIcon size={16} />
                              </div>

                              <div className="flex flex-col">
                                <h4 className={`text-xs font-bold ${isActive ? "text-[#f7941d]" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                                  {step.label}
                                </h4>
                                <span className="text-[10px] text-slate-400 leading-relaxed md:mt-1 hidden md:block">
                                  {step.desc}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Info Blocks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Details */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">Détails de l&apos;engin</h3>
                    
                    <div className="flex gap-4 items-center">
                      {reservation.equipmentImage && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                          <img src={reservation.equipmentImage} alt={reservation.equipmentName} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{reservation.equipmentName}</h4>
                        <span className="text-[10px] text-slate-400">Aandilik Pro Fleet</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 text-xs text-slate-500 pt-2">
                      <div className="flex justify-between">
                        <span>Période</span>
                        <span className="text-slate-950 font-bold">{reservation.startDate} au {reservation.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de la location</span>
                        <span className="text-[#f7941d] font-black text-sm">{reservation.totalPrice} DH</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">Statut Actuel</h3>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f7941d]">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">État</span>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            {reservation.status === 'Pending' ? 'En attente de validation' :
                             reservation.status === 'Confirmed' ? 'Réservation Validée' :
                             reservation.status === 'In Progress' ? 'En cours de livraison' :
                             reservation.status === 'Completed' ? 'Location Clôturée' : 'Annulée'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Support Help Block */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Wrench size={16} className="text-slate-500 shrink-0" />
                      <div className="text-[10px]">
                        <span className="text-slate-800 font-bold block">Assistance Aandilik</span>
                        <span className="text-slate-500">Besoin d&apos;aide logistique ? Contactez notre support.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#f7941d] rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
