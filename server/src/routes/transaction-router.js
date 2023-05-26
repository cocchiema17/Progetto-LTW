const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const validationHandler = require("../middlewares/validate-request-handler");
const pgClient = require("../pg-client");
const { query, body } = require("express-validator");
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
    query("sortColumn").optional(),
    query("asc").optional(),
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
    body("spaceId").trim().notEmpty(),
    body("value").trim().notEmpty().isFloat().not().equals(0),
  ],
  validationHandler,
  async (req, res) => {
    const { title, description, date, categoryName, spaceId, value } = req.body;

    const tx = await pgClient.createTransaction({
      title,
      description,
      date,
      categoryName,
      spaceId: parseInt(spaceId),
      value,
    });

    res.status(201).send(tx);
  }
);

// TO DO
router.delete(
  "/transactions/:id",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    console.log("DELETE");
  }
);

module.exports = router;
