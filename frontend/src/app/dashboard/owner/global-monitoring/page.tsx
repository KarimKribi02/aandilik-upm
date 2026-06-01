"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { useData } from "@/context/DataProvider";
import { Reservation } from "@/data/mockData";
import { History, TrendingUp, FileSearch, Check, X, Phone, Mail, User, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllTrackedReservations, TrackedReservation } from "@/lib/tracking";

export default function GlobalMonitoring() {
  const { reservations: allReservations, equipment, users, updateReservationStatus } = useData();
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Awaiting");
  
  const TABS = [
    { key: "Awaiting", label: "Awaiting Validation", status: "Pending" },
    { key: "Confirmed", label: "Confirmed", status: "Confirmed" },
    { key: "Delivery", label: "In Delivery", status: "In Progress" },
    { key: "Finished", label: "Rental Finished", status: "Completed" },
    { key: "Cancelled", label: "Cancelled", status: "Cancelled" }
  ];

  const filteredReservations = (allReservations || []).filter(r => {
    const tab = TABS.find(t => t.key === activeTab);
    return r.status === tab?.status;
  });

  const handleUpdateStatus = async (id: string, status: any) => {
    setLoadingId(id);
    try {
      await updateReservationStatus(id, status);
      showToast(`Reservation moved to ${status}.`, "success");
    } catch (err: any) {
      showToast(`Update failed: ${err.message}`, "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Global <span className="text-primary">Monitoring</span></h1>
          <p className="text-secondary text-sm">Real-time supervision and control of all platform rental contracts.</p>
        </div>
        <Button variant="secondary" className="gap-2"><FileSearch size={18} /> Deep Audit</Button>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface-container pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.key 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "bg-white text-secondary border border-surface-container hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span className="ml-2 opacity-50 bg-black/10 px-2 py-0.5 rounded-full text-[8px]">
              {(allReservations || []).filter(r => r.status === tab.status).length}
            </span>
          </button>
        ))}
      </div>

      <Table headers={["Reference", "Track ID", "Equipment", "Client Details", "Period & Total", "Control State"]}>
        {filteredReservations.length > 0 ? filteredReservations.map((res: Reservation) => {
          const eq = equipment.find(e => e.id === res.equipmentId);
          
          // Try to find tracking code from localStorage
          const allTracked = getAllTrackedReservations();
          const tracked = Object.values(allTracked).find(t => 
            t.clientEmail === res.client_email && 
            t.startDate === res.startDate
          );

          return (
            <TableRow key={res.id}>
              <TableCell>
                <div className="font-mono text-[10px] font-bold text-primary">#{res.id}</div>
                <div className="text-[9px] text-secondary mt-1 uppercase font-bold">Ref Code</div>
              </TableCell>
              <TableCell>
                {tracked ? (
                  <Link href={`/track?code=${tracked.trackingCode}`} className="group">
                    <div className="font-mono text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 group-hover:border-primary group-hover:text-primary transition-all flex items-center gap-1.5 w-fit">
                      {tracked.trackingCode}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ) : (
                  <div className="text-[10px] font-bold text-slate-300 italic">No Track Code</div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img src={eq?.image || ""} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{eq?.name || "Deleted Equipment"}</div>
                    <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{eq?.category}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <User size={12} className="text-primary" /> {res.client_nom || "Guest Client"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold truncate max-w-[150px]">
                    <Mail size={10} /> {res.client_email || "N/A"}
                  </div>
                  {res.client_telephone && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                        <Phone size={10} /> {res.client_telephone}
                      </div>
                      <a
                        href={`https://wa.me/${res.client_telephone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${res.client_nom || ""}, suite à votre demande de réservation sur AANDILIK, je vous contacte pour confirmer les détails. Merci !`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-[10px] font-black transition-all w-fit shadow-sm shadow-green-200 hover:shadow-green-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.847L.057 23.882l6.19-1.442A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.816 9.816 0 01-5.006-1.368l-.36-.214-3.724.867.933-3.617-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-black text-slate-900">{res.startDate} → {res.endDate}</div>
                  <div className="text-xs font-black text-primary">{res.totalPrice} MAD Total</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                  {res.status === 'Pending' && (
                    <div className="flex gap-1">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-9 px-3 text-[10px] bg-orange-500 hover:bg-orange-600 border-none flex-1 font-bold"
                        onClick={() => handleUpdateStatus(res.id, 'Confirmed')}
                        loading={loadingId === res.id}
                      >
                        Valider ✓
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-9 px-2 text-[10px] flex-none"
                        onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                        loading={loadingId === res.id}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  {res.status === 'Confirmed' && (
                    <div className="flex gap-1">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-9 px-3 text-[10px] bg-blue-500 hover:bg-blue-600 border-none flex-1 font-bold"
                        onClick={() => handleUpdateStatus(res.id, 'In Progress')}
                        loading={loadingId === res.id}
                      >
                        Livrer ○
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-9 px-2 text-[10px] flex-none"
                        onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                        loading={loadingId === res.id}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  {res.status === 'In Progress' && (
                    <div className="flex gap-1">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-9 px-3 text-[10px] bg-green-500 hover:bg-green-600 border-none flex-1 font-bold"
                        onClick={() => handleUpdateStatus(res.id, 'Completed')}
                        loading={loadingId === res.id}
                      >
                        Terminer ✓
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-9 px-2 text-[10px] flex-none"
                        onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                        loading={loadingId === res.id}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                  {res.status === 'Completed' && (
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-2 bg-slate-50 rounded-xl">
                      Rental Finished
                    </div>
                  )}
                  {res.status === 'Cancelled' && (
                    <div className="flex flex-col gap-2">
                       <div className="text-[10px] font-black text-red-300 uppercase tracking-widest text-center py-2 bg-red-50/50 rounded-xl">
                        Cancelled
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 px-3 text-[10px] font-bold gap-1.5 text-orange-600 border-orange-100 bg-orange-50 hover:bg-orange-100"
                        onClick={() => handleUpdateStatus(res.id, 'Pending')}
                        loading={loadingId === res.id}
                      >
                        <RotateCcw size={12} /> Restorer
                      </Button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        }) : (
          <TableRow>
            <TableCell colSpan={6} className="h-40 text-center text-secondary text-sm font-bold opacity-50">
              No reservations found in this stage.
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
}
