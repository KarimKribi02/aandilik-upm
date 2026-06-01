"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Clock,
  CheckCircle2,
  Activity,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Package,
  AlertCircle,
  Truck,
  Wrench,
  Copy,
  Check,
  CalendarDays,
  User,
  Phone,
  Mail,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findReservationByCode, TrackedReservation } from "@/lib/tracking";

const STATUS_STEPS = [
  {
    key: "Sent",
    label: "Réservation envoyée",
    desc: "Votre demande a été transmise avec succès.",
    icon: Package,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  {
    key: "Pending",
    label: "En cours de validation",
    desc: "Notre équipe vérifie la disponibilité du matériel.",
    icon: Clock,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    key: "Confirmed",
    label: "Confirmé",
    desc: "Votre réservation a été validée officiellement.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    key: "In Progress",
    label: "Matériel livré",
    desc: "L'équipement est désormais sur votre chantier.",
    icon: Truck,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    key: "Completed",
    label: "Location terminée",
    desc: "La session est close. Merci de votre confiance.",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
];

const CANCELLED_STEP = {
  key: "Cancelled",
  label: "Réservation annulée",
  desc: "Cette réservation a été annulée.",
  icon: XCircle,
  color: "text-red-500",
  bg: "bg-red-50",
  border: "border-red-200",
};

function getActiveStep(status: TrackedReservation["status"]) {
  if (status === "Cancelled") return -1;
  switch (status) {
    case "Pending": return 1; // Awaiting Validation
    case "Confirmed": return 2; // Confirmed
    case "In Progress": return 3; // Matériel livré
    case "Completed": return 4; // Location terminée
    default: return 0; // Réservation envoyée
  }
}

function StatusBadge({ status }: { status: TrackedReservation["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    Pending: { label: "En attente", cls: "bg-orange-100 text-orange-700" },
    Confirmed: { label: "Confirmé", cls: "bg-blue-100 text-blue-700" },
    "In Progress": { label: "En transit", cls: "bg-purple-100 text-purple-700" },
    Completed: { label: "Terminé", cls: "bg-green-100 text-green-700" },
    Cancelled: { label: "Annulé", cls: "bg-red-100 text-red-700" },
  };
  const s = map[status] || map["Pending"];
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.cls}`}>
      {s.label}
    </span>
  );
}

function TrackingResult({ reservation }: { reservation: TrackedReservation }) {
  const [copied, setCopied] = useState(false);
  const activeStep = getActiveStep(reservation.status);
  const isCancelled = reservation.status === "Cancelled";

  const handleCopy = () => {
    navigator.clipboard.writeText(reservation.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* LEFT: Equipment Info + Client Details */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Equipment Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm relative">
              <Image
                src={reservation.equipmentImage || "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt={reservation.equipmentName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                    {reservation.equipmentName}
                  </h3>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    Matériel loué · AANDILIK
                  </div>
                </div>
                <StatusBadge status={reservation.status} />
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} className="text-primary" />
                  {reservation.startDate} → {reservation.endDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity size={12} className="text-primary" />
                  {reservation.totalPrice} MAD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            Informations client
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
                <User size={14} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nom</div>
                <div className="text-sm font-bold text-slate-800">{reservation.clientNom}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
                <Phone size={14} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Téléphone</div>
                <div className="text-sm font-bold text-slate-800">{reservation.clientTelephone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
                <Mail size={14} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</div>
                <div className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{reservation.clientEmail}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking code badge */}
        <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-between border border-slate-800">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
              Code de suivi
            </div>
            <div className="text-xl font-black tracking-widest text-white font-mono">
              {reservation.trackingCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              copied ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {copied ? <><Check size={12} /> Copié</> : <><Copy size={12} /> Copier</>}
          </button>
        </div>
      </div>

      {/* RIGHT: Timeline */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-28">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Chronologie de suivi
            </h4>
            <StatusBadge status={reservation.status} />
          </div>

          <div className="relative">
            {(isCancelled ? [...STATUS_STEPS.slice(0, 1), CANCELLED_STEP] : STATUS_STEPS).map((step, idx) => {
              const isActive = !isCancelled && idx === activeStep;
              const isDone = !isCancelled && idx < activeStep;
              const isCancelledStep = step.key === "Cancelled";
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative pl-12 pb-10 last:pb-0">
                  {/* Connector line */}
                  {idx < (isCancelled ? 1 : STATUS_STEPS.length) - 1 && (
                    <div
                      className={`absolute left-3 top-6 w-0.5 h-full transition-all duration-700 ${
                        isDone ? "bg-primary" : "bg-slate-100"
                      }`}
                    />
                  )}

                  {/* Node */}
                  <div
                    className={`absolute left-0 top-0 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                      isCancelledStep
                        ? "bg-red-50 border-red-400 text-red-500"
                        : isDone
                        ? "bg-primary border-primary text-white"
                        : isActive
                        ? "bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110"
                        : "bg-white border-slate-200 text-slate-300"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={13} strokeWidth={3} />
                    ) : isActive ? (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                    ) : (
                      <StepIcon size={12} />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h5
                      className={`font-black text-sm ${
                        isActive || isDone || isCancelledStep
                          ? "text-slate-900"
                          : "text-slate-300"
                      }`}
                    >
                      {step.label}
                    </h5>
                    <p
                      className={`text-[10px] font-medium leading-relaxed ${
                        isActive || isDone || isCancelledStep
                          ? "text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {step.desc}
                    </p>
                    {(isActive || isDone || isCancelledStep) && (
                      <div className="text-[9px] font-black uppercase tracking-widest text-primary mt-1">
                        {reservation.history.find((h) => h.label === step.label)?.time || ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!isCancelled && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Wrench size={16} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Support Aandilik</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Besoin d&apos;aide ? Contactez-nous via WhatsApp.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get("code") || "");
  const [result, setResult] = useState<TrackedReservation | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-search if code is in URL
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setTimeout(() => {
        setTrackingCode(code);
        setLoading(true);
        const found = findReservationByCode(code);
        setResult(found);
        setNotFound(!found);
        setLoading(false);
      }, 0);
    }
  }, [searchParams]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setTimeout(() => {
      const found = findReservationByCode(trackingCode);
      setResult(found);
      setNotFound(!found);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HERO */}
      <section className="relative w-full bg-white overflow-hidden pt-28 pb-20 border-b border-slate-100">
        <div className="absolute inset-0 w-full h-full lg:w-[55%] ml-auto z-0 opacity-5 lg:opacity-100">
          <img
            src="https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Tracking"
            className="w-full h-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-10 text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900">Suivi matériel</span>
          </div>

          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-5 block">
              TÉLÉMÉTRIE EN DIRECT
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.0] tracking-tight mb-8">
              Suivez votre<br />
              <span className="text-primary">réservation.</span>
            </h1>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-lg">
              Entrez votre code de suivi unique reçu lors de la confirmation de votre location.
            </p>

            <form onSubmit={handleTrack} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1 group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="ADL-XXXX-XXXX"
                  className="w-full h-16 pl-14 pr-6 bg-slate-50 rounded-2xl outline-none text-sm font-black tracking-[0.1em] placeholder:text-slate-400 placeholder:font-normal focus:ring-4 focus:ring-primary/10 border border-slate-200 transition-all uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !trackingCode.trim()}
                className="h-16 px-10 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shrink-0 shadow-md shadow-primary/20 active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Initialiser <ArrowRight size={14} strokeWidth={2.5} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
                  Recherche en cours...
                </div>
              </motion.div>
            )}

            {!loading && notFound && (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center gap-6"
              >
                <div className="w-24 h-24 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400">
                  <AlertCircle size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Code introuvable</h3>
                  <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                    Le code <span className="font-black text-slate-800 font-mono">{trackingCode}</span> ne correspond à aucune réservation. Vérifiez l&apos;orthographe ou contactez-nous.
                  </p>
                </div>
                <Link
                  href="/equipment"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  Parcourir le catalogue <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}

            {!loading && result && (
              <TrackingResult key={result.trackingCode} reservation={result} />
            )}

            {!loading && !notFound && !result && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center opacity-60"
              >
                <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  <Package size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-black text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Entrez votre code de suivi unique reçu lors de la confirmation de votre réservation.
                </p>

                {/* Demo codes hint */}
                <div className="mt-8 p-4 bg-white border border-slate-100 rounded-2xl text-left max-w-sm w-full shadow-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Format attendu
                  </div>
                  <div className="font-mono text-sm font-black text-slate-700 tracking-widest text-center">
                    ADL-XXXX-XXXX
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tight">
                Une technologie au service de <br className="hidden lg:block" />
                votre <span className="text-primary">productivité.</span>
              </h2>
              <p className="text-sm font-semibold text-slate-400 leading-relaxed mb-12 max-w-xl mx-auto">
                Grâce au suivi en temps réel et à notre support logistique, gardez le contrôle total sur vos chantiers.
              </p>
              <Link
                href="/equipment"
                className="inline-flex items-center gap-4 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Louer du matériel <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}
