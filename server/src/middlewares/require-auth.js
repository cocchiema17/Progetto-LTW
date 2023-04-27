const UnauthorizedError = require("../errors/unauthorized-error");

const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};

module.exports = requireAuth;