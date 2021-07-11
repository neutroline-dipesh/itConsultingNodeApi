const express = require("express");
const app = express();
const morgan = require("morgan");
const mysql = require("mysql");
const dbConfig = require("./config/db.config");
const cors = require("cors");
const path = require("path");
const PORT = 4000;

//for path directory
global.appRoot = __dirname;
//for request parameter
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//require all routes
const allQueriesRouter = require("./routes/allQueriesRoutes");

//use all routes
app.use("/allQueries", allQueriesRouter);

app.listen(PORT, () => {
  console.log("Server start at port : " + PORT);
  //   console.log(dbConfig);
});
