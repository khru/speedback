import React, { useState } from 'react';
import { Coffee, CheckCircle2, ArrowRightLeft, ChevronDown, ChevronUp, Clock, Check, ChevronsDown, ChevronsUp } from 'lucide-react';
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
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());

  // Auto-expand current round logic (first incomplete)
  const currentRoundIndex = rounds.findIndex(r => !completedRounds.has(r.roundNumber));
  
  const toggleRoundCompletion = (roundNum: number) => {
    setCompletedRounds(prev => {
      const next = new Set(prev);
      if (next.has(roundNum)) {
        next.delete(roundNum);
        // When reopening, ensure it's expanded
        setExpandedRounds(prevExp => new Set(prevExp).add(roundNum));
      } else {
        next.add(roundNum);
        // When completing, collapse it to clear the view, 
        // but keep it available for "Expand All" logic
        setExpandedRounds(prevExp => {
            const newExp = new Set(prevExp);
            newExp.delete(roundNum);
            return newExp;
        });
      }
      return next;
    });
  };

  const toggleExpand = (roundNum: number) => {
     setExpandedRounds(prev => {
         const next = new Set(prev);
         if (next.has(roundNum)) {
             next.delete(roundNum);
         } else {
             next.add(roundNum);
         }
         return next;
     });
  };

  // Logic for "Expand All" / "Collapse All"
  const allRoundNumbers = rounds.map(r => r.roundNumber);
  const areAllExpanded = allRoundNumbers.every(num => expandedRounds.has(num));

  const toggleAll = () => {
    if (areAllExpanded) {
      setExpandedRounds(new Set());
    } else {
      setExpandedRounds(new Set(allRoundNumbers));
    }
  };

  const progressPercentage = Math.round((completedRounds.size / rounds.length) * 100);

  // --- Time Calculations ---
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
            <div className="flex items-center justify-between md:justify-start gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                {t(lang, 'schedule.title')}
              </h2>
              
              {/* Expand All Toggle */}
              <button
                onClick={toggleAll}
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors border border-violet-100"
              >
                {areAllExpanded ? <ChevronsUp size={14} /> : <ChevronsDown size={14} />}
                {areAllExpanded 
                  ? (lang === 'es' ? 'Contraer todo' : 'Collapse all') 
                  : (lang === 'es' ? 'Expandir todo' : 'Expand all')
                }
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 text-zinc-500 font-medium text-xs md:text-sm">
               <span>{rounds.length} {t(lang, 'schedule.roundsTotal').toLowerCase()}</span>
               <span className="w-1 h-1 bg-zinc-300 rounded-full"/>
               <span>{roundDurationMinutes} min / {t(lang, 'schedule.round').toLowerCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Total Time Pill */}
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-600">
                    <Clock size={14} className="text-violet-600 md:w-4 md:h-4" />
                    <span className="font-bold text-zinc-900 text-sm md:text-base">{formatTotalTime(totalEstimatedMinutes)}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1 mr-2">{t(lang, 'schedule.totalEst')}</span>
             </div>
          </div>
      </div>

      {/* --- Minimal Progress Bar --- */}
      <div className="mb-8 md:mb-12 px-2">
         <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${progressPercentage === 100 ? 'bg-emerald-500' : 'bg-violet-600'}`}
              style={{ width: `${progressPercentage}%` }}
            />
         </div>
         <div className="flex justify-between mt-2 items-center">
            <span className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-wider">0%</span>
            <span className={`text-[10px] md:text-xs font-bold ${progressPercentage === 100 ? 'text-emerald-600' : 'text-violet-600'}`}>
              {progressPercentage}% {t(lang, 'schedule.completed')}
            </span>
            <span className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-wider">100%</span>
         </div>
      </div>

      {/* --- Timeline --- */}
      <div className="relative px-1 md:px-0">
         {/* Vertical Line */}
         <div className="absolute left-4 md:left-6 top-4 bottom-4 w-px bg-zinc-100" />

         <div className="space-y-6 md:space-y-8">
            {rounds.map((round, index) => {
               const isCompleted = completedRounds.has(round.roundNumber);
               const isCurrent = currentRoundIndex === index;
               
               // Logic: Open if it's the current active round OR if manually expanded
               const isExpanded = expandedRounds.has(round.roundNumber) || (isCurrent && !isCompleted);
               
               return (
                  <div key={round.roundNumber} className={`relative pl-12 md:pl-16 transition-all duration-500 group`}>
                      
                      {/* Round Status Node (Visual Only) */}
                      <div 
                        className={`absolute left-4 md:left-6 -translate-x-1/2 top-0 
                        w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center z-10 
                        transition-all border-[3px] bg-white shadow-sm
                         ${isCompleted 
                            ? 'border-emerald-500 text-emerald-500' 
                            : isCurrent 
                              ? 'border-violet-600 text-violet-600 shadow-violet-200 scale-110' 
                              : 'border-zinc-200 text-zinc-300'
                         }`}
                      >
                         {isCompleted ? <Check size={14} className="md:w-4 md:h-4" strokeWidth={3} /> : <span className="text-xs md:text-sm font-extrabold">{round.roundNumber}</span>}
                      </div>

                      {/* Round Header */}
                      <div className={`flex items-center justify-between mb-4 select-none ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
                         <div 
                            onClick={() => toggleExpand(round.roundNumber)}
                            className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                         >
                            <h3 className={`text-base md:text-lg font-bold tracking-tight ${isCurrent ? 'text-violet-900' : 'text-zinc-700'}`}>
                               {t(lang, 'schedule.round')} {round.roundNumber}
                            </h3>
                            {isCurrent && !isCompleted && (
                              <span className="px-1.5 py-0.5 rounded-md bg-violet-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wide shadow-sm animate-pulse">
                                Now
                              </span>
                            )}
                            <div className="text-zinc-300">
                                {isExpanded ? <ChevronUp size={14} className="md:w-4 md:h-4" /> : <ChevronDown size={14} className="md:w-4 md:h-4" />}
                            </div>
                         </div>
                         
                         {/* Simple Mark Done Button */}
                         <div className="flex items-center">
                            <button
                              onClick={() => toggleRoundCompletion(round.roundNumber)}
                              className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all shadow-sm border
                                ${isCompleted 
                                  ? 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100' 
                                  : 'bg-white border-violet-100 text-violet-600 hover:bg-violet-50 hover:border-violet-200'
                                }
                              `}
                            >
                              {isCompleted ? (
                                <>
                                  {t(lang, 'schedule.reopen')}
                                  <ChevronDown size={12} />
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={14} />
                                  {t(lang, 'schedule.markDone')}
                                </>
                              )}
                            </button>
                         </div>
                      </div>

                      {/* Pairs Grid */}
                      <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden
                        ${!isExpanded ? 'max-h-0 opacity-0 scale-y-95' : 'max-h-[3000px] opacity-100 scale-y-100'}
                      `}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 pb-4">
                            {round.pairs.map((pair, idx) => (
                               <PairCard key={idx} pair={pair} isCurrent={isCurrent && !isCompleted} />
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
    relative p-3 md:p-4 rounded-2xl border transition-all flex items-center justify-between gap-2 md:gap-3 group
    ${isCurrent 
      ? 'bg-white border-violet-200 shadow-lg shadow-violet-100/50' 
      : 'bg-white border-zinc-100 shadow-sm hover:border-zinc-200 hover:shadow-md'
    }
  `}>
    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
      <Avatar name={pair.member1.name} size="md" className="!w-8 !h-8 !text-xs md:!w-10 md:!h-10 md:!text-sm ring-4 ring-white shadow-sm" />
      <span className={`text-xs md:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-zinc-900' : 'text-zinc-600'}`}>
        {pair.member1.name}
      </span>
    </div>

    <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full ${isCurrent ? 'bg-violet-50 text-violet-500' : 'bg-zinc-50 text-zinc-300'} transition-colors shrink-0`}>
       <ArrowRightLeft size={12} className="md:w-3.5 md:h-3.5" />
    </div>

    <div className="flex items-center justify-end gap-2 md:gap-3 flex-1 min-w-0 text-right">
      <span className={`text-xs md:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-zinc-900' : 'text-zinc-600'}`}>
        {pair.member2.name}
      </span>
      <Avatar name={pair.member2.name} size="md" className="!w-8 !h-8 !text-xs md:!w-10 md:!h-10 md:!text-sm ring-4 ring-white shadow-sm" />
    </div>
  </div>
);

const RestingCard: React.FC<{ member: Member, lang: Language }> = ({ member, lang }) => (
  <div className="relative p-3 md:p-4 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm flex items-center justify-between gap-2 md:gap-3 group">
    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
      <Avatar name={member.name} size="md" className="!w-8 !h-8 !text-xs md:!w-10 md:!h-10 md:!text-sm opacity-80 grayscale-[0.5] ring-4 ring-white shadow-sm" />
      <span className="text-xs md:text-sm font-bold text-slate-500 truncate">
        {member.name}
      </span>
    </div>

    <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
       <Coffee size={12} className="text-slate-400 md:w-3.5 md:h-3.5" />
       <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
         {t(lang, 'schedule.rest')}
       </span>
    </div>
  </div>
);