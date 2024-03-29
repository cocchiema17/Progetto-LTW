const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const validationHandler = require("../middlewares/validate-request-handler");
const pgClient = require("../pg-client");
const { query, body } = require("express-validator");
const NotFoundError = require("../errors/not-found-error");

const router = express.Router();

router.get(
  "/transactions",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    query("page")
      .default(0)
      .isInt({ min: 0 })
      .toInt()
      .withMessage("Invalid page"),
    query("pageSize")
      .default(30)
      .isInt({ min: 1, max: 500 })
      .toInt()
      .withMessage("Invalid page size"),
    query("space").optional(),
    query("categoryName").optional(),
    query("amount").optional(),
    query("operator").optional(),
    query("amount2").optional(),
    query("search").optional(),
    query("sortColumn")
      .optional()
      .isIn(["title", "description", "amount", "space", "category", "transactionDate"]),
    query("asc")
      .optional().isBoolean().toBoolean(),
  ],
  validationHandler,
  async (req, res) => {
    const {
      page,
      pageSize,
      space,
      categoryName,
      search,
      amount,
      operator,
      amount2,
      sortColumn,
      asc,
    } = req.query;

    const { totalElements, totalPages, value } =
      await pgClient.getUserTransactions(
        req.currentUser.id,
        {
          page,
          pageSize,
          space,
          categoryName,
          search,
          amount,
          operator,
          amount2,
        },
        { sortColumn, asc }
      );

    res.send({ totalElements, totalPages, value });
  }
);

router.post(
  "/transactions",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("date").trim().notEmpty().isDate({ format: "YYYY-MM-DD" }),
    body("categoryName").trim().notEmpty(),
    body("color").trim().notEmpty(),
    body("spaceId").trim().notEmpty(),
    body("value").trim().notEmpty().isFloat().not().equals(0),
  ],
  validationHandler,
  async (req, res) => {
    const { title, description, date, categoryName, color, spaceId, value } =
      req.body;

    const tx = await pgClient.createTransaction({
      title,
      description,
      date,
      categoryName,
      color,
      spaceId: parseInt(spaceId),
      value,
    });

    res.status(201).send(tx);
  }
);

router.delete(
  "/transactions/:id",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    const txId = req.params.id;

    try {
      const rowCount = await pgClient.deleteTransaction(txId);
      if (rowCount == 0) {
        throw new NotFoundError();
      }
      res.sendStatus(204);
    } catch (err) {
      if (err.code == "22P02") {
        // not uuid
        throw new NotFoundError();
      }
    }
  }
);

router.patch(
  "/transactions/:id",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("date").trim().notEmpty().isDate({ format: "YYYY-MM-DD" }),
    body("value").trim().notEmpty().isFloat().not().equals(0),
  ],
  validationHandler,
  async (req, res) => {
    const { title, description, date, value } = req.body;

    const rowCount = await pgClient.updateTransaction(req.params.id, { title, description, date, value });

    if (rowCount == 0) {
      throw new NotFoundError();
    }

    res.sendStatus(204);
  }
)

module.exports = router;
