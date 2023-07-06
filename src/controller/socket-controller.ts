import { WebSocket, WebSocketServer } from 'ws';
import userService from '../services/user-service.js';
import { SocketMessages } from '../types/socket-messages.js';
import { SocketResponse, UserData } from '../types/socket-message.js';
import roomService from '../services/room-service.js';
import { GameResponse } from '../types/game-types.js';

export type SocketWithNameAndId = WebSocket & {name?: string, id?: number}

export default class SocketController {
  server: WebSocketServer;
  socket: SocketWithNameAndId;

  constructor(server: WebSocketServer, client: WebSocket) {
    this.server = server;
    this.socket = client;
    this.init();
  }

  init() {
    this.socket.on('message', this.handleMessage.bind(this));
    // this.socket.on(SocketEvents.RoomConnect, this.connectRoom.bind(this));
    // this.socket.on(SocketEvents.AutoConnect, this.autoConnect.bind(this));
    // this.socket.on(SocketEvents.CreateScene, this.sceneCreated.bind(this));
    // this.socket.on(SocketEvents.HitBall, this.handleHit.bind(this));
    // this.socket.on('disconnect', this.disconnectSocket.bind(this));
  }

  handleMessage(input: any) {
    try {
      const data = JSON.parse(input);
      if (!data.type) return;
      const message = data as SocketResponse;
      console.log(message);
      switch (message.type) {
        case SocketMessages.REGISTRATION: {
          const { name, password } = JSON.parse(message.data) as UserData;
          userService.createUser(name, password, this.socket);
          roomService.updateRooms();
          break;
        }
        case SocketMessages.CREATE_ROOM: {
          roomService.createRoom(this.socket);
          break;
        }
        case SocketMessages.ADD_USER: {
          const { indexRoom } = JSON.parse(message.data);
          roomService.addUser(indexRoom, this.socket);
          break;
        }
        case SocketMessages.ADD_SHIPS: {
          const { gameId, ships, indexPlayer } = JSON.parse(message.data) as GameResponse;
          roomService.addShips(gameId, ships, indexPlayer);
          break;
        }
        case SocketMessages.ATTACK:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.CREATE_GAME:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.FINISH:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.START_GAME:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.TURN:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.UPDATE_ROOM:
          //Инструкции, соответствующие value2
          break;
        case SocketMessages.UPDATE_WINNERS:
          //Инструкции, соответствующие value2
          break;
        default:
          //Здесь находятся инструкции, которые выполняются при отсутствии соответствующего значения
          //statements_def
          break;
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }
}
