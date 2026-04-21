"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Zap, 
  Construction, 
  ShieldCheck,
  ChevronRight,
  Navigation
} from "lucide-react";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const steps = [
  { id: "requested", label: "Requested", icon: <Clock size={20} />, time: "Today, 10:42 AM" },
  { id: "verified", label: "Verified", icon: <ShieldCheck size={20} />, time: "Today, 11:15 AM" },
  { id: "transit", label: "In Transit", icon: <Truck size={20} />, time: "Active Now" },
  { id: "onsite", label: "On Site", icon: <MapPin size={20} />, time: "Estimated 2:00 PM" },
  { id: "completed", label: "Done", icon: <CheckCircle2 size={20} />, time: "--" },
];

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsTracking(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-low pb-32 pt-32">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <img src="/images/tracking_radar.png" alt="Radar" className="w-full h-full object-cover scale-150 rotate-12" />
      </div>

      <section className="container mx-auto px-6 max-w-7xl pt-32">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center flex flex-col gap-4">
            <div className="text-primary font-bold tracking-[0.4em] text-xs uppercase flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-primary/30" />
              Deployment Telemetry
              <div className="w-12 h-px bg-primary/30" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Track Your <span className="text-secondary">Machine.</span>
            </h1>
          </div>

          {/* Search Box */}
          <GlassContainer className="p-2 rounded-[32px] border-white/40 shadow-2xl overflow-hidden relative">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-2 relative z-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={24} />
                <input 
                  type="text" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="Enter Deployment ID (e.g. ADL-9981-XP)"
                  className="w-full h-20 pl-16 pr-8 bg-white/50 backdrop-blur-sm rounded-[24px] outline-none text-xl font-bold tracking-widest placeholder:text-secondary/40 focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                />
              </div>
              <Button 
                size="lg" 
                className="h-20 px-12 text-lg font-black group"
                loading={loading}
              >
                Launch Protocol <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </GlassContainer>

          {/* Result Area */}
          <AnimatePresence mode="wait">
            {isTracking ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="flex flex-col gap-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left: Machine Info & Mapping */}
                  <div className="lg:col-span-7 flex flex-col gap-8">
                    <Card variant="lowest" className="p-8 border border-white relative overflow-hidden group">
                      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        <div className="w-48 h-48 rounded-[32px] overflow-hidden cosmic-shadow shrink-0">
                          <img 
                            src="https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                            alt="Machine"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                            <Activity size={12} className="animate-pulse" /> Live Deployment
                          </div>
                          <h3 className="text-3xl font-black tracking-tight leading-none">Caterpillar 320 GC</h3>
                          <div className="flex flex-wrap gap-4 text-xs font-bold text-secondary">
                            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-tertiary" /> Certified Operator</span>
                            <span className="flex items-center gap-1"><Zap size={14} className="text-primary" /> Peak Efficiency</span>
                          </div>
                        </div>
                      </div>
                      <Navigation className="absolute -bottom-8 -right-8 w-40 h-40 text-primary opacity-[0.03] rotate-45" />
                    </Card>

                    {/* Live Telemetry */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Fuel", val: "84%", color: "primary" },
                        { label: "Hours", val: "1,242h", color: "secondary" },
                        { label: "Temp", val: "72C", color: "tertiary" },
                        { label: "Load", val: "Normal", color: "secondary" },
                      ].map((stat, i) => (
                        <Card key={i} variant="low" className="p-6 flex flex-col gap-2 text-center">
                          <div className="text-[10px] font-black uppercase tracking-tighter text-secondary opacity-60">{stat.label}</div>
                          <div className={`text-xl font-black text-${stat.color}`}>{stat.val}</div>
                        </Card>
                      ))}
                    </div>

                    <Card variant="default" className="h-[300px] bg-surface-container relative overflow-hidden flex items-center justify-center border-dashed border-2 border-surface-high">
                      <div className="text-center flex flex-col gap-4">
                        <MapPin size={40} className="text-primary mx-auto animate-bounce" />
                        <div className="font-bold text-sm">Zone Industrielle 4, Casablanca</div>
                        <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">Global Positioning Active</div>
                      </div>
                      <div className="absolute inset-0 opacity-10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Casablanca&zoom=13&size=600x300&key=')] bg-cover" />
                    </Card>
                  </div>

                  {/* Right: Timeline */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <Card variant="lowest" className="p-10 border border-white flex flex-col gap-10">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-xl uppercase tracking-widest text-secondary text-sm">Status Timeline</h4>
                        <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">In Transit</div>
                      </div>

                      <div className="space-y-0">
                        {steps.map((step, idx) => {
                          const isActive = idx === 2;
                          const isDone = idx < 2;
                          
                          return (
                            <div key={step.id} className="relative pl-12 pb-10 last:pb-0">
                              {/* Connector Line */}
                              {idx !== steps.length - 1 && (
                                <div className={`absolute left-[9px] top-6 bottom-0 w-[2px] ${isDone ? 'bg-primary' : 'bg-surface-container'}`} />
                              )}
                              
                              {/* Indicator Circle */}
                              <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                                isDone ? 'bg-primary border-primary text-white' : 
                                isActive ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-125' : 
                                'bg-surface-container border-surface-container text-secondary'
                              }`}>
                                {isDone ? <CheckCircle2 size={12} /> : null}
                                {isActive ? <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" /> : null}
                              </div>

                              <div className="flex flex-col gap-1">
                                <h5 className={`font-bold text-sm ${isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-secondary/50'}`}>
                                  {step.label}
                                </h5>
                                <p className="text-[10px] font-medium text-secondary opacity-60 italic">{step.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-8 border-t border-surface-container flex flex-col gap-4">
                        <div className="text-secondary text-[10px] font-bold uppercase tracking-widest">Contact On-Site Operator</div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-black">M</div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Mohamed Tazi</div>
                            <div className="text-[10px] text-secondary">Verified Specialist</div>
                          </div>
                          <Button variant="secondary" size="sm" className="ml-auto">Voice Feed</Button>
                        </div>
                      </div>
                    </Card>
                    
                    <GlassContainer className="bg-primary/5 border-primary/20 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-primary">
                        <AlertCircle size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Protocol Notice</span>
                      </div>
                      <p className="text-[11px] text-secondary leading-relaxed">
                        Expected site readiness in 120 minutes. Please ensure the structural foundation is clear for deployment.
                      </p>
                    </GlassContainer>
                  </div>
                </div>

                <div className="flex justify-center mt-12">
                  <button 
                    onClick={() => setIsTracking(false)}
                    className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    Track another deployment <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                  <Construction size={40} className="text-secondary" />
                </div>
                <p className="text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                  Enter your unique alphanumeric deployment ID provided in your confirmation email to initiate live telemetry tracking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
