import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, Zap, Globe, BookOpen, FileText, Table2, X, Loader2, Share2, Check, Info } from 'lucide-react';

import { MemberInput } from './components/MemberInput';
import { MemberList } from './components/MemberList';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { Timer } from './components/Timer';
import { ConfirmModal } from './components/ConfirmModal';
import { RecommendationsModal } from './components/RecommendationsModal';
import { SoundMenu } from './components/SoundMenu';
import { InstallPWA } from './components/InstallPWA';
import { generateRotationSchedule } from './services/rotationService';
import { Member, Round, Language, SoundMode } from './types';
import { t } from './constants/translations';
import { sanitizeInput, sanitizeForCSV } from './utils/security';

// Robust ID generator
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
};

const STORAGE_KEY = 'speedback_app_state_v2';

interface AppState {
  members: Member[];
  rounds: Round[];
  lang: Language;
  sessionDurationMinutes: number;
  soundMode: SoundMode;
  completedRounds: number[];
}

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(5);
  const [soundMode, setSoundMode] = useState<SoundMode>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Initialization Logic: URL Params > LocalStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMembers = params.get('members');

    if (urlMembers) {
      // 1. Priority: URL Params (Room Link)
      try {
        const names = urlMembers.split(',').map(n => sanitizeInput(n.trim())).filter(n => n.length > 0);
        if (names.length > 0) {
          const newMembers = names.map(name => ({ id: generateId(), name }));
          setMembers(newMembers);
          // Initialize defaults for a fresh room
          setRounds([]);
          setCompletedRounds([]);
          
          // Clean URL so a refresh doesn't lock the state to the URL params forever
          window.history.replaceState({}, '', window.location.pathname);
          
          // Optionally attempt to restore preferences like lang/sound from storage without overwriting members
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
             const parsed: AppState = JSON.parse(saved);
             if (parsed.lang) setLang(parsed.lang);
             if (parsed.soundMode) setSoundMode(parsed.soundMode);
             // We deliberately ignore stored members/rounds in favor of the URL
          }
        }
      } catch (e) {
        console.error("Error parsing URL members", e);
      }
    } else {
      // 2. Fallback: LocalStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: AppState = JSON.parse(saved);
          if (parsed.members) setMembers(parsed.members);
          if (parsed.rounds) setRounds(parsed.rounds);
          if (parsed.completedRounds) setCompletedRounds(parsed.completedRounds);
          if (parsed.lang) setLang(parsed.lang);
          if (parsed.sessionDurationMinutes) setSessionDurationMinutes(parsed.sessionDurationMinutes);
          if (parsed.soundMode) setSoundMode(parsed.soundMode);
        } catch (e) {
          console.error("Failed to load local data", e);
        }
      }
    }
    // Small delay to ensure state is settled before allowing writes
    setTimeout(() => setIsLoaded(true), 50);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return; // Prevent overwriting with empty state before load
    
    const data: AppState = { 
      members, 
      rounds, 
      completedRounds,
      lang, 
      sessionDurationMinutes, 
      soundMode 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [members, rounds, completedRounds, lang, sessionDurationMinutes, soundMode, isLoaded]);

  // --- Actions ---

  const addMember = (name: string) => {
    const cleanName = sanitizeInput(name);
    if (!cleanName) return;
    
    setMembers(prevMembers => {
      // Avoid duplicates
      if (prevMembers.some(m => m.name.toLowerCase() === cleanName.toLowerCase())) {
        return prevMembers;
      }
      return [...prevMembers, { id: generateId(), name: cleanName }];
    });

    // Reset rounds when adding members to ensure consistency
    setRounds([]); 
    setCompletedRounds([]);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setRounds([]);
    setCompletedRounds([]);
  };

  const openClearModal = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearMembers = () => {
    setMembers([]);
    setRounds([]);
    setCompletedRounds([]);
    setIsClearModalOpen(false);
  };

  const handleGenerate = () => {
    const generatedRounds = generateRotationSchedule(members);
    setRounds(generatedRounds);
    setCompletedRounds([]); // Reset progress on new generation
    // On mobile, close menu after generating to show results
    setIsMobileMenuOpen(false);
  };

  const handleShare = async () => {
    if (members.length === 0) return;
    
    const names = members.map(m => m.name).join(',');
    const url = `${window.location.origin}${window.location.pathname}?members=${encodeURIComponent(names)}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const toggleRoundCompletion = (roundNum: number) => {
    setCompletedRounds(prev => {
      if (prev.includes(roundNum)) {
        return prev.filter(r => r !== roundNum);
      } else {
        return [...prev, roundNum];
      }
    });
  };

  const exportTXT = () => {
    if (rounds.length === 0) return;
    
    let text = `SPEEDBACK - Feedback Session\n\n`;
    rounds.forEach(r => {
      const isDone = completedRounds.includes(r.roundNumber) ? '[DONE]' : '[ ]';
      text += `--- ${t(lang, 'schedule.round').toUpperCase()} ${r.roundNumber} ${isDone} ---\n`;
      r.pairs.forEach(p => {
        text += `• ${p.member1.name} <> ${p.member2.name}\n`;
      });
      if (r.restingMember) {
        text += `• (${t(lang, 'schedule.rest')}: ${r.restingMember.name})\n`;
      }
      text += "\n";
    });

    downloadFile(text, 'txt');
  };

  const exportCSV = () => {
    if (rounds.length === 0) return;

    let csv = "Round,Status,Member 1,Member 2,Type,Notes\n";

    rounds.forEach(r => {
        const status = completedRounds.includes(r.roundNumber) ? 'Completed' : 'Pending';
        r.pairs.forEach(p => {
            csv += `${r.roundNumber},${status},"${sanitizeForCSV(p.member1.name)}","${sanitizeForCSV(p.member2.name)}","Pair",""\n`;
        });
        if (r.restingMember) {
            csv += `${r.roundNumber},${status},"${sanitizeForCSV(r.restingMember.name)}","","Rest",""\n`;
        }
    });

    downloadFile(csv, 'csv');
  };

  const downloadFile = (content: string, ext: 'txt' | 'csv') => {
    const mime = ext === 'csv' ? 'text/csv' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speedback-session.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  // Pre-load check to avoid flashing empty state before localStorage read
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-violet-600 w-8 h-8" />
      </div>
    );
  }

  // APP VIEW
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-zinc-900 overflow-hidden">
      
      <ConfirmModal 
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClearMembers}
        lang={lang}
      />

      <RecommendationsModal 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm safe-top">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-1.5 text-violet-700">
            <Zap className="fill-current" size={20} />
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Speedback</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {members.length > 0 && (
             <button
               onClick={handleShare}
               className={`p-2 rounded-full transition-all ${showCopiedToast ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-500 hover:bg-zinc-100'}`}
             >
               {showCopiedToast ? <Check size={20} /> : <Share2 size={20} />}
             </button>
           )}
           <SoundMenu mode={soundMode} onChange={setSoundMode} lang={lang} />
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop: Sticky / Mobile: Drawer) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-[85%] max-w-[320px] md:w-80 lg:w-96 
        bg-white border-r border-zinc-200 flex flex-col shadow-2xl md:shadow-xl md:shadow-zinc-200/50 
        transition-transform duration-300 ease-in-out safe-left
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Sidebar Header */}
        <div className="p-6 bg-white border-b border-zinc-100 flex justify-between items-start safe-top">
           <div className="flex items-center gap-2 text-violet-700">
              <Zap className="fill-current" size={24} />
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Speedback</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-600">
              <X size={24} />
            </button>
        </div>

        {/* Members Management Area */}
        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-zinc-900 mb-1">{t(lang, 'sidebar.title')}</h2>
            <p className="text-xs text-zinc-500">{t(lang, 'sidebar.desc')}</p>
          </div>
          
          <MemberInput onAdd={addMember} lang={lang} />
          <MemberList members={members} onRemove={removeMember} onClear={openClearModal} lang={lang} />
        </div>

        {/* Action Area */}
        <div className="p-6 bg-white border-t border-zinc-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10 pb-8 md:pb-6 safe-bottom space-y-3">
          
          <InstallPWA lang={lang} variant="mobile" className="!mb-0 !w-full" />
          
          <button
            onClick={handleGenerate}
            disabled={members.length < 2}
            className="w-full bg-slate-900 hover:bg-violet-600 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-violet-600/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
          >
            <Sparkles size={18} className="text-violet-300 group-hover:text-white group-hover:animate-pulse" />
            {rounds.length > 0 ? t(lang, 'sidebar.regenerate') : t(lang, 'sidebar.generate')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT: Timer & Schedule */}
      <main className="flex-grow flex flex-col h-[calc(100vh-65px)] md:h-screen overflow-hidden safe-right">
        
        {/* Desktop Header */}
        <header className="hidden md:flex flex-shrink-0 h-20 px-8 border-b border-zinc-200 bg-white/80 backdrop-blur-md items-center justify-between z-20 sticky top-0">
           <div>
             <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
               Session
             </h2>
           </div>

           <div className="flex items-center gap-3">
              <InstallPWA lang={lang} variant="desktop" />
              
              <SoundMenu mode={soundMode} onChange={setSoundMode} lang={lang} />

              <div className="w-px h-6 bg-zinc-200 mx-1"></div>

              {members.length > 0 && (
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    showCopiedToast 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                  }`}
                  title={t(lang, 'common.share')}
                >
                  {showCopiedToast ? <Check size={14} /> : <Share2 size={14} />}
                  <span>{showCopiedToast ? t(lang, 'common.linkCopied') : t(lang, 'common.share')}</span>
                </button>
              )}

              <button 
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg text-sm font-bold transition-all border border-violet-100"
                title={t(lang, 'recommendations.button')}
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">{t(lang, 'recommendations.button')}</span>
              </button>

              <button 
                onClick={toggleLang}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full text-xs font-bold transition-all"
              >
                <Globe size={14} />
                <span className="uppercase">{lang}</span>
              </button>
              
              {rounds.length > 0 && (
                <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
                   <button
                    onClick={exportTXT}
                    className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors"
                    title="Export TXT"
                  >
                    <FileText size={16} />
                  </button>
                  <div className="w-px h-4 bg-zinc-200"></div>
                   <button
                    onClick={exportCSV}
                    className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors"
                    title="Export CSV"
                  >
                    <Table2 size={16} />
                  </button>
                </div>
              )}
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-4 md:p-10 lg:p-12 custom-scrollbar pb-24 md:pb-12">
          
          {/* Mobile Toolbar (Export/Lang/Guide) */}
          <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button onClick={() => setIsGuideOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100 whitespace-nowrap">
                <BookOpen size={14} /> {t(lang, 'recommendations.button')}
              </button>
              <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold whitespace-nowrap">
                <Globe size={14} /> {lang.toUpperCase()}
              </button>
               {rounds.length > 0 && (
                <>
                  <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-xs font-bold whitespace-nowrap">
                    <Table2 size={14} /> CSV
                  </button>
                </>
              )}
          </div>

          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            
            {/* Timer Section */}
            <section className="transform transition-all">
              <Timer 
                duration={sessionDurationMinutes} 
                onDurationChange={setSessionDurationMinutes}
                lang={lang} 
                soundMode={soundMode}
              />
            </section>

            {/* Results Section */}
            <section>
              {rounds.length > 0 ? (
                <ScheduleDisplay 
                  rounds={rounds} 
                  completedRounds={completedRounds}
                  onToggleRound={toggleRoundCompletion}
                  lang={lang} 
                  roundDurationMinutes={sessionDurationMinutes}
                />
              ) : (
                <div className="mt-6 md:mt-10 p-8 md:p-12 rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-3xl flex items-center justify-center mb-4 md:mb-6 text-zinc-300 shadow-sm border border-white">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-zinc-800">{t(lang, 'schedule.waiting')}</h3>
                  <p className="text-zinc-500 max-w-xs md:max-w-md mt-2 leading-relaxed text-sm md:text-base">
                    {t(lang, 'schedule.waitingDesc')}
                  </p>
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="md:hidden mt-6 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold"
                  >
                    Open Menu
                  </button>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;