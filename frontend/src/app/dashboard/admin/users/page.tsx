"use client";

import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { users } from "@/data/mockData";
import { MoreHorizontal, ShieldOff, ShieldCheck, Mail, Search } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">User <span className="text-primary">Control</span></h1>
          <p className="text-secondary text-sm">Manage global account access and platform permissions.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search by ID or email..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <Table headers={["User Profile", "System Role", "Joining Date", "Status", "Actions"]}>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">{user.name}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    <Mail size={10} /> {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-surface-container text-secondary'
              }`}>
                {user.role}
              </span>
            </TableCell>
            <TableCell>
              <div className="text-xs text-secondary font-medium">Oct 12, 2025</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Active
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 p-2 border-red-100">
                  <ShieldOff size={18} />
                </Button>
                <Button variant="tertiary" size="sm" className="p-2"><MoreHorizontal size={18} /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Card variant="low" className="p-8 border border-surface-container bg-surface-low/30 mt-auto">
        <h4 className="font-bold text-sm mb-4">Account Policy Update</h4>
        <p className="text-secondary text-xs leading-relaxed max-w-2xl">
          Suspension actions are permanent until manually reviewed by a Senior Administrator. 
          Please ensure all relevant activity logs are verified before modifying platform access.
        </p>
      </Card>
    </div>
  );
}
