import { SocketWithNameAndId } from '../controller/socket-controller.js';
import { Point, Ship, ShipMessage } from '../types/game-types.js';

/* eslint-disable */
export class Game {
  private static id = 1;
  id: number;
  user1: SocketWithNameAndId;
  user2: SocketWithNameAndId;
  ships1!: Ship[];
  ships2!: Ship[];
  shots1: Point[] = [];
  shots2: Point[] = [];
  currentPlayer: 0 | 1;
  isFinished = false;

  constructor(user1: SocketWithNameAndId, user2: SocketWithNameAndId) {
    this.id = Game.id++;
    this.user1 = user1;
    this.user2 = user2;
    this.currentPlayer = (Math.ceil(Math.random() * 2) - 1) as 0 | 1;
  }

  attack(x: number, y: number) {
    const shots = this.currentPlayer === 0 ? this.shots1 : this.shots2;
    const retry = shots.some((el) => el.x === x && el.y === y);
    if (retry) return;
    shots.push({x, y});
    const ships = this.currentPlayer === 0 ? this.ships2 : this.ships1;
    return this.hitShips(x, y, ships);
  }

  switchCurrentPLayer() {
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    return this.currentPlayer;
  }

  hitShips(x: number, y: number, ships: Ship[]) {
    let result: 'miss' | 'killed' | 'shot' = 'miss';
    let killedShip: Ship | null = null;
    ships.forEach((ship) => {
      if (ship.isKilled) return;
      let currentIsKilled = true;
      ship.points.forEach((point) => {
        if (point.x === x && point.y === y && point.status) {
          point.status = false;
          result = 'shot';
        }
        if (point.status) currentIsKilled = false;
      });
      if (currentIsKilled) {
        ship.isKilled = currentIsKilled;
        result = 'killed';
        killedShip = ship;
      }
    });
    this.isFinished = ships.every(el => el.isKilled);
    return {result, killedShip};
  }

  getShipArroundPoints(ship: Ship) {
    const allArroudPoints: Point[] = [];
    ship.points.forEach((point) => {
      allArroudPoints.push(...this.getArroundPoints(point.x, point.y));
    });
    return allArroudPoints.filter((point) => {
      let result = true;
      ship.points.forEach(el => {
        if(el.x === point.x && el.y === point.y) result = false;
      })
      return result
    });
  }

  mapFromMessageToShip(ships: ShipMessage[]) {
    return ships.map(el => {
      const start = el.position;
      const points: { x: number; y: number; status: boolean }[] = [];
      for (let i = 0; i < el.length; i++) {
        el.direction ? points.push({ x: start.x, y: start.y + i, status: true })
                     : points.push({ x: start.x + i, y: start.y, status: true });
      }
      return { isKilled: false, points};
    });
  }

  getArroundPoints(x: number, y: number) {
    const points: Point[] = [];
    points.push({ x: x - 1, y });
    points.push({ x: x - 1, y: y - 1 });
    points.push({ x: x, y: y - 1 });
    points.push({ x: x + 1, y: y - 1 });
    points.push({ x: x + 1, y});
    points.push({ x: x + 1, y: y + 1 });
    points.push({ x: x, y: y + 1 });
    points.push({ x: x - 1, y: y + 1 });
    return points.filter(point => this.checkPoint(point.x, point.y))
  }

  checkPoint(x: number, y: number) {
    return !(x > 9 || x < 0 || y > 9 || y < 0)
  }

  addPointToCurrentsShots(point: Point) {
    const shots = this.currentPlayer === 0 ? this.shots1 : this.shots2;
    const retry = shots.some((el) => el.x === point.x && el.y === point.y);
    if (retry) return false;
    return !!shots.push(point);    
  }

  checkRandomPoint(point: Point) {
    const shots = this.currentPlayer === 0 ? this.shots1 : this.shots2;
    return !shots.some((el) => el.x === point.x && el.y === point.y); 
  }
}
