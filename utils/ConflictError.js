const ERROR_CODE_409 = 409;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_409;
  }
}

module.exports = ConflictError;
