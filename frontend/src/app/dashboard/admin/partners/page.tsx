"use client";

import { useState, useRef } from "react";
import { useData } from "@/context/DataProvider";
import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  Handshake,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnersManagement() {
  const { partners, addPartner, deletePartner } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");
  const [logoPreview, setLogoPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", logo: "" });

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setForm(p => ({ ...p, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setIsAdding(false);
    setLogoPreview("");
    setLogoMode("upload");
    setForm({ name: "", logo: "" });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPartner(form);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/admin" className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Operations
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Partners <span className="text-primary">Management</span></h1>
          <p className="text-secondary text-sm">Add and remove partners displayed in the homepage marquee.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2 bg-primary text-white shadow-xl shadow-primary/20">
          <Plus size={20} /> Add Partner
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <Card variant="lowest" className="p-8 border border-primary/20 bg-primary/5">
              <form onSubmit={handleAdd} className="flex flex-col gap-8">

                {/* Logo Upload */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary">Partner Logo</label>
                    <div className="flex rounded-xl overflow-hidden border border-surface-container">
                      <button type="button" onClick={() => setLogoMode("upload")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors ${logoMode === "upload" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-surface-low"}`}>
                        <Upload size={13} /> Upload File
                      </button>
                      <button type="button" onClick={() => setLogoMode("url")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors ${logoMode === "url" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-surface-low"}`}>
                        <LinkIcon size={13} /> Image URL
                      </button>
                    </div>
                  </div>

                  {logoMode === "upload" ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
                      className={`relative h-36 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-surface-container bg-white hover:border-primary/50 hover:bg-primary/5"}`}
                    >
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4" />
                          <button type="button"
                            onClick={e => { e.stopPropagation(); setLogoPreview(""); setForm(p => ({...p, logo: ""})); }}
                            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors shadow-lg">
                            <X size={14} className="text-gray-700" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-secondary">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <ImageIcon size={20} className="text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm text-foreground">Drag & drop logo here</p>
                            <p className="text-xs mt-1">or <span className="text-primary font-bold">click to browse</span></p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input value={form.logo}
                        onChange={e => { setForm(p => ({...p, logo: e.target.value})); setLogoPreview(e.target.value); }}
                        placeholder="https://example.com/logo.png"
                        className="w-full h-12 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-bold" />
                      {logoPreview && (
                        <div className="h-24 rounded-2xl bg-surface-low flex items-center justify-center p-3">
                          <img src={logoPreview} alt="Preview" className="max-h-full max-w-full object-contain"
                            onError={() => setLogoPreview("")} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Partner Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-secondary">Partner Name</label>
                  <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                    placeholder="e.g. KOMATSU"
                    className="w-full h-12 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-bold" />
                  <p className="text-[11px] text-secondary">If no logo is uploaded, the name will be displayed as bold text in the slider.</p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="tertiary" onClick={handleReset}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white px-12">Add Partner</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partners Table */}
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Handshake className="text-primary" size={24} /> Active Partners ({partners.length})
        </h3>

        <Table headers={["Logo", "Partner Name", "Actions"]}>
          {partners.length > 0 ? partners.map(partner => (
            <TableRow key={partner.id}>
              <TableCell>
                <div className="w-20 h-12 rounded-lg bg-surface-low flex items-center justify-center overflow-hidden border border-surface-container">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="max-h-10 max-w-full object-contain p-1" />
                  ) : (
                    <span className="text-xs font-black text-gray-400 tracking-tight">{partner.name.slice(0,3)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-black text-base tracking-tight">{partner.name}</span>
              </TableCell>
              <TableCell>
                <Button
                  variant="tertiary" size="sm"
                  className="p-2 text-red-500 hover:bg-red-50"
                  onClick={() => deletePartner(partner.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-20 text-secondary italic">
                No partners added yet. Click "Add Partner" above to get started.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </div>
    </div>
  );
}
