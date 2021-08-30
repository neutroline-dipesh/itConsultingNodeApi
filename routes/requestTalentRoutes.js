const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const fetch = require("node-fetch");
const { stringify } = require("querystring");
const fs = require("fs");
const googlefile_upload = require("../uitlity/requestTalentFileUpload");
const mailFunction = require("../uitlity/requestTalentMail");

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

//post requestTalent
router.post("/", upload.single("attachment"), async (req, res) => {
  let data = req.body;

  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();

 var resumeOriginalName = "";
 var resumedestination = "";
 var resumemimeType = "";
 var resumePath = "";

  if (req.file) {
    resumeOriginalName = req.file.originalname;
    resumedestination = fs.createReadStream(req.file.path);
    resumemimeType = req.file.mimetype;
    resumePath = req.file.path;
  }


  mailFunction.mailFunction(
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.country,
    data.city,
    data.companyName,
    data.jobTitle,
    data.message,
    resumeOriginalName,
    resumePath
  );

  try {
    if (!req.body.captcha)
      return res.json({ success: false, msg: "Please select captcha" });

    // Secret key
    const secretKey = "6LeYwOgbAAAAAGBay4fiR-aA6jeo1szYTWBTNtQO";

    // Verify URL
    const query = stringify({
      secret: secretKey,
      response: req.body.captcha,
      remoteip: req.connection.remoteAddress,
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then((res) => res.json());

    // If not successful
    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed captcha verification" });
    } else {
      var sql =
        "INSERT INTO requesttalent SET firstName = ?,lastName	=?, email = ?, phone = ?,country = ?, city = ?, companyName=?,jobTitle=?,  message = ?,attachment =?, status=?, postedDate = ? ";
      // console.log(sql);
      await mysqlconnection.query(
        sql,
        [
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          data.country,
          data.city,
          data.companyName,
          data.jobTitle,
          data.message,
          // "",
          // "http://" + req.headers.host + "/" + req.file.path,
          "",
          "notSeen",
          postedDate,
        ],
        (err, rows, fields) => {
          tableId = rows.insertId;
          if (!err) {
            googlefile_upload.create_folder(
              `${data.firstName} ${data.lastName}`,
              "application/vnd.google-apps.folder",
              ["1FiPKSQPnbDr85oyWKx50zLLb5XqA5etq"],
              resumeOriginalName,
              resumedestination,
              resumemimeType,
              tableId
            );

            res.status(200).json({
              status: "ok",
              success: true,
              msg: "Captcha passed",
              data: data,
            });
            console.log(data);
          } else console.log(err);
        }
      );
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

//get requestTalent
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM requesttalent ORDER BY id DESC";
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

//get by ID requestTalent
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM requesttalent WHERE id = ?";
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

//get number of notSeen from status form allQueries
router.get("/status/notSeen", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM requesttalent WHERE status = 'notSeen' ";
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

//get number of Employers from Employers
router.get("/totalEmployers/totalNumber", async (req, res) => {
  try {
    var sql = "SELECT COUNT(firstName) as totalNumber FROM requesttalent";
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

//get by ID requestTalent
router.delete("/:id", auth, async (req, res) => {
  try {
    var sql = "DELETE FROM requesttalent WHERE id = ?";
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

//update status requestTalent
router.patch("/status/:id", auth, async (req, res) => {
  console.log(req.params.id);

  let data = req.body;

  try {
    var sql = "UPDATE requesttalent set status = ? WHERE id = ?";
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

module.exports = router;
