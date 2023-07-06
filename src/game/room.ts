import { SocketWithNameAndId } from "../controller/socket-controller.js";
import { Game } from "./game.js";

export class Room {

  player1: SocketWithNameAndId;
  player2: SocketWithNameAndId | undefined;
  game: Game | undefined;

  constructor(player1: SocketWithNameAndId){
    this.player1 = player1
  }

  startGame() {
    this.game = new Game(this.player1, this.player2!);
    return this.game;
  }

}