const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const pgClient = require("../pg-client");
const validationHandler = require("../middlewares/validate-request-handler");
const { body } = require("express-validator");

const BadRequestError = require("../errors/bad-request-error");
const DatabaseError = require("../errors/database-error");

const router = express.Router();

router.post("/spaces",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("name").trim().notEmpty().isLength({ min: 3, max: 40 }).withMessage("Space name not valid")
  ],
  validationHandler,
  async (req, res) => {
    const { name } = req.body;
    try {
      const space = await pgClient.createSpace(req.currentUser.id, name);
      res.send(space);
    } catch (err) {
      if (err.code == '23505') { // concurrent insert with same email
        throw new BadRequestError(`Space with name ${name} already in use`);
      }
      console.error(err);
      throw new DatabaseError(err.message);
    }
  }
);

router.get("/spaces",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    const spaces = await pgClient.getUserSpaces(req.currentUser.id);

    res.send({ value: spaces });
  }
);

module.exports = router;