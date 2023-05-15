const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const pgClient = require("../pg-client");
const router = express.Router();

router.get("/categories",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    const categories = await pgClient.getUserCategories(req.currentUser.id);

    res.send({ value: categories });
  }
);

module.exports = router;