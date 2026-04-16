"use client";

import { use, useState, useEffect } from "react";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card, GlassContainer } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { equipment: allEquipment, currentUser, addReservation } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [equipment, setEquipment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-05");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = allEquipment.find((e) => e.id === id);
    if (found) {
      setEquipment(found);
    }
  }, [id, allEquipment]);

  if (allEquipment.length > 0 && !equipment) {
    notFound();
  }

  if (!equipment) return <div className="p-32 text-center font-bold text-secondary">Loading structural data...</div>;

  const handleRentClick = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmReservation = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * equipment.pricePerDay;

      addReservation({
        equipmentId: equipment.id,
        renterId: currentUser!.id,
        ownerId: equipment.ownerId,
        startDate,
        endDate,
        totalPrice
      });

      showToast("Deployment request transmitted.", "success");
      setLoading(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

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
              {Object.entries(equipment.specs).map(([key, value]: [string, any]) => (
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
                  <CalendarIcon size={20} className="text-primary" />
                  <span className="font-bold text-sm">Deployment Range</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent text-xs font-bold outline-none" 
                  />
                  <div className="h-px w-4 bg-tertiary/20" />
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent text-xs font-bold outline-none" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 text-xs font-medium text-secondary bg-surface-container/30 rounded-lg">
                <Info size={14} className="text-tertiary" />
                Insurance & Logistics to be calculated at checkout.
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Button 
                size="lg" 
                className="w-full h-18 text-xl font-black"
                onClick={handleRentClick}
                disabled={!equipment.availability}
              >
                {equipment.availability ? "Rent This Machine" : "Currently In Use"} <ArrowRight className="ml-2" />
              </Button>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Availability Status</span>
                  <span className={`font-bold ${equipment.availability ? 'text-green-600' : 'text-red-500'}`}>
                    {equipment.availability ? 'Ready for Deployment' : 'Scheduled Task'}
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

      {/* Reservation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Reservation"
        footer={(
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 font-black" onClick={handleConfirmReservation} loading={loading}>Confirm Deployment</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 p-4 bg-surface-low rounded-2xl">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold">{equipment.name}</h4>
              <p className="text-xs text-secondary">${equipment.pricePerDay} / day</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-low rounded-2xl">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Start Date</div>
              <div className="font-black text-sm">{startDate}</div>
            </div>
            <div className="p-4 bg-surface-low rounded-2xl">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">End Date</div>
              <div className="font-black text-sm">{endDate}</div>
            </div>
          </div>

          <div className="p-6 primary-gradient text-white rounded-[24px]">
            <div className="flex justify-between items-center opacity-80 mb-2">
              <span className="text-sm font-medium">Estimated Total</span>
              <span className="text-xs">
                {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
              </span>
            </div>
            <div className="text-3xl font-black">
              ${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * equipment.pricePerDay}
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Deployment Scheduled"
        footer={(
          <Button className="w-full font-black" onClick={() => router.push("/dashboard/client/reservations")}>
            View My Reservations <ArrowRight className="ml-2" />
          </Button>
        )}
      >
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={64} />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Request Sent Successfully!</h4>
            <p className="text-secondary text-sm">The owner will review your deployment request shortly. You can track the status in your dashboard.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
