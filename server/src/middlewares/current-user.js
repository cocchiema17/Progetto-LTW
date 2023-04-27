const jwt = require("jsonwebtoken");

const currentUser = (req, res, next) => {
  const jwtCookie = req.cookies.session;

  if (jwtCookie) {
    try {
      const payload = jwt.verify(jwtCookie, process.env.JWT_KEY);
      req.currentUser = payload;
    } catch (err) {
      console.error("Jwt expired");
    }
  }
  next();
};

module.exports = currentUser;