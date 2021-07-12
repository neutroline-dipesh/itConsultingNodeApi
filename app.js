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
app.use("/public/assets", express.static("public/assets"));

//require all routes
const allQueriesRouter = require("./routes/allQueriesRoutes");
const interRouter = require("./routes/internalRoutes");
const contractRouter = require("./routes/contractRoutes");
const allJobsRouter = require("./routes/allJobs");
//use all routes
app.use("/allQueries", allQueriesRouter);
app.use("/internal", interRouter);
app.use("/contract", contractRouter);
app.use("/allJobs", allJobsRouter);

app.listen(PORT, () => {
  console.log("Server start at port : " + PORT);
  //   console.log(dbConfig);
});
