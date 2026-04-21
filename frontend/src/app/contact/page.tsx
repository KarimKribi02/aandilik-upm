"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", project: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const offices = [
    { title: "Casablanca HQ", address: "42 Boulevard de l'Anfa, 20000", phone: "+212 522 00 11 22", map: "Center Zone" },
    { title: "Marrakech Depot", address: "Zone Industrielle Sidi Ghanem, 40000", phone: "+212 524 33 44 55", map: "South Hub" },
  ];

  return (
    <div className="flex flex-col gap-0 pb-32 pt-32">
      {/* Hero Header */}
      <section className="container mx-auto px-6 max-w-7xl pt-32 pb-20">
        <div className="max-w-3xl">
          <div className="text-secondary font-bold tracking-[0.3em] text-xs uppercase mb-6 flex items-center gap-3">
            <div className="w-8 h-px bg-secondary" />
            Direct Communication
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            Let's <span className="text-primary">Connect.</span>
          </h1>
          <p className="text-xl text-secondary leading-relaxed max-w-xl">
            Our deployment architects are standing by to coordinate your next structural achievement. Reach out for 
            immediate logistics and technical support.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container mx-auto px-6 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold border-b border-surface-container pb-4">Operational Hubs</h3>
              <div className="flex flex-col gap-6">
                {offices.map((office, i) => (
                  <Card key={i} variant="low" className="p-8 border border-white hover:border-primary/20 transition-all group">
                    <h4 className="font-bold text-lg mb-4 text-primary">{office.title}</h4>
                    <div className="flex flex-col gap-4 text-sm text-secondary">
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-tertiary" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-tertiary" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-tertiary" />
                        <span>Mon - Sat: 08:00 - 19:00</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-surface-lowest p-10 rounded-[40px] border border-surface-container flex flex-col gap-6 cosmic-shadow">
              <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center text-white">
                <MessageSquare size={24} />
              </div>
              <h4 className="font-bold text-xl">Technical Support</h4>
              <p className="text-sm text-secondary leading-relaxed">Dedicated engineering support for complex site requirements and heavy machinery troubleshooting.</p>
              <Button variant="secondary" className="w-fit">Start Live Chat</Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <GlassContainer className="relative min-h-[800px] rounded-[60px] overflow-hidden p-1 bg-surface-container">
              <img 
                src="/images/contact_hq.png" 
                alt="HQ" 
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-lowest via-surface-lowest/90 to-transparent" />
              
              <div className="relative z-10 p-12 md:p-20">
                <div className="max-w-2xl">
                  <h3 className="text-4xl font-black tracking-tighter mb-4">Command Directive.</h3>
                  <p className="text-secondary mb-12">Submit your project details for an immediate logistical assessment.</p>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary pl-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full h-16 bg-white rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary border border-surface-container transition-all"
                          placeholder="e.g. Jean Dupont"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary pl-1">Project Site Email</label>
                        <input 
                          type="email" 
                          required
                          className="w-full h-16 bg-white rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary border border-surface-container transition-all"
                          placeholder="e.g. site@project.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary pl-1">Project Scale</label>
                      <select className="w-full h-16 bg-white rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary border border-surface-container transition-all appearance-none cursor-pointer">
                        <option>Residential Structural</option>
                        <option>Industrial Infrastructure</option>
                        <option>Commercial Development</option>
                        <option>Civils & Earthmoving</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary pl-1">Message Detail</label>
                      <textarea 
                        rows={6}
                        className="w-full bg-white rounded-2xl p-6 outline-none focus:ring-2 focus:ring-primary border border-surface-container transition-all resize-none"
                        placeholder="Describe your equipment requirements..."
                      />
                    </div>

                    <Button size="lg" className="h-20 text-lg font-black group overflow-hidden relative">
                      <motion.div 
                        animate={isSent ? { y: -100 } : { y: 0 }}
                        className="flex items-center gap-3"
                      >
                        Transmit Signal <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </motion.div>
                      <motion.div 
                        initial={{ y: 100 }}
                        animate={isSent ? { y: 0 } : { y: 100 }}
                        className="absolute inset-0 flex items-center justify-center bg-green-500 text-white"
                      >
                        Signal Received.
                      </motion.div>
                    </Button>
                  </form>
                </div>
              </div>
            </GlassContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
