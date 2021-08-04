const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const auth = require("../middlewares/checkAuth");

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
<<<<<<< HEAD
      "INSERT INTO allqueries SET firstName = ? email = ?, phone = ?, country = ?, city=?, status=?, message = ?, postedDate = ? ";
=======
      "INSERT INTO allqueries SET fullName = ?, email = ?, phone = ?, city = ?, country = ?,  message = ?, status=?, postedDate = ? ";
>>>>>>> ef316d18677e8d942dfc7646e9e7fc56cb9fdb3b
    await mysqlconnection.query(
      sql,
      [
        data.fullName,
        data.email,
        data.phone,
<<<<<<< HEAD
        data.country,
        data.city,
       // data.subject,
        data.status,
=======
        data.city,
        data.country,
>>>>>>> ef316d18677e8d942dfc7646e9e7fc56cb9fdb3b
        data.message,
        "notSeen",

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
    var sql = "SELECT * FROM allqueries ORDER BY id DESC";
    const output = mysqlconnection.query(sql, (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        console.log(result.length);
        // console.log(output);
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get number of notSeen from status form allQueries
router.get("/notSeenQueries", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM allqueries WHERE status = 'notSeen' ";
    const output = mysqlconnection.query(sql, (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        console.log(result.length);
        // console.log(output);
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
    var sql = "SELECT * FROM allqueries WHERE id = ?";
    const output = mysqlconnection.query(
      sql,
      [req.params.id],
      (err, result) => {
        if (!err) {
          res.status(200).json({
            status: "ok",
            data: result,
          });
          console.log(output);
        } else console.log(err);
      }
    );
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//update allqueries
router.patch("/:id", auth, async (req, res) => {
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
      "UPDATE allqueries SET firstName = ?,lastName = ?, email = ?, phone = ?, address = ?, subject = ?, status=?, message = ?, postedDate = ? WHERE id=?";
    mysqlconnection.query(
      sql,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.address,
        data.subject,
        data.status,
        data.message,
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
router.patch("/status/:id", auth, async (req, res) => {
  console.log(req.params.id);

  let data = req.body;

  try {
    var sql = "UPDATE allqueries set status = ? WHERE id = ?";
    mysqlconnection.query(sql, ["seen", req.params.id], (err, rows, fields) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: data,
        });
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get by ID allqueries
router.delete("/:id", auth, async (req, res) => {
  try {
    var sql = "DELETE FROM allqueries WHERE id = ?";
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
