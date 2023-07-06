import { User } from "../types/user.js";

class Storage {
  
  users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

}

export default new Storage();