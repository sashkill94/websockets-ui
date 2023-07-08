import { User } from "../types/user.js";

class Storage {
  
  users: User[] = [];
  winners: Map<string, number> = new Map();

  addUser(user: User) {
    this.users.push(user);
  }

  addWin(name: string) {
    let wins = 1;
    if (this.winners.get(name)) wins = this.winners.get(name)! + 1;
    
    this.winners.set(name, wins);
  }

}

export default new Storage();