const nodeMailer = require("nodemailer");
const NodeMailerConfig = require("../config/nodemailer.config");

const mailFunction = (
   firstName,
   lastName,
    gmail,
    phone,
   country,
   state,
    city,
    senioritylevel,
   expectedSalary,
 message,
    resumeOriginalName,
  resumePath,
  coverOriginalName,
  coverPath,
 jobTitle,
jobType
  ) => 
  {
  console.log("mail Send");
  let setpTransport = nodeMailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: NodeMailerConfig.user,
      pass: NodeMailerConfig.pass,
    },
  });
  let mailOptions = {
    from: gmail,
    to: NodeMailerConfig.user,
    subject: `Job Application from ${firstName} ${lastName}`,
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
    // <img src="cid:logo" alt="logo"/>
    <p> Job Application</p>
    </div>
    <div class="innerBox">
   
    
    <h3>Hi,<br>
  
    ${firstName} has submitted a job application on ${jobTitle}.</h3>
    <table class = "table">
    <tbody>
      <tr>
        <td><b>Name: </b></td>
        <td>${firstName} ${lastName}</td>
      </tr>
      <tr>
        <td><b>Email:</b> </td>
        <td>${gmail}</td>
      </tr>
      <tr>
        <td><b>Phone:</b> </td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td><b>Country: </b></td>
        <td>${country}</td>
      </tr>
      <tr>
      <td><b>State:</b> </td>
      <td>${state}</td>
    </tr>
      <tr>
        <td><b>City:</b> </td>
        <td>${city}</td>
      </tr>
      <tr>
        <td><b>Seniority Level:</b> </td>
        <td>${senioritylevel}</td>
      </tr>
      <tr>
      <td><b>Expected Salary:</b> </td>
      <td>${expectedSalary}</td>
    </tr>
      <tr>
        <td><b>Message: </b></td>
        <td>${message}</td>
      </tr>
      <tr>
        <td><b>Job Title: </b></td>
        <td>${jobTitle}</td>
      </tr>
      <tr>
        <td><b>Job Title: </b></td>
        <td>${jobType}</td>
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
        filename: resumeOriginalName,
        path: resumePath,
      },
      {
        filename: coverOriginalName,
        path: coverPath,
      },
      // {
      //   filename: "logo.jpg",
      //   path: `${__dirname}/../public/assets/logo.png`,
      //   cid: "logo",
      // },
    ],
  };
  setpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("success");
    }
  });
};

module.exports = {
  mailFunction
};
