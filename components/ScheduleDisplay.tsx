import React, { useState, useRef, useEffect } from 'react';
import { Layers, Coffee, CheckCircle2, ArrowRightLeft, ChevronDown, ChevronUp, Clock, Timer, Check, Circle } from 'lucide-react';
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
  // Track manually expanded rounds (separate from completion status)
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());

  // Auto-expand current round logic
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
        // When completing, we generally want to collapse it, 
        // but we remove it from manual expanded list to let default logic take over
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
               
               // Logic: Open if it's the current active round OR if manually expanded
               // But if it's completed, it's closed by default unless manually expanded
               const isExpanded = expandedRounds.has(round.roundNumber) || (isCurrent && !isCompleted);
               
               return (
                  <div key={round.roundNumber} className={`relative pl-16 transition-all duration-500 group`}>
                      
                      {/* Round Status Node (Visual Only) */}
                      <div 
                        className={`absolute left-6 -translate-x-1/2 top-0 
                        w-9 h-9 rounded-full flex items-center justify-center z-10 
                        transition-all border-[3px] bg-white shadow-sm
                         ${isCompleted 
                            ? 'border-emerald-500 text-emerald-500' 
                            : isCurrent 
                              ? 'border-violet-600 text-violet-600 shadow-violet-200 scale-110' 
                              : 'border-zinc-200 text-zinc-300'
                         }`}
                      >
                         {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-sm font-extrabold">{round.roundNumber}</span>}
                      </div>

                      {/* Round Header - Click toggles VISIBILITY, not completion */}
                      <div 
                        className={`flex items-center justify-between mb-4 select-none ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
                      >
                         <div 
                            onClick={() => toggleExpand(round.roundNumber)}
                            className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                         >
                            <h3 className={`text-lg font-bold tracking-tight ${isCurrent ? 'text-violet-900' : 'text-zinc-700'}`}>
                               {t(lang, 'schedule.round')} {round.roundNumber}
                            </h3>
                            {isCurrent && !isCompleted && (
                              <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm animate-pulse">
                                Now
                              </span>
                            )}
                            <div className="text-zinc-300">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                         </div>
                         
                         {/* Action Area: Separated from the header text click to prevent accidents */}
                         <div className="flex items-center">
                            {isCompleted ? (
                              <button 
                                onClick={() => toggleRoundCompletion(round.roundNumber)}
                                className="flex items-center gap-1 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                              >
                                {t(lang, 'schedule.reopen')} <ChevronDown size={12}/>
                              </button>
                            ) : (
                               <HoldButton 
                                 onComplete={() => toggleRoundCompletion(round.roundNumber)} 
                                 lang={lang}
                               />
                            )}
                         </div>
                      </div>

                      {/* Pairs Grid */}
                      <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden
                        ${!isExpanded ? 'max-h-0 opacity-0 scale-y-95' : 'max-h-[3000px] opacity-100 scale-y-100'}
                      `}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
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

const HoldButton: React.FC<{ onComplete: () => void, lang: Language }> = ({ onComplete, lang }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Duration in ms to hold
  const HOLD_DURATION = 600;

  const start = (e: React.PointerEvent) => {
    // Prevent default context menu on mobile
    e.preventDefault(); 
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(p);

      if (p < 100) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Complete
        if (navigator.vibrate) navigator.vibrate(50);
        onComplete();
        setProgress(0);
        setIsHolding(false);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  const stop = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onContextMenu={(e) => e.preventDefault()}
      className={`
        relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg 
        border text-xs font-bold uppercase tracking-wider transition-all select-none
        ${isHolding ? 'scale-95 border-violet-500' : 'scale-100 border-zinc-200 hover:border-violet-300'}
        bg-white shadow-sm
      `}
    >
      {/* Fill Background */}
      <div 
        className="absolute inset-0 bg-violet-100 z-0 transition-none" 
        style={{ width: `${progress}%` }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 text-violet-700">
         {isHolding ? (
             <span>{lang === 'es' ? 'Mantén...' : 'Hold...'}</span>
         ) : (
            <>
               <span>{t(lang, 'schedule.markDone')}</span>
               <CheckCircle2 size={14} />
            </>
         )}
      </div>
    </button>
  );
};

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