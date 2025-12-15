import { joinRoom } from 'trystero';
import { Member, Round } from '../types';

// Tipos de acciones P2P
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

// Singleton para mantener la conexión
let roomInstance: any = null;
let actions: any = null;

const APP_ID = 'speedback_rotation_v1_app';

export const connectP2P = (roomId: string) => {
  if (roomInstance) {
    return actions;
  }

  // Conectar usando estrategia MQTT (definida en importmap)
  const config = { appId: APP_ID };
  const room = joinRoom(config, roomId);
  
  const [sendState, onState] = room.makeAction<StateActionPayload>('syncState');
  const [sendTimer, onTimer] = room.makeAction<TimerActionPayload>('syncTimer');

  roomInstance = room;
  actions = {
    room,
    sendState,
    onState,
    sendTimer,
    onTimer,
    onPeerJoin: room.onPeerJoin,
    onPeerLeave: room.onPeerLeave
  };

  return actions;
};

export const getP2P = () => {
  return actions;
};

export const disconnectP2P = () => {
  if (roomInstance) {
    try {
      roomInstance.leave();
    } catch (e) {
      console.error("Error leaving room", e);
    }
    roomInstance = null;
    actions = null;
  }
};