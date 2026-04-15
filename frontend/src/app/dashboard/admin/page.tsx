"use client";

import { Card } from "@/components/ui/Card";
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  ArrowUpRight,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminOverview() {
  const stats = [
    { label: "Active Users", value: "1,280", icon: Users, color: "text-blue-500", trend: "+8%" },
    { label: "Fleet Size", value: "452", icon: ShieldCheck, color: "text-green-500", trend: "+15%" },
    { label: "System Health", value: "99.8%", icon: Activity, color: "text-primary", trend: "0%" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Ops <span className="text-primary">Command</span></h1>
        <p className="text-secondary text-sm">Global platform health and administrative mission control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="lowest" className="p-8 border border-surface-container flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <ArrowUpRight size={12} /> {stat.trend} week-over-week
              </div>
            </div>
            <div className={`p-4 bg-surface-low rounded-2xl ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Network Monitor */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Operational Traffic</h3>
            <span className="text-xs font-bold text-green-600 animate-pulse flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> Live Updates
            </span>
          </div>
          <Card variant="low" className="h-96 border-2 border-surface-container bg-surface-low/30 relative flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center p-12">
              <Monitor size={64} className="text-primary opacity-20" />
              <p className="text-secondary text-xs uppercase tracking-[0.3em] font-black">Connecting to Datastream Cluster...</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </Card>
        </div>

        {/* Critical Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="font-bold text-xl">Maintenance Alerts</h3>
          <div className="flex flex-col gap-4">
            <Card variant="lowest" className="p-6 border border-orange-100 bg-orange-50/50 flex gap-4">
              <AlertTriangle className="text-orange-600 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm text-orange-900">Validation Queue Backlog</h4>
                <p className="text-[11px] text-orange-700 leading-relaxed mt-1">12 new equipment listings from "Elite Rentals" are awaiting structural validation.</p>
              </div>
            </Card>
            <Card variant="lowest" className="p-6 border border-blue-100 bg-blue-50/50 flex gap-4">
              <ShieldCheck className="text-blue-600 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm text-blue-900">Platform Security</h4>
                <p className="text-[11px] text-blue-700 leading-relaxed mt-1">New IP range detected in administrative access logs. Verification required.</p>
              </div>
            </Card>
          </div>
          <Button variant="secondary" size="lg" className="w-full text-xs font-black tracking-widest uppercase">System Audit Logger</Button>
        </div>
      </div>
    </div>
  );
}
