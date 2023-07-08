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
      if (v.player2) return;
      rooms.push({ roomId: k, roomUsers: [{ name: v.player1.name, index: v.player1.id }] })
    });
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

}
export default new RoomManager();
