const express = require("express");
const router = express.Router();
const tableController = require("../App/Controller/table.controller");
const schemaController = require("../App/Controller/schema.controller");

router.post("/organizationCreate", schemaController.organizationCreate);
router.post("/projectCreate", schemaController.projectCreate);
module.exports = router;
