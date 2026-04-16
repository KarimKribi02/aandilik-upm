"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
      isOpen ? "opacity-100" : "opacity-0"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-white rounded-[40px] border border-surface-container cosmic-shadow overflow-hidden transition-all duration-300 transform",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      )}>
        <div className="flex items-center justify-between p-8 border-b border-surface-container">
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-low rounded-xl transition-colors text-secondary"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>

        {footer && (
          <div className="p-8 border-t border-surface-container bg-surface-low flex gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
