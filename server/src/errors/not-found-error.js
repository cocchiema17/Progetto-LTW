const CustomError = require("./custom-error");

module.exports = class NotFoundError extends CustomError {
  constructor() {
    super('Bad Request');
    this.code = 404;
    this.errors = [{
      message: "Not Found"
    }]
  }
}