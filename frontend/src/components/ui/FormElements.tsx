"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
}

export const Input = ({ label, error, className, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">{label}</label>
    <input
      {...props}
      className="h-12 px-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm transition-all placeholder:text-secondary/50"
    />
    {error && <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>}
  </div>
);

export const Select = ({ label, error, className, options, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { label: string; value: string }[] }) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">{label}</label>
    <select
      {...props}
      className="h-12 px-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm transition-all appearance-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const TextArea = ({ label, error, className, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">{label}</label>
    <textarea
      {...props}
      className="p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm transition-all min-h-[120px] resize-none"
    />
  </div>
);
