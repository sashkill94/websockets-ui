export interface SocketResponse {
  type: string;
  data: any;
  id: number;
}

export interface UserData {
  name: string;
  password: string;
}

export interface AtackMessage {
  x: number;
  y: number;
  gameId: number;
  indexPlayer: number;
}

export interface RandomAtackMessage {
  gameId: number;
  indexPlayer: number;
}
