export enum RoastStyle {
  SAVAGE = 'savage',
  FRIENDLY = 'friendly',
  COMPLIMENT = 'compliment'
}

export interface RoastResponse {
  savage: string;
  friendly: string;
  compliment: string;
}

export interface AppState {
  image: string | null; // base64
  status: 'idle' | 'analyzing' | 'result' | 'error';
  roasts: RoastResponse | null;
  errorMsg: string | null;
}
