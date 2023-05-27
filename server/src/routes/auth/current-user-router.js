const express = require("express");
const currentUser = require("../../middlewares/current-user");
const csrfProtection = require("../../middlewares/csrf-protection");
const router = express.Router();

router.get("/currentUser",
  csrfProtection,
  currentUser,
  async (req, res) => {
    res.send({
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      email: req.currentUser.email,
    });
  }
);

module.exports = router;