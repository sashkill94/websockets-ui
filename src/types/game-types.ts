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
  type: "small" | "medium" | "large" | "huge";
}

export type Ship = {x: number; y: number; }[];