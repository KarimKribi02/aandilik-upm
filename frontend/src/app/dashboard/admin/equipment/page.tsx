"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { equipmentList } from "@/data/mockData";
import { ShieldCheck, XCircle, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminEquipment() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Fleet <span className="text-primary">Validation</span></h1>
        <p className="text-secondary text-sm">Review and certify industrial assets for platform listing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
        {[
          { label: "Pending Review", value: "12", color: "bg-surface-low text-primary" },
          { label: "Certified Site", value: "452", color: "bg-green-50 text-green-700" },
          { label: "Rejected Drafts", value: "3", color: "bg-red-50 text-red-700" },
        ].map(stat => (
          <div key={stat.label} className={`p-6 rounded-2xl ${stat.color} flex flex-col gap-1`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</div>
            <div className="text-2xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <Table headers={["Machinery Unit", "Owner Identity", "Submission Date", "Risk Level", "Actions"]}>
        {equipmentList.map((item) => (
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
              <div className="font-bold text-sm tracking-tight text-foreground">Karim Rentals Inc.</div>
            </TableCell>
            <TableCell>
              <div className="text-xs text-secondary font-medium">Apr 12, 2026</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Standard
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="bg-green-50 text-green-700 hover:bg-green-100 p-2 border-green-100">
                  <ShieldCheck size={18} />
                </Button>
                <Button variant="secondary" size="sm" className="bg-red-50 text-red-700 hover:bg-red-100 p-2 border-red-100">
                  <XCircle size={18} />
                </Button>
                <Link href={`/equipment/${item.id}`} target="_blank">
                  <Button variant="tertiary" size="sm" className="p-2"><ExternalLink size={18} /></Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

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
