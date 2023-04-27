const { validationResult } = require("express-validator");
const ValidationError = require("../errors/validation-error");

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array({ onlyFirstError: true }));
  }
  next();
};

module.exports = validationHandler;