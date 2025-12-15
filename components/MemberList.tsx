import React from 'react';
import { Trash2, Users, Ban } from 'lucide-react';
import { Member, Language } from '../types';
import { t } from '../constants/translations';
import { Avatar } from './Avatar';

interface MemberListProps {
  members: Member[];
  onRemove: (id: string) => void;
  onClear: () => void;
  lang: Language;
}

export const MemberList: React.FC<MemberListProps> = ({ members, onRemove, onClear, lang }) => {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 mt-4">
        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
          <Users className="h-6 w-6 text-zinc-300" />
        </div>
        <p className="text-zinc-500 font-medium text-center">{t(lang, 'sidebar.noMembers')}</p>
        <p className="text-zinc-400 text-xs text-center mt-1">{t(lang, 'sidebar.noMembersSub')}</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {t(lang, 'sidebar.listTitle')} ({members.length})
        </h3>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar mb-4">
        {members.map((member) => (
          <div 
            key={member.id}
            className="group flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Avatar name={member.name} size="md" />
              <span className="text-zinc-700 font-semibold text-sm truncate max-w-[140px]">{member.name}</span>
            </div>
            <button
              onClick={() => onRemove(member.id)}
              className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 rounded-xl transition-all"
      >
        <Ban size={14} />
        {t(lang, 'sidebar.clearList')}
      </button>
    </div>
  );
};