"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Equipment {
  id: string;
  name: string;
  image: string;
  pricePerDay: number;
}

interface ComparisonBarProps {
  selectedItems: Equipment[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ selectedItems, onRemove, onClear }) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-surface-container rounded-[32px] p-4 flex items-center justify-between shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 pl-4">
          <div className="flex items-center gap-3 pr-6 border-r border-surface-container">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-sm font-black">Comparison</div>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{selectedItems.length}/3 Machines</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            {selectedItems.map((item) => (
              <motion.div 
                layoutId={`compare-${item.id}`}
                key={item.id} 
                className="flex items-center gap-3 bg-surface-low p-2 pr-4 rounded-2xl relative group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="max-w-[100px] overflow-hidden">
                  <div className="text-xs font-black truncate">{item.name}</div>
                  <div className="text-[10px] text-secondary font-bold">${item.pricePerDay}/d</div>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-surface-container flex items-center justify-center text-secondary hover:text-primary shadow-sm"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
            
            {selectedItems.length < 3 && (
              <div className="w-32 h-[64px] border-2 border-dashed border-surface-container rounded-2xl flex items-center justify-center text-secondary/30 text-[10px] font-bold uppercase">
                Add Slot
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 bg-white/50 h-full rounded-2xl ml-4">
          <button 
            onClick={onClear}
            className="text-xs font-bold text-secondary hover:text-primary transition-colors"
          >
            Clear
          </button>
          <Link href={`/equipment/compare?ids=${selectedItems.map(i => i.id).join(',')}`}>
            <Button size="sm" className="h-12 px-6">
              Analyze <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
