const nodemailer = require("nodemailer");
const NodeMailerConfig = require("../config/nodemailer.config");

const mailFunction = (
    fullName,
    email,
    phone,
    city,
    country,
    message,
    resumeOriginalName,
           resumePath,
  ) => {
    console.log("mail Send");
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
  
    ${fullName} has sent a message.</h3>
    <table class = "table">
    <tbody>
      <tr>
        <td>Name: </td>
        <td>${fullName}</td>
      </tr>
      <tr>
        <td>Email: </td>
        <td>${email}</td>
      </tr>
      <tr>
        <td>Phone: </td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td>Country: </td>
        <td>${country}</td>
      </tr>
      <tr>
        <td>City: </td>
        <td>${city}</td>
      </tr>
      <tr>
        <td>Message: </td>
        <td>${message}</td>
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
      from: email,
      to: NodeMailerConfig.user,
      subject: `Message from ${fullName}`,
      html: output,
      attachments: [
        {
          filename: resumeOriginalName,
          path: resumePath,
        },
      
        // {
        //   filename: "logo.jpg",
        //   path: `${__dirname}/../public/assets/logo.png`,
        //   cid: "logo",
        // },
      ],
    };
  
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
       
        console.log(error);
      } else {
        console.log("success");
      }
    });
  
    smtpTransport.close();
}
  module.exports = {
    mailFunction,
  };
  