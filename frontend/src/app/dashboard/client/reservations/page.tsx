"use client";

import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useData } from "@/context/DataProvider";
import { Calendar, MoreHorizontal, FileText, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function ClientReservations() {
  const { reservations, equipment, currentUser } = useData();

  // Filter reservations for the current client
  const myReservations = (reservations || []).filter(res => res.renterId === currentUser?.id);

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
        {myReservations.length > 0 ? (
          <Table headers={["Equipment", "Rental Period", "Daily Rate", "Status", "Actions"]}>
            {myReservations.map((res) => {
              const eq = equipment.find(e => e.id === res.equipmentId);
              const statusColors: any = {
                Pending: "bg-orange-100 text-orange-700",
                Confirmed: "bg-green-100 text-green-700",
                Cancelled: "bg-red-100 text-red-700",
                Completed: "bg-blue-100 text-blue-700",
                Rejected: "bg-gray-100 text-gray-700"
              };

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
                    <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">
                      {Math.max(0, Math.ceil((new Date(res.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days Left
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">${eq?.pricePerDay}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[res.status] || "bg-surface-low"}`}>
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
            <PackageSearch size={48} className="text-secondary/20 mb-4" />
            <h4 className="font-bold text-lg mb-1">No reservations found</h4>
            <p className="text-secondary text-xs mb-6">You haven't rented any industrial machinery yet.</p>
            <Link href="/equipment">
              <Button size="sm">Explore Equipment Catalog</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Logistics Support */}
      <Card variant="low" className="p-10 flex flex-col md:flex-row gap-8 items-center justify-between border-2 border-surface-container bg-surface-low/50">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <Calendar size={32} />
          </div>
          <div>
            <h4 className="font-bold text-xl leading-tight">Delivery Tracking</h4>
            <p className="text-secondary text-sm">Real-time GPS tracking for your scheduled machinery deployments.</p>
          </div>
        </div>
        <Button variant="primary">Access Tracking Hub</Button>
      </Card>
    </div>
  );
}
