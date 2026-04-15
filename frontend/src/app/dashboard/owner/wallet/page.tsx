"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  CreditCard,
  Building2,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OwnerWallet() {
  const transactions = [
    { id: "T1", type: "Rental Income", asset: "Cat 320", date: "2026-04-12", amount: 2250, status: "Cleared" },
    { id: "T2", type: "Platform Fee", asset: "Global", date: "2026-04-12", amount: -225, status: "Cleared" },
    { id: "T3", type: "Rental Income", asset: "JCB 3CX", date: "2026-04-10", amount: 1400, status: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Earnings <span className="text-primary">& Wallet</span></h1>
          <p className="text-secondary text-sm">Industrial financial overview and transaction ledger.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2"><Download size={18} /> Financial Export</Button>
          <Button className="gap-2"><CreditCard size={18} /> Withdraw Funds</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card variant="high" className="p-8 primary-gradient text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Available Balance</div>
            <div className="text-5xl font-black tracking-tighter">$14,820.00</div>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-12">
            <div className="text-xs font-medium opacity-80 flex items-center gap-1">
              <TrendingUp size={14} /> +12% from last cycle
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet size={24} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
        </Card>

        <Card variant="lowest" className="p-8 border border-surface-container flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Total Payouts</div>
            <div className="text-3xl font-black">$62,400</div>
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-8">View Payout History</Button>
        </Card>

        <Card variant="lowest" className="p-8 border border-surface-container flex flex-col justify-between bg-surface-low/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-xs font-bold">Bank Account</div>
              <div className="text-[10px] text-secondary font-medium tracking-widest">**** 4291</div>
            </div>
          </div>
          <p className="text-[11px] text-secondary leading-relaxed">Default settlement account for monthly platform payouts.</p>
          <Button variant="tertiary" size="sm" className="w-full mt-4 underline">Change Method</Button>
        </Card>
      </div>

      <div className="flex flex-col gap-8">
        <h3 className="font-bold text-xl">Transaction Ledger</h3>
        <Table headers={["Reference", "Type", "Asset Cluster", "Execution Date", "Amount", "Status"]}>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell className="font-mono text-[11px] font-bold">{t.id}</TableCell>
              <TableCell className="font-bold text-sm">{t.type}</TableCell>
              <TableCell className="text-secondary text-xs">{t.asset}</TableCell>
              <TableCell className="text-secondary text-xs">{t.date}</TableCell>
              <TableCell>
                <div className={cn("font-black text-sm flex items-center gap-1", t.amount > 0 ? "text-green-600" : "text-red-500")}>
                  {t.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  ${Math.abs(t.amount)}
                </div>
              </TableCell>
              <TableCell>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center w-fit",
                  t.status === 'Cleared' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                )}>
                  {t.status}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
}
