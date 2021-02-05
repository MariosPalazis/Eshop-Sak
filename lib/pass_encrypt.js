import bcrypt from "bcrypt";


export default class Encryption {
  hashPassword(plainTextPassword) {
    const saltRounds = 10;
    return bcrypt.hash(plainTextPassword, saltRounds);
  }

  matchPassword(plainTextPassword, hash) {
    return bcrypt.compare(plainTextPassword, hash);
  }
}
