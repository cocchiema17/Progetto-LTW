const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const validationHandler = require("../middlewares/validate-request-handler");
const pgClient = require("../pg-client");
const { query } = require("express-validator");
const BadRequestError = require("../errors/bad-request-error");
const router = express.Router();


router.get("/transactions",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    query("spaceId").notEmpty().withMessage("Space id is required"),
    query("page").default(0).isInt({ min: 0 }).toInt().withMessage("Invalid page"),
    query("pageSize").default(10).isInt({ min: 1, max: 500 }).toInt().withMessage("Invalid page size")
  ],
  validationHandler,
  async (req, res) => {
    const { spaceId, page, pageSize } = req.query;

    console.log(page*pageSize);

    const spaces = await pgClient.getSpacesByUserId(req.currentUser.id);
    if (!spaces.find(s => s.id == spaceId)) {
      throw new BadRequestError("User does not have space indicated");
    }

    const { totalElements, totalPages, value } = await pgClient.getTransactionsBySpaceId(spaceId, page, pageSize);

    res.send({ totalElements, totalPages, value });
  }
);

module.exports = router;