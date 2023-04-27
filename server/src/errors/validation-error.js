const CustomError = require("./custom-error");

module.exports = class ValidationError extends CustomError {
  constructor(errors) {
    super('Bad Request');
    this.code = 400;
    this.errors = errors.map(e => {
      return {
        message: e.msg,
        locationType: e.location,
        location: e.param
      }
    });
  }
}