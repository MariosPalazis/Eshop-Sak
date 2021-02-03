import Chalk from "chalk";
import * as bcrypt from "./pass_encrypt.js";

class Validate {
  isValidEmail(email) {
    const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

    console.log(Chalk.blue.bold("VALIDATING EMAIL"));
    if (emailPattern.test(email)) return true;
    else return false;
  }

  isValidPass(rawPassword, hashedPassword) {
    console.log(Chalk.blue.bold("VALIDATING PASSWORDS"));
    return bcrypt.matchPassword(rawPassword, hashedPassword);
  }
}

export default Validate;
