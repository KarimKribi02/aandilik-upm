"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  ArrowRight,
  Info,
  CheckCircle2,
  Activity,
  Gauge,
  Thermometer,
  Shield
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { equipment: allEquipment, currentUser, addReservation } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [equipment, setEquipment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-05");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = allEquipment.find((e) => e.id === id);
    if (found) {
      setEquipment(found);
    }
  }, [id, allEquipment]);

  if (allEquipment.length > 0 && !equipment) {
    notFound();
  }

  if (!equipment) return <div className="p-32 text-center font-black text-secondary animate-pulse uppercase tracking-[0.3em]">Initialisation des protocoles...</div>;

  const handleRentClick = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmReservation = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * (equipment.pricePerDay * 10);

      addReservation({
        equipmentId: equipment.id,
        renterId: currentUser!.id,
        ownerId: equipment.ownerId,
        startDate,
        endDate,
        totalPrice
      });

      showToast("Demande de déploiement transmise.", "success");
      setLoading(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <Link 
          href="/equipment" 
          className="inline-flex items-center gap-2 text-secondary/40 hover:text-primary transition-colors mb-12 group text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Content */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-primary font-black tracking-[0.3em] text-[10px] uppercase">
                <Shield size={14} /> Protocoles Certifiés Aandilik
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight text-[#0a1118]">
                {equipment.name}
              </h1>
              <div className="flex flex-wrap gap-10 text-secondary">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <MapPin size={18} className="text-primary" /> {equipment.location}
                </span>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <ShieldCheck size={18} className="text-primary" /> Inspection Technique OK
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl bg-[#0a1118] p-2 border border-black/5">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="absolute inset-0 w-full h-full object-cover rounded-[32px] opacity-90 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10" />
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.3em] border-b border-surface-container pb-4">Spécifications Structurelles</h3>
              <p className="text-secondary leading-relaxed font-medium text-lg">
                {equipment.description}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(equipment.specs).map(([key, value]: [string, any]) => (
                  <Card key={key} variant="lowest" className="p-8 rounded-[32px] border-none shadow-sm group hover:bg-primary transition-all duration-500">
                    <div className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-3 group-hover:text-white/60">{key === 'weight' ? 'Poids' : key === 'engine' ? 'Moteur' : key === 'reach' ? 'Portée' : key}</div>
                    <div className="text-xl font-black group-hover:text-white transition-colors">{value}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.3em] border-b border-surface-container pb-4">Télémétrie en Direct</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card variant="lowest" className="p-8 rounded-[32px] border-none shadow-sm flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Gauge size={18} className="text-primary" />
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Niveau fuel</span>
                    </div>
                    <span className="text-sm font-black text-primary">84%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f8f9fa] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "84%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-secondary/60">Estimé : 12.5 h restantes.</p>
                </Card>

                <Card variant="lowest" className="p-8 rounded-[32px] border-none shadow-sm flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-primary" />
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Santé Moteur</span>
                    </div>
                    <span className="text-sm font-black text-[#0a1118]">98%</span>
                  </div>
                  <div className="flex gap-1 h-12 items-end">
                    {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex-1 bg-primary/20 rounded-t-lg"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-secondary/60">Vibrations dans la norme.</p>
                </Card>

                <Card variant="lowest" className="p-8 rounded-[32px] border-none shadow-sm flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer size={18} className="text-primary" />
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Température</span>
                    </div>
                    <span className="text-sm font-black text-[#0a1118]">42°C</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-[3px] border-surface-container border-t-primary animate-spin" />
                    <div className="text-[10px] font-bold text-secondary/60 uppercase">Analyse active...</div>
                  </div>
                  <p className="text-[10px] font-bold text-secondary/60 italic">Système de refroidissement OK.</p>
                </Card>
              </div>
            </div>

            <div className="bg-[#0a1118] rounded-[40px] p-12 flex flex-col md:flex-row gap-10 items-center justify-between text-white overflow-hidden relative group">
              <div className="relative z-10 flex gap-8 items-center">
                <div className="w-20 h-20 bg-primary rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <Wrench size={36} />
                </div>
                <div>
                  <h4 className="font-black text-2xl tracking-tight mb-1">Support Technique 24/7</h4>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Maintenance sur site incluse</p>
                </div>
              </div>
              <Button variant="secondary" className="relative z-10 bg-white text-black hover:bg-white/90 h-16 px-10 rounded-[20px] font-black uppercase tracking-widest text-xs">
                Fiche Technique (PDF)
              </Button>
              <Activity className="absolute -bottom-20 -right-20 w-64 h-64 text-primary opacity-5 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>

          {/* Right: Sidebar / Sticky */}
          <div className="lg:col-span-4">
            <div className="sticky top-40 flex flex-col gap-6">
              <Card variant="lowest" className="p-10 rounded-[40px] border-none shadow-2xl bg-white flex flex-col gap-10">
                <div className="flex justify-between items-end border-b border-surface-container pb-8">
                  <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Tarif Journalier</div>
                  <div className="text-right">
                    <span className="text-6xl font-black text-[#0a1118] tracking-tighter">{equipment.pricePerDay * 10}</span>
                    <span className="text-secondary/60 text-[10px] font-black uppercase tracking-widest block mt-1 ml-1">MAD par 24h</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-6 bg-[#f8f9fa] rounded-[24px] border border-black/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <CalendarIcon size={20} />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest text-secondary">Période</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-sm font-black outline-none text-[#0a1118]" 
                      />
                      <div className="h-px w-6 bg-primary/20" />
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent text-sm font-black outline-none text-[#0a1118]" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-5 text-[10px] font-black uppercase tracking-widest text-secondary/60 bg-[#0a1118]/5 rounded-[20px]">
                    <Info size={16} className="text-primary" />
                    Assurance & Logistique calculées au panier.
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <Button 
                    size="lg" 
                    className="w-full h-20 rounded-[28px] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                    onClick={handleRentClick}
                    disabled={!equipment.availability}
                  >
                    {equipment.availability ? "Réserver cet équipement" : "Actuellement en déploiement"} <ArrowRight className="ml-3" size={18} />
                  </Button>
                  
                  <div className="flex flex-col gap-4 px-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-secondary/40">Statut</span>
                      <span className={equipment.availability ? 'text-green-500' : 'text-red-500'}>
                        {equipment.availability ? 'Prêt au déploiement' : 'Tâche en cours'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-secondary/40">Base de dépôt</span>
                      <span className="text-[#0a1118]">{equipment.location}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="p-8 bg-primary rounded-[32px] text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Besoin d'aide ?</div>
                  <div className="text-lg font-black tracking-tight">Parlez à un ingénieur</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 transition-transform group-hover:rotate-12">
                  <Zap size={24} />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmation de Réservation"
        footer={(
          <div className="flex gap-4 w-full">
            <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={handleConfirmReservation} loading={loading}>Confirmer</Button>
          </div>
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6 p-6 bg-[#f8f9fa] rounded-[32px]">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
              <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-black text-lg tracking-tight mb-1">{equipment.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">{equipment.pricePerDay * 10} MAD / jour</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-[#f8f9fa] rounded-[24px]">
              <div className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Début</div>
              <div className="font-black text-sm">{startDate}</div>
            </div>
            <div className="p-6 bg-[#f8f9fa] rounded-[24px]">
              <div className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Fin</div>
              <div className="font-black text-sm">{endDate}</div>
            </div>
          </div>

          <div className="p-8 bg-[#0a1118] text-white rounded-[32px] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center opacity-60 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest">Total Estimé</span>
                <span className="text-[10px] font-black">
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} Jours
                </span>
              </div>
              <div className="text-4xl font-black tracking-tighter">
                {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * (equipment.pricePerDay * 10)} <span className="text-lg">MAD</span>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Déploiement Planifié"
        footer={(
          <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => router.push("/dashboard/client/reservations")}>
            Voir mes réservations <ArrowRight className="ml-2" size={16} />
          </Button>
        )}
      >
        <div className="flex flex-col items-center text-center gap-8 py-6">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-2xl font-black tracking-tight">Demande Entregistrée !</h4>
            <p className="text-secondary font-medium leading-relaxed">L'équipe logistique examine votre demande. Un code de suivi unique sera généré sous peu.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
