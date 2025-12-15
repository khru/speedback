import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, ArrowRight, Users, Copy } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface MemberInputProps {
  onAdd: (name: string) => void;
  lang: Language;
}

export const MemberInput: React.FC<MemberInputProps> = ({ onAdd, lang }) => {
  const [name, setName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MIN_HEIGHT = 88; // Altura inicial más grande para que se vea cómodo

  // Reset height function
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'; // Reset to recalculate
    const newHeight = Math.max(el.scrollHeight, MIN_HEIGHT);
    el.style.height = `${Math.min(newHeight, 300)}px`; // Grow up to 300px
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (name.trim()) {
      // Split by newline OR comma
      const names = name.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
      names.forEach(n => onAdd(n));
      setName('');
      
      // Reset height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_HEIGHT}px`;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
    adjustHeight(e.target);
  };

  const isBulk = name.includes(',') || name.includes('\n');

  return (
    <div className="bg-white p-1">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute top-4 left-4 flex items-start pointer-events-none z-10">
          {isBulk ? (
            <Users className="h-5 w-5 text-violet-500 transition-colors" />
          ) : (
            <UserPlus className="h-5 w-5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
          )}
        </div>
        
        <textarea
          ref={textareaRef}
          value={name}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={t(lang, 'sidebar.inputPlaceholder')}
          className="block w-full pl-12 pr-12 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium resize-none overflow-y-auto leading-relaxed custom-scrollbar"
          style={{ 
            height: `${MIN_HEIGHT}px`,
            minHeight: `${MIN_HEIGHT}px`,
            maxHeight: '300px'
          }}
        />
        
        <button
          type="submit"
          disabled={!name.trim()}
          className="absolute bottom-3 right-3 p-2 flex items-center justify-center bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-lg transition-all h-9 w-9 shadow-sm z-10"
        >
          <ArrowRight size={18} />
        </button>
      </form>
      
      <div className="flex justify-between items-center px-1 mt-2 min-h-[20px]">
        <p className="text-[10px] text-zinc-400 font-medium">{t(lang, 'sidebar.addHelper')}</p>
        {isBulk && (
          <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-violet-100 animate-in fade-in">
            {t(lang, 'sidebar.bulkMode')}
          </span>
        )}
      </div>
    </div>
  );
};