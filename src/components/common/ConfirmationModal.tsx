import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { ModalConfig } from '../../types';

interface ConfirmationModalProps {
  config: ModalConfig;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ config, onClose }) => {
  if (!config.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-scaleUp">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${
            config.type === 'danger' 
              ? 'bg-red-100 text-red-600' 
              : config.type === 'warning'
              ? 'bg-amber-100 text-amber-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {config.type === 'danger' && <AlertCircle size={24} />}
            {config.type === 'warning' && <AlertTriangle size={24} />}
            {config.type === 'info' && <Info size={24} />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{config.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            {config.cancelText || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={config.onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm cursor-pointer ${
              config.type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : config.type === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {config.confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
