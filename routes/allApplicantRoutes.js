const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");

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
        "INSERT INTO allapplicant SET firstName = ?,middleName	= ?,lastName = ?, gender = ?, gmail = ?, phone = ?, country = ?, state = ?,city = ?, currentAddress= ?, senioritylevel =?, expectedSalary =?, message = ?, resume = ? , coverletter = ?, jobTitle = ?, status = ?,approvelStatus = ?,jobType=?, postedDate = ?";
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
          data.expectedSalary,
          data.message,
          "http://" + req.headers.host + "/" + req.files.resume[0].path,
          "http://" + req.headers.host + "/" + req.files.coverletter[0].path,
          data.jobTitle,
          data.status,
          data.approvelStatus,
          data.jobType,
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

//get internalJobs from allApplicant
router.get("/internal", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM allapplicant where jobType = 'internal' ORDER BY id DESC";
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

//get contractJobs from allApplicant
router.get("/contract", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM allapplicant where jobType = 'contract' ORDER BY id DESC";
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

//get by ID Applicant
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM allapplicant WHERE id = ?";
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

//update approvelStatus from allApplicant
router.patch("/approvelStatus/:id", auth, async (req, res) => {
  // console.log(req.params.id);

  let data = req.body;

  try {
    var sql =
      "UPDATE allapplicant set status = ?,approvelStatus = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      ["seen", data.approvelStatus, req.params.id],
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

//delete by ID allapplicant
router.delete("/:id", auth, async (req, res) => {
  try {
    var sql = "DELETE FROM allapplicant WHERE id = ?";
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
