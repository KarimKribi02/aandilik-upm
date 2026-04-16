"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Package, 
  Calendar, 
  Clock, 
  TrendingUp,
  ArrowRight,
  PackageSearch
} from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataProvider";

export default function ClientOverview() {
  const { reservations, equipment, currentUser } = useData();

  // Filter reservations for the current client
  const myReservations = (reservations || []).filter(res => res.renterId === currentUser?.id);
  
  const activeCount = myReservations.filter(r => r.status === "Confirmed").length;
  const pendingCount = myReservations.filter(r => r.status === "Pending").length;
  const completedCount = myReservations.filter(r => r.status === "Completed").length;

  const stats = [
    { label: "Active Rentals", value: activeCount.toString(), icon: Package, color: "text-blue-500" },
    { label: "Completed", value: completedCount.toString(), icon: Calendar, color: "text-green-500" },
    { label: "Pending Approval", value: pendingCount.toString(), icon: Clock, color: "text-orange-500" },
  ];

  const recentReservations = myReservations.slice(0, 2);

  return (
    <div className="flex flex-col gap-12">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Bonjour, <span className="text-primary">{currentUser?.name.split(' ')[0] || "Client"}</span></h1>
        <p className="text-secondary text-sm">Industrial status overview for your active project sites.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="lowest" className="p-8 flex items-center justify-between border border-surface-container">
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black">{stat.value}</div>
            </div>
            <div className={`p-4 bg-surface-low rounded-2xl ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Machinery */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Recent Activity</h3>
            <Link href="/dashboard/client/reservations" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentReservations.length > 0 ? (
              recentReservations.map((res) => {
                const item = equipment.find(e => e.id === res.equipmentId);
                return (
                  <Card key={res.id} variant="lowest" className="p-6 flex items-center gap-6 border border-surface-container hover:cosmic-shadow transition-all group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                      <img src={item?.image} alt={item?.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{item?.name}</h4>
                      <p className="text-xs text-secondary">{item?.location} • {res.status === 'Confirmed' ? 'Return in 4 days' : 'Awaiting confirmation'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 px-2">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        res.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' : 
                        res.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-surface-low text-secondary'
                      }`}>
                        {res.status}
                      </span>
                      <Link href={`/equipment/${item?.id}`}>
                        <Button variant="tertiary" size="sm" className="text-[10px] h-8">Full Specs</Button>
                      </Link>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-surface-low rounded-3xl border border-dashed border-surface-container">
                <PackageSearch size={32} className="text-secondary/20 mb-3" />
                <p className="text-secondary text-xs">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Recommendations */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="font-bold text-xl">Quick Actions</h3>
          <Card variant="high" className="p-8 primary-gradient text-white flex flex-col gap-6 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-2">
              <h4 className="font-bold text-lg">Extend Rentals</h4>
              <p className="text-white/70 text-xs">Need more time for site preparation? Application for extension takes seconds.</p>
              <Button variant="glass" className="mt-4 w-full justify-between group">
                Apply Extension <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white opacity-10 group-hover:rotate-12 transition-transform" />
          </Card>
          
          <div className="p-8 bg-surface-low rounded-3xl border border-surface-container flex flex-col gap-4">
            <h4 className="font-bold text-sm">Need a specialized tool?</h4>
            <p className="text-secondary text-xs leading-relaxed">Browse our verified catalog of technical equipment ready for deployment.</p>
            <Link href="/equipment">
              <Button variant="secondary" className="w-full text-xs h-10">Return to Catalog</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
