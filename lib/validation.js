import Chalk from "chalk";
import Bcrypt from "./pass_encrypt.js";

const bcrypt = new Bcrypt();

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

  isValidPassFormat(rawPassword) {
    const passwordPattern = /.*(\d+.*[A-Z]+.*|[A-Z]+.*\d+.*)+.*/;

    console.log(Chalk.blue.bold("VALIDATING PASSWORD FORMAT"));
    if (passwordPattern.test(rawPassword)) return true;
    else return false;
  }
}

export default Validate;
