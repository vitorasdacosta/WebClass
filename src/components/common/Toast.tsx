import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastConfig } from '../../types';

interface ToastProps {
  toast: ToastConfig;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast.isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce-short transition-all">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
        toast.type === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : toast.type === 'error'
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-600 shrink-0" />}
        {toast.type === 'error' && <AlertTriangle size={18} className="text-red-600 shrink-0" />}
        {toast.type === 'info' && <Info size={18} className="text-blue-600 shrink-0" />}
        <span>{toast.message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          title="Fechar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
