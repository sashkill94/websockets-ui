export interface GameResponse {
  gameId: number;
  ships: ShipMessage[];
  indexPlayer: number;
}

export interface ShipMessage {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export type Ship = {
  isKilled: boolean;
  points: { x: number; y: number; status: boolean }[];
};

export type Point = { x: number; y: number };

export interface AtackMessage {
  x: number;
  y: number;
  gameId: number;
  indexPlayer: number;
}
