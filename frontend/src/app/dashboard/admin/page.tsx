"use client";

import { useData } from "@/context/DataProvider";
import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  Construction, 
  Activity, 
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const { users, equipment, transactions } = useData();

  const totalVolume = (transactions || []).reduce((acc, tx) => acc + tx.amount, 0);

  const stats = [
    { label: "Total Users", value: (users || []).length.toString(), icon: Users, color: "text-purple-500" },
    { label: "Active Fleet", value: (equipment || []).filter(e => e.status === "active").length.toString(), icon: Construction, color: "text-blue-500" },
    { label: "Pending Approvals", value: (equipment || []).filter(e => e.status === "pending").length.toString(), icon: Activity, color: "text-orange-500" },
    { label: "System Health", value: "99.9%", icon: ShieldCheck, color: "text-green-500" },
  ];

  const recentEquipment = (equipment || []).slice(-3).reverse();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">System <span className="text-primary">Operations</span></h1>
          <p className="text-secondary text-sm">Real-time oversight of the Aandilik industrial network.</p>
        </div>
        <Button variant="secondary" className="gap-2">System Diagnostics</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} variant="lowest" className="p-6 border border-surface-container flex items-center gap-6">
            <div className={`p-4 bg-surface-low rounded-2xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Fleet Validation Queue */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Fleet Validation Queue</h3>
            <Link href="/dashboard/admin/equipment" className="text-xs font-bold text-primary hover:underline">Manage All</Link>
          </div>
          
          <Table headers={["Machinery", "Owner", "Status", "Actions"]}>
            {recentEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="font-bold text-sm tracking-tight">{item.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">Owner ID: {item.ownerId}</div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="tertiary" size="sm" className="p-2"><MoreVertical size={18} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>

        {/* Global Statistics */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <h3 className="text-2xl font-bold">Network Growth</h3>
          <Card variant="high" className="p-8 primary-gradient text-white flex flex-col gap-6 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-2">
              <h4 className="font-bold text-lg">Transaction Volume</h4>
              <p className="text-white/70 text-xs">Processing ${totalVolume.toLocaleString()} in active industrial contracts this month.</p>
              <Link href="/dashboard/admin/transactions">
                <Button variant="glass" className="mt-4 w-full justify-between group">
                  Financial Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white opacity-10" />
          </Card>

          <div className="p-8 bg-surface-low rounded-3xl border border-surface-container">
            <h4 className="font-bold text-sm mb-4">Security Overview</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Identity Verified</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[100%]" />
              </div>
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-secondary">Risk Analysis</span>
                <span className="font-bold text-blue-600">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
