import { SocketWithNameAndId } from '../controller/socket-controller.js';
import storage from '../storage/storage.js';

class UserService {
  private static index = 1;

  createUser(name: string, password: string, socket: SocketWithNameAndId) {
    const id = UserService.index++;
    socket.name = name;
    socket.id = id;
    storage.addUser({ name, password, socket, inGame: false });
    socket.send(
      JSON.stringify({
        type: 'reg',
        data: JSON.stringify({
          name: name,
          index: id,
          error: false,
          errorText: '',
        }),
        id: 0,
      }),
    );
  }
}

export default new UserService();
