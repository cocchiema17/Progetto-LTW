const express = require("express");
const requireAuth = require("../../middlewares/require-auth");
const currentUser = require("../../middlewares/current-user");
const csrfProtection = require("../../middlewares/csrf-protection");
const validationHandler = require("../../middlewares/validate-request-handler");
const { body } = require("express-validator");
const pgClient = require("../../pg-client");
const { sendResetEmail } = require("../../mailer");
const { randomBytes } = require("crypto");
const router = express.Router();
const BadRequestError = require("../../errors/bad-request-error");
const { DateTime } = require("luxon");

router.post("/forgot",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
  ],
  validationHandler,
  async (req, res) => {
    const { email } = req.body;

    if (email != req.currentUser.email) {
      throw new BadRequestError("Invalid request");
    }

    const resetToken = randomBytes(30).toString("hex");
    const expiresAt = DateTime.utc().plus({ minutes: 30 }).toISO()
    await pgClient.saveResetToken(req.currentUser.id, resetToken, expiresAt);

    await sendResetEmail(email, resetToken);

    res.sendStatus(204);
  }
);

module.exports = router;