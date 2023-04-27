const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const router = express.Router();

router.post("/logout",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    res.clearCookie("session");
    res.clearCookie("csrfToken");
    res.sendStatus(204);
  }
);

module.exports = router;