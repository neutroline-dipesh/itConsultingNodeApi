const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");

//post allqueries
router.post("/", async (req, res) => {
  let data = req.body;
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();
  // console.log(postedDate);
  try {
    var sql =
      "INSERT INTO alljobs SET jobId = ?,jobTitle = ?, jobSubtitle = ?, department = ?, jobType = ?, country = ?, state=?, city = ?, description = ?, publishBy = ?, visibility = ?, postedDate = ?";
    await mysqlconnection.query(
      sql,
      [
        data.jobId,
        data.jobTitle,
        data.jobSubtitle,
        data.department,
        data.jobType,
        data.country,
        data.state,
        data.city,
        data.description,
        data.publishBy,
        data.visibility,
        postedDate,
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({
            status: "ok",
            data: data,
          });
        } else console.log(err);
      }
    );
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get allqueries
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM alljobs";
    mysqlconnection.query(sql, (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        // console.log(result);
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get by ID allqueries
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM alljobs WHERE id = ?";
    mysqlconnection.query(sql, [req.params.id], (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        // console.log(result);
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//update allqueries
router.patch("/:id", async (req, res) => {
  console.log(req.params.id);

  let data = req.body;
  console.log(data);
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();
  console.log(postedDate);
  try {
    var sql =
      "UPDATE alljobs SET jobId = ?,jobTitle = ?, jobSubtitle = ?, department = ?, jobType = ?, country = ?, state=?, city = ?, description = ?, publishBy = ?, visibility = ?, postedDate = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      [
        data.jobId,
        data.jobTitle,
        data.jobSubtitle,
        data.department,
        data.jobType,
        data.country,
        data.state,
        data.city,
        data.description,
        data.publishBy,
        data.visibility,
        postedDate,
        req.params.id,
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({
            status: "ok",
            data: data,
          });
        } else console.log(err);
      }
    );
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//update status allqueries
router.patch("/visibility/:id", async (req, res) => {
  //   console.log(req.params.id);
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  let data = req.body;

  try {
    var sql = "UPDATE alljobs set visibility = ?, postedDate = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      [data.visibility, postedDate, req.params.id],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({
            status: "ok",
            data: data,
          });
        } else console.log(err);
      }
    );
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get by ID allqueries
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM alljobs WHERE id = ?";
    mysqlconnection.query(sql, [req.params.id], (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        // console.log(result);
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

module.exports = router;
