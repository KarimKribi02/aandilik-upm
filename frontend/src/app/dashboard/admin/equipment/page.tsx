"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, XCircle, Info, ExternalLink, PackageSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminEquipment() {
  const { equipment, users, updateEquipment } = useData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<"pending" | "active" | "rejected">("pending");

  const filteredEquipment = (equipment || []).filter(item => item.status === filter);

  const handleStatusChange = (id: string, newStatus: "active" | "rejected") => {
    updateEquipment(id, { status: newStatus });
    showToast(`Asset status updated to: ${newStatus}`, "info");
  };

  const pendingCount = (equipment || []).filter(e => e.status === "pending").length;
  const activeCount = (equipment || []).filter(e => e.status === "active").length;
  const rejectedCount = (equipment || []).filter(e => e.status === "rejected").length;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Fleet <span className="text-primary">Validation</span></h1>
        <p className="text-secondary text-sm">Review and certify industrial assets for platform listing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
        <button onClick={() => setFilter("pending")} className={`p-6 rounded-2xl flex flex-col gap-1 text-left transition-all ${filter === "pending" ? "bg-primary text-white cosmic-shadow" : "bg-surface-low text-primary"}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Pending Review</div>
          <div className="text-2xl font-black">{pendingCount}</div>
        </button>
        <button onClick={() => setFilter("active")} className={`p-6 rounded-2xl flex flex-col gap-1 text-left transition-all ${filter === "active" ? "bg-green-100 text-green-700 cosmic-shadow" : "bg-green-50 text-green-700"}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Certified Site</div>
          <div className="text-2xl font-black">{activeCount}</div>
        </button>
        <button onClick={() => setFilter("rejected")} className={`p-6 rounded-2xl flex flex-col gap-1 text-left transition-all ${filter === "rejected" ? "bg-red-100 text-red-700 cosmic-shadow" : "bg-red-50 text-red-700"}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Rejected Drafts</div>
          <div className="text-2xl font-black">{rejectedCount}</div>
        </button>
      </div>

      {filteredEquipment.length > 0 ? (
        <Table headers={["Machinery Unit", "Owner Identity", "Status", "Risk Level", "Actions"]}>
          {filteredEquipment.map((item) => {
            const owner = users.find(u => u.id === item.ownerId);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{item.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-sm tracking-tight text-foreground">{owner?.name || "Corporate Partner"}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{owner?.email}</div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Standard
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-green-50 text-green-700 hover:bg-green-100 p-2 border-green-100"
                          onClick={() => handleStatusChange(item.id, "active")}
                        >
                          <ShieldCheck size={18} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-red-50 text-red-700 hover:bg-red-100 p-2 border-red-100"
                          onClick={() => handleStatusChange(item.id, "rejected")}
                        >
                          <XCircle size={18} />
                        </Button>
                      </>
                    )}
                    <Link href={`/equipment/${item.id}`} target="_blank">
                      <Button variant="tertiary" size="sm" className="p-2"><ExternalLink size={18} /></Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
          <PackageSearch size={48} className="text-secondary/20 mb-4" />
          <h4 className="font-bold text-lg mb-1">No equipment in "{filter}"</h4>
          <p className="text-secondary text-xs">All machinery in this category has been processed.</p>
        </div>
      )}

      <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
          <Info size={40} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-2">Protocol Reminder</h4>
          <p className="text-secondary text-sm leading-relaxed">
            Every listing must be verified against the official "Safety & Integrity Standard v4". 
            Failure to check serial numbers against the global blacklist results in immediate account flagging.
          </p>
        </div>
        <Button variant="primary">Download Protocol</Button>
      </div>
    </div>
  );
}
