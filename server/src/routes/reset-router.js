const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const validationHandler = require("../middlewares/validate-request-handler");
const { body } = require("express-validator");
const csrfProtection = require("../middlewares/csrf-protection");
const pgClient = require("../pg-client");
const BadRequestError = require("../errors/bad-request-error");
const { DateTime } = require("luxon");
const router = express.Router();

router.post("/reset/:token",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("newPassword")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Invalid password"),
    body("confirmPassword")
      .trim()
      .notEmpty().withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        return value === req.body.newPassword
      })
  ],
  validationHandler,
  async (req, res) => {
    const token = await pgClient.getResetToken(req.currentUser.id, req.params.token);

    if (!token) {
      throw new BadRequestError("Bad Request");
    }

    const { expiresAt, consumed } = token;

    if (DateTime.utc() >= expiresAt) {
      throw new BadRequestError("The link is expired");
    }

    if (consumed) {
      throw new BadRequestError("The link was already used");
    }

    await pgClient.changePassword(req.currentUser.id, token.token, req.body.newPassword);

    res.sendStatus(204);
  }
);

module.exports = router;