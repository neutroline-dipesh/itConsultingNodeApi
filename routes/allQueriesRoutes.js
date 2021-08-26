const express = require("express");
const router = express.Router();
const mysqlconnection = require("../model/db");
const path = require("path");
const multer = require("multer");
const auth = require("../middlewares/checkAuth");
const fetch = require("node-fetch");
const { stringify } = require("querystring");
const nodemailer = require("nodemailer");
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

//post allqueries
router.post("/", upload.single("attachment"), async (req, res) => {
  let data = req.body;
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();
  // console.log(postedDate);

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
  <p> Message</p>
  </div>
  <div class="innerBox">
 
  
  <h3>Hi,<br>

  ${data.fullName} has sent a message.</h3>
  <table class = "table">
  <tbody>
    <tr>
      <td>Name: </td>
      <td>${data.fullName}</td>
    </tr>
    <tr>
      <td>Email: </td>
      <td>${data.email}</td>
    </tr>
    <tr>
      <td>Phone: </td>
      <td>${data.phone}</td>
    </tr>
    <tr>
      <td>Country: </td>
      <td>${data.country}</td>
    </tr>
    <tr>
      <td>City: </td>
      <td>${data.city}</td>
    </tr>
    <tr>
      <td>Message: </td>
      <td>${data.message}</td>
    </tr>
  </tbody>
</table>

</div>
<div class="footerText">©Neutrosys Pvt Ltd.</div>
</body>
</html>

  
`;

  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: NodeMailerConfig.user,
      pass: NodeMailerConfig.pass,
    },
  });

  let mailOptions = {
    from: data.email,
    to: NodeMailerConfig.user,
    subject: `Message from ${data.fullName}`,
    html: output,
    attachments: [
      {
        filename: req.file.name,
        path: req.file.path,
      },
      {
        filename: "logo.jpg",
        path: `${__dirname}/../public/assets/logo.png`,
        cid: "logo",
      },
    ],
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.send("success");
    }
  });

  smtpTransport.close();

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
    const verifyrecaptcha = await fetch(verifyURL).then((res) => res.json());

    // If not successful
    if (verifyrecaptcha.success !== undefined && !verifyrecaptcha.success) {
      return res.json({ success: false, msg: "Failed captcha verification" });
    } else {
      var sql =
        "INSERT INTO allqueries SET fullName = ?, email = ?, phone = ?, city = ?, country = ?,  message = ?, status=?,attachment =?, postedDate = ? ";
      await mysqlconnection.query(
        sql,
        [
          data.fullName,
          data.email,
          data.phone,
          data.city,
          data.country,
          data.message,
          "notSeen",
          "http://" + req.headers.host + "/" + req.file.path,
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
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
});
//get allqueries
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM allqueries ORDER BY id DESC";
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

//get number of notSeen from status form allQueries
router.get("/notSeenQueries", async (req, res) => {
  try {
    var sql =
      "SELECT COUNT(status) as notSeenMessage FROM allqueries WHERE status = 'notSeen' ";
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

//get by ID allqueries
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM allqueries WHERE id = ?";
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

//update allqueries
router.patch("/:id", auth, async (req, res) => {
  console.log(req.params.id);

  let data = req.body;
  console.log(data);
  var date = new Date();
  var postedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  // let postedDate = new Date();
  console.log(postedDate);
  try {
    var sql =
      "UPDATE allqueries SET firstName = ?,lastName = ?, email = ?, phone = ?, address = ?, subject = ?, status=?, message = ?, postedDate = ? WHERE id=?";
    mysqlconnection.query(
      sql,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.address,
        data.subject,
        data.status,
        data.message,
        postedDate,
        req.params.id,
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

//update status allqueries
router.patch("/status/:id", auth, async (req, res) => {
  console.log(req.params.id);

  let data = req.body;

  try {
    var sql = "UPDATE allqueries set status = ? WHERE id = ?";
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

//get by ID allqueries
router.delete("/:id", auth, async (req, res) => {
  try {
    var sql = "DELETE FROM allqueries WHERE id = ?";
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
