const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const nodeMailer = require("nodemailer");
const fs = require("fs");
<<<<<<< HEAD
const nodemailerConfig = require("../config/nodemailer.config");

// //Add Credentials for google api
const Client_id =
  "706645762043-6as1bcbbdticdes3lbl8mekjb8u3u4fc.apps.googleusercontent.com";
const Client_Secret = "s7Yq5ZTe-zSyOFerzg3oGWfp";
const Redirect_uri = "https://developers.google.com/oauthplayground";
const Refresh_token =
  "1//04FC6pW4ys5kHCgYIARAAGAQSNwF-L9IrGc7tL5MkRLQkMdCVAOgVDIWfF3a9gh9MkJFzG5aSsIq2s59riJ86OsZ_AW9rJVw6Shc";

const oauth2Client = new google.auth.OAuth2(
  Client_id,
  Client_Secret,
  Redirect_uri[0]
);
oauth2Client.setCredentials({ refresh_token: Refresh_token });
=======
const googlefile_upload = require("./credentials");
const NodeMailerConfig = require("../config/nodemailer.config");
>>>>>>> bb2b188abad4070ddc1cea7cb629ed61faf04c8d

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

<<<<<<< HEAD
const google_upload = (originalName, destination, mimeType, id) => {
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  const fileMetadata = {
    name: originalName,
    mimetype: mimeType,
    parents: id,
  };
  const media = {
    mimetype: mimeType,
    body: destination,
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    (err, response) => {
      if (!err) {
        //  console.log(response);
      } else {
        console.log(err);
      }
    }
  );
};

const create_folder = (
  folder_name,
  mimeType,
  parents,
  resumeoriginalname,
  resumedestination,
  resumefilemimetype,
  coverletteroriginalname,
  coverletterdestination,
  coverletterfilemimetype
) => {
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  const fileMetadata = {
    name: folder_name,
    mimeType: mimeType,
    parents: parents,
  };

  drive.files.create(
    {
      resource: fileMetadata,
      fields: "id",
    },
    (err, response) => {
      if (!err) {
        const id = response.data.id;
        google_upload(
          resumeoriginalname,
          resumedestination,
          resumefilemimetype,
          [id]
        );

        google_upload(
          coverletteroriginalname,
          coverletterdestination,
          coverletterfilemimetype,
          [id]
        );
      } else {
        console.log(err);
      }
    }
  );
};

=======
>>>>>>> bb2b188abad4070ddc1cea7cb629ed61faf04c8d
router.post("/", files, async (req, res) => {
  let data = req.body;

  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
<<<<<<< HEAD
  var resume = "";
  var coverletter = "";
  var resumeOriginalName = "";
  if (req.files.resume) {
    resume = "http://" + req.headers.host + "/" + req.files.resume[0].path;
    resumeOriginalName = req.files.resume[0].originalname;
  }
  if (req.files.coverletter) {
    coverletter =
      "http://" + req.headers.host + "/" + req.files.coverletter[0].path;
  }
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

<<<<<<< HEAD
  create_folder(
=======

  googlefile_upload.multiplecreate_folder(
>>>>>>> bb2b188abad4070ddc1cea7cb629ed61faf04c8d
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

<<<<<<< HEAD
  // let setpTransport = nodeMailer.createTransport({
  //   service: "Gmail",
  //   port: 465,
  //   auth: {
  //     user: "pramila.neutroline@gmail.com",
  //     pass: "Neutroline1pk",
  //   },
  // });
  // let mailOptions = {
  //   from: data.gmail,
  //   to: "pramila.neutroline@gmail.com",
  //   subject: `Message from ${data.fullName} for finding new position`,
  //   html: `
  //   <h1>Information</h1>
  //   <ul>

  //   <li>Name:${data.fullName}</li>
  //   <li>Phone:${data.phone}</li>
  //   <li>JobType:${data.jobType}</li>
  //   <li>Gmail:${data.gmail}</li>

  //   </ul>
  //   <h1>Message</h1>
  //   <p>${data.message}</p>
  //   <h4>Attachment </h4>
  //   `,
  //   attachments: [
  //     {
  //       filename: req.files.resume[0].originalname,
  //       path: req.files.resume[0].path,
  //     },
  //     {
  //       filename: req.files.coverletter[0].originalname,
  //       path: req.files.coverletter[0].path,
  //     },
  //   ],
  // };
  // setpTransport.sendMail(mailOptions, (error) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("success");
  //   }
  // });
=======
 
 
let setpTransport = nodeMailer.createTransport({
=======
  let setpTransport = nodeMailer.createTransport({
>>>>>>> bb2b188abad4070ddc1cea7cb629ed61faf04c8d
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
        filename: req.files.resume[0].originalname,
        path: req.files.resume[0].path,
      },
      {
        filename:req.files.coverletter[0].originalname,
        path:req.files.coverletter[0].path
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
>>>>>>> 764c18d5f6d080f551ce3efc86a877f34e934929

<<<<<<< HEAD
=======

>>>>>>> bb2b188abad4070ddc1cea7cb629ed61faf04c8d
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
        resume,
        coverletter,
        data.jobType,
        "notSeen",

        postedDate,
      ],
      (err, rows, fields) => {
        if (!err) {
          return res.status(200).json({
            status: "ok",
            success: true,
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
