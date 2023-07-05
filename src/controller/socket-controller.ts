import { WebSocket, WebSocketServer } from 'ws';
import { SocketEvents } from '../types/socket-events.js';

export default class SocketController {
  server: WebSocketServer;
  socket: WebSocket;

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

  handleMessage(a: Buffer) {
    try {
      const message = JSON.parse(a.toString());
      console.log(message);
      
      // const candidateRoom = this.state.rooms.find((el) => el.name === room);
      // if (candidateRoom) {
      //   this.socket.emit(SocketEvents.RoomConnectionError, 'Room with this name already exists.');
      //   console.log(`Room ${room} already exists.`);
      //   return;
      // }
      // console.log('Create room - ', room);
      // this.room = this.state.createRoom(room, this.socket.id, this.io);
      // this.socket.join(room);
      // this.roomName = room;
      // this.socket.emit(SocketEvents.SuccessConnect);
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  
}
