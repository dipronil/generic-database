const express = require("express");
const router = express.Router();
const tableController = require("../App/Controller/table.controller");

router.post("/createTable", tableController.createTable);
router.post("/updateTable",tableController.updateTable);
router.post("/database",tableController.getTableData);
module.exports = router;