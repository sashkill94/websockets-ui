import { SocketWithNameAndId } from '../controller/socket-controller.js';
import { Game } from '../game/game.js';
import roomManager from '../game/room-manager.js';
import storage from '../storage/storage.js';
import { Ship, ShipMessage } from '../types/game-types.js';
import { SocketMessages } from '../types/socket-messages.js';

class RoomService {
  createRoom(creator: SocketWithNameAndId) {
    if (roomManager.checkIfUserHaveRoom(creator)) return;
    roomManager.createRoom(creator);
    this.updateRooms();
    this.updateWinners();
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
    roomManager.removeUserRooms(socket);
    this.updateRooms();
  }

  addShips(gameId: number, ships: ShipMessage[], indexPlayer: number) {
    const game = roomManager.getGame(gameId);
    if (!game) return;
    if (indexPlayer === 0) {
      game.ships1 = game.mapFromMessageToShip(ships);
      if (game.withBot) game.generateShipsToBot();
    } else {
      game.ships2 = game.mapFromMessageToShip(ships);
    }
    if (game.ships1 && game.ships2) {
      [game.user1, game.user2].forEach(el => {
        if (!el) return;
        el.send(
          JSON.stringify({
            type: 'start_game',
            data: JSON.stringify({
              ships: el === game.user1 ? game.ships1 : game.ships2,
              currentPlayerIndex: game.currentPlayer,
            }),
            id: 0,
          }),
        );
      });
      this.sendChangeTurn(game, false);
      if (game.withBot) this.checkIsBotCurrentPLayer(game)
    }
  }

  randomAtack(gameId: number, indexPlayer: number) {
    const game = roomManager.getGame(gameId);
    let point = this.getRandomPoint();
    while (!game?.checkRandomPoint(point)) {
      point = this.getRandomPoint();
    }
    console.log(point);
    this.attack(point.x, point.y, gameId, indexPlayer);
  }

  checkIsBotCurrentPLayer(game: Game) {
    if (game.withBot && game.currentPlayer === 1) {
      this.delay(1000).then(() => this.randomAtack(game.id, 1));
    }
  }

  delay(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  attack(x: number, y: number, gameId: number, indexPlayer: number) {
    const game = roomManager.getGame(gameId);
    if (game?.currentPlayer !== indexPlayer) return;
    const result: { result: string; killedShip: Ship | null } | undefined = game.attack(x, y);
    if (!result) return;
    this.sendAttackResponse(game, x, y, indexPlayer, result.result);
    if (result.killedShip && result.result === 'killed') {
      this.sendMissMessagesAfterKill(game, result.killedShip, indexPlayer);
    }
    if (game.isFinished) {
      this.sendFinishGame(game, game.currentPlayer);
      roomManager.removeRoom(gameId);
      const player = game.currentPlayer === 0 ? game.user1 : game.user2;
      if (!(game.withBot && game.currentPlayer === 1)) storage.addWin(player?.name || 'annonymus');
      this.updateRooms();
      this.updateWinners();
    } else this.sendChangeTurn(game, result.result === 'miss');
  }

  sendMissMessagesAfterKill(game: Game, ship: Ship, indexPlayer: number) {
    const arroundPoints = game.getShipArroundPoints(ship);
    arroundPoints.forEach(point => {
      const result = game.addPointToCurrentsShots(point);
      if (result) this.sendAttackResponse(game, point.x, point.y, indexPlayer, 'miss');
    });
  }

  sendAttackResponse(game: Game, x: number, y: number, indexPlayer: number, status: string) {
    [game.user1, game.user2].forEach(soket => {
      if (!soket) return;
      soket.send(
        JSON.stringify({
          type: 'attack',
          data: JSON.stringify({
            position: {
              x,
              y,
            },
            currentPlayer: indexPlayer /* id of the player in the current game */,
            status,
          }),
          id: 0,
        }),
      );
    });
  }

  sendChangeTurn(game: Game, turn: boolean) {
    if (turn) game.switchCurrentPLayer();
    [game.user1, game.user2].forEach(socket => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: 'turn',
          data: JSON.stringify({
            currentPlayer: game.currentPlayer,
          }),
          id: 0,
        }),
      );
    });
    this.checkIsBotCurrentPLayer(game);
  }

  sendFinishGame(game: Game, winPlayer: 0 | 1) {
    [game.user1, game.user2].forEach(socket => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: 'finish',
          data: JSON.stringify({
            winPlayer,
          }),
          id: 0,
        }),
      );
    });
  }

  updateWinners() {
    storage.users
      .filter(user => !user.inGame)
      .forEach(user => {
        user.socket.send(
          JSON.stringify({
            type: 'update_winners',
            data: JSON.stringify(storage.getWinners()),
            id: 0,
          }),
        );
      });
  }

  getRandomPoint() {
    const x = Math.ceil(Math.random() * 10) - 1;
    const y = Math.ceil(Math.random() * 10) - 1;
    return { x, y };
  }

  handleDisconnect(socket: SocketWithNameAndId) {
    const { name, id } = socket;
    if (!name || !id) return;
    const game = roomManager.getGameByUser(socket);
    if (!game) return;
    const winner = game.finishByDisconnect(socket);
    this.sendFinishGame(game, winner);
  }

  startSoloGame(socket: SocketWithNameAndId) {
    const roomId = roomManager.createRoom(socket);
    const room = roomManager.getRoom(roomId);
    if (!room) return;
    room.isSolo = true;
    room.startSoloGame();
    socket.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
          idGame: room.game?.id,
          idPlayer: 0,
        }),
        id: 0,
      }),
    );
  }
}

export default new RoomService();
