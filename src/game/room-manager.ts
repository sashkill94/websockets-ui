import { Socket } from "dgram";
import { SocketWithNameAndId } from "../controller/socket-controller.js";
import { Room } from "./room.js";

class RoomManager {

  private static roomId = 1;
  rooms: Map<number, Room> = new Map();

  createRoom(creator: SocketWithNameAndId){
    const room = new Room(creator);
    const id = RoomManager.roomId++;
    this.rooms.set(id, room);
    return id;
  }

  getAllFreeRoms() {
    const rooms: any = [];
    this.rooms.forEach((v, k) => {
      if (v.player2 && !v.isSolo) return;
      rooms.push({ roomId: k, roomUsers: [{ name: v.player1.name, index: v.player1.id }] })
    });
    console.log(rooms);
    return rooms;
  }

  getRoom(id: number) {
    return this.rooms.get(id);
  }

  getGame(gameId: number) {
    for (const room of this.rooms.values()) {
      if (room.game?.id === gameId) return room.game;
    }
  }

  removeRoom(gameId: number) {
    let key;
    for (const entry of this.rooms.entries()) {
      if (entry[1].game?.id === gameId) key = entry[0];
    }
    if (key) this.rooms.delete(key);
  }

  removeUserRooms(user: SocketWithNameAndId) {
    let key;
    for (const entry of this.rooms.entries()) {
      if (entry[1].player1 === user) key = entry[0];
    }
    if (key) this.rooms.delete(key);
  }

  checkIfUserHaveRoom(user: SocketWithNameAndId) {
    let key;
    for (const entry of this.rooms.entries()) {
      if (entry[1].player1 === user) key = entry[0];
    }
    return !!key;
  }

  getGameByUser(user: SocketWithNameAndId) {
    let key;
    for (const entry of this.rooms.entries()) {
      if (entry[1].player1 === user || entry[1].player2 === user) key = entry[0];
    }
    if (key) return this.rooms.get(key)?.game;
    return null;
  }

}
export default new RoomManager();
