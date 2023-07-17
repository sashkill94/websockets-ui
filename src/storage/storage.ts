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

  getWinners() {
    const winners = [];
    for (const entry of this.winners.entries())
      winners.push({
        name: entry[0],
        wins: entry[1]
      })
    return winners;
  }

  checkUser(name: string) {
    return this.users.some(el => el.name === name);
  }
}

export default new Storage();