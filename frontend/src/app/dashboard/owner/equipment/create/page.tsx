"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/FormElements";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Save, Upload, Info } from "lucide-react";
import Link from "next/link";

export default function CreateEquipment() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl">
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/owner/equipment" className="flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Fleet
        </Link>
        <h1 className="text-4xl font-black tracking-tight">Add <span className="text-primary">New Asset</span></h1>
        <p className="text-secondary text-sm">Industrial induction program for your machinery fleet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Form */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <Card variant="lowest" className="p-8 border border-surface-container flex flex-col gap-6">
            <h3 className="font-bold text-lg mb-2">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Machine Name" placeholder="e.g. Caterpillar 320" />
              <Select 
                label="Category" 
                options={[
                  { label: "Earthmoving", value: "earthmoving" },
                  { label: "Lifting", value: "lifting" },
                  { label: "Concrete", value: "concrete" },
                ]} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Daily Rental Rate ($)" type="number" placeholder="450" />
              <Input label="Site Location" placeholder="Casablanca, Morocco" />
            </div>
            <TextArea label="Equipment Description" placeholder="Describe technical capabilities, maintenance history, and site requirements..." />
          </Card>

          <Card variant="lowest" className="p-8 border border-surface-container flex flex-col gap-6">
            <h3 className="font-bold text-lg mb-2">Asset Media</h3>
            <div className="border-2 border-dashed border-surface-container rounded-2xl p-12 flex flex-col items-center gap-4 hover:bg-surface-low transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-surface-low rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Upload high-resolution images</p>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-widest mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Help */}
        <div className="flex flex-col gap-8">
          <div className="p-8 bg-surface-container-high rounded-3xl flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Induction Protocol</h4>
                <p className="text-secondary text-[11px] leading-relaxed">All machinery must undergo a certified safety inspection before being listed for external rent.</p>
              </div>
            </div>
            <div className="w-full h-px bg-surface-container" />
            <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Checklist</div>
              {["Serial Number", "Insurance Docs", "Maintenance Log", "Technical Specs"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-bold text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full gap-2 font-black">
              <Save size={20} /> Register Asset
            </Button>
            <Button variant="secondary" size="lg" className="w-full font-black">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
