import React, { useEffect, useState } from 'react';
import { Download, MonitorDown } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface InstallPWAProps {
  lang: Language;
  className?: string;
  variant?: 'mobile' | 'desktop';
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ lang, className = '', variant = 'desktop' }) => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: any) => {
        // Reset after choice
        if (choiceResult.outcome === 'accepted') {
            setSupportsPWA(false);
        }
    });
  };

  if (!supportsPWA) {
    return null;
  }

  if (variant === 'mobile') {
      return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 mb-3 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-all ${className}`}
        >
            <Download size={14} />
            {t(lang, 'common.install')}
        </button>
      )
  }

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs font-bold transition-all shadow-sm shadow-violet-200 ${className}`}
      onClick={onClick}
      title={t(lang, 'common.install')}
    >
      <MonitorDown size={14} />
      <span className="hidden lg:inline">{t(lang, 'common.install')}</span>
    </button>
  );
};