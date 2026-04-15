"use client";

import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  CreditCard, 
  PieChart,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminTransactions() {
  const transactions = [
    { id: "TX-4521", type: "Booking #821", part: "BuildingCorp → Karim", date: "2026-04-12", amount: 2250, fee: 225, status: "Settled" },
    { id: "TX-4520", type: "Booking #819", part: "MarocBuild → Atlas", date: "2026-04-11", amount: 1400, fee: 140, status: "Settled" },
    { id: "TX-4519", type: "Booking #818", part: "SiteTools → Karim", date: "2026-04-10", amount: 850, fee: 85, status: "Processing" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Platform <span className="text-primary">Financials</span></h1>
          <p className="text-secondary text-sm">Monitor global cash flow and platform revenue streams.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2"><Filter size={18} /> Filters</Button>
          <Button className="gap-2"><Download size={18} /> Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card variant="high" className="p-8 primary-gradient text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Platform Volume (MTD)</div>
            <div className="text-5xl font-black tracking-tighter text-balance">$284,520.00</div>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-12">
            <div className="text-xs font-medium opacity-80 flex items-center gap-1">
              <TrendingUp size={14} /> +24% from March
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
        </Card>

        <Card variant="lowest" className="p-8 border border-surface-container flex flex-col justify-between bg-surface-low/30">
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Fee Revenue (10%)</div>
            <div className="text-3xl font-black text-primary">$28,452</div>
          </div>
          <div className="flex items-center gap-2 mt-8 text-[10px] font-bold text-green-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> Verified Cleared
          </div>
        </Card>

        <Card variant="lowest" className="p-8 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
              <PieChart size={24} />
            </div>
            <div>
              <div className="text-xs font-bold">Payout Status</div>
              <div className="text-[10px] text-secondary font-medium tracking-widest">Settlement Engine Active</div>
            </div>
          </div>
          <p className="text-[11px] text-secondary leading-relaxed">Automatic payouts are scheduled for the 15th of each month for all cleared transactions.</p>
          <Button variant="tertiary" size="sm" className="w-full mt-4 underline">Configure Gateway</Button>
        </Card>
      </div>

      <Table headers={["TX ID", "Source/Type", "Counterparties", "Execution", "Amount", "Platform Fee", "Status"]}>
        {transactions.map(tx => (
          <TableRow key={tx.id}>
            <TableCell className="font-mono text-[10px] font-bold text-secondary">{tx.id}</TableCell>
            <TableCell className="font-bold text-sm tracking-tight">{tx.type}</TableCell>
            <TableCell className="text-secondary text-[10px] font-bold uppercase tracking-widest">{tx.part}</TableCell>
            <TableCell className="text-secondary text-xs">{tx.date}</TableCell>
            <TableCell className="font-black text-sm text-foreground">${tx.amount}</TableCell>
            <TableCell className="font-black text-sm text-primary">+${tx.fee}</TableCell>
            <TableCell>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit",
                tx.status === 'Settled' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              )}>
                {tx.status}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
