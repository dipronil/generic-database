const express = require("express");
const router = express.Router();
const tableController = require("../App/Controller/table.controller");
const connectionController = require("../App/Controller/connection.controller");

router.post("/createTable", tableController.createTable);
router.post("/updateTable",tableController.updateTable);
router.post("/database",tableController.getTableData);
router.post("/check/keys",tableController.checkAccessKeys);
router.post("/databaseConnect",tableController.databaseConnect);

router.post("/connect", connectionController.connection);
router.post("/create/model", connectionController.createModel);
module.exports = router;