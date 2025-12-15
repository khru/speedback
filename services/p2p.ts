import { Member, Round } from '../types';

// Tipos de acciones
export type TimerActionPayload = 
  | { type: 'START'; endTimestamp: number; duration: number }
  | { type: 'STOP'; timeLeft: number }
  | { type: 'RESET'; duration: number }
  | { type: 'UPDATE_DURATION'; duration: number };

export type StateActionPayload = {
  members: Member[];
  rounds: Round[];
  timestamp: number;
};

type MessageType = 
  | { channel: 'syncState'; payload: StateActionPayload }
  | { channel: 'syncTimer'; payload: TimerActionPayload };

const CHANNEL_NAME = 'speedback_v1_broadcast';

// Singleton para mantener el canal
let broadcastChannel: BroadcastChannel | null = null;
let listeners: {
  onState: ((payload: StateActionPayload) => void) | null;
  onTimer: ((payload: TimerActionPayload) => void) | null;
} = {
  onState: null,
  onTimer: null
};

export const connectP2P = (roomId: string) => {
  if (broadcastChannel) {
    return getActions();
  }

  // Inicializar BroadcastChannel
  broadcastChannel = new BroadcastChannel(`${CHANNEL_NAME}_${roomId}`);
  
  broadcastChannel.onmessage = (event) => {
    const data = event.data as MessageType;
    if (data.channel === 'syncState' && listeners.onState) {
      listeners.onState(data.payload);
    } else if (data.channel === 'syncTimer' && listeners.onTimer) {
      listeners.onTimer(data.payload);
    }
  };

  return getActions();
};

const getActions = () => {
  return {
    sendState: (payload: StateActionPayload) => {
      broadcastChannel?.postMessage({ channel: 'syncState', payload });
    },
    onState: (callback: (payload: StateActionPayload) => void) => {
      listeners.onState = callback;
    },
    sendTimer: (payload: TimerActionPayload) => {
      broadcastChannel?.postMessage({ channel: 'syncTimer', payload });
    },
    onTimer: (callback: (payload: TimerActionPayload) => void) => {
      listeners.onTimer = callback;
    },
    // Mocking peer methods as BroadcastChannel doesn't support peer awareness natively
    // In a real local-first app, you might not need peer counts, or you'd use a heartbeat.
    onPeerJoin: (cb: (id: string) => void) => { /* No-op for BroadcastChannel */ },
    onPeerLeave: (cb: (id: string) => void) => { /* No-op for BroadcastChannel */ }
  };
};

export const getP2P = () => {
  if (!broadcastChannel) return null;
  return getActions();
};

export const disconnectP2P = () => {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
    listeners = { onState: null, onTimer: null };
  }
};