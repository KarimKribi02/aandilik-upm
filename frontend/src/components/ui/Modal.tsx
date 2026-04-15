"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-lg rounded-3xl border border-surface-container shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-surface-container bg-surface-low">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <Button variant="tertiary" size="sm" onClick={onClose} className="p-2">
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {footer && (
          <div className="p-8 border-t border-surface-container flex justify-end gap-3 bg-surface-low">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
