const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const nodeMailer = require("nodemailer");
const fs = require("fs");
const googlefile_upload = require("./credentials");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
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

  googlefile_upload.multiplecreate_folder(
    `${data.fullName}`,
    "application/vnd.google-apps.folder",
    ["1FiPKSQPnbDr85oyWKx50zLLb5XqA5etq"],
    req.files.resume[0].originalname,
    fs.createReadStream(req.files.resume[0].path),
    req.files.resume[0].mimetype,
    req.files.coverletter[0].originalname,
    fs.createReadStream(req.files.coverletter[0].path),
    req.files.coverletter[0].mimetype
  );

  let setpTransport = nodeMailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: "pramila.neutroline@gmail.com",
      pass: "Neutroline1pk",
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
  setpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("success");
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
