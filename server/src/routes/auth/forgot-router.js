const express = require("express");
const requireAuth = require("../../middlewares/require-auth");
const currentUser = require("../../middlewares/current-user");
const csrfProtection = require("../../middlewares/csrf-protection");
const validationHandler = require("../../middlewares/validate-request-handler");
const { body } = require("express-validator");
const pgClient = require("../../pg-client");
const transporter = require("../../mail");
const { randomBytes } = require("crypto");
const router = express.Router();
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

    await transporter.sendMail({
      from: 'reset-password@finager.org', // sender address
      to: email, // list of receivers
      subject: "How to Reset your email :)", // Subject line
      text: "Hello world?", // plain text body
      html: `<a href="${req.hostname + ":4000/auth/reset/" + resetToken}">Reset yout password</a>`, // html body
    });

    res.sendStatus(204);
  }
);

module.exports = router;