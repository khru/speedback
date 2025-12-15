export interface Member {
  id: string;
  name: string;
}

export interface Pair {
  member1: Member;
  member2: Member;
}

export interface Round {
  roundNumber: number;
  pairs: Pair[];
  restingMember?: Member | null;
}

export interface IcebreakerResponse {
  questions: string[];
}

export type Language = 'en' | 'es';

export type SoundMode = 'all' | 'alarms-only' | 'mute';

export interface SoundSettings {
  mode: SoundMode;
}

export interface TranslationDictionary {
  [key: string]: {
    [key: string]: string;
  };
}