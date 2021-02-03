class Validate {
  isValidEmail(email) {
    const emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-z0-9-]*[a-zA-Z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

    if (emailPattern.test(email)) return true;
    else return false;
  }

  isValidPass(password) {
    const passwordPattern = /.*(\d+.*[A-Z]+.*|[A-Z]+.*\d+.*)+.*/;

    if (passwordPattern.test(password)) return true;
    else return false;
  }

  isValidConfirmPass(password, confirmation) {
    if (password===confirmation) return true;
    else return false;
  }

}
export default Validate;
