 class NotFound extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name;
    this.message = message;
    this.status = 404;
  }
}

class DbError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name;
    this.message = message;
    this.status = 500;
  }
}

class ConfigMissing extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name;
    this.message = message;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message || this.constructor.name);
    this.name = this.constructor.name;
    this.message = message;
  }
}

class UserNotFound extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

class PasswordsNoMatch extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}



class CustomErrors {
  constructor() {
    this.UserNotFound = UserNotFound;
    this.ValidationError = ValidationError;
    this.DbError = DbError;
  }
  notFound(message = "") { return new NotFound(message) }
  dbError(message = "") { return new DbError(message) }
  configMissing(message = "") { return new ConfigMissing(message) }
  validationError(message = "") { return new ValidationError(message) }
  userNotFound(message = "") { return new UserNotFound(message) }
  passwordsNoMatch(message = "") { return new PasswordsNoMatch(message) }

}

export default new CustomErrors();

