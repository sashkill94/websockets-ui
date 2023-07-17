import { SocketWithNameAndId } from "../controller/socket-controller.js";

export interface User {
  name: string,
  password: string,
  socket: SocketWithNameAndId,
  inGame: boolean
}