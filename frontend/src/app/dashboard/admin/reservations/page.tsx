"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { reservations, equipmentList, users } from "@/data/mockData";
import { History, TrendingUp, AlertCircle, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminReservations() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Global <span className="text-primary">Monitoring</span></h1>
          <p className="text-secondary text-sm">Real-time supervision of all platform rental contracts.</p>
        </div>
        <Button variant="secondary" className="gap-2"><FileSearch size={18} /> Deep Audit</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {[
          { label: "Active Contracts", value: "84", icon: History },
          { label: "Avg Duration", value: "14 Days", icon: TrendingUp },
          { label: "Disputed", value: "0", icon: AlertCircle },
        ].map(stat => (
          <Card key={stat.label} variant="lowest" className="p-6 border border-surface-container flex items-center gap-4">
            <div className="p-3 bg-surface-low rounded-xl text-primary">
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary">{stat.label}</div>
              <div className="text-xl font-black">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Table headers={["Ref ID", "Equipment", "Contract Participants", "Duration", "Status"]}>
        {reservations.map((res) => {
          const eq = equipmentList.find(e => e.id === res.equipmentId);
          const renter = users.find(u => u.id === res.renterId);
          return (
            <TableRow key={res.id}>
              <TableCell className="font-mono text-[10px] font-bold text-primary">{res.id}</TableCell>
              <TableCell>
                <div className="text-sm font-bold">{eq?.name}</div>
                <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{eq?.category}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-bold text-foreground">Renter: {renter?.name}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">Owner: Karim Rentals</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs font-medium">{res.startDate} — {res.endDate}</div>
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {res.status}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
}
