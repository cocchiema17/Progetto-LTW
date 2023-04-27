const CustomError = require("./custom-error");

module.exports = class BadRequestError extends CustomError {
  constructor(message) {
    super('Bad Request');
    this.code = 400;
    this.errors = [
      { message }
    ]
  }
}