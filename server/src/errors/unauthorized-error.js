const CustomError = require("./custom-error");

module.exports = class UnauthorizedError extends CustomError {
  constructor() {
    super('Unauthorized');
    this.code = 401;
    this.errors = [
      { message: "Unauthorized" }
    ]
  }
}