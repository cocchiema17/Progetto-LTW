const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const validationHandler = require("../middlewares/validate-request-handler");
const pgClient = require("../pg-client");
const { query, body } = require("express-validator");
const router = express.Router();

router.get("/transactions",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    query("page").default(0).isInt({ min: 0 }).toInt().withMessage("Invalid page"),
    query("pageSize").default(30).isInt({ min: 1, max: 500 }).toInt().withMessage("Invalid page size")
  ],
  validationHandler,
  async (req, res) => {
    const { page, pageSize } = req.query;

    const { totalElements, totalPages, value } = await pgClient.getUserTransactions(req.currentUser.id, page, pageSize);

    res.send({ totalElements, totalPages, value });
  }
);

router.post("/transactions",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("date").trim().notEmpty().isDate({ format: 'YYYY-MM-DD' }).toDate(),
    body("categoryName").trim().notEmpty(),
    body("spaceId").trim().notEmpty(),
    body("value").trim().notEmpty().isFloat().not().equals(0),
  ],
  validationHandler,
  async (req, res) => {
    const { title, description, date, categoryName, spaceId, value } = req.body;

    const tx = await pgClient.createTransaction({ title, description, date, categoryName, spaceId: parseInt(spaceId), value });

    res.status(201).send(tx);
  }
);

module.exports = router;