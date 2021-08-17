const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const auth = require("../middlewares/checkAuth");

//post allqueries

router.post("/", auth, async (req, res) => {
  var id = "";
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  try {
    let data = req.body;
    console.log(req.body);
    var sql1 = "SELECT MAX(id) +1 as id FROM alljobs";
    mysqlconnection.query(sql1, (err, result) => {
      if (!err) {
        var iDdata = JSON.parse(JSON.stringify(result));
        id = "JOB00" + iDdata[0].id;
        // console.log(id);

        var sql =
          "INSERT INTO alljobs SET jobId = ? ,jobTitle = ?, jobSubtitle = ?, department = ?, jobType = ?, country = ?, state=?, city = ?, description = ?, publishBy = ?, visibility = ?,workType= ?,  postedDate = ?";
        mysqlconnection.query(
          sql,
          [
            id,
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
            data.workType,
            postedDate,
          ],
          (err, rows, fields) => {
            if (!err) {
              return res.status(200).json({
                status: "ok",
                data: data,
              });
            } else console.log(err);
          }
        );
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get all Internal jobs from allJObs
router.get("/internal", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM alljobs WHERE workType = 'Internal' ORDER BY id DESC";
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
//get all Contract jobs from allJObs
router.get("/contract", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM alljobs WHERE workType = 'Contract' ORDER BY id DESC";
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
//get allqueries
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM alljobs ORDER BY id DESC";
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

//get publised job form allJobs
router.get("/publish/", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM alljobs WHERE visibility = 'Publish' ORDER BY id DESC";
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

//get number of internaljobs from allJObs
router.get("/internal/totalJobs", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(jobId) as totalNumber FROM alljobs WHERE workType = 'Internal' ";
    const output = mysqlconnection.query(sql, (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        console.log(result);
        // console.log(output);
      } else console.log(err);
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get number of contractJobs from allJObs
router.get("/contract/totalJobs", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(jobId) as totalNumber FROM alljobs WHERE workType = 'Contract' ";
    const output = mysqlconnection.query(sql, (err, result) => {
      if (!err) {
        res.status(200).json({
          status: "ok",
          data: result,
        });
        console.log(result);
        // console.log(output);
      } else console.log(err);
    });
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
router.patch("/visibility/:id", auth, async (req, res) => {
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
router.delete("/:id", auth, async (req, res) => {
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
