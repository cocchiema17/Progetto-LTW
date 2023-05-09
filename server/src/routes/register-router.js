const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const BadRequestError = require("../errors/bad-request-error");
const DatabaseError = require("../errors/database-error");

const pgClient = require("../pg-client");
const validationHandler = require("../middlewares/validate-request-handler");
const Password = require("../services/password-srv");

router.post("/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("firstName")
      .trim()
      .notEmpty().withMessage("First name is mandatory")
      .isLength({ min: 3, max: 30 }).withMessage("Value must be at least 3 and at most 30 characters")
      .isAlpha().withMessage("firstName must contains only letters"),
    body("lastName")
      .trim()
      .notEmpty().withMessage("Last name is mandatory")
      .isLength({ min: 3, max: 30 }).withMessage("lastName must be at least 3 and at most 30 characters")
      .isAlpha().withMessage("lastName must contains only letters"),
    body("password")
      .trim()
      .notEmpty().withMessage("Password is mandatory")
      .isLength({ min: 3, max: 50 }).withMessage("password must be at least 5 and at most 50 characters")
      .isAscii().withMessage("The password can contains only ascii characters")
  ],
  validationHandler,
  async (req, res) => {
    const {
      email,
      password,
      firstName,
      lastName
    } = req.body;

    const existingUser = await pgClient.findUserByEmail(email);

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const hashedPassword = await Password.toHash(password);

    let user;

    try {
      user = await pgClient.saveUser(email, hashedPassword, firstName, lastName);
    } catch (err) {
      if (err.code == '23505') { // concurrent insert with same email
        throw new BadRequestError('Email already in use');
      }
      throw new DatabaseError(err.message);
    }

    res.status(201).send({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

  }
);

module.exports = router;