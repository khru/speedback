import React, { useState } from 'react';
import { Layers, Coffee, CheckCircle2, ArrowRightLeft, ChevronDown, Clock, Timer, Check } from 'lucide-react';
import { Round, Language, Member, Pair } from '../types';
import { t } from '../constants/translations';
import { Avatar } from './Avatar';

interface ScheduleDisplayProps {
  rounds: Round[];
  lang: Language;
  roundDurationMinutes: number;
}

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ rounds, lang, roundDurationMinutes }) => {
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(new Set());

  if (rounds.length === 0) return null;

  const toggleRoundCompletion = (roundNum: number) => {
    setCompletedRounds(prev => {
      const next = new Set(prev);
      if (next.has(roundNum)) {
        next.delete(roundNum);
      } else {
        next.add(roundNum);
      }
      return next;
    });
  };

  const currentRoundIndex = rounds.findIndex(r => !completedRounds.has(r.roundNumber));
  const progressPercentage = Math.round((completedRounds.size / rounds.length) * 100);

  // --- Time Calculations (Silent) ---
  const SETUP_BUFFER_MINUTES = 10;
  const TRANSITION_BUFFER_MINUTES = 2; 
  
  const totalRoundMinutes = rounds.length * roundDurationMinutes;
  const totalTransitionMinutes = Math.max(0, rounds.length - 1) * TRANSITION_BUFFER_MINUTES;
  const totalEstimatedMinutes = totalRoundMinutes + totalTransitionMinutes + SETUP_BUFFER_MINUTES;

  const formatTotalTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 max-w-4xl mx-auto">
      
      {/* --- Simplified Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
              {t(lang, 'schedule.title')}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-zinc-500 font-medium text-sm">
               <span>{rounds.length} {t(lang, 'schedule.roundsTotal').toLowerCase()}</span>
               <span className="w-1 h-1 bg-zinc-300 rounded-full"/>
               <span>{roundDurationMinutes} min / {t(lang, 'schedule.round').toLowerCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Total Time Pill */}
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-600">
                    <Clock size={16} className="text-violet-600" />
                    <span className="font-bold text-zinc-900">{formatTotalTime(totalEstimatedMinutes)}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1 mr-2">{t(lang, 'schedule.totalEst')}</span>
             </div>
          </div>
      </div>

      {/* --- Minimal Progress Bar --- */}
      <div className="mb-12 px-2">
         <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${progressPercentage === 100 ? 'bg-emerald-500' : 'bg-violet-600'}`}
              style={{ width: `${progressPercentage}%` }}
            />
         </div>
         <div className="flex justify-between mt-2 items-center">
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">0%</span>
            <span className={`text-xs font-bold ${progressPercentage === 100 ? 'text-emerald-600' : 'text-violet-600'}`}>
              {progressPercentage}% {t(lang, 'schedule.completed')}
            </span>
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">100%</span>
         </div>
      </div>

      {/* --- Timeline --- */}
      <div className="relative px-2 md:px-0">
         {/* Vertical Line */}
         <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-100" />

         <div className="space-y-8">
            {rounds.map((round, index) => {
               const isCompleted = completedRounds.has(round.roundNumber);
               const isCurrent = currentRoundIndex === index;
               
               return (
                  <div key={round.roundNumber} className={`relative pl-16 transition-all duration-500 group`}>
                      
                      {/* Round Number Node */}
                      <button 
                        onClick={() => toggleRoundCompletion(round.roundNumber)}
                        className={`absolute left-6 -translate-x-1/2 top-0 
                        w-9 h-9 rounded-full flex items-center justify-center z-10 
                        transition-all cursor-pointer border-[3px] bg-white shadow-sm
                         ${isCompleted 
                            ? 'border-emerald-500 text-emerald-500' 
                            : isCurrent 
                              ? 'border-violet-600 text-violet-600 shadow-violet-200 scale-110' 
                              : 'border-zinc-200 text-zinc-300 hover:border-zinc-300'
                         }`}
                      >
                         {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-sm font-extrabold">{round.roundNumber}</span>}
                      </button>

                      {/* Round Header Text */}
                      <div 
                        className={`flex items-center justify-between mb-4 cursor-pointer select-none ${isCompleted ? 'opacity-50' : 'opacity-100'}`}
                        onClick={() => toggleRoundCompletion(round.roundNumber)}
                      >
                         <div className="flex items-center gap-3">
                            <h3 className={`text-lg font-bold tracking-tight ${isCurrent ? 'text-violet-900' : 'text-zinc-700'}`}>
                               {t(lang, 'schedule.round')} {round.roundNumber}
                            </h3>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm animate-pulse">
                                Now
                              </span>
                            )}
                         </div>
                         
                         <div className="text-xs font-medium text-zinc-400 flex items-center gap-1 hover:text-zinc-600 transition-colors">
                            {isCompleted ? (
                              <span className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
                                {t(lang, 'schedule.reopen')} <ChevronDown size={12}/>
                              </span>
                            ) : (
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-zinc-100 shadow-sm text-emerald-600">
                                {t(lang, 'schedule.markDone')} <CheckCircle2 size={12}/>
                              </span>
                            )}
                         </div>
                      </div>

                      {/* Pairs Grid */}
                      <div className={`transition-all duration-500 ease-in-out origin-top
                        ${isCompleted ? 'max-h-0 overflow-hidden opacity-0 scale-y-95' : 'max-h-[3000px] opacity-100 scale-y-100'}
                      `}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {round.pairs.map((pair, idx) => (
                               <PairCard key={idx} pair={pair} isCurrent={isCurrent} />
                            ))}
                            {round.restingMember && <RestingCard member={round.restingMember} lang={lang} />}
                         </div>
                      </div>
                      
                  </div>
               )
            })}
         </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const PairCard: React.FC<{ pair: Pair, isCurrent: boolean }> = ({ pair, isCurrent }) => (
  <div className={`
    relative p-4 rounded-2xl border transition-all flex items-center justify-between gap-2 group
    ${isCurrent 
      ? 'bg-white border-violet-200 shadow-lg shadow-violet-100/50' 
      : 'bg-white border-zinc-100 shadow-sm hover:border-zinc-200 hover:shadow-md'
    }
  `}>
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <Avatar name={pair.member1.name} size="md" className="ring-4 ring-white shadow-sm" />
      <span className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-zinc-900' : 'text-zinc-600'}`}>
        {pair.member1.name}
      </span>
    </div>

    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrent ? 'bg-violet-50 text-violet-500' : 'bg-zinc-50 text-zinc-300'} transition-colors`}>
       <ArrowRightLeft size={14} />
    </div>

    <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-right">
      <span className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-zinc-900' : 'text-zinc-600'}`}>
        {pair.member2.name}
      </span>
      <Avatar name={pair.member2.name} size="md" className="ring-4 ring-white shadow-sm" />
    </div>
  </div>
);

const RestingCard: React.FC<{ member: Member, lang: Language }> = ({ member, lang }) => (
  <div className="relative p-4 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm flex items-center justify-between gap-3 group">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <Avatar name={member.name} size="md" className="opacity-80 grayscale-[0.5] ring-4 ring-white shadow-sm" />
      <span className="text-sm font-bold text-slate-500 truncate">
        {member.name}
      </span>
    </div>

    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
       <Coffee size={14} className="text-slate-400" />
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
         {t(lang, 'schedule.rest')}
       </span>
    </div>
  </div>
);