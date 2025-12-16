import { Language } from '../types';

export const t = (lang: Language, key: string): string => {
  const keys = key.split('.');
  let current: any = TRANSLATIONS[lang];
  
  for (const k of keys) {
    if (current[k] === undefined) return key;
    current = current[k];
  }
  
  return current;
};

export const TRANSLATIONS = {
  en: {
    common: {
      appTitle: "Speedback",
      subtitle: "Professional Feedback Rotator",
      loading: "Loading...",
      confirm: "Are you sure you want to delete everyone?",
      close: "Close",
      exitRoom: "Exit Room",
      language: "Language",
      install: "Install App",
      share: "Share Room",
      linkCopied: "Link copied to clipboard!"
    },
    room: {
      title: "Create Feedback Room",
      placeholder: "Enter room name (e.g. Design Team)",
      button: "Enter Room",
      hint: "This name will be used for exports"
    },
    sidebar: {
      title: "Participants",
      desc: "Add your team members. Paste a list or type names.",
      inputPlaceholder: "Paste names here (one per line or comma separated)...",
      addHelper: "Press Enter or click button to add",
      bulkMode: "Bulk Mode",
      listTitle: "Team Members",
      noMembers: "No participants",
      noMembersSub: "Add people above to start",
      clearList: "Clear List",
      generate: "Create Schedule",
      regenerate: "Regenerate",
      export: "Export TXT"
    },
    timer: {
      title: "Global Timer",
      min: "min",
      speaker1: "Turn: Speaker 1",
      speaker2: "Turn: Speaker 2",
      warning: "Switch in 10s...",
      finishing: "Finishing...",
      notificationTitle: "Time's Up!",
      notificationBody: "Next round.",
      switchTitle: "Swap Turns",
      switchBody: "Time for the other person to speak.",
      warnTitle: "Heads up",
      warnBody: "10 seconds to rotate speaker"
    },
    schedule: {
      title: "Agenda",
      roundsTotal: "Rounds",
      round: "Round",
      feedbackType: "Feedback 1:1",
      rest: "Break",
      waiting: "Waiting for setup",
      waitingDesc: "Add participants in the sidebar and generate rotations to view the agenda here.",
      markDone: "Done",
      completed: "Completed",
      reopen: "Re-open",
      progress: "Progress",
      totalEst: "Total Duration",
      importantTitle: "Important Preparation",
      importantBody: "Please ensure all participants come to the session with their feedback prepared in advance to maintain the schedule."
    },
    modal: {
      clearTitle: "Clear Participant List",
      clearMessage: "Are you sure you want to remove all participants? This action cannot be undone and the current schedule will be lost.",
      cancel: "Cancel",
      confirmDelete: "Yes, Clear All"
    },
    recommendations: {
      button: "Feedback Guide",
      title: "Session Guidelines",
      subtitle: "Choose a framework for your team"
    },
    sound: {
      all: "All Sounds",
      alarmsOnly: "Alarms Only (End)",
      mute: "Mute All"
    }
  },
  es: {
    common: {
      appTitle: "Speedback",
      subtitle: "Rotador de Feedback Profesional",
      loading: "Cargando...",
      confirm: "¿Estás seguro de que quieres borrar a todos?",
      close: "Cerrar",
      exitRoom: "Salir de Sala",
      language: "Idioma",
      install: "Instalar App",
      share: "Compartir Sala",
      linkCopied: "¡Enlace copiado al portapapeles!"
    },
    room: {
      title: "Crear Sala de Feedback",
      placeholder: "Nombre de la sala (ej. Equipo Diseño)",
      button: "Entrar a la Sala",
      hint: "Este nombre se usará en las exportaciones"
    },
    sidebar: {
      title: "Participantes",
      desc: "Añade a los miembros de tu equipo. Pega una lista o escribe nombres.",
      inputPlaceholder: "Pega nombres aquí (uno por línea o separados por comas)...",
      addHelper: "Presiona Enter o clic para añadir",
      bulkMode: "Modo Masivo",
      listTitle: "Miembros del Equipo",
      noMembers: "Sin participantes",
      noMembersSub: "Añade personas arriba para comenzar",
      clearList: "Limpiar Lista",
      generate: "Crear Rotaciones",
      regenerate: "Regenerar",
      export: "Exportar TXT"
    },
    timer: {
      title: "Timer Global",
      min: "min",
      speaker1: "Turno: Hablante 1",
      speaker2: "Turno: Hablante 2",
      warning: "Rotación en 10s...",
      finishing: "Finalizando...",
      notificationTitle: "¡Tiempo Terminado!",
      notificationBody: "Siguiente ronda.",
      switchTitle: "Cambio de Turno",
      switchBody: "Es hora de que hable la otra persona.",
      warnTitle: "Atención",
      warnBody: "10 segundos para rotar speaker"
    },
    schedule: {
      title: "Agenda",
      roundsTotal: "Rondas",
      round: "Ronda",
      feedbackType: "Feedback 1:1",
      rest: "Descanso",
      waiting: "Esperando configuración",
      waitingDesc: "Añade participantes en el panel lateral y genera las rotaciones para ver la agenda aquí.",
      markDone: "Listo",
      completed: "Completada",
      reopen: "Reabrir",
      progress: "Progreso",
      totalEst: "Duración Total",
      importantTitle: "Preparación Importante",
      importantBody: "Por favor, asegúrese de que todos los participantes vengan a la sesión con su feedback preparado de antemano para cumplir con el horario."
    },
    modal: {
      clearTitle: "Limpiar Lista de Participantes",
      clearMessage: "¿Estás seguro de que quieres eliminar a todos los participantes? Esta acción no se puede deshacer y el horario actual se perderá.",
      cancel: "Cancelar",
      confirmDelete: "Sí, Borrar Todo"
    },
    recommendations: {
      button: "Guía de Feedback",
      title: "Recomendaciones",
      subtitle: "Elige un marco de trabajo para tu equipo"
    },
    sound: {
      all: "Todos los sonidos",
      alarmsOnly: "Solo Alarmas (Final)",
      mute: "Silenciar Todo"
    }
  }
};