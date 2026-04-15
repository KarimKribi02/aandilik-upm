"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { equipmentList } from "@/data/mockData";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function OwnerEquipment() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Manage <span className="text-primary">Fleet</span></h1>
          <p className="text-secondary text-sm">Control your industrial assets and availability status.</p>
        </div>
        <Link href="/dashboard/owner/equipment/create">
          <Button className="gap-2 shadow-lg hover:cosmic-shadow transition-all">
            <Plus size={18} /> List New Equipment
          </Button>
        </Link>
      </div>

      <Table headers={["Asset", "Daily Rate", "Status", "Performance", "Actions"]}>
        {equipmentList.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-[10px] text-secondary uppercase tracking-widest">{item.category}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-bold">${item.pricePerDay}</div>
            </TableCell>
            <TableCell>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                item.availability ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {item.availability ? 'Active' : 'Rented'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-bold text-foreground">92% Up-time</div>
                <div className="w-24 h-1 bg-surface-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%]" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/dashboard/owner/equipment/edit/${item.id}`}>
                  <Button variant="tertiary" size="sm" className="p-2"><Edit3 size={18} /></Button>
                </Link>
                <Button variant="tertiary" size="sm" className="p-2 text-red-500 hover:bg-red-50"><Trash2 size={18} /></Button>
                <Button variant="tertiary" size="sm" className="p-2"><Eye size={18} /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
