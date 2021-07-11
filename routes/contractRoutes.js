const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");

//for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

//post internalJobs
router.post(
  "/",
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "coverletter",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    let data = req.body;
    var date = new Date();
    var postedDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // let postedDate = new Date();
    // console.log(postedDate);
    try {
      var sql =
        "INSERT INTO contract SET firstName = ?,middleName	= ?,lastName = ?, gender = ?, gmail = ?, phone = ?, country = ?, state = ?,city = ?, currentAddress= ?, senioritylevel =? , message = ?, resume = ? , coverletter = ?, jobTitle = ?, status = ?,approvelStatus = ?, postedDate = ?";
      await mysqlconnection.query(
        sql,
        [
          data.firstName,
          data.middleName,
          data.lastName,
          data.gender,
          data.gmail,
          data.phone,
          data.country,
          data.state,
          data.city,
          data.currentAddress,
          data.senioritylevel,
          data.message,
          "http://" + req.headers.host + "/" + req.files.resume[0].path,
          "http://" + req.headers.host + "/" + req.files.coverletter[0].path,
          data.jobTitle,
          data.status,
          data.approvelStatus,
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
  }
);

//get internalJobs
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM contract";
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

//get by ID internalJObs
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM contract WHERE id = ?";
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

//update status internalJobs
router.patch("/status/:id", async (req, res) => {
  console.log(req.params.id);

  let data = req.body;

  try {
    var sql = "UPDATE contract set status = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      [data.status, req.params.id],
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

//update approvelStatus internalJobs
router.patch("/approvelStatus/:id", async (req, res) => {
  console.log(req.params.id);

  let data = req.body;

  try {
    var sql = "UPDATE contract set approvelStatus = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      [data.approvelStatus, req.params.id],
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

//get by ID internalJobs
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM contract WHERE id = ?";
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
