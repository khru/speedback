import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, VolumeX, Check } from 'lucide-react';
import { SoundMode, Language } from '../types';
import { t } from '../constants/translations';

interface SoundMenuProps {
  mode: SoundMode;
  onChange: (mode: SoundMode) => void;
  lang: Language;
}

export const SoundMenu: React.FC<SoundMenuProps> = ({ mode, onChange, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    switch (mode) {
      case 'all': return <Volume2 size={20} />;
      case 'alarms-only': return <Volume1 size={20} />;
      case 'mute': return <VolumeX size={20} />;
    }
  };

  const options: { value: SoundMode; label: string; icon: any }[] = [
    { value: 'all', label: t(lang, 'sound.all'), icon: Volume2 },
    { value: 'alarms-only', label: t(lang, 'sound.alarmsOnly'), icon: Volume1 },
    { value: 'mute', label: t(lang, 'sound.mute'), icon: VolumeX },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all ${
          isOpen ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
        }`}
        title="Configuración de sonido"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="px-4 py-2 border-b border-zinc-100 mb-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sonido</span>
          </div>
          <div className="flex flex-col gap-1 p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === option.value
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <option.icon size={16} />
                  <span>{option.label}</span>
                </div>
                {mode === option.value && <Check size={14} className="text-violet-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};