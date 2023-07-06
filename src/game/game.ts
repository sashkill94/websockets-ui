import { EventListenerOptions } from "ws";
import { SocketWithNameAndId } from "../controller/socket-controller.js";
import { Ship, ShipMessage } from "../types/game-types.js";

export class Game {

  private static id = 1;
  id: number;
  user1: SocketWithNameAndId;
  user2: SocketWithNameAndId;
  private _ships1!: Ship[];
  private _ships2!: Ship[]; 

  constructor(user1: SocketWithNameAndId, user2: SocketWithNameAndId){
    this.id = Game.id++;
    this.user1 = user1;
    this.user2 = user2;
  }

  set ships1 (ships: ShipMessage[]) {
    this._ships1 = this.mapFromMessageToShip(ships);
  }

  set ships2 (ships: ShipMessage[]) {
    this._ships2 = this.mapFromMessageToShip(ships);
  }

  private mapFromMessageToShip(ships: ShipMessage[]) {
    return ships.map((el) => {
      const start = el.position;
      const points: {x: number, y: number}[] = [];
      for (let i = 0; i < el.length; i++) {
        el.direction ? points.push({x: start.x, y: start.y - i})
                     : points.push({x: start.x + i, y: start.y})
      }
      return points;
    })
  }



}