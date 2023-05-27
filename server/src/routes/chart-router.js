const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const pgClient = require("../pg-client");
const validationHandler = require("../middlewares/validate-request-handler");
const { query } = require("express-validator");
const BadRequestError = require("../errors/bad-request-error");

const router = express.Router();

router.get("/charts",
  csrfProtection,
  currentUser,
  requireAuth,
  [
    query("spaceId").trim().notEmpty().withMessage("Space id is required"),
    query("fromDate").optional().isDate({ format: 'YYYY-MM-DD' }).withMessage("Invalid date format"),
    query("toDate").optional().isDate({ format: 'YYYY-MM-DD' }).withMessage("Invalid date format")
  ],
  validationHandler,
  async (req, res) => {
    const { spaceId, fromDate, toDate } = req.query;

    const userId = req.currentUser.id;

    const spaces = await pgClient.getUserSpaces(userId);
    if (!spaces.find(s => s.id == spaceId)) {
      throw new BadRequestError("Space not found");
    }

    const results = await Promise.all([
      pgClient.getBarChartData(spaceId, fromDate, toDate),
      pgClient.getLineChartData(spaceId, fromDate, toDate),
      pgClient.getPieChartData(spaceId, fromDate, toDate),
    ]);

    const response = {
      barChart: results[0],
      lineChart: results[1],
      pieChart: results[2],
    }

    res.send(response);
  }
);


module.exports = router;