import React, { useEffect, useState } from 'react';
import { Lightbulb, X, MessageSquareQuote, RefreshCw } from 'lucide-react';
import { generateIcebreakers } from '../services/geminiService';
import { Pair, Language } from '../types';
import { t } from '../constants/translations';

interface IcebreakerModalProps {
  pair: Pair | null;
  onClose: () => void;
  lang: Language;
}

export const IcebreakerModal: React.FC<IcebreakerModalProps> = ({ pair, onClose, lang }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    if (!pair) return;
    setLoading(true);
    const result = await generateIcebreakers(pair.member1.name, pair.member2.name, lang);
    setQuestions(result);
    setLoading(false);
  };

  useEffect(() => {
    if (pair) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair, lang]);

  if (!pair) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in slide-in-from-bottom-8 duration-300 ring-1 ring-white/20">
        
        {/* Header */}
        <div className="bg-[#1e1e2e] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-violet-500/20 rounded-lg text-violet-300">
              <Lightbulb size={20} />
            </div>
            <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">{t(lang, 'modal.guide')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{t(lang, 'modal.title')}</h2>
          <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
             <span>{pair.member1.name}</span>
             <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
             <span>{pair.member2.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-zinc-50/50">
          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="animate-spin h-6 w-6 text-violet-600 mx-auto mb-3" />
              <p className="text-zinc-500 font-medium text-sm">{t(lang, 'modal.preparing')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">{t(lang, 'modal.subtitle')}</h3>
              {questions.map((q, idx) => (
                <div key={idx} className="group flex gap-4 items-start bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all">
                  <div className="mt-1">
                    <MessageSquareQuote size={20} className="text-violet-500" />
                  </div>
                  <p className="text-zinc-700 leading-relaxed font-medium text-sm sm:text-base">{q}</p>
                </div>
              ))}
              
              <button 
                onClick={fetchQuestions}
                className="w-full mt-6 py-3 text-sm text-zinc-600 font-semibold hover:text-violet-700 hover:bg-white border border-transparent hover:border-zinc-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                {t(lang, 'modal.refresh')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};