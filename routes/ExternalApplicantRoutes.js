const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const nodeMailer = require("nodemailer");
const fs = require("fs");
const googlefile_upload = require("./credentials");
const NodeMailerConfig = require("../config/nodemailer.config");

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

 
  var coverletter = "";

  var coverOriginalName="";
  var coverletterdestination="";
  var coverlettermimeType="";
  var coverPath="";

    resume = "http://" + req.headers.host + "/" + req.files.resume[0].path;
   resumeOriginalName = req.files.resume[0].originalname;
    resumedestination=fs.createReadStream(req.files.resume[0].path);
    resumemimeType=req.files.resume[0].mimetype;
    resumePath=req.files.resume[0].path;
  
  if (req.files.coverletter) {
    coverletter =
      "http://" + req.headers.host + "/" + req.files.coverletter[0].path;
      coverOriginalName=req.files.coverletter[0].originalname;
      coverletterdestination=fs.createReadStream(req.files.coverletter[0].path);
      coverlettermimeType= req.files.coverletter[0].mimetype;
      coverPath=req.files.coverletter[0].path;
  }
  


  googlefile_upload.multiplecreate_folder(
    `${data.fullName}`,
    "application/vnd.google-apps.folder",
    ["1FiPKSQPnbDr85oyWKx50zLLb5XqA5etq"],
    resumeOriginalName,
    resumedestination,
    resumemimeType ,
    coverOriginalName,
    coverletterdestination,
    coverlettermimeType
  );

 
 

  let setpTransport = nodeMailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: NodeMailerConfig.user,
      pass: NodeMailerConfig.pass,
    },
  });
  let mailOptions = {
    from: data.gmail,
    to: NodeMailerConfig.user,
    subject: `Message from ${data.fullName} for finding new position`,
    html: `
    <html>
    <head>
    <style>
    .bodyContainer{
    width: 80%;
    height: auto;
    background-color:#f1f1f1;
    padding: 2rem;
    
  }
  .innerBox{
    font-family: arial, sans-serif;
    font-size: 16px;
    width: 36rem;
    position:relative;
    margin-left:5%;
    background-color:white;
    height: auto;
    padding:2rem;
  }
  
  .topBox{
    height: auto;
    width: 40rem;
    background-color:#8ea9db;
    padding-top:1rem;
    padding-bottom:0.5rem;
    position:relative;
    margin-left:5%;
  }
  
  p{
    color: #fff;
    text-align:center;
    font-weight: 700;
  }
  img{
    height: auto;
    width: 200px;
    margin-left:32%;
  
  }
  
  .footerText{
    color: #3e7aba;
    text-align:center;
    margin-top:5px;
  }
  li{
    list-style-type: none;
    line-height: 2em;
    font-size:14px;
  }
  table {
    font-family: arial, sans-serif;
    font-size: 14px;
    width: 80%;
    position:relative;
    margin-left:10%;
  }
  
  td {
    text-align: left;
    padding: 8px;
  }
  
  tr{
    background-color: #dddddd;
  }
  
  </style>
    </head>
    <body>
    <div class ="bodyContainer">
    
    <div class="topBox">
    <img src="cid:logo" alt="logo"/>
    <p> External Job Application</p>
    </div>
    <div class="innerBox">
   
    
    <h3>Hi,<br>
  
    ${data.fullName} has submitted a job application on ${data.jobType}.</h3>
    <table class = "table">
    <tbody>
    <tr>
    <td>Name: </td>
    <td>${data.fullName}</td>
  </tr>
  <tr>
    <td>Email: </td>
    <td>${data.gmail}</td>
  </tr>
  <tr>
    <td>Phone: </td>
    <td>${data.phone}</td>
  </tr>
  <tr>
    <td>Message: </td>
    <td>${data.message}</td>
  </tr>
  <tr>
    <td>Job Type: </td>
    <td>${data.jobType}</td>
  </tr>
    </tbody>
  </table>
  
  </div>
  <div class="footerText">©Neutrosys Pvt Ltd.</div>
  </body>
  </html>
    
    `,
    attachments: [
      {
        filename:  resumeOriginalName,
        path: resumePath,
      },
      {
        filename: coverOriginalName,
        path:coverPath,
      },  
      {
        filename: "logo.jpg",
        path: `${__dirname}/../public/assets/logo.png`,
        cid: "logo",
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

  // try {
  //   var sql =
  //     "INSERT INTO externalapplicant SET fullName = ?, gmail = ?, phone = ?,   message = ?, resume = ? , coverletter = ?, jobType  = ?, status = ?,postedDate = ?";
  //   await mysqlconnection.query(
  //     sql,
  //     [
  //       data.fullName,
  //       data.gmail,
  //       data.phone,
  //       data.message,
  //       resume,
  //       coverletter,
  //       data.jobType,
  //       "notSeen",

  //       postedDate,
  //     ],
  //     (err, rows, fields) => {
  //       if (!err) {
  //         return res.status(200).json({
  //           status: "ok",
  //           success: true,
  //         });
  //       } else console.log(err);
  //     }
  //   );
  // } catch (err) {
  //   res.json({
  //     message: err,
  //   });
  // }
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
