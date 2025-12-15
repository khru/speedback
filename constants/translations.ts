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
      language: "Language"
    },
    room: {
      title: "Create Feedback Room",
      placeholder: "Enter room name (e.g. Design Team)",
      button: "Enter Room",
      hint: "This name will be used for exports"
    },
    sidebar: {
      title: "Participants",
      desc: "Add your team members.",
      inputPlaceholder: "Names separated by commas...",
      addHelper: "Press Enter to add",
      bulkMode: "Bulk Mode Detected",
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
      title: "Scheduled Sessions",
      roundsTotal: "Total Rounds",
      round: "Round",
      feedbackType: "Feedback 1:1",
      rest: "Break / Rest",
      waiting: "Waiting for setup",
      waitingDesc: "Add participants in the sidebar and generate rotations to view the agenda here.",
      markDone: "Mark Complete",
      completed: "Completed",
      reopen: "Re-open Round",
      progress: "Session Progress",
      sessionTime: "Active Session",
      setupTime: "Setup & Buffer",
      prepTime: "+10m prep & transitions",
      totalEst: "Total Est. Time",
      includesSetup: "Incl. 10m setup + transitions",
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
      language: "Idioma"
    },
    room: {
      title: "Crear Sala de Feedback",
      placeholder: "Nombre de la sala (ej. Equipo Diseño)",
      button: "Entrar a la Sala",
      hint: "Este nombre se usará en las exportaciones"
    },
    sidebar: {
      title: "Participantes",
      desc: "Añade a los miembros de tu equipo.",
      inputPlaceholder: "Nombres separados por comas...",
      addHelper: "Presiona Enter para añadir",
      bulkMode: "Modo Masivo Detectado",
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
      title: "Sesiones Programadas",
      roundsTotal: "Rondas Totales",
      round: "Ronda",
      feedbackType: "Feedback 1:1",
      rest: "Descanso",
      waiting: "Esperando configuración",
      waitingDesc: "Añade participantes en el panel lateral y genera las rotaciones para ver la agenda aquí.",
      markDone: "Marcar Lista",
      completed: "Completada",
      reopen: "Reabrir Ronda",
      progress: "Progreso de Sesión",
      sessionTime: "Sesión Activa",
      setupTime: "Prep. y Setup",
      prepTime: "+10m prep y transiciones",
      totalEst: "Tiempo Total Est.",
      includesSetup: "Incl. 10m setup + transiciones",
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