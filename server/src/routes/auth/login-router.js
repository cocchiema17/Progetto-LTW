const express = require("express");
const router = express.Router();
const pgClient = require("../../pg-client");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../../keys");
const validationHandler = require("../../middlewares/validate-request-handler");
const BadRequestError = require("../../errors/bad-request-error");
const Password = require("../../services/password-srv");
const { randomBytes } = require("crypto");

router.post("/signin",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty().withMessage("Value is mandatory")
  ],
  validationHandler,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await pgClient.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError("Bad credentials");
    }

    const match = await Password.compare(user.password, password);

    if (!match) {
      throw new BadRequestError("Bad credentials");
    }

    /*if (!user.emailActivated) {
      throw new BadRequestError("Email is not validated");
    }*/

    const userJwt = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      jwtKey,
      { expiresIn: "1800s" }
    );

    const csrfToken = randomBytes(20).toString("hex");

    res.cookie("session", userJwt, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    });

    res.cookie("csrfToken", csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    })

    res.status(200).send({
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      csrfToken: csrfToken
    });
  }
);

module.exports = router;