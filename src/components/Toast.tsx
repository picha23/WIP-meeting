import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ show, title, message, type = 'success' }) => {
  if (!show) return null;

  return (
    <div className="fixed top-16 right-6 z-[100] transform transition-all duration-300 ease-out flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-xl border border-[#e5e1e7] text-[#1c1b1f] animate-in fade-in slide-in-from-top-4">
      <div className="w-7 h-7 rounded-full bg-[#beedd3] text-[#186700] flex items-center justify-center shrink-0">
        {type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-600" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#186700]" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-bold text-[#1c1b1f] leading-snug">{title}</span>
        <span className="text-[11px] text-[#404a3a] leading-tight">{message}</span>
      </div>
    </div>
  );
};
