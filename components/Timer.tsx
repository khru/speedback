import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Mic, RefreshCw, AlertCircle } from 'lucide-react';
import { Language, SoundMode } from '../types';
import { t } from '../constants/translations';
import { getP2P, TimerActionPayload } from '../services/p2p';

interface TimerProps {
  duration: number;
  onDurationChange: (minutes: number) => void;
  lang: Language;
  soundMode: SoundMode;
  roomName: string | null;
}

export const Timer: React.FC<TimerProps> = ({ duration, onDurationChange, lang, soundMode, roomName }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [totalTime, setTotalTime] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Ref to track duration changes vs pause events
  const prevDurationRef = useRef(duration);
  
  const audioEndRef = useRef<HTMLAudioElement | null>(null);
  const audioSwitchRef = useRef<HTMLAudioElement | null>(null);
  const audioWarnRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const notifiedSwitchRef = useRef(false);
  const notifiedWarnRef = useRef(false);

  // Sync state ONLY when duration changes manually, NOT when isRunning toggles
  useEffect(() => {
    if (prevDurationRef.current !== duration) {
      setTotalTime(duration * 60);
      setTimeLeft(duration * 60);
      setIsRunning(false);
      prevDurationRef.current = duration;
    }
  }, [duration]);

  // Hook into P2P
  useEffect(() => {
    if (!roomName) return;
    const p2p = getP2P();
    if (!p2p) return;

    // Listener for P2P timer events
    p2p.onTimer((data: TimerActionPayload) => {
      if (data.type === 'START') {
        const { endTimestamp, duration: remoteDuration } = data;
        endTimeRef.current = endTimestamp;
        setTotalTime(remoteDuration);
        setIsRunning(true);
        // Calculate remaining immediately
        const remaining = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
        setTimeLeft(remaining);
        resetNotificationRefs();
      } else if (data.type === 'STOP') {
        setIsRunning(false);
        endTimeRef.current = null;
        // Sync pause time from peer to avoid drift
        if (data.timeLeft !== undefined) {
            setTimeLeft(data.timeLeft);
        }
      } else if (data.type === 'RESET') {
        setIsRunning(false);
        endTimeRef.current = null;
        setTotalTime(data.duration);
        setTimeLeft(data.duration);
        resetNotificationRefs();
      }
    });

  }, [roomName]);

  useEffect(() => {
    audioEndRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioSwitchRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); 
    audioWarnRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3');

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const resetNotificationRefs = () => {
    notifiedSwitchRef.current = false;
    notifiedWarnRef.current = false;
  };

  const playSound = (type: 'end' | 'warn' | 'switch') => {
    if (soundMode === 'mute') return;
    
    // Logic: 'alarms-only' only plays 'end'. 'all' plays everything.
    if (soundMode === 'alarms-only' && type !== 'end') return;

    try {
      if (type === 'end') audioEndRef.current?.play().catch(() => {});
      if (type === 'warn') audioWarnRef.current?.play().catch(() => {});
      if (type === 'switch') audioSwitchRef.current?.play().catch(() => {});
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const triggerNotification = (title: string, body: string, soundType: 'end' | 'warn' | 'switch') => {
    playSound(soundType);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (endTimeRef.current) {
          const now = Date.now();
          const remaining = Math.ceil((endTimeRef.current - now) / 1000);
          const halfTime = Math.ceil(totalTime / 2);
          
          if (remaining === halfTime + 10 && !notifiedWarnRef.current) {
             triggerNotification(t(lang, 'timer.warnTitle'), t(lang, 'timer.warnBody'), 'warn');
             notifiedWarnRef.current = true;
          }

          if (remaining === halfTime && !notifiedSwitchRef.current) {
             triggerNotification(t(lang, 'timer.switchTitle'), t(lang, 'timer.switchBody'), 'switch');
             notifiedSwitchRef.current = true;
          }

          if (remaining <= 0) handleComplete();
          else setTimeLeft(remaining);
        } else {
          // Fallback if endTime not set (should not happen in p2p start)
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [isRunning, totalTime, lang, soundMode]);

  const handleComplete = () => {
    setTimeLeft(0);
    setIsRunning(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    endTimeRef.current = null;
    triggerNotification(t(lang, 'timer.notificationTitle'), t(lang, 'timer.notificationBody'), 'end');
  };

  const broadcast = (payload: TimerActionPayload) => {
    const p2p = getP2P();
    if (p2p) {
      p2p.sendTimer(payload);
    }
  };

  const handleStart = () => {
    const now = Date.now();
    const endTimestamp = now + (timeLeft * 1000);
    endTimeRef.current = endTimestamp;
    resetNotificationRefs();
    setIsRunning(true);
    
    const remaining = timeLeft;
    const halfTime = Math.ceil(totalTime / 2);
    if (remaining < halfTime + 10) notifiedWarnRef.current = true;
    if (remaining < halfTime) notifiedSwitchRef.current = true;

    // Send P2P
    broadcast({ type: 'START', endTimestamp, duration: totalTime });
  };

  const handlePause = () => {
    setIsRunning(false);
    
    // Calculate exact timeLeft to save before nullifying endTimeRef
    let currentRemaining = timeLeft;
    if (endTimeRef.current) {
        currentRemaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(currentRemaining);
    }
    
    endTimeRef.current = null;
    broadcast({ type: 'STOP', timeLeft: currentRemaining });
  };

  const handleReset = () => {
    const newDuration = duration * 60;
    setIsRunning(false);
    setTotalTime(newDuration);
    setTimeLeft(newDuration);
    endTimeRef.current = null;
    resetNotificationRefs();
    broadcast({ type: 'RESET', duration: newDuration });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      onDurationChange(val);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const halfTime = totalTime / 2;
  const isSecondHalf = timeLeft <= halfTime;
  const isWarningZone = timeLeft <= halfTime + 10 && timeLeft > halfTime;
  const progress = timeLeft / totalTime;
  
  let statusColor = "text-emerald-400";
  let barColor = "bg-emerald-500";
  let phaseText = t(lang, 'timer.speaker1');
  let phaseIcon = <Mic size={16} className="text-emerald-500" />;
  
  if (timeLeft <= 10) {
    statusColor = "text-rose-500 animate-pulse";
    barColor = "bg-rose-500";
    phaseText = t(lang, 'timer.finishing');
    phaseIcon = <AlertCircle size={16} className="text-rose-500" />;
  } else if (isSecondHalf) {
    statusColor = "text-amber-400";
    barColor = "bg-amber-500";
    phaseText = t(lang, 'timer.speaker2');
    phaseIcon = <RefreshCw size={16} className="text-amber-500" />;
  } else if (isWarningZone) {
    phaseText = t(lang, 'timer.warning');
    statusColor = "text-emerald-200 animate-pulse";
    phaseIcon = <AlertCircle size={16} className="text-emerald-200 animate-bounce" />;
  }

  return (
    <div className="bg-[#1e1e2e] rounded-2xl p-6 shadow-2xl border border-white/5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000 ${isRunning ? 'opacity-100' : 'opacity-20'}`} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2 text-zinc-400">
          <TimerIcon size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">{t(lang, 'timer.title')}</span>
        </div>
        
        {!isRunning && (
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
             <input 
               type="number" 
               min="1" 
               max="60"
               value={duration}
               onChange={handleInputChange}
               className="w-8 bg-transparent text-white text-right text-sm font-mono outline-none"
             />
             <span className="text-xs text-zinc-500 font-medium">{t(lang, 'timer.min')}</span>
          </div>
        )}
      </div>

      <div className="text-center relative z-10 py-2">
        <div className={`text-7xl font-mono font-medium tracking-tighter ${statusColor} transition-colors duration-500`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border border-white/5 bg-white/5 ${isWarningZone ? 'text-white' : 'text-zinc-400'} transition-all`}>
          {phaseIcon}
          <span>{phaseText}</span>
        </div>
      </div>

      <div className="mt-8 relative z-10 flex items-center justify-between gap-4">
        <div className="flex-grow h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900 z-10 h-full"></div>
          <div 
            className={`h-full ${barColor} transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor]`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
           {!isRunning ? (
            <button onClick={handleStart} className="bg-white text-black hover:bg-zinc-200 p-3 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
              <Play size={20} fill="currentColor" />
            </button>
          ) : (
            <button onClick={handlePause} className="bg-zinc-800 text-white hover:bg-zinc-700 p-3 rounded-full transition-transform hover:scale-105 active:scale-95 border border-zinc-700">
              <Pause size={20} fill="currentColor" />
            </button>
          )}

          <button onClick={handleReset} className="text-zinc-500 hover:text-white p-3 rounded-full transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};