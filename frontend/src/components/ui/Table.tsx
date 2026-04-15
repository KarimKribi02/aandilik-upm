"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export const Table = ({ headers, children, className }: TableProps) => {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-surface-container", className)}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-low border-b border-surface-container">
          <tr>
            {headers.map((header) => (
              <th 
                key={header} 
                className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tr className={cn("hover:bg-surface-low/50 transition-colors group", className)}>
    {children}
  </tr>
);

export const TableCell = ({ children, className }: { children: ReactNode; className?: string }) => (
  <td className={cn("px-6 py-4 text-sm align-middle", className)}>
    {children}
  </td>
);
