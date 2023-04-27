const UnauthorizedError = require("../errors/unauthorized-error");

const csrfProtection = (req, res, next) => {
  const cookieCsrf = req.cookies.csrfToken;
  const headerCsrf = req.get("x-csrf-token");

  if (cookieCsrf !== headerCsrf) {
    throw new UnauthorizedError();
  }
  next();
};

module.exports = csrfProtection;