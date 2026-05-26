const ERROR_CODE_400 = 400;
const ERROR_CODE_401 = 401;
const ERROR_CODE_403 = 403;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;
const ERROR_CODE_409 = 409;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_409;
  }
}

module.exports = {
  ERROR_CODE_400,
  ERROR_CODE_401,
  ERROR_CODE_403,
  ERROR_CODE_404,
  ERROR_CODE_500,
  ERROR_CODE_409,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};
