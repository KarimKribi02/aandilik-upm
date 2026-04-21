"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Construction, Users, Trophy, Target } from "lucide-react";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "Founded", value: "2024" },
  { label: "Fleet Capacity", value: "500+" },
  { label: "Active Project Sites", value: "120+" },
  { label: "Deployment Centers", value: "12" },
];

const values = [
  { 
    icon: <ShieldCheck className="text-primary" size={24} />, 
    title: "Uncompromising Safety", 
    desc: "Our machinery undergoes rigorous 150-point structural integrity checks before every deployment." 
  },
  { 
    icon: <Zap className="text-tertiary" size={24} />, 
    title: "Logistical Velocity", 
    desc: "Engineered for speed. We guarantee site arrival within 24 hours of your architectural directive." 
  },
  { 
    icon: <Construction className="text-secondary" size={24} />, 
    title: "Precision Engineering", 
    desc: "Only the latest models from Tier-1 manufacturers. Precision is our core mechanical language." 
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col pb-32 pt-32">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/about_hero.png" 
            alt="Industrial Excellence" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-6 flex items-center gap-3">
              <div className="w-8 h-px bg-primary" />
              The Digital Backbone
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Engineering the <br />
              <span className="text-primary">Future of Build.</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-xl">
              Aandilik is the world's most advanced equipment procurement platform, connecting architectural 
              ambition with mechanical precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="container mx-auto px-6 max-w-7xl py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-5xl font-black tracking-tighter">Our <span className="text-secondary">Narrative.</span></h2>
            <div className="space-y-6 text-lg text-secondary leading-relaxed">
              <p>
                Aandilik was founded on a simple realization: the construction industry’s heartbeat is its machinery, 
                yet procurement remains fragmented. We built the digital bridge.
              </p>
              <p>
                From the bustling ports of Casablanca to the expanding skylines of Marrakech, 
                we provide the mechanical muscle that drives modern civilization. Our platform 
                isn't just about rental; it's about structural empowerment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-surface-container">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs font-bold text-secondary uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-surface-container rounded-[60px] overflow-hidden cosmic-shadow p-4">
              <div className="w-full h-full rounded-[40px] overflow-hidden bg-primary/10 flex items-center justify-center p-12 text-center">
                <div className="flex flex-col gap-6 items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary cosmic-shadow">
                    <Trophy size={40} />
                  </div>
                  <h3 className="text-2xl font-bold italic text-primary">"The machinery of progress never sleeps. Neither do we."</h3>
                  <div className="text-sm font-bold uppercase tracking-widest text-secondary">- Aandilik Founders</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-tertiary rounded-[40px] flex items-center justify-center text-white hidden md:flex">
              <div className="text-center">
                <div className="text-4xl font-black">99.8%</div>
                <div className="text-[10px] font-bold uppercase">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-surface-low py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tighter mb-4">Core Structural <span className="text-primary">Protocols.</span></h2>
            <p className="text-secondary max-w-2xl mx-auto">Our operation is defined by three non-negotiable architectural mandates.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <Card key={i} variant="lowest" className="p-10 flex flex-col gap-6 hover:translate-y-[-8px] transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-surface-container">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold">{val.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{val.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 max-w-7xl py-32">
        <GlassContainer className="primary-gradient p-16 md:p-24 rounded-[60px] text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Build the Monument <br />of Tomorrow.</h2>
            <p className="text-white/80 max-w-md text-lg">Join the network of premier builders and equipment owners today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-10">Deploy Now</Button>
            <Button variant="glass" size="lg" className="h-16 px-10 border-white/40 text-white">Contact Agency</Button>
          </div>
          <Construction className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12" />
        </GlassContainer>
      </section>
    </div>
  );
}
