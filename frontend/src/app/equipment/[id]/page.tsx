"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Activity,
  Gauge,
  Thermometer,
  Shield,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateTrackingCode, saveTrackedReservation, buildInitialHistory } from "@/lib/tracking";

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser, reservations } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [equipment, setEquipment] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [copied, setCopied] = useState(false);

  const rawUrl = equipment?.images || '';
  const secureImageUrl = rawUrl.startsWith('http://api.aandilik.com')
    ? rawUrl.replace('http://api.aandilik.com', 'https://api.aandilik.com')
    : rawUrl;

  const [imgSrc, setImgSrc] = useState("https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=compress&cs=tinysrgb&w=800");

  useEffect(() => {
    if (secureImageUrl) {
      setImgSrc(secureImageUrl);
    }
  }, [secureImageUrl]);

  // Guest inputs
  const [clientNom, setClientNom] = useState("");
  const [clientTelephone, setClientTelephone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // Dates
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString().split("T")[0];
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setClientNom(currentUser.name || "");
      setClientEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Fetch single materiel
  useEffect(() => {
    const materialId = id ? parseInt(id, 10) : null;
    if (!materialId || isNaN(materialId)) {
      setFetching(false);
      return;
    }

    const fetchEquipment = async () => {
      try {
        setFetching(true);
        const data = await apiFetch(`/materiel/${materialId}`);
        setEquipment(data);
      } catch (err: any) {
        showToast("Impossible de charger cet équipement.", "error");
        router.push("/equipment");
      } finally {
        setFetching(false);
      }
    };
    fetchEquipment();
  }, [id, router]);

  // Real-time calculation
  const getDaysCount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start >= end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = getDaysCount();
  const pricePerDay = equipment?.prix_location || 0;
  const totalPrice = days * pricePerDay;
  const commission = totalPrice * 0.1; // 10% platform commission

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNom.trim() || !clientTelephone.trim() || !clientEmail.trim() || !startDate || !endDate) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }
    if (days <= 0) {
      showToast("La date de fin doit être après la date de début.", "error");
      return;
    }

    try {
      setLoading(true);

      // Generate tracking code first so we can save it to DB
      const code = generateTrackingCode();
      setTrackingCode(code);

      const payload = {
        client_nom: clientNom,
        client_telephone: clientTelephone,
        client_email: clientEmail,
        date_debut: startDate,
        date_fin: endDate,
        materielId: Number(id),
        tracking_code: code // Fixed: Send the tracking code to the backend
      };

      // Save to database for tracking
      await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Persist to localStorage for client-side local lookup if needed
      saveTrackedReservation({
        trackingCode: code,
        reservationId: id,
        equipmentName: equipment.nom_equipement,
        equipmentImage: equipment.images || "",
        clientNom,
        clientEmail,
        clientTelephone,
        startDate,
        endDate,
        totalPrice,
        status: "Pending",
        createdAt: new Date().toISOString(),
        history: buildInitialHistory("Pending", new Date().toISOString()),
      });

      // WhatsApp logic removed - now handled via backend email notification to owner
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la réservation", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
            Chargement de la télémétrie...
          </div>
        </div>
      </div>
    );
  }

  const isCurrentlyRented = (reservations || []).some(r => r.equipmentId === id && r.status === 'In Progress');

  if (!equipment) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-300 mb-6">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Équipement Introuvable</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
          Le matériel demandé n&apos;existe pas ou a été retiré de notre catalogue.
        </p>
        <Link href="/equipment">
          <Button variant="secondary" className="px-8 h-14">
            Retourner au catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <Link 
          href="/equipment" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 group text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column — Machine details */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em] text-[10px] uppercase">
                <Shield size={14} /> CERTIFICATION QUALITÉ AANDILIK
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-900">
                {equipment.nom_equipement}
              </h1>
              <div className="flex flex-wrap gap-6 text-slate-500">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <MapPin size={16} className="text-primary" /> {equipment.localisation}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-green-500" /> Prêt pour service
                </span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-md bg-slate-950 p-1 border border-slate-200/50"
            >
              <img
                src={imgSrc}
                alt={equipment.nom_equipement}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={() => {
                  setImgSrc('/placeholder-machinery.png');
                }}
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </motion.div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-200/60 pb-3">
                Spécifications et description
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">
                {equipment.description || "Aucune description supplémentaire disponible pour cet engin."}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Poids Opérationnel</div>
                  <div className="text-lg font-black text-slate-900">{equipment.poids_operationnel || "N/A"} t</div>
                </Card>
                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacité de Godet</div>
                  <div className="text-lg font-black text-slate-900">{equipment.capacite_godet || "N/A"}</div>
                </Card>
                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Catégorie</div>
                  <div className="text-lg font-black text-slate-900 uppercase truncate">{equipment.categorie || "Lourd"}</div>
                </Card>
                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Localisation</div>
                  <div className="text-lg font-black text-slate-900 truncate">{equipment.localisation}</div>
                </Card>
              </div>
            </div>

            {/* Direct Telemetry metrics for rich premium UX */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-200/60 pb-3">
                Télémétrie logistique (Temps Réel)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Gauge size={16} className="text-primary" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Niveau Carburant</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "84%" }} />
                  </div>
                </Card>

                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Activity size={16} className="text-primary" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rendement Moteur</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "98%" }} />
                  </div>
                </Card>

                <Card variant="lowest" className="p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Thermometer size={16} className="text-primary" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Température Sys</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">42°C</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "42%" }} />
                  </div>
                </Card>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center justify-between text-white overflow-hidden relative group shadow-md border border-slate-800">
              <div className="relative z-10 flex gap-4 items-center">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-md">
                  <Wrench size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg tracking-tight mb-0.5">Assistance & Maintenance</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Support de chantier 24h/24 & 7j/7 inclus</p>
                </div>
              </div>
              <Button variant="glass" className="relative z-10 text-xs font-black tracking-widest uppercase rounded-xl border border-white/20 hover:bg-white/10 text-white">
                Fiche PDF
              </Button>
            </div>
          </div>

          {/* Right Column — Reservation checkout card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-6">
              <Card variant="lowest" className="p-8 rounded-3xl border border-slate-200/60 shadow-xl bg-white flex flex-col gap-6">
                
                {/* Daily rate info */}
                <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Tarif journalier</span>
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="text-4xl font-black text-slate-900">{pricePerDay}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">MAD/jour</span>
                  </div>
                </div>

                {/* checkout / reservation form */}
                <form onSubmit={handleSubmitReservation} className="flex flex-col gap-4">
                  
                  {/* Nom complet */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <User size={10} className="text-slate-500" /> Nom complet *
                    </label>
                    <input
                      required
                      type="text"
                      value={clientNom}
                      onChange={e => setClientNom(e.target.value)}
                      placeholder="e.g. Karim Tazi"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* Téléphone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Phone size={10} className="text-slate-500" /> Téléphone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={clientTelephone}
                      onChange={e => setClientTelephone(e.target.value)}
                      placeholder="e.g. 0612345678"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Mail size={10} className="text-slate-500" /> Adresse Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      placeholder="e.g. karim@domain.com"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <CalendarIcon size={10} className="text-slate-500" /> Date début
                      </label>
                      <input
                        required
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <CalendarIcon size={10} className="text-slate-500" /> Date fin
                      </label>
                      <input
                        required
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Real-time Calculation Display */}
                  <AnimatePresence>
                    {days > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 overflow-hidden"
                      >
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Durée de location</span>
                          <span>{days} {days === 1 ? "jour" : "jours"}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Prix de base ({days}j × {pricePerDay} MAD)</span>
                          <span>{totalPrice} MAD</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Frais plateforme (10%)</span>
                          <span>{commission} MAD</span>
                        </div>
                        <div className="h-px bg-slate-200 my-1" />
                        <div className="flex justify-between text-xs font-black text-slate-900">
                          <span>Prix Total</span>
                          <span className="text-primary font-black">{totalPrice} MAD</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  {isCurrentlyRented ? (
                    <div className="flex flex-col gap-4 mt-3">
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                        <ShieldCheck size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-700 font-bold leading-relaxed">
                          Ce matériel est actuellement en possession d'un client et sera de nouveau disponible bientôt.
                        </p>
                      </div>
                      <Button
                        type="button"
                        disabled
                        className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-black flex items-center justify-center gap-3 border-none text-[10px] uppercase tracking-widest"
                      >
                         Actuellement indisponible
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="submit"
                      loading={loading}
                      disabled={days <= 0 || loading || equipment.status !== 'active'}
                      className="w-full h-14 mt-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-950"
                    >
                      {equipment.status !== 'active' ? "Indisponible" : "Réserver Maintenant"} <ArrowRight className="ml-2" size={14} />
                    </Button>
                  )}
                </form>

                <div className="flex flex-col gap-2.5 text-[9px] font-black uppercase tracking-widest px-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Statut de l&apos;engin</span>
                    <span className={equipment.status === 'active' ? 'text-green-600' : 'text-amber-500'}>
                      {equipment.status === 'active' ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assurance de base</span>
                    <span className="text-slate-800">Incluse</span>
                  </div>
                </div>
              </Card>

              {/* Call support card */}
              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white flex items-center justify-between group cursor-pointer overflow-hidden relative shadow-md">
                <div className="relative z-10">
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Assistance Immédiate</div>
                  <div className="text-sm font-black tracking-tight text-white">Parler à un ingénieur site</div>
                </div>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-slate-950 relative z-10 transition-transform group-hover:rotate-12">
                  <Zap size={18} />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal without initial Tracking Code */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/");
        }}
        title="Réservation Enregistrée"
        footer={(
          <div className="flex flex-col gap-3 w-full">
            <Button 
              className="w-full h-14 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-950" 
              onClick={() => { setIsSuccessModalOpen(false); router.push("/"); }}
            >
              Retourner à l&apos;accueil
            </Button>
          </div>
        )}
      >
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shadow-sm animate-pulse-slow">
            <CheckCircle2 size={40} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Demande bien reçue !</h4>
            <p className="text-slate-500 text-xs font-medium leading-relaxed px-4">
              Votre demande de location a été transmise au propriétaire. Un email de confirmation contenant votre code de suivi vous a été envoyé.
            </p>
          </div>

          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4 text-white relative overflow-hidden">
            <div className="flex flex-col gap-1 w-full text-center z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                Code de suivi unique
              </span>
              <span className="font-mono text-2xl font-black text-primary tracking-widest select-all">
                {trackingCode}
              </span>
            </div>
            
            <button
              onClick={handleCopyCode}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black transition-all z-10 ${
                copied ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? <><Check size={14} /> Copié</> : <><Copy size={14} /> Copier le code de suivi</>}
            </button>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
              <Mail size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Étape suivante</div>
              <div className="text-sm font-bold text-slate-900">Suivi en direct</div>
              <div className="text-[10px] text-slate-500">Un e-mail de confirmation a été envoyé à {clientEmail}</div>
            </div>
          </div>

          <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-left">
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
              Conservez précieusement ce code de suivi. Vous pouvez l&apos;utiliser à tout moment sur la page de suivi pour connaître l&apos;état logistique de votre matériel.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
