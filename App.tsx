import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Download, Zap, LogIn, Globe, LogOut, LayoutGrid, BookOpen } from 'lucide-react';

import { MemberInput } from './components/MemberInput';
import { MemberList } from './components/MemberList';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { Timer } from './components/Timer';
import { ConfirmModal } from './components/ConfirmModal';
import { RecommendationsModal } from './components/RecommendationsModal';
import { SoundMenu } from './components/SoundMenu';
import { generateRotationSchedule } from './services/rotationService';
import { Member, Round, Language, SoundMode } from './types';
import { t } from './constants/translations';

// Simple UUID generator fallback
const generateId = () => Math.random().toString(36).substr(2, 9);
const SYNC_CHANNEL_NAME = 'speedback_global_sync';

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [roomInput, setRoomInput] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(5);
  const [soundMode, setSoundMode] = useState<SoundMode>('all');
  
  // Modal State
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize Sync Channel
  useEffect(() => {
    syncChannelRef.current = new BroadcastChannel(SYNC_CHANNEL_NAME);
    syncChannelRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      // Only sync if in the same room
      if (payload.roomName === roomName && roomName !== null) {
        if (type === 'SYNC_STATE') {
          setMembers(payload.members);
          setRounds(payload.rounds);
        }
      }
    };

    return () => {
      syncChannelRef.current?.close();
    };
  }, [roomName]);

  const broadcastState = (newMembers: Member[], newRounds: Round[]) => {
    if (!roomName) return;
    syncChannelRef.current?.postMessage({
      type: 'SYNC_STATE',
      payload: {
        roomName,
        members: newMembers,
        rounds: newRounds
      }
    });
  };

  // Load from local storage on mount (Generic Store)
  useEffect(() => {
    // When roomName changes, try to load specific room data if we implemented room persistence
    // For now, we stick to the global store for simplicity or load "by room"
    if (roomName) {
       const saved = localStorage.getItem(`speedback_room_${roomName}`);
       if (saved) {
         try {
           const parsed = JSON.parse(saved);
           setMembers(parsed.members || []);
           setRounds(parsed.rounds || []);
         } catch (e) {
           console.error("Failed to load room data", e);
         }
       } else {
         // Reset if new room
         setMembers([]);
         setRounds([]);
       }
    }
  }, [roomName]);

  // Save to local storage on change AND broadcast
  useEffect(() => {
    if (roomName) {
      const data = { members, rounds };
      localStorage.setItem(`speedback_room_${roomName}`, JSON.stringify(data));
      // Note: We don't broadcast here to avoid infinite loops, we broadcast on specific actions
    }
  }, [members, rounds, roomName]);

  // Fix: Use functional update to support bulk additions safely in loops
  const addMember = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    
    setMembers(prevMembers => {
      if (prevMembers.some(m => m.name.toLowerCase() === cleanName.toLowerCase())) {
        return prevMembers;
      }
      const newMembers = [...prevMembers, { id: generateId(), name: cleanName }];
      broadcastState(newMembers, []); // Clear rounds when modifying members
      setRounds([]); 
      return newMembers;
    });
  };

  const removeMember = (id: string) => {
    const newMembers = members.filter(m => m.id !== id);
    setMembers(newMembers);
    setRounds([]);
    broadcastState(newMembers, []);
  };

  const openClearModal = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearMembers = () => {
    setMembers([]);
    setRounds([]);
    setIsClearModalOpen(false);
    broadcastState([], []);
  };

  const handleGenerate = () => {
    const generatedRounds = generateRotationSchedule(members);
    setRounds(generatedRounds);
    broadcastState(members, generatedRounds);
  };

  const exportSchedule = () => {
    if (rounds.length === 0) return;
    
    let text = `${roomName?.toUpperCase() || 'SPEEDBACK'} - Feedback Session\n\n`;
    rounds.forEach(r => {
      text += `--- ${t(lang, 'schedule.round').toUpperCase()} ${r.roundNumber} ---\n`;
      r.pairs.forEach(p => {
        text += `• ${p.member1.name} <> ${p.member2.name}\n`;
      });
      if (r.restingMember) {
        text += `• (${t(lang, 'schedule.rest')}: ${r.restingMember.name})\n`;
      }
      text += "\n";
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speedback-${roomName?.replace(/\s+/g, '-').toLowerCase() || 'session'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEnterRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      setRoomName(roomInput.trim());
    }
  };

  const handleExitRoom = () => {
    setRoomName(null);
    setRoomInput('');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  // ROOM ENTRY VIEW (LANDING PAGE)
  if (!roomName) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-violet-500/30">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>
        
        <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
          
          <div className="flex justify-center mb-8">
             <div className="bg-gradient-to-tr from-slate-800 to-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-black/50 ring-1 ring-white/10 border border-white/5 relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <Zap className="text-violet-400 w-12 h-12 fill-current relative z-10" />
             </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/20 border border-slate-200/60 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{t(lang, 'common.appTitle')}</h1>
              <p className="text-slate-500 font-medium text-sm">{t(lang, 'common.subtitle')}</p>
            </div>
            
            <form onSubmit={handleEnterRoom} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{t(lang, 'room.title')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LayoutGrid className="h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    placeholder={t(lang, 'room.placeholder')}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-semibold text-base"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={!roomInput.trim()}
                className="w-full bg-slate-900 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-slate-900/10 hover:shadow-violet-600/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>{t(lang, 'room.button')}</span>
                <LogIn size={20} />
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
               <p className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                 {t(lang, 'room.hint')}
               </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
               onClick={toggleLang}
               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md"
            >
              <Globe size={16} />
              <span>{lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // APP VIEW
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-zinc-900">
      
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

      {/* SIDEBAR: Configuration & Members */}
      <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-zinc-200 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 shadow-xl shadow-zinc-200/50 z-30">
        
        {/* Logo Area */}
        <div className="p-6 bg-white border-b border-zinc-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-violet-700">
              <Zap className="fill-current" size={24} />
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Speedback</h1>
            </div>
          </div>
          <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
             <div className="flex items-center gap-2 px-2">
                <LayoutGrid size={14} className="text-zinc-400"/>
                <p className="text-xs text-zinc-600 font-bold truncate max-w-[120px]">{roomName}</p>
             </div>
             <button 
                onClick={handleExitRoom}
                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                title={t(lang, 'common.exitRoom')}
             >
               <LogOut size={14} />
             </button>
          </div>
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
        <div className="p-6 bg-white border-t border-zinc-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
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
      <main className="flex-grow flex flex-col h-auto md:h-screen overflow-hidden">
        
        {/* Header */}
        <header className="flex-shrink-0 h-20 px-8 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between z-20 sticky top-0">
           <div>
             <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
               {roomName}
               <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-violet-100">Session</span>
             </h2>
           </div>

           <div className="flex items-center gap-3">
              <SoundMenu mode={soundMode} onChange={setSoundMode} lang={lang} />
              
              <div className="w-px h-6 bg-zinc-200 mx-1"></div>

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
                <button
                  onClick={exportSchedule}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 hover:border-violet-300 hover:text-violet-700 transition-all shadow-sm"
                >
                  <Download size={16} />
                  {t(lang, 'sidebar.export')}
                </button>
              )}
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-12 pb-20">
            
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
                  lang={lang} 
                  roundDurationMinutes={sessionDurationMinutes}
                />
              ) : (
                <div className="mt-10 p-12 rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-3xl flex items-center justify-center mb-6 text-zinc-300 shadow-sm border border-white">
                    <RefreshCw size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800">{t(lang, 'schedule.waiting')}</h3>
                  <p className="text-zinc-500 max-w-md mt-2 leading-relaxed">
                    {t(lang, 'schedule.waitingDesc')}
                  </p>
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