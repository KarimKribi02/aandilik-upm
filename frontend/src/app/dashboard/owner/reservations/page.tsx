"use client";

import { useState } from "react";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { 
  Clock, 
  X,
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  PackageSearch
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation } from "@/data/mockData";

export default function OwnerReservations() {
  const { reservations, equipment, users, currentUser, updateReservationStatus } = useData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Filter reservations for the current owner and active tab
  const ownerReservations = (reservations || []).filter(res => {
    const isOwner = String(res.ownerId) === String(currentUser?.id);
    const matchesTab = res.status === activeTab;
    return isOwner && matchesTab;
  });

  const handleStatusChange = (id: string, newStatus: any) => {
    updateReservationStatus(id, newStatus);
    showToast(`Statut mis à jour : ${newStatus}`, "success");
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="flex flex-col gap-12 relative min-h-[80vh]">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Rental <span className="text-primary">Requests</span></h1>
        <p className="text-secondary text-sm">Gérez les demandes de location entrantes et les contrats actifs de votre flotte.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="flex gap-4 border-b border-surface-container pb-4">
            {["Pending", "Confirmed", "Completed", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab ? "bg-primary text-white" : "text-secondary hover:bg-surface-low"
                }`}
              >
                {tab === "Pending" ? "En attente" : tab === "Confirmed" ? "Confirmées" : tab === "Completed" ? "Terminées" : "Refusées"}
              </button>
            ))}
          </div>

          {ownerReservations.length > 0 ? (
            <Table headers={["Engin", "Locataire", "Période", "Revenu", "Actions"]} className="w-full table-auto">
              {ownerReservations.map((res) => {
                const eq = equipment.find(e => e.id === res.equipmentId);
                const renterName = res.client_nom || "Client Aandilik";

                return (
                  <TableRow 
                    key={res.id} 
                    onClick={() => setSelectedReservation(res)}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                          <img src={eq?.image} alt={eq?.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-sm tracking-tight">{eq?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="font-bold text-sm text-slate-900">{renterName}</div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Clock size={14} className="text-primary shrink-0" /> {res.startDate} — {res.endDate}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="font-bold text-slate-900">{res.totalPrice} DH</div>
                    </TableCell>
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {res.status === "Pending" && (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="h-9 px-3.5 text-xs bg-green-500 hover:bg-green-600 border-none font-bold transition-all active:scale-95"
                              onClick={() => handleStatusChange(res.id, "Confirmed")}
                            >
                              Accepter
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-9 px-3.5 text-xs bg-red-50 text-red-600 border-red-100 font-bold transition-all active:scale-95"
                              onClick={() => handleStatusChange(res.id, "Rejected")}
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                        {res.status === "Confirmed" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-9 px-4 text-xs bg-blue-500 hover:bg-blue-600 border-none font-bold transition-all active:scale-95"
                            onClick={() => handleStatusChange(res.id, "Completed")}
                          >
                            Clôturer
                          </Button>
                        )}
                        {res.status === "Completed" && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                            Terminé
                          </span>
                        )}
                        {res.status === "Rejected" && (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                            Refusé
                          </span>
                        )}
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-9 px-3 text-xs bg-slate-100 hover:bg-slate-200 border-none font-bold transition-all active:scale-95 whitespace-nowrap"
                          onClick={() => setSelectedReservation(res)}
                        >
                          Détails
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
              <PackageSearch size={48} className="text-secondary/20 mb-4" />
              <h4 className="font-bold text-lg mb-1">Aucune demande</h4>
              <p className="text-secondary text-xs">Lorsque les clients réserveront votre matériel, ils apparaîtront ici.</p>
            </div>
          )}
        </div>

        <div className="xl:col-span-4 flex flex-col gap-8">
          <h3 className="font-bold text-xl">Operational Insights</h3>
          <Card variant="low" className="p-8 border-2 border-surface-container bg-surface-low/30">
            <h4 className="font-bold text-sm mb-4">Statistiques Flotte</h4>
            <div className="flex flex-col gap-6">
              {[
                { label: "Taux d'acceptation", val: "96%", color: "bg-green-500", width: "w-[96%]" },
                { label: "Temps de réponse moyen", val: "1.8h", color: "bg-blue-500", width: "w-[85%]" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-black">{stat.val}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`${stat.color} h-full ${stat.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="flex flex-col gap-4 p-8 bg-surface-container-high rounded-3xl">
            <h4 className="font-bold text-sm">Besoin d&apos;assistance ?</h4>
            <p className="text-secondary text-xs leading-relaxed">Notre service d&apos;assistance partenaires est disponible 7j/7 pour vous aider à coordonner les livraisons.</p>
            <Button variant="secondary" size="sm" className="w-full">Contacter le support</Button>
          </div>
        </div>
      </div>

      {/* Slide-over Details Drawer */}
      <AnimatePresence>
        {selectedReservation && (() => {
          const res = selectedReservation;
          const eq = equipment.find(e => e.id === res.equipmentId);
          const trackingCode = res.trackingCode || `ADK-2026-${res.id.substring(0, 4).toUpperCase()}`;

          // Calculate duration in days
          const start = new Date(res.startDate);
          const end = new Date(res.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;

          // Financial details
          const rawTotal = res.totalPrice || (days * (eq?.pricePerDay || 0));
          const commission = Math.round(rawTotal * 0.1);
          const netPayout = rawTotal - commission;

          // WhatsApp link
          const cleanPhone = res.client_telephone?.replace(/[^0-9]/g, "") || "";
          const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

          return (
            <>
              {/* Dark Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedReservation(null)}
                className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 cursor-pointer"
              />

              {/* Slider Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-slate-950 text-slate-100 shadow-2xl z-50 flex flex-col border-l border-slate-800/80 overflow-y-auto"
              >
                {/* Header Section */}
                <div className="p-8 border-b border-slate-900 flex justify-between items-start sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Détails de réservation</span>
                    <h3 className="text-xl font-black text-white tracking-tight">Requête #{res.id}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedReservation(null)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-8 flex-1 flex flex-col gap-8">
                  {/* Equipment Header Info */}
                  <div className="bg-slate-900/50 border border-slate-800/60 rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border border-slate-800">
                        <img src={eq?.image} alt={eq?.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-md text-white truncate">{eq?.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{eq?.category}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/60">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Code de suivi</span>
                        <div className="font-mono text-xs font-black text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-xl tracking-wider select-all">
                          {trackingCode}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Statut Actuel</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          res.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                          res.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                          res.status === 'Completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {res.status === 'Pending' ? 'En attente 🟡' : res.status === 'Confirmed' ? 'Confirmé 🟢' : res.status === 'Completed' ? 'Terminé 🔵' : 'Refusé 🔴'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Client Information */}
                  <div className="flex flex-col gap-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Détails du Client</h5>
                    <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                          <User size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Nom complet</span>
                          <span className="text-sm font-bold text-white">{res.client_nom || "Client Aandilik"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                          <Mail size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Email</span>
                          <span className="text-sm font-semibold text-white truncate block select-all">{res.client_email || "Non renseigné"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                            <Phone size={18} />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Téléphone</span>
                            <span className="text-sm font-semibold text-white select-all">{res.client_telephone || "Non renseigné"}</span>
                          </div>
                        </div>

                        {waLink && (
                          <a 
                            href={waLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all shadow-md shadow-green-950/20 active:scale-95 shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.847L.057 23.882l6.19-1.442A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.816 9.816 0 01-5.006-1.368l-.36-.214-3.724.867.933-3.617-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                            </svg>
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Timeline & Financial Breakdown */}
                  <div className="flex flex-col gap-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Détails Financiers & Calendrier</h5>
                    <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6">
                      
                      {/* Timeline dates info */}
                      <div className="flex justify-between items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Date début</span>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Calendar size={12} className="text-primary" /> {res.startDate}
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-slate-700" />
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Date fin</span>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Calendar size={12} className="text-primary" /> {res.endDate}
                          </span>
                        </div>
                      </div>

                      {/* Financial values details */}
                      <div className="flex flex-col gap-3.5 text-sm">
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Durée de location</span>
                          <span className="text-white font-bold">{days} {days > 1 ? "jours" : "jour"}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Prix journalier</span>
                          <span className="text-white font-bold">{eq?.pricePerDay || 0} DH / jour</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Montant brut calculé</span>
                          <span className="text-white font-bold">{rawTotal} DH</span>
                        </div>
                        <div className="flex justify-between text-red-400/90 font-medium">
                          <span className="flex items-center gap-1">Commission Aandilik (10%)</span>
                          <span className="font-bold">-{commission} DH</span>
                        </div>
                        
                        <div className="h-px bg-slate-800/80 my-2" />

                        {/* Net payout highlight */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenu net propriétaire</span>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-slate-400 font-medium">Ce que vous encaissez</span>
                            <span className="text-3xl font-black text-primary tracking-tight select-all">
                              {netPayout} DH
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-8 border-t border-slate-900 bg-slate-950/95 sticky bottom-0 z-10 flex gap-3">
                  {res.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(res.id, 'Confirmed')}
                        className="flex-1 py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-zinc-950 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                      >
                        Accepter la demande
                      </button>
                      <button
                        onClick={() => handleStatusChange(res.id, 'Rejected')}
                        className="flex-1 py-4 px-6 rounded-xl bg-red-50/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  {res.status === 'Confirmed' && (
                    <button
                      onClick={() => handleStatusChange(res.id, 'Completed')}
                      className="w-full py-4 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-zinc-950 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                    >
                      Clôturer la location
                    </button>
                  )}
                  {res.status === 'Completed' && (
                    <div className="w-full py-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 font-bold text-center text-xs uppercase tracking-wider">
                      Cette location est clôturée
                    </div>
                  )}
                  {res.status === 'Rejected' && (
                    <div className="w-full py-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 font-bold text-center text-xs uppercase tracking-wider">
                      Cette demande a été refusée
                    </div>
                  )}
                </div>

              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
