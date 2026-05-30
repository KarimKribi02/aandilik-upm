"use client";

import { useState, useEffect } from "react";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Clock, CheckCircle, XCircle, MoreVertical, PackageSearch, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getAllTrackedReservations } from "@/lib/tracking";

export default function OwnerReservations() {
  const { reservations, equipment, users, currentUser, updateReservationStatus } = useData();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Pending");

  // Filter reservations for the current owner and active tab
  const ownerReservations = (reservations || []).filter(res => {
    const isOwner = res.ownerId === currentUser?.id;
    const matchesTab = res.status === activeTab;
    return isOwner && matchesTab;
  });

  const handleStatusChange = (id: string, newStatus: any) => {
    updateReservationStatus(id, newStatus);
    showToast(`Request updated to: ${newStatus}`, "info");
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Rental <span className="text-primary">Requests</span></h1>
        <p className="text-secondary text-sm">Manage incoming inquiries and active contracts for your fleet.</p>
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
                {tab}
              </button>
            ))}
          </div>

          {ownerReservations.length > 0 ? (
            <Table headers={["Asset", "Track ID", "Renter", "Timeline", "Revenue", "Actions"]}>
              {ownerReservations.map((res) => {
                const eq = equipment.find(e => e.id === res.equipmentId);
                const renter = users.find(u => u.id === res.renterId);

                // Try to find tracking code from localStorage
                const allTracked = getAllTrackedReservations();
                const tracked = Object.values(allTracked).find(t => 
                  t.clientEmail === res.client_email || t.clientNom === renter?.name
                );

                return (
                  <TableRow key={res.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                          <img src={eq?.image} alt={eq?.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-sm tracking-tight">{eq?.name}</div>
                      </div>
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
                      <div className="font-bold text-sm">{renter?.name}</div>
                      <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{renter?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Clock size={14} className="text-primary" /> {res.startDate} — {res.endDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">${res.totalPrice}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {res.status === "Pending" && (
                          <div className="flex gap-1.5">
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="h-8 px-3 text-[10px] bg-green-500 hover:bg-green-600 border-none flex-1"
                              onClick={() => handleStatusChange(res.id, "Confirmed")}
                            >
                              Accepter
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-8 px-3 text-[10px] bg-red-50 text-red-600 border-red-100 flex-1"
                              onClick={() => handleStatusChange(res.id, "Rejected")}
                            >
                              Rejeter
                            </Button>
                          </div>
                        )}
                        {res.status === "Confirmed" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-8 px-4 text-[10px] bg-blue-500 hover:bg-blue-600 border-none w-full"
                            onClick={() => handleStatusChange(res.id, "Completed")}
                          >
                            Clôturer
                          </Button>
                        )}
                        {res.status === "Completed" && (
                          <div className="text-[10px] font-bold text-slate-400 italic text-center w-full">
                            Terminé
                          </div>
                        )}
                        <Button variant="tertiary" size="sm" className="hidden"><MoreVertical size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
              <PackageSearch size={48} className="text-secondary/20 mb-4" />
              <h4 className="font-bold text-lg mb-1">No {activeTab.toLowerCase()} requests</h4>
              <p className="text-secondary text-xs">When clients rent your machines, they will appear here.</p>
            </div>
          )}
        </div>

        <div className="xl:col-span-4 flex flex-col gap-8">
          <h3 className="font-bold text-xl">Operational Insights</h3>
          <Card variant="low" className="p-8 border-2 border-surface-container bg-surface-low/30">
            <h4 className="font-bold text-sm mb-4">Request Volume</h4>
            <div className="flex flex-col gap-6">
              {[
                { label: "Approval Rate", val: "94%", color: "bg-green-500" },
                { label: "Avg Response Time", val: "2.4h", color: "bg-blue-500" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-black">{stat.val}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={stat.color + " h-full w-[80%]"} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="flex flex-col gap-4 p-8 bg-surface-container-high rounded-3xl">
            <h4 className="font-bold text-sm">Need Help?</h4>
            <p className="text-secondary text-xs leading-relaxed">Our support team is available 24/7 to help resolve disputes or logistic issues.</p>
            <Button variant="secondary" size="sm" className="w-full">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
