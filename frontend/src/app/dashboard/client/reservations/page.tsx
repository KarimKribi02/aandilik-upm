"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { reservations, equipmentList } from "@/data/mockData";
import { Calendar, MoreHorizontal, FileText } from "lucide-react";

export default function ClientReservations() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">My <span className="text-primary">Reservations</span></h1>
          <p className="text-secondary text-sm">Review status and logistics for your active machinery.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2"><FileText size={18} /> Export History</Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> Active & Upcoming
        </h3>
        <Table headers={["Equipment", "Rental Period", "Daily Rate", "Status", "Actions"]}>
          {reservations.map((res) => {
            const eq = equipmentList.find(e => e.id === res.equipmentId);
            return (
              <TableRow key={res.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                      <img src={eq?.image} alt={eq?.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold">{eq?.name}</div>
                      <div className="text-[10px] text-secondary uppercase tracking-widest">{eq?.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{res.startDate} — {res.endDate}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">8 Days Left</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold">${eq?.pricePerDay}</div>
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {res.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Modify</Button>
                    <Button variant="tertiary" size="sm" className="p-2"><MoreHorizontal size={18} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </div>

      {/* Logistics Support */}
      <Card variant="low" className="p-10 flex flex-col md:flex-row gap-8 items-center justify-between border-2 border-surface-container bg-surface-low/50">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <Calendar size={32} />
          </div>
          <div>
            <h4 className="font-bold text-xl leading-tight">Delivery Tracking</h4>
            <p className="text-secondary text-sm">Logistics confirmed for JCB 3CX installation at Route 9.</p>
          </div>
        </div>
        <Button variant="primary">Access Tracking Hub</Button>
      </Card>
    </div>
  );
}
