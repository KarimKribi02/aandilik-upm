"use client";

import { use, useState } from "react";
import { equipmentList } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  ArrowRight,
  Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const equipment = equipmentList.find((e) => e.id === id);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 max-w-7xl pb-32">
      <Link 
        href="/equipment" 
        className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Content */}
        <div className="lg:col-span-7 flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-primary font-bold tracking-widest text-xs uppercase">
              <Zap size={14} /> High-Performance Fleet
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              {equipment.name}
            </h1>
            <div className="flex flex-wrap gap-6 text-secondary">
              <span className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={18} className="text-primary" /> {equipment.location}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck size={18} className="text-primary" /> Certified Inspection
              </span>
            </div>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden cosmic-shadow bg-surface-container">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-bold border-b border-surface-container pb-4">Structural Specification</h3>
            <p className="text-secondary leading-relaxed">
              {equipment.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(equipment.specs).map(([key, value]) => (
                <Card key={key} variant="low" className="p-6">
                  <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">{key}</div>
                  <div className="text-lg font-black">{value}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-high rounded-3xl p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary cosmic-shadow">
                <Wrench size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Technical Support</h4>
                <p className="text-secondary text-sm">24/7 on-site maintenance included.</p>
              </div>
            </div>
            <Button variant="secondary">Download Data Sheet</Button>
          </div>
        </div>

        {/* Right: Sidebar / Sticky */}
        <div className="lg:col-span-5">
          <GlassContainer className="sticky top-40 p-10 flex flex-col gap-10">
            <div className="flex justify-between items-end">
              <div className="text-secondary text-sm font-bold uppercase tracking-widest">Rate</div>
              <div className="text-right">
                <span className="text-5xl font-black">${equipment.pricePerDay}</span>
                <span className="text-secondary text-xs font-bold block">per 24h cycle</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-5 bg-white/40 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-primary" />
                  <span className="font-bold text-sm">Date Range</span>
                </div>
                <span className="text-secondary text-sm font-medium">Select Range</span>
              </div>
              <div className="flex items-center gap-2 p-4 text-xs font-medium text-secondary bg-surface-container/30 rounded-lg">
                <Info size={14} className="text-tertiary" />
                Insurance & Logistics to be calculated at checkout.
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Button size="lg" className="w-full h-18 text-xl font-black">
                Rent This Machine <ArrowRight className="ml-2" />
              </Button>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Availability</span>
                  <span className={`font-bold ${equipment.availability ? 'text-green-600' : 'text-red-500'}`}>
                    {equipment.availability ? 'Ready for Deployment' : 'In Use'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Depot Location</span>
                  <span className="font-bold">Zone Industrielle 4</span>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
}
