const CustomError = require("./custom-error");

module.exports = class DatabaseException extends CustomError {
  constructor(message) {
    super('Database exception');
    this.code = 500;
    this.errors = [
      { message: 'Internal Server Error' }
    ]
  }
}