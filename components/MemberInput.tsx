import React, { useState } from 'react';
import { UserPlus, ArrowRight, Users } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface MemberInputProps {
  onAdd: (name: string) => void;
  lang: Language;
}

export const MemberInput: React.FC<MemberInputProps> = ({ onAdd, lang }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const names = name.split(',').map(n => n.trim()).filter(n => n.length > 0);
      names.forEach(n => onAdd(n));
      setName('');
    }
  };

  return (
    <div className="bg-white p-1">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {name.includes(',') ? (
            <Users className="h-5 w-5 text-violet-500 transition-colors" />
          ) : (
            <UserPlus className="h-5 w-5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(lang, 'sidebar.inputPlaceholder')}
          className="block w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="absolute inset-y-2 right-2 px-3 flex items-center justify-center bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-lg transition-all"
        >
          <ArrowRight size={18} />
        </button>
      </form>
      <div className="flex justify-between items-center px-1 mt-2">
        <p className="text-xs text-zinc-400">{t(lang, 'sidebar.addHelper')}</p>
        {name.includes(',') && (
          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t(lang, 'sidebar.bulkMode')}
          </span>
        )}
      </div>
    </div>
  );
};