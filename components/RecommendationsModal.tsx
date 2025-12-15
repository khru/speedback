import React, { useState } from 'react';
import { X, Shield, Zap, Rocket, Star, BookOpen, Brain, Heart, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

type TabType = 'hybrid' | 'performance' | 'safety' | 'tactical' | 'mindset';

export const RecommendationsModal: React.FC<RecommendationsModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hybrid');

  if (!isOpen) return null;

  const content = {
    es: {
      hybrid: {
        title: "Manifiesto Speedback (Recomendado)",
        desc: "Equilibrio entre rapidez y calidad humana. El estándar oficial.",
        rules: [
          { title: "Hechos sobre Sentimientos", desc: "No me digas qué soy, dime qué hice. Trae un dato concreto." },
          { title: "Futuro sobre Pasado (Feedforward)", desc: "No te quejes de lo que ya pasó. Dame una idea para hacerlo mejor la próxima vez." },
          { title: "El Candado", desc: "Quien recibe el feedback no puede debatir. Escucha, procesa y cierra con un 'Gracias'." }
        ]
      },
      performance: {
        title: "Alto Rendimiento",
        desc: "Basado en Radical Candor. Crecimiento rápido sin rodeos.",
        rules: [
          { title: "Prohibido Generalizar", desc: "Nada de 'eres genial' o 'eres desorganizado'. Ejemplo específico obligatorio." },
          { title: "La Fórmula SBI", desc: "Situación + Comportamiento (Behavior) + Impacto." },
          { title: "Mata al 'Sándwich'", desc: "No escondas una crítica entre dos elogios falsos. Ve al punto." },
          { title: "Escucha Activa", desc: "El receptor tiene prohibido defenderse. Su único trabajo es entender." }
        ]
      },
      safety: {
        title: "Seguridad Psicológica",
        desc: "Basado en Comunicación No Violenta. Prioriza la relación humana.",
        rules: [
          { title: "Cámara de Video", desc: "Describe hechos (lo que graba una cámara), no juicios ('llegaste tarde' vs 'no te importa')." },
          { title: "Habla desde el 'Yo'", desc: "Expresa cómo te sentiste tú, en lugar de acusar al otro." },
          { title: "Peticiones, no Exigencias", desc: "Termina con una solicitud clara que se puede aceptar o rechazar." },
          { title: "El Regalo", desc: "Quien recibe debe agradecer el riesgo que el otro ha tomado para ayudarle." }
        ]
      },
      tactical: {
        title: "Táctico & Veloz",
        desc: "Eficiencia pura para sesiones cortas.",
        rules: [
          { title: "La Ley del Silencio", desc: "Mientras te dan feedback, es ilegal interrumpir o justificarse." },
          { title: "La Salida Única", desc: "Al terminar, la única palabra permitida es: 'Gracias'." },
          { title: "Regla del 10%", desc: "Asume que el 90% puede estar mal, pero busca el 10% de verdad que te sirve." },
          { title: "Orientado a la Acción", desc: "Solo cosas que se puedan cambiar. No critiques personalidad." }
        ]
      },
      mindset: {
        title: "Mentalidad y Reglas de Oro",
        desc: "Reglas de oro para asegurar que el feedback sea constructivo y bien recibido.",
        pillars: [
          {
            title: "Pilar 1: Ownership (Mentalidad)",
            icon: Shield,
            color: "text-blue-600",
            items: [
              { title: "Mírate al espejo primero", text: "Antes de señalar un error, pregúntate: ¿He sido claro? ¿He dado apoyo?" },
              { title: "Separa el Estímulo de la Respuesta", text: "No reacciones de inmediato. Usa el espacio entre la crítica y tu emoción para elegir una respuesta racional." },
              { title: "Humildad, no Pasividad", text: "Escucha para entender. Si no estás de acuerdo, agradece y procesa antes de debatir." },
              { title: "Céntrate en lo que Controlas", text: "Tú controlas tu mensaje, no la reacción del otro. No te frustres por lo que no depende de ti." }
            ]
          },
          {
            title: "Pilar 2: Comunicación Efectiva",
            icon: Heart,
            color: "text-rose-600",
            items: [
              { title: "Observación vs Evaluación", text: "Usa el 'filtro de cámara'. Describe hechos observables, no juicios morales." },
              { title: "Expresa Sentimientos Reales", text: "Di 'Me siento frustrado', no 'Siento que me ignoras' (eso es un juicio)." },
              { title: "La Necesidad detrás", text: "Identifica qué necesitas (confianza, claridad, apoyo) y pídelo explícitamente." },
              { title: "Peticiones Positivas", text: "No digas lo que NO quieres. Pide acciones concretas de lo que SÍ quieres que pase." }
            ]
          }
        ],
        cheatSheet: {
          giver: [
            "Hechos, no Opiniones: ¿Lo podría grabar una cámara?",
            "Lenguaje Positivo: ¿Pido lo que quiero o me quejo?",
            "Propósito: ¿Ayudo al equipo o me desahogo?"
          ],
          receiver: [
            "Escudo Estoico: Separa lo que dicen de quién eres.",
            "Propiedad Extrema: Busca el 1% de verdad.",
            "Humildad: Escucha para entender, no para responder."
          ]
        }
      }
    },
    en: {
      hybrid: {
        title: "Speedback Manifesto (Recommended)",
        desc: "Balance between speed and human quality. The official standard.",
        rules: [
          { title: "Facts over Feelings", desc: "Don't tell me what I am, tell me what I did. Bring concrete data." },
          { title: "Future over Past (Feedforward)", desc: "Don't complain about the past. Give me an idea to do better next time." },
          { title: "The Lock", desc: "The receiver cannot debate. Listen, process, and close with a 'Thank you'." }
        ]
      },
      performance: {
        title: "High Performance",
        desc: "Based on Radical Candor. Fast growth without fluff.",
        rules: [
          { title: "No Generalizations", desc: "No 'you are great' or 'you are messy'. Specific examples are mandatory." },
          { title: "The SBI Formula", desc: "Situation + Behavior + Impact." },
          { title: "Kill the 'Sandwich'", desc: "Don't hide criticism between two fake compliments. Get to the point." },
          { title: "Active Listening", desc: "The receiver is forbidden to defend themselves. Their only job is to understand." }
        ]
      },
      safety: {
        title: "Psychological Safety",
        desc: "Based on Non-Violent Communication. Prioritizes human connection.",
        rules: [
          { title: "Video Camera", desc: "Describe facts (what a camera records), not judgments ('you were late' vs 'you don't care')." },
          { title: "Speak from 'I'", desc: "Express how you felt, rather than accusing the other person." },
          { title: "Requests, not Demands", desc: "End with a clear request that can be accepted or rejected." },
          { title: "The Gift", desc: "The receiver must thank the other for the risk taken to help them." }
        ]
      },
      tactical: {
        title: "Tactical & Fast",
        desc: "Pure efficiency for short sessions.",
        rules: [
          { title: "The Law of Silence", desc: "While receiving feedback, it is illegal to interrupt or justify yourself." },
          { title: "The Single Exit", desc: "When finished, the only allowed word is: 'Thank you'." },
          { title: "The 10% Rule", desc: "Assume 90% might be wrong, but look for the 10% of truth that helps you." },
          { title: "Action Oriented", desc: "Only things that can be changed. Do not criticize personality." }
        ]
      },
      mindset: {
        title: "Mindset & Golden Rules",
        desc: "Core principles to ensure feedback is constructive and well-received.",
        pillars: [
          {
            title: "Pillar 1: Ownership (Mindset)",
            icon: Shield,
            color: "text-blue-600",
            items: [
              { title: "Mirror First", text: "Before pointing out an error, ask: Was I clear? Did I provide support?" },
              { title: "Separate Stimulus from Response", text: "Don't react immediately. Use the gap between criticism and emotion to choose a rational response." },
              { title: "Humility, not Passivity", text: "Listen to understand. If you disagree, thank them and process before debating." },
              { title: "Focus on Control", text: "You control your message, not their reaction. Don't get frustrated by what isn't yours." }
            ]
          },
          {
            title: "Pillar 2: Effective Communication",
            icon: Heart,
            color: "text-rose-600",
            items: [
              { title: "Observation vs Evaluation", text: "Use the 'camera filter'. Describe observable facts, not moral judgments." },
              { title: "Express Real Feelings", text: "Say 'I feel frustrated', not 'I feel like you ignore me' (that's a judgment)." },
              { title: "The Need Behind", text: "Identify what you need (trust, clarity, support) and ask for it explicitly." },
              { title: "Positive Requests", text: "Don't say what you DON'T want. Ask for concrete actions of what you DO want." }
            ]
          }
        ],
        cheatSheet: {
          giver: [
            "Facts, not Opinions: Could a camera record it?",
            "Positive Language: Am I asking for what I want?",
            "Purpose: Am I helping the team or venting?"
          ],
          receiver: [
            "Stoic Shield: Separate words from self-worth.",
            "Extreme Ownership: Find the 1% of truth.",
            "Humility: Listen to understand, not to respond."
          ]
        }
      }
    }
  };

  const tabs = [
    { id: 'hybrid', icon: Star, label: lang === 'es' ? 'Manifiesto' : 'Manifesto', color: 'text-amber-500', bg: 'bg-amber-500' },
    { id: 'performance', icon: Rocket, label: lang === 'es' ? 'Rendimiento' : 'Performance', color: 'text-violet-500', bg: 'bg-violet-500' },
    { id: 'safety', icon: Shield, label: lang === 'es' ? 'Seguridad' : 'Safety', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { id: 'tactical', icon: Zap, label: lang === 'es' ? 'Táctico' : 'Tactical', color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'mindset', icon: Brain, label: lang === 'es' ? 'Mentalidad' : 'Mindset', color: 'text-pink-500', bg: 'bg-pink-500' },
  ];

  const currentContent = content[lang][activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-zinc-50 border-r border-zinc-200 flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
          <div className="p-6 border-b border-zinc-200 hidden md:block">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <BookOpen className="text-violet-600" size={20} />
              <span>{t(lang, 'recommendations.title')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t(lang, 'recommendations.subtitle')}</p>
          </div>
          
          <div className="flex md:flex-col p-2 gap-1 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold w-full whitespace-nowrap md:whitespace-normal
                  ${activeTab === tab.id 
                    ? 'bg-white shadow-md text-slate-900 ring-1 ring-zinc-200' 
                    : 'text-slate-500 hover:bg-zinc-100 hover:text-slate-700'
                  }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? `${tab.bg}/10` : 'bg-zinc-100'}`}>
                  <tab.icon size={16} className={activeTab === tab.id ? tab.color : 'text-zinc-400'} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="max-w-3xl mx-auto pb-10">
              
              <div className="mb-8">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${tabs.find(t => t.id === activeTab)?.bg} bg-opacity-10 ${tabs.find(t => t.id === activeTab)?.color}`}>
                   {tabs.find(t => t.id === activeTab)?.label}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  {currentContent.title}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                  {currentContent.desc}
                </p>
              </div>

              {activeTab === 'mindset' ? (
                /* Specialized Layout for Mindset Tab */
                <div className="space-y-10">
                  {/* Pillars Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentContent.pillars?.map((pillar, idx) => (
                      <div key={idx} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <div className="flex items-center gap-3 mb-4">
                          <pillar.icon className={pillar.color} size={24} />
                          <h3 className="font-bold text-slate-900">{pillar.title}</h3>
                        </div>
                        <ul className="space-y-4">
                          {pillar.items.map((item, i) => (
                            <li key={i}>
                              <p className="font-semibold text-sm text-slate-800 mb-1">{item.title}</p>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Cheat Sheet Table */}
                  <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="bg-zinc-50 border-b border-zinc-200 p-4">
                      <h3 className="font-bold text-slate-800 text-center uppercase tracking-widest text-xs">Cheat Sheet</h3>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-zinc-100">
                      <div className="p-0">
                         <div className="bg-blue-50/50 p-2 text-center border-b border-blue-50">
                           <span className="text-xs font-bold text-blue-700">FEEDBACK GIVER</span>
                         </div>
                         <ul className="p-4 space-y-3">
                           {currentContent.cheatSheet?.giver.map((item, i) => (
                             <li key={i} className="flex gap-2 text-sm text-slate-600">
                               <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                               <span>{item}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                      <div className="p-0">
                         <div className="bg-emerald-50/50 p-2 text-center border-b border-emerald-50">
                           <span className="text-xs font-bold text-emerald-700">FEEDBACK RECEIVER</span>
                         </div>
                         <ul className="p-4 space-y-3">
                           {currentContent.cheatSheet?.receiver.map((item, i) => (
                             <li key={i} className="flex gap-2 text-sm text-slate-600">
                               <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                               <span>{item}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Layout for other tabs */
                <div className="grid gap-6">
                  {currentContent.rules?.map((rule, idx) => (
                    <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-violet-100 hover:shadow-md transition-all group">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-300 shadow-sm border border-zinc-100 group-hover:text-violet-500 group-hover:border-violet-200 transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{rule.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {rule.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};