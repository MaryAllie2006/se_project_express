const ERROR_CODE_400 = 400;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_400;
  }
}

module.exports = BadRequestError;
