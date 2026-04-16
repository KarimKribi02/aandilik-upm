"use client";

import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  ArrowUpRight,
  PackageSearch
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function OwnerOverview() {
  const { equipment, reservations, currentUser } = useData();
  
  // Filter for current owner
  const myEquipment = (equipment || []).filter(e => e.ownerId === currentUser?.id);
  const myReservations = (reservations || []).filter(res => res.ownerId === currentUser?.id);

  const activeRentals = myReservations.filter(r => r.status === "Confirmed").length;
  const pendingRequests = myReservations.filter(r => r.status === "Pending").length;
  const totalRevenue = myReservations
    .filter(r => r.status === "Confirmed" || r.status === "Completed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const stats = [
    { label: "Active Rentals", value: activeRentals.toString(), icon: BarChart3, color: "text-blue-500" },
    { label: "Pending Requests", value: pendingRequests.toString(), icon: Clock, color: "text-orange-500" },
    { label: "Total Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Owner <span className="text-primary">Dashboard</span></h1>
          <p className="text-secondary">Mission control for your industrial assets.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2">
            <Settings size={18} /> Settings
          </Button>
          <Link href="/dashboard/owner/equipment">
            <Button variant="primary" className="gap-2">
              <Plus size={18} /> Add Equipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="lowest" className="p-8 border border-surface-container flex items-center justify-between">
            <div>
              <div className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="text-4xl font-black">{stat.value}</div>
            </div>
            <div className={`p-4 bg-surface-low rounded-2xl ${stat.color}`}>
              <stat.icon size={32} />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Equipment List */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <h3 className="text-2xl font-bold">Your Fleet</h3>
          <div className="flex flex-col gap-4">
            {myEquipment.length > 0 ? (
              myEquipment.slice(0, 3).map((item) => (
                <Card key={item.id} variant="lowest" className="p-6 border border-surface-container hover:cosmic-shadow transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                          <p className="text-secondary text-sm">{item.category} • {item.location.split(',')[0]}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            item.availability ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.availability ? 'Available' : 'Rented'}
                          </span>
                          <Button variant="tertiary" size="sm" className="p-2"><MoreVertical size={18} /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
                <PackageSearch size={48} className="text-secondary/20 mb-4" />
                <p className="text-secondary text-sm">No machinery listed yet.</p>
              </div>
            )}
          </div>
          <Link href="/dashboard/owner/equipment">
            <Button variant="secondary" className="w-full">View Entire Fleet</Button>
          </Link>
        </div>

        {/* Recent Reservations */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <h3 className="text-2xl font-bold">Recent Bookings</h3>
          <div className="flex flex-col gap-4">
            {myReservations.length > 0 ? (
              myReservations.slice(0, 3).map((res) => {
                const eq = equipment.find(e => e.id === res.equipmentId);
                return (
                  <Card key={res.id} variant="low" className="p-6 border border-surface-container">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`text-xs font-bold uppercase tracking-widest ${
                        res.status === 'Confirmed' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {res.status}
                      </div>
                      <div className="text-secondary text-xs uppercase font-bold">{res.startDate}</div>
                    </div>
                    <h4 className="font-bold mb-4">{eq?.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-[10px] font-bold uppercase">
                          {res.renterId.charAt(0)}
                        </div>
                      </div>
                      <Link href="/dashboard/owner/reservations">
                        <Button variant="tertiary" size="sm" className="text-xs h-8 px-2">
                          Manage <ArrowUpRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-surface-low rounded-3xl border border-dashed border-surface-container">
                <Clock size={32} className="text-secondary/20 mb-3" />
                <p className="text-secondary text-xs">No bookings found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
