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
    console.log(file);

    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
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

//post externalApplicant
router.post("/", files, async (req, res) => {
  let data = req.body;
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  console.log(data);
  console.log(req.files);
  // let postedDate = new Date();
  // console.log(postedDate);

  let setpTransport = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: "",
      pass: "",
    },
  });
  let mailOptions = {
    from: data.gmail,
    to: "pramila.neutroline@gmail.com",
    subject: `Message from ${data.fullName} for finding new position`,
    html: `
    <h1>Information</h1>
    <ul>

    <li>Name:${data.fullName}</li>
    <li>Phone:${data.phone}</li>
    <li>JobType:${data.jobType}</li>
    <li>Gmail:${data.gmail}</li>

    </ul>
    <h1>Message</h1>
    <p>${data.message}</p>
    <h4>Attachment </h4>
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
      "INSERT INTO externalapplicant SET fullName = ?, gmail = ?, phone = ?,   message = ?, resume = ? , coverletter = ?, jobType  = ?, status = ?,postedDate = ?";
    await mysqlconnection.query(
      sql,
      [
        data.fullName,
        data.gmail,
        data.phone,
        data.message,
        "http://" + req.headers.host + "/" + req.files.resume[0].path,
        "http://" + req.headers.host + "/" + req.files.coverletter[0].path,
        data.jobType,
        "notSeen",

        postedDate,
      ],
      (err, rows, fields) => {
        if (!err) {
          return res.status(200).json({
            status: "ok",
            success: true,
            msg: "Captcha passed",
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

//get externalAppliacnt from allApplicant
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM externalapplicant ORDER BY id DESC";
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

//get by ID externalApplicant
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM externalapplicant WHERE id = ?";
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

//get number of ExternalApplicant from External
router.get("/totalExternal/totalNumber", async (req, res) => {
  try {
    var sql = "SELECT COUNT(fullName) as totalNumber FROM externalapplicant";
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

//get number of notSeen External form allApplicant
router.get("/status/notSeen", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM externalapplicant WHERE status = 'notSeen'";
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

//update Status from externalAllApplicant
router.patch("/status/:id", auth, async (req, res) => {
  let data = req.body;

  try {
    var sql = "UPDATE externalapplicant set status = ? WHERE id = ?";
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

//delete by ID externalApplicant
router.delete("/:id", auth, async (req, res) => {
  try {
    var sql = "DELETE FROM externalapplicant WHERE id = ?";
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
