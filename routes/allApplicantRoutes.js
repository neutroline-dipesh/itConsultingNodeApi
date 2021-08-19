const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const nodeMailer = require("nodemailer");

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
const files=upload.fields([
  {
    name: "resume",
    maxCount: 1,
  },
  {
    name: "coverletter",
    maxCount: 1,
  },
])

//post internalJobs
router.post(
  "/",
  files,
   async (req, res) => {
    let data = req.body;
    console.log(data);
    var date = new Date();
    var postedDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // let postedDate = new Date();
    // console.log(postedDate);

    let setpTransport = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: "yamuna.neutroline@gmail.com",
        pass: "Working@Neutroline123",
      },
    });
    let mailOptions = {
      from: data.email,
      to: "yamuna.neutroline@gmail.com",
      subject: `Job Application from ${data.firstName} ${data.lastName}`,
      html: `
      <h1>Information</h1>
      <ul>
      <li> Name: ${data.firstName} ${data.lastName}</li>
      <li> Email: ${data.gmail}</li>
      <li> Phone: ${data.phone}</li>
      <li> Country: ${data.country}</li>
      <li> State: ${data.state}</li>
      <li> City: ${data.city}</li>
      <li> Seniority Level: ${data.senioritylevel}</li>
      <li> Salary: ${data.expectedSalary}</li>
      <li> Salary Type: ${data.salaryType}</li>
      <li> Message: ${data.message}</li>
      <li> JobTitle: ${data.jobTitle}</li>
      <li> JobType: ${data.jobType}</li>
      
      </ul>
      <h3>Message</h3>
      <p>${data.message}</p>
      
      `,
      attachments: [
        {
          filename: req.files.resume[0].originalname,
          path: req.files.resume[0].path,
        },
        {
          filename: req.files.coverletter[0].originalname,
          path: req.files.coverletter[0].path,
        },
      ],
    };
    setpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send("success");
      }
    });

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
          "http://" + req.headers.host + "/" + req.files.resume[0].path,
          "http://" + req.headers.host + "/" + req.files.coverletter[0].path,
          data.jobTitle,
          "notSeen",
          "notSeen",
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
