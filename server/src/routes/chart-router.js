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
    query("spaceId").trim().notEmpty().withMessage("Space id is required")
  ],
  validationHandler,
  async (req, res) => {
    const { spaceId } = req.query;

    const results = await Promise.all([
      pgClient.getBarChartData(req.currentUser.id, spaceId),
      pgClient.getLineChartData(req.currentUser.id, spaceId),
      pgClient.getPieChartData(req.currentUser.id, spaceId),
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