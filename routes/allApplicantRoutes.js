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


  const output = `
 
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
    <p> Job Application</p>
    </div>
    <div class="innerBox">
   
    
    <h3>Hi,<br>
  
    ${data.firstName} has submitted a job application on ${data.jobTitle}.</h3>
    <table class = "table">
    <tbody>
      <tr>
        <td><b>Name: </b></td>
        <td>${data.firstName} ${data.lastName}</td>
      </tr>
      <tr>
        <td><b>Email:</b> </td>
        <td>${data.gmail}</td>
      </tr>
      <tr>
        <td><b>Phone:</b> </td>
        <td>${data.phone}</td>
      </tr>
      <tr>
        <td><b>Country: </b></td>
        <td>${data.country}</td>
      </tr>
      <tr>
      <td><b>State:</b> </td>
      <td>${data.state}</td>
    </tr>
      <tr>
        <td><b>City:</b> </td>
        <td>${data.city}</td>
      </tr>
      <tr>
        <td><b>Seniority Level:</b> </td>
        <td>${data.senioritylevel}</td>
      </tr>
      <tr>
      <td><b>Expected Salary:</b> </td>
      <td>${data.expectedSalary}</td>
    </tr>
      <tr>
        <td><b>Message: </b></td>
        <td>${data.message}</td>
      </tr>
      <tr>
        <td><b>Job Title: </b></td>
        <td>${data.jobTitle}</td>
      </tr>
      <tr>
        <td><b>Job Title: </b></td>
        <td>${data.jobType}</td>
      </tr>
    </tbody>
  </table>
  
  </div>
  <div class="footerText">©Neutrosys Pvt Ltd.</div>
  </body>
  </html>
    `;

    

  let setpTransport = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: NodeMailerConfig.user,
      pass: NodeMailerConfig.pass,
    },
  });
  let mailOptions = {
    from: data.gmail,
    to: NodeMailerConfig.user,
    subject: `Job Application from ${data.firstName} ${data.lastName}`,
    html: output,
    attachments: [
      {
        filename: resumeOriginalName,
        path: resumePath,
      },
      {
        filename: coverOriginalName,
        path: coverPath,
      },
      {
        filename: "logo.jpg",
        path: `${__dirname}/../public/assets/logo.png`,
        cid: "logo",
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
      resume,
       coverletter,
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
