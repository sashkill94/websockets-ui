import { SocketWithNameAndId } from '../controller/socket-controller.js';
import roomManager from '../game/room-manager.js';
import storage from '../storage/storage.js';
import { ShipMessage } from '../types/game-types.js';
import { SocketMessages } from '../types/socket-messages.js';

class RoomService {
  createRoom(creator: SocketWithNameAndId) {
    roomManager.createRoom(creator);
    this.updateRooms();
  }

  updateRooms() {
    const data = roomManager.getAllFreeRoms();
    storage.users
      .filter(user => !user.inGame)
      .forEach(user => {
        user.socket.send(
          JSON.stringify({
            type: SocketMessages.UPDATE_ROOM,
            data: JSON.stringify(data),
            id: 0,
          }),
        );
      });
  }

  addUser(roomId: number, socket: SocketWithNameAndId) {
    const room = roomManager.getRoom(roomId);
    if (!room || room.player1.id == socket.id || room.player2) return;
    room.player2 = socket;
    const game = room.startGame();
    [room.player1, room.player2].forEach((el, index) => {
      el.send(
        JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({
            idGame: game.id,
            idPlayer: index,
          }),
          id: 0,
        }),
      );
    });
  }

  addShips(gameId: number, ships: ShipMessage[], indexPlayer: number) {
    console.log(gameId, ships, indexPlayer);
  }


}

export default new RoomService();
