const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");

const fs = require("fs");

const google_upload = require("../uitlity/allApplicantFileUpload");
const mailFunction=require("../uitlity/allApplicantMail");
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
const files = upload.fields([
  {
    name: "resume",
    maxCount: 1,
  },
  {
    name: "coverletter",
    maxCount: 1,
  },
]);

//post internalJobs
router.post("/", files, async (req, res) => {
  let data = req.body;
  console.log(data);
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();
  // console.log(postedDate);

  var coverOriginalName = "";
  var coverletterdestination = "";
  var coverlettermimeType = "";
  var coverPath = "";
  var tableId = "";

  var resumeOriginalName = "";
  var resumedestination = "";
  var resumemimeType = "";
  var resumePath = "",
    resumeOriginalName = req.files.resume[0].originalname;
  resumedestination = fs.createReadStream(req.files.resume[0].path);
  resumemimeType = req.files.resume[0].mimetype;
  resumePath = req.files.resume[0].path;
  // }

  if (req.files.coverletter) {
    coverOriginalName = req.files.coverletter[0].originalname;
    coverletterdestination = fs.createReadStream(req.files.coverletter[0].path);
    coverlettermimeType = req.files.coverletter[0].mimetype;
    coverPath = req.files.coverletter[0].path;
  }

  
  mailFunction.mailFunction(
    data.firstName,
        data.lastName,
        data.gmail,
        data.phone,
        data.country,
        data.state,
        data.city,
        data.senioritylevel,
        data.expectedSalary,
        data.message,
    resumeOriginalName,
    resumePath,
    coverOriginalName,
    coverPath,
    data.jobTitle,
    
    data.jobType,
    postedDate
  );


  try {
    var sql =
      "INSERT INTO allapplicant SET firstName = ?,lastName = ?, gmail = ?, phone = ?, country = ?, state = ?,city = ?, senioritylevel =?, expectedSalary =?, salaryType=?, message = ?, resume = ? , coverletter = ?, jobTitle = ?, status = ?,approvelStatus = ?,jobType=?, postedDate = ?";
    await mysqlconnection.query(
      sql,
      [
        data.firstName,
        data.lastName,
        data.gmail,
        data.phone,
        data.country,
        data.state,
        data.city,
        data.senioritylevel,
        data.expectedSalary,
        data.salaryType,
        data.message,
        "",
        "",
        data.jobTitle,
        "notSeen",
        "notSeen",
        data.jobType,
        postedDate,
      ],
      (err, rows, fields) => {
        tableId = rows.insertId;
        if (!err) {
          google_upload.multiplecreate_folder(
            `${data.firstName} ${data.lastName}`,
            "application/vnd.google-apps.folder",
            ["1FiPKSQPnbDr85oyWKx50zLLb5XqA5etq"],
            resumeOriginalName,
            resumedestination,
            resumemimeType,
            coverOriginalName,
            coverletterdestination,
            coverlettermimeType,
            tableId
          );

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

//get allApplicant from allApplicant
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM allapplicant ORDER BY id DESC";
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

//get internalJobs from allApplicant
router.get("/internal", async (req, res) => {
  try {
    var sql =
      "SELECT * FROM allapplicant where jobType = 'Internal' ORDER BY id DESC";
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
      "SELECT * FROM allapplicant where jobType = 'Contract' ORDER BY id DESC";
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
  console.log(req.body);

  let data = req.body;

  try {
    var sql =
      "UPDATE allapplicant set status = ?,approvelStatus = ? WHERE id = ?";
    mysqlconnection.query(
      sql,
      ["seen", req.body.approvelStatus, req.params.id],
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

//get number of notSeen internal form allApplicant
router.get("/internal/notSeen", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM allapplicant WHERE status = 'notSeen' and jobType = 'Internal'";
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

//get number of notSeen Contract form allApplicant
router.get("/contract/notSeen", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM allapplicant WHERE status = 'notSeen' and jobType = 'Contract'";
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
