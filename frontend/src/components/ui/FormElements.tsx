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

import { Upload, X, ImageIcon } from "lucide-react";

export const TextArea = ({ label, error, className, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">{label}</label>
    <textarea
      {...props}
      className="p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm transition-all min-h-[120px] resize-none"
    />
  </div>
);

export const FileUploader = ({ label, value, onChange }: { label: string; value?: string; onChange: (base64: string) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">{label}</label>
      <div className="relative group">
        {value ? (
          <div className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-surface-container">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-48 w-full rounded-2xl border-2 border-dashed border-surface-container bg-surface-low hover:bg-surface-low/50 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-secondary group-hover:text-primary transition-colors">
              <div className="p-3 bg-surface-container rounded-xl">
                <Upload size={24} />
              </div>
              <span className="text-xs font-bold">Click to upload fleet image</span>
              <span className="text-[10px] opacity-50 uppercase tracking-tighter">JPG, PNG up to 5MB</span>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};
