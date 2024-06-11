require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express();
// const { queryDatabase } = require("./Config/establishConnection");
app.use(cors());
const bodyParser = require("body-parser");
const {pageNotFound} = require("./App/Middleware/pageNotFoundMiddleware");
const {errorHandler} = require("./App/Middleware/errorMiddleware");
const tableRoute = require("./Route/table.route");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// queryDatabase();
app.use('/api/v1', tableRoute);
app.use(pageNotFound);
app.use(errorHandler);
port = 3000;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
