"use client";

import { motion } from "framer-motion";
import { Zap, MapPin, Construction, Clock } from "lucide-react";
import { GlassContainer } from "./ui/Card";

const activities = [
  { id: 1, type: "Rental", machine: "Caterpillar 320 GC", location: "Casablanca, Morocco", time: "2 min ago" },
  { id: 2, type: "Delivery", machine: "JCB 3CX Backhoe", location: "Rabat, Morocco", time: "5 min ago" },
  { id: 3, type: "Maintenance", machine: "Komatsu PC210", location: "Tangier, Morocco", time: "12 min ago" },
  { id: 4, type: "Rental", machine: "Liebherr LTM 1100", location: "Marrakech, Morocco", time: "15 min ago" },
  { id: 5, type: "Deployment", machine: "Volvo A60H Hauler", location: "Agadir, Morocco", time: "18 min ago" },
  { id: 6, type: "Rental", machine: "Bobcat S450", location: "Fes, Morocco", time: "22 min ago" },
];

export const LiveActivityFeed = () => {
  return (
    <div className="w-full overflow-hidden bg-surface-container/50 border-y border-surface-container py-3 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface-low to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-low to-transparent z-10" />
      
      <motion.div 
        className="flex gap-12 items-center whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...activities, ...activities].map((activity, idx) => (
          <div key={`${activity.id}-${idx}`} className="flex items-center gap-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{activity.type}</span>
            </div>
            <div className="h-4 w-px bg-surface-container-high" />
            <span className="text-sm font-bold">{activity.machine}</span>
            <div className="flex items-center gap-1 text-secondary text-xs">
              <MapPin size={10} />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center gap-1 text-secondary/60 text-[10px]">
              <Clock size={10} />
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const LiveStatsPulse = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      <GlassContainer className="p-4 border-none bg-white/40 shadow-sm flex flex-col gap-1">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Active Deployments</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black">184</span>
          <span className="text-xs text-green-500 font-bold mb-1">+12%</span>
        </div>
      </GlassContainer>
      <GlassContainer className="p-4 border-none bg-white/40 shadow-sm flex flex-col gap-1">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Fleet Health</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black">98.2%</span>
          <span className="text-xs text-primary font-bold mb-1">OPTIMAL</span>
        </div>
      </GlassContainer>
      <GlassContainer className="p-4 border-none bg-white/40 shadow-sm flex flex-col gap-1">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Operators Online</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black">42</span>
          <span className="text-xs text-secondary font-bold mb-1">LIVE</span>
        </div>
      </GlassContainer>
      <GlassContainer className="p-4 border-none bg-white/40 shadow-sm flex flex-col gap-1">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Revenue Generated</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black">$2.4M</span>
          <span className="text-xs text-tertiary font-bold mb-1">YTD</span>
        </div>
      </GlassContainer>
    </div>
  );
};
