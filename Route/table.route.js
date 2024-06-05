const express = require("express");
const router = express.Router();
const tableController = require("../App/Controller/table.controller");

router.post("/createTable", tableController.createTable);
router.post("/updateTable",tableController.updateTable);

module.exports = router;