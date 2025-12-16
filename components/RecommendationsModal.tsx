import React, { useState } from 'react';
import { X, Shield, Zap, Rocket, Star, BookOpen, Brain, Heart, CheckCircle2, AlertTriangle, MessageCircle, Clock, Target, ThumbsUp, Microscope, Gift } from 'lucide-react';
import { Language } from '../types';
import { t } from '../constants/translations';

interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

type TabType = 'hybrid' | 'performance' | 'safety' | 'tactical' | 'mindset';

interface SectionItem {
  title: string;
  desc: string;
}

interface Section {
  title: string;
  icon?: any;
  color?: string; // Tailwind text color class
  items: SectionItem[];
  isWarning?: boolean; // For Anti-patterns
}

interface TabContent {
  title: string;
  desc: string;
  sections: Section[];
}

export const RecommendationsModal: React.FC<RecommendationsModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hybrid');

  if (!isOpen) return null;

  const content: Record<Language, Record<TabType, TabContent>> = {
    es: {
      hybrid: {
        title: "Fundamentos y Preparación",
        desc: "Antes de hablar: mentalidad, preparación y respeto.",
        sections: [
          {
            title: "Checklist de Vuelo (Antes de ir)",
            icon: CheckCircle2,
            color: "text-emerald-600",
            items: [
              { title: "1. Preparado", desc: "Tengo ejemplos concretos y recientes. No hablo de memoria." },
              { title: "2. Temperatura", desc: "No voy 'en caliente' ni enfadado. Ha pasado poco tiempo, pero el suficiente para enfriar." },
              { title: "3. Receptividad", desc: "¿Es buen momento para la otra persona? ¿Está abierta a recibirlo?" },
              { title: "4. Intención", desc: "Voy a ayudar, no a descargar mi frustración." }
            ]
          },
          {
            title: "Mentalidad",
            icon: Gift,
            color: "text-pink-600",
            items: [
              { title: "Es un Regalo", desc: "El feedback es un dato para que la otra persona mejore. Dalo con esa generosidad." },
              { title: "El Espejo (Auto-feedback)", desc: "Antes de juzgar, pregúntate: ¿Qué podría haber hecho yo mejor para evitar esto? Empieza por ti." },
              { title: "Digestión", desc: "Al recibir feedback, no reacciones al instante. Reflexiona, separa el 'dato' de la emoción y decide qué tomar." },
              { title: "Intención Clara", desc: "“Te lo digo para que te vaya mejor, no para tener razón.”" }
            ]
          },
          {
            title: "Reglas de Respeto",
            icon: Heart,
            color: "text-rose-600",
            items: [
              { title: "Respeto tu tiempo", desc: "Voy al grano, pido permiso: “¿Tienes 2 minutos?”" },
              { title: "Respeto tu trabajo", desc: "Critico el output (el resultado), no tu valor como persona." },
              { title: "Respeto la verdad", desc: "Digo lo que veo (hechos), no lo que imagino (suposiciones)." }
            ]
          }
        ]
      },
      performance: {
        title: "Modelos y Estructura",
        desc: "Fórmulas probadas para dar feedback constructivo.",
        sections: [
          {
            title: "Fórmula Corta (S.C.I.)",
            icon: Rocket,
            color: "text-violet-600",
            items: [
              { title: "Situación", desc: "“En la reunión de ayer…” (Contexto específico)." },
              { title: "Conducta", desc: "“Cuando interrumpiste a X…” (Acción observable)." },
              { title: "Impacto", desc: "“El equipo dejó de aportar ideas…” (Consecuencia real)." },
              { title: "Futuro", desc: "“La próxima, ¿puedes dejar terminar antes de hablar?”" }
            ]
          },
          {
            title: "Feedback Positivo",
            icon: ThumbsUp,
            color: "text-emerald-600",
            items: [
              { title: "Sé específico", desc: "No digas “Buen trabajo”. Di: “La forma en que organizaste los datos ayudó a…”" },
              { title: "Explica el porqué", desc: "Conecta la acción con el éxito del equipo o negocio." },
              { title: "Hazlo transferible", desc: "“Esa calma bajo presión, úsala también en la demo con cliente.”" }
            ]
          }
        ]
      },
      safety: {
        title: "Seguridad Psicológica y Blameless",
        desc: "Cómo corregir sin culpar y atacando al problema, no a la persona.",
        sections: [
          {
            title: "Cultura Blameless (Sin Culpa)",
            icon: Microscope,
            color: "text-blue-600",
            items: [
              { title: "Acción observable vs. Persona", desc: "Describe lo que hizo (video), no cómo es (foto). Evita: “Eres desordenado”. Usa: “Los archivos no estaban en la carpeta”." },
              { title: "Comportamiento vs. Valores", desc: "No ataques su identidad ni sus valores. Céntrate en la conducta visible." },
              { title: "Sistémico", desc: "Asume que la persona quería hacerlo bien. ¿Falló el proceso? ¿La herramienta? ¿La instrucción?" }
            ]
          },
          {
            title: "Empatía y Firmeza",
            icon: Shield,
            color: "text-indigo-600",
            items: [
              { title: "Valida primero", desc: "“Entiendo que estabas bajo presión…”" },
              { title: "Curiosidad", desc: "“¿Qué te llevó a tomar esa decisión?” (Pregunta genuina, no trampa)." },
              { title: "Cuida el tono", desc: "Directo no es agresivo. Se puede ser firme y amable a la vez." }
            ]
          },
          {
            title: "No Violenta (Express)",
            icon: MessageCircle,
            color: "text-teal-600",
            items: [
              { title: "1. Hecho", desc: "Sin adjetivos. Solo datos." },
              { title: "2. Sentimiento/Impacto", desc: "Cómo me afecta a mí o al proyecto." },
              { title: "3. Necesidad", desc: "Lo que falta (claridad, tiempo, calidad)." },
              { title: "4. Petición", desc: "Clara, positiva y realizable." }
            ]
          }
        ]
      },
      tactical: {
        title: "Táctica y Claridad",
        desc: "Herramientas para asegurar que el mensaje llega limpio.",
        sections: [
          {
            title: "Comunicación Clara",
            icon: Zap,
            color: "text-amber-600",
            items: [
              { title: "Hechos, no etiquetas", desc: "“Llegaste 10 min tarde” (Hecho). “Eres impuntual” (Etiqueta)." },
              { title: "Concreto > General", desc: "Evita “Siempre” o “Nunca”. Cita el evento específico." },
              { title: "Cierra el bucle", desc: "“¿Qué te llevas de esto?” o “¿Cómo lo ves tú?”" }
            ]
          },
          {
            title: "Cuándo y Dónde",
            icon: Clock,
            color: "text-slate-600",
            items: [
              { title: "Rápido", desc: "Cuanto antes mejor, pero asegúrate de estar calmado." },
              { title: "Privado", desc: "La corrección siempre en privado. El elogio puede ser público." },
              { title: "Directo", desc: "No uses intermediarios. Habla con la persona, no de la persona." }
            ]
          }
        ]
      },
      mindset: {
        title: "Mentalidad y Anti-patrones",
        desc: "Cómo recibir feedback y qué errores evitar.",
        sections: [
          {
            title: "Cómo recibir feedback",
            icon: Brain,
            color: "text-purple-600",
            items: [
              { title: "Escucha activo", desc: "Apaga tu voz interna defensiva. Escucha para entender." },
              { title: "Agradece", desc: "Alguien ha dedicado tiempo a ayudarte. “Gracias” es la mejor respuesta." },
              { title: "Ownership", desc: "No busques excusas. Toma lo que te sirve y comprométete a probar." }
            ]
          },
          {
            title: "Anti-patrones (AVOID)",
            icon: AlertTriangle,
            isWarning: true,
            color: "text-red-600",
            items: [
              { title: "“For your own good”", desc: "Paternalista. Mejor explica el impacto real en el trabajo." },
              { title: "The Sandwich", desc: "Fake praise + Criticism + Fake praise. Dilutes message and breeds mistrust." },
              { title: "Hoarding", desc: "Don't save a list of errors to dump them all at the annual review." },
              { title: "Psychoanalysis", desc: "Don't guess why they are that way. Talk about what they do, not what they are." }
            ]
          }
        ]
      }
    },
    en: {
      hybrid: {
        title: "Foundations & Preparation",
        desc: "Before speaking: mindset, preparation, and respect.",
        sections: [
          {
            title: "Pre-flight Checklist",
            icon: CheckCircle2,
            color: "text-emerald-600",
            items: [
              { title: "1. Prepared", desc: "I have concrete, recent examples. Not speaking from vague memory." },
              { title: "2. Temperature", desc: "I am not 'heated' or angry. Enough time has passed to cool down." },
              { title: "3. Receptivity", desc: "Is the recipient ready? Are they open to hearing this now?" },
              { title: "4. Intention", desc: "I am here to help, not to vent my frustration." }
            ]
          },
          {
            title: "Mindset",
            icon: Gift,
            color: "text-pink-600",
            items: [
              { title: "Feedback is a Gift", desc: "It's data to help the other person grow. Give it with generosity." },
              { title: "The Mirror (Self-feedback)", desc: "What could I have done better? Before judging, review your own responsibility." },
              { title: "Digestion", desc: "Don't react instantly. Take time to process what you received and separate data from emotion." },
              { title: "Clear Intention", desc: "“I'm telling you this so you can improve, not to be right.”" }
            ]
          },
          {
            title: "Rules of Respect",
            icon: Heart,
            color: "text-rose-600",
            items: [
              { title: "Respect time", desc: "Get to the point. Ask permission: “Do you have 2 minutes?”" },
              { title: "Respect work", desc: "Critique the output, not their value as a person." },
              { title: "Respect truth", desc: "Say what you see (facts), not what you imagine (assumptions)." }
            ]
          }
        ]
      },
      performance: {
        title: "Models & Structure",
        desc: "Proven formulas for constructive feedback.",
        sections: [
          {
            title: "Short Formula (S.B.I.)",
            icon: Rocket,
            color: "text-violet-600",
            items: [
              { title: "Situation", desc: "“In yesterday's meeting…” (Specific context)." },
              { title: "Behavior", desc: "“When you interrupted X…” (Observable action)." },
              { title: "Impact", desc: "“The team stopped sharing ideas…” (Real consequence)." },
              { title: "Future", desc: "“Next time, could you let them finish before speaking?”" }
            ]
          },
          {
            title: "Positive Feedback",
            icon: ThumbsUp,
            color: "text-emerald-600",
            items: [
              { title: "Be specific", desc: "Don't say “Good job”. Say: “The way you organized the data helped to…”" },
              { title: "Explain why", desc: "Connect the action to team or business success." },
              { title: "Make it transferable", desc: "“That calmness under pressure, use it in the client demo too.”" }
            ]
          }
        ]
      },
      safety: {
        title: "Psychological Safety & Blameless",
        desc: "Correcting without blaming; attacking the problem, not the person.",
        sections: [
          {
            title: "Blameless Culture",
            icon: Microscope,
            color: "text-blue-600",
            items: [
              { title: "Observable Action vs. Person", desc: "Describe what they did (video), not how they are (photo). Avoid: “You are messy”. Use: “Files were not in the folder”." },
              { title: "Behavior vs. Values", desc: "Do not attack their identity or values. Focus on visible conduct." },
              { title: "Systemic", desc: "Assume they wanted to do well. Did the process fail? The tool? The instruction?" }
            ]
          },
          {
            title: "Empathy & Firmness",
            icon: Shield,
            color: "text-indigo-600",
            items: [
              { title: "Validate first", desc: "“I understand you were under pressure…”" },
              { title: "Curiosity", desc: "“What led you to that decision?” (Genuine question, not a trap)." },
              { title: "Watch the tone", desc: "Direct is not aggressive. You can be firm and kind simultaneously." }
            ]
          },
          {
            title: "Non-Violent (Express)",
            icon: MessageCircle,
            color: "text-teal-600",
            items: [
              { title: "1. Fact", desc: "No adjectives. Just data." },
              { title: "2. Feeling/Impact", desc: "How it affects me or the project." },
              { title: "3. Need", desc: "What is missing (clarity, time, quality)." },
              { title: "4. Request", desc: "Clear, positive, and doable." }
            ]
          }
        ]
      },
      tactical: {
        title: "Tactics & Clarity",
        desc: "Tools to ensure the message lands cleanly.",
        sections: [
          {
            title: "Clear Communication",
            icon: Zap,
            color: "text-amber-600",
            items: [
              { title: "Facts, not labels", desc: "“You arrived 10 min late” (Fact). “You are unpunctual” (Label)." },
              { title: "Concrete > General", desc: "Avoid “Always” or “Never”. Cite the specific event." },
              { title: "Close the loop", desc: "“What is your takeaway?” or “How do you see it?”" }
            ]
          },
          {
            title: "When and Where",
            icon: Clock,
            color: "text-slate-600",
            items: [
              { title: "Fast", desc: "Sooner is better, but ensure you are calm." },
              { title: "Private", desc: "Correction always in private. Praise can be public." },
              { title: "Direct", desc: "No triangulation. Speak to the person, not about the person." }
            ]
          }
        ]
      },
      mindset: {
        title: "Mindset & Anti-patterns",
        desc: "How to receive feedback and what errors to avoid.",
        sections: [
          {
            title: "How to Receive Feedback",
            icon: Brain,
            color: "text-purple-600",
            items: [
              { title: "Active listening", desc: "Turn off your internal defensive voice. Listen to understand." },
              { title: "Thank you", desc: "Someone took time to help you. “Thank you” is the best response." },
              { title: "Ownership", desc: "Don't make excuses. Take what is useful and commit to trying." }
            ]
          },
          {
            title: "Anti-patterns (AVOID)",
            icon: AlertTriangle,
            isWarning: true,
            color: "text-red-600",
            items: [
              { title: "“For your own good”", desc: "Patronizing. Better to explain the real impact on work." },
              { title: "The Sandwich", desc: "Fake praise + Criticism + Fake praise. Dilutes message and breeds mistrust." },
              { title: "Hoarding", desc: "Don't save a list of errors to dump them all at the annual review." },
              { title: "Psychoanalysis", desc: "Don't guess why they are that way. Talk about what they do, not what they are." }
            ]
          }
        ]
      }
    }
  };

  const tabs = [
    { id: 'hybrid', icon: Star, label: lang === 'es' ? 'Fundamentos' : 'Foundations', color: 'text-amber-500', bg: 'bg-amber-500' },
    { id: 'performance', icon: Rocket, label: lang === 'es' ? 'Estructura' : 'Structure', color: 'text-violet-500', bg: 'bg-violet-500' },
    { id: 'safety', icon: Shield, label: lang === 'es' ? 'Seguridad' : 'Safety', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { id: 'tactical', icon: Zap, label: lang === 'es' ? 'Táctico' : 'Tactical', color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'mindset', icon: Brain, label: lang === 'es' ? 'Mentalidad' : 'Mindset', color: 'text-pink-500', bg: 'bg-pink-500' },
  ];

  const currentContent = content[lang][activeTab];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white md:rounded-2xl shadow-2xl w-full md:max-w-5xl h-[100dvh] md:h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Sidebar / Tabs Column */}
        <div className="w-full md:w-64 bg-zinc-50 border-r border-zinc-200 flex-shrink-0 flex flex-col">
          
          {/* Mobile Header (Visible only on mobile) */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white shrink-0 z-20">
             <div className="flex items-center gap-2 font-bold text-slate-800">
                <BookOpen size={18} className="text-violet-600"/>
                <span>{t(lang, 'recommendations.title')}</span>
             </div>
             <button 
                onClick={onClose}
                className="p-2 -mr-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
             >
                <X size={24} />
             </button>
          </div>

          {/* Desktop Sidebar Header */}
          <div className="p-6 border-b border-zinc-200 hidden md:block">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <BookOpen className="text-violet-600" size={20} />
              <span>{t(lang, 'recommendations.title')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
               {lang === 'es' ? 'Elige un marco de trabajo' : 'Choose a framework'}
            </p>
          </div>
          
          {/* Tabs Container */}
          <div className="flex md:flex-col p-2 gap-1 w-full overflow-x-auto md:overflow-visible bg-zinc-50 border-b md:border-b-0 border-zinc-200 scrollbar-hide shrink-0 z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold whitespace-nowrap md:whitespace-normal flex-shrink-0 md:w-full select-none
                  ${activeTab === tab.id 
                    ? 'bg-white shadow-md text-slate-900 ring-1 ring-zinc-200' 
                    : 'text-slate-500 hover:bg-zinc-100 hover:text-slate-700'
                  }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === tab.id ? `${tab.bg}/10` : 'bg-zinc-100'}`}>
                  <tab.icon size={16} className={activeTab === tab.id ? tab.color : 'text-zinc-400'} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
          
          {/* Desktop Close Button (Hidden on Mobile) */}
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-4 right-4 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar pb-24 md:pb-10">
            <div className="max-w-3xl mx-auto">
              
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

              {/* Sections Layout */}
              <div className="space-y-8">
                {currentContent.sections?.map((section, idx) => (
                  <div key={idx} className={`rounded-2xl border overflow-hidden ${section.isWarning ? 'bg-red-50 border-red-100' : 'bg-zinc-50 border-zinc-100'}`}>
                    <div className={`px-6 py-4 border-b flex items-center gap-3 ${section.isWarning ? 'border-red-100' : 'border-zinc-200/50'}`}>
                      {section.icon && (
                        <div className={`p-2 rounded-lg bg-white shadow-sm shrink-0 ${section.color}`}>
                           <section.icon size={18} />
                        </div>
                      )}
                      <h3 className={`font-bold text-lg ${section.isWarning ? 'text-red-800' : 'text-slate-800'}`}>
                        {section.title}
                      </h3>
                    </div>
                    
                    <div className="p-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                       {section.items.map((item, i) => (
                         <div key={i} className={`p-4 rounded-xl bg-white border shadow-sm transition-all hover:shadow-md ${section.isWarning ? 'border-red-100 hover:border-red-200' : 'border-zinc-100 hover:border-violet-100'} h-full`}>
                            <h4 className={`font-bold text-sm mb-1.5 ${section.isWarning ? 'text-red-700' : 'text-slate-900'}`}>
                              {item.title}
                            </h4>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                              {item.desc}
                            </p>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};