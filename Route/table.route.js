const express = require("express");
const router = express.Router();
const tableController = require("../App/Controller/table.controller");

router.post("/createTable", tableController.createTable);
router.post("/updateTable",tableController.updateTable);
router.post("/database",tableController.getTableData);
router.post("/check/keys",tableController.checkAccessKeys);
router.post("/databaseConnect",tableController.databaseConnect);

module.exports = router;