
const express = require("express");
const requireAuth = require("../middlewares/require-auth");
const currentUser = require("../middlewares/current-user");
const csrfProtection = require("../middlewares/csrf-protection");
const xlsx = require('xlsx');
const pgClient = require("../pg-client");

const router = express.Router();
const fs = require('fs');


router.get("/report",
  csrfProtection,
  currentUser,
  requireAuth,
  async (req, res) => {
    const data = await pgClient.getReportData(req.currentUser.id);

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', 'attachment; filename=example.xlsx');
    
    res.send(excelBuffer);
  }
);

module.exports = router;