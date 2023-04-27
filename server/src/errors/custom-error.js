module.exports = class CustomError extends Error {
  constructor(msg, code, errors) {
    super(msg);
    this.code = code;
    this.errors = errors;
  }

  serializeErrors() {
    return {
      error: {
        code: this.code,
        errors: this.errors
      }
    }
  }

}