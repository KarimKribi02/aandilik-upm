"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  UserCheck,
  Plus,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { equipmentList } from "@/data/mockData";

export default function OwnerOverview() {
  const stats = [
    { label: "Active Revenue", value: "$12,450", icon: BarChart3, color: "text-green-500", trend: "+12%" },
    { label: "Fleet Utilization", value: "84%", icon: TrendingUp, color: "text-blue-500", trend: "+5%" },
    { label: "Awaiting Approval", value: "3", icon: Clock, color: "text-orange-500", trend: "0%" },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Bonjour, <span className="text-primary">Karim</span></h1>
          <p className="text-secondary text-sm">Your industrial fleet is currently operating at high efficiency.</p>
        </div>
        <Link href="/dashboard/owner/equipment/create">
          <Button className="gap-2 shadow-lg hover:cosmic-shadow transition-all">
            <Plus size={18} /> Add New Asset
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="lowest" className="p-8 flex items-center justify-between border border-surface-container">
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <ArrowUpRight size={12} /> {stat.trend} from last month
              </div>
            </div>
            <div className={`p-4 bg-surface-low rounded-2xl ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="font-bold text-xl">Revenue Trajectory</h3>
          <Card variant="low" className="h-80 border-2 border-surface-container bg-surface-low/30 relative flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <BarChart3 size={48} className="text-primary opacity-20" />
              <p className="text-secondary text-xs uppercase tracking-widest font-bold">Analytics Engine Synchronizing...</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="font-bold text-xl">Recent Inquiries</h3>
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <Card key={i} variant="lowest" className="p-6 border border-surface-container">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center text-primary">
                    <UserCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase">2h ago</span>
                </div>
                <h4 className="font-bold text-sm mb-1">New Request for Cat 320</h4>
                <p className="text-xs text-secondary leading-relaxed mb-4">BuildingCorp Marrakech requested a 15-day rental.</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 text-[10px]">Approve</Button>
                  <Button variant="tertiary" size="sm" className="flex-1 text-[10px]">Details</Button>
                </div>
              </Card>
            ))}
          </div>
          <Link href="/dashboard/owner/reservations">
            <Button variant="tertiary" className="w-full text-xs underline">Manage All Requests</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
