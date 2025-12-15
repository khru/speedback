import { Language } from '../types';

// Servicio de Feedback Prompts (Offline)

const PROMPTS_EN = [
  "Mention a key strength this person brings to the team.",
  "In what area do you think this person has improved the most recently?",
  "What advice would you give to increase their impact on the next project?",
  "Describe a situation where this person helped or inspired you.",
  "What technical or soft skill should they continue to develop?",
  "If this person were a team lead, what quality would you highlight?",
  "How would you describe this person's communication style in one word?",
  "What do you value most about working with them?",
  "Is there a process where you think their input would be valuable?",
  "Feedback 'Start, Stop, Continue': What should they start doing?",
  "Feedback 'Start, Stop, Continue': What should they stop doing?",
  "Feedback 'Start, Stop, Continue': What should they continue doing?",
  "How does this person handle moments of pressure?",
  "What unique perspective do they bring to meetings?",
  "One idea for us to collaborate better in the future is..."
];

const PROMPTS_ES = [
  "Menciona una fortaleza clave que esta persona aporta al equipo.",
  "¿En qué área crees que esta persona ha mejorado más últimamente?",
  "¿Qué consejo le darías para aumentar su impacto en el próximo proyecto?",
  "Describe una situación donde esta persona te haya ayudado o inspirado.",
  "¿Qué habilidad técnica o blanda debería seguir desarrollando?",
  "Si esta persona fuera un líder de equipo, ¿qué cualidad destacarías?",
  "¿Cómo describirías el estilo de comunicación de esta persona en una palabra?",
  "¿Qué es lo que más valoras de trabajar con él/ella?",
  "¿Hay algún proceso donde creas que su intervención sería valiosa?",
  "Feedback 'Start, Stop, Continue': ¿Qué debería empezar a hacer?",
  "Feedback 'Start, Stop, Continue': ¿Qué debería dejar de hacer?",
  "Feedback 'Start, Stop, Continue': ¿Qué debería continuar haciendo?",
  "¿Cómo maneja esta persona los momentos de presión?",
  "¿Qué perspectiva única aporta a las reuniones?",
  "Una idea para que colaboremos mejor en el futuro es..."
];

export const generateIcebreakers = async (name1: string, name2: string, lang: Language = 'en'): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const source = lang === 'es' ? PROMPTS_ES : PROMPTS_EN;
      
      // Barajamos el array y tomamos 3
      const shuffled = [...source].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      // Personalizamos ocasionalmente
      if (Math.random() > 0.5) {
        if (lang === 'es') {
          selected[0] = `Para ${name1}: ¿Cuál consideras que es el "superpoder" de ${name2}?`;
        } else {
          selected[0] = `For ${name1}: What do you consider to be ${name2}'s "superpower"?`;
        }
      }
      
      resolve(selected);
    }, 300);
  });
};