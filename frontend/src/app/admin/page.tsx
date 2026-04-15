"use client";

import { equipmentList, users } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Hammer
} from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="container mx-auto px-6 max-w-7xl pb-32">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">Command <span className="text-primary">Center</span></h1>
            <p className="text-secondary">Global platform administration and equipment validation.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="System search..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-foreground text-sm"
            />
          </div>
        </div>

        {/* Global Overview Tabs */}
        <div className="flex gap-4 border-b border-surface-container pb-4 overflow-x-auto">
          {["User Management", "Equipment Validation", "Logistics Control", "Revenue Analytics"].map((tab, i) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                i === 0 ? "bg-primary text-white" : "text-secondary hover:bg-surface-low"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: Tables */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* User List Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="text-primary" /> Active Users
                </h3>
                <Button variant="secondary" size="sm">Export CSV</Button>
              </div>
              <Card variant="lowest" className="border border-surface-container overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-low border-b border-surface-container">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">User</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Role</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-surface-container last:border-none hover:bg-surface-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-primary">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{user.name}</div>
                              <div className="text-secondary text-xs flex items-center gap-1">
                                <Mail size={10} /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-surface-container text-secondary'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" /> Active
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="tertiary" size="sm" className="p-2"><MoreHorizontal size={18} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* Equipment Validation Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-primary" /> Validation Queue
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipmentList.slice(0, 2).map((item) => (
                  <Card key={item.id} variant="lowest" className="p-6 border border-surface-container">
                    <div className="flex gap-4 mb-6">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                        <p className="text-secondary text-xs">{item.location.split(',')[0]} • New Listing</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="primary" className="flex-1 py-2 text-xs">Approve</Button>
                      <Button variant="secondary" className="flex-1 py-2 text-xs">Reject</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar / Insights */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Card variant="high" className="p-8 text-white primary-gradient relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Platform Health</h3>
                <div className="text-4xl font-black mb-6">99.8%</div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-80">Up-time</span>
                    <span className="font-bold">24h Stable</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[99.8%]" />
                  </div>
                </div>
              </div>
              <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
            </Card>

            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-lg">System Alerts</h4>
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-4">
                  <AlertTriangle className="text-orange-600 shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-bold text-orange-900">3 Inspection Overdue</div>
                    <div className="text-xs text-orange-700">Maintenance cycle required for Crane fleet in Casablanca.</div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                  <Mail className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-bold text-blue-900">5 New Applications</div>
                    <div className="text-xs text-blue-700">New owner applications awaiting identity verification.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
