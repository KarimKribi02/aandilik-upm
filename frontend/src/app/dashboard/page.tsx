"use client";

import { equipmentList, reservations } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ArrowUpRight
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const stats = [
    { label: "Active Rentals", value: "12", icon: BarChart3, color: "text-blue-500" },
    { label: "Pending Requests", value: "3", icon: Clock, color: "text-orange-500" },
    { label: "Total Revenue", value: "$42.5k", icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="container mx-auto px-6 max-w-7xl pb-32">
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
            <Button variant="primary" className="gap-2">
              <Plus size={18} /> Add Equipment
            </Button>
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
              {equipmentList.slice(0, 3).map((item) => (
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
              ))}
            </div>
            <Button variant="secondary" className="w-full">View Entire Fleet</Button>
          </div>

          {/* Recent Reservations */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <h3 className="text-2xl font-bold">Recent Bookings</h3>
            <div className="flex flex-col gap-4">
              {reservations.map((res) => {
                const eq = equipmentList.find(e => e.id === res.equipmentId);
                return (
                  <Card key={res.id} variant="low" className="p-6 border border-surface-container">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xs font-bold text-primary uppercase tracking-widest">
                        {res.status}
                      </div>
                      <div className="text-secondary text-xs uppercase font-bold">{res.startDate}</div>
                    </div>
                    <h4 className="font-bold mb-4">{eq?.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-[10px] font-bold">AZ</div>
                      </div>
                      <Button variant="tertiary" size="sm" className="text-xs h-8 px-2">
                        Details <ArrowUpRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
