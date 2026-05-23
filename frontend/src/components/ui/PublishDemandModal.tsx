"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./FormElements";
import { useData } from "@/context/DataProvider";
import { useToast } from "./Toast";

interface PublishDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishDemandModal({ isOpen, onClose }: PublishDemandModalProps) {
  const { addDemand } = useData();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demandData, setDemandData] = useState({
    equipmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandData.equipmentType || !demandData.location || !demandData.startDate || !demandData.endDate) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDemand(demandData);
      showToast("Votre demande a été publiée. Les propriétaires vous contacteront bientôt.", "success");
      setDemandData({
        equipmentType: "",
        location: "",
        startDate: "",
        endDate: "",
        budget: "",
        description: ""
      });
      onClose();
    } catch (err) {
      showToast("La publication de la demande a échoué. Veuillez réessayer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publier une demande"
      footer={(
        <div className="flex gap-4 w-full">
          <Button 
            variant="secondary" 
            className="flex-1 rounded-2xl h-14 font-black" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 rounded-2xl h-14 font-black" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </div>
      )}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input 
          label="Type de matériel" 
          placeholder="Ex: Excavatrice, Grue..."
          value={demandData.equipmentType}
          onChange={(e: any) => setDemandData({...demandData, equipmentType: e.target.value})}
          required
        />
        <Input 
          label="Localisation" 
          placeholder="Ex: Casablanca, Tanger..." 
          value={demandData.location}
          onChange={(e: any) => setDemandData({...demandData, location: e.target.value})}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Date de début" 
            type="date"
            value={demandData.startDate}
            onChange={(e: any) => setDemandData({...demandData, startDate: e.target.value})}
            required
          />
          <Input 
            label="Date de fin" 
            type="date"
            value={demandData.endDate}
            onChange={(e: any) => setDemandData({...demandData, endDate: e.target.value})}
            required
          />
        </div>
        <Input 
          label="Budget estimé (DH/jour)" 
          type="number"
          placeholder="Ex: 500"
          value={demandData.budget}
          onChange={(e: any) => setDemandData({...demandData, budget: e.target.value})}
        />
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Description de votre besoin</label>
          <textarea 
            className="w-full h-24 px-4 py-3 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none resize-none"
            placeholder="Précisez votre besoin (durée, spécifications techniques...)"
            value={demandData.description}
            onChange={(e) => setDemandData({...demandData, description: e.target.value})}
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
