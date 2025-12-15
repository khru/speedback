import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lang: Language;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200">
        
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-4 mx-auto text-rose-600">
            <AlertTriangle size={24} />
          </div>
          
          <h3 className="text-lg font-bold text-center text-zinc-900 mb-2">
            {t(lang, 'modal.clearTitle')}
          </h3>
          
          <p className="text-center text-zinc-500 text-sm leading-relaxed mb-6">
            {t(lang, 'modal.clearMessage')}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              {t(lang, 'modal.cancel')}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
            >
              {t(lang, 'modal.confirmDelete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};