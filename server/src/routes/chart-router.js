const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const pgClient = require("../pg-client");
const validationHandler = require("../middlewares/validate-request-handler");
const { query } = require("express-validator");

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

    const results = await Promise.all([
      pgClient.getBarChartData(req.currentUser.id, spaceId, fromDate, toDate),
      pgClient.getLineChartData(req.currentUser.id, spaceId, fromDate, toDate),
      pgClient.getPieChartData(req.currentUser.id, spaceId, fromDate, toDate),
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