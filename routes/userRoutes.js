const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "This is secret Key asdfg";
const SALT_ROUND = 10;
const mysqlconnection = require("../model/db");

//add user
router.post("/signup", async (req, res) => {
  let { name, email, password, conformpassword } = req.body;
  console.log(req.body);
  try {
    const schema = Joi.object({
      password: Joi.string().min(4).max(30).required(),
      email: Joi.any(),
      conformpassword: Joi.any(),
      name: Joi.any(),
    });
    const validationErr = schema.validate(req.body, { abortEarly: false });
    if (validationErr && validationErr.error) {
      let message = validationErr.error.details.map((dat) => {
        return dat.message;
      });
      return res.status(422).json({
        message,
      });
    }
    if (password !== conformpassword) {
      return res.status(401).json({
        message: "Password Must be Same",
      });
    }

    email = email.toLowerCase();
    // let olduser = await user.find({ email });
    var sql = "SELECT email FROM `user` WHERE email = ?";
    mysqlconnection.query(sql, email, (err, result) => {
      if (!err) {
        if (result.length > 0) {
          res.status(422).json({
            message: "Email Already Exist",
          });
          return;
        }
      } else console.log(err);
    });

    let hash = bcrypt.hashSync(password, SALT_ROUND);
    // console.log(hash);

    var date = new Date();
    var createdAt =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    var sql =
      "INSERT INTO user SET name = ?,email = ?, password = ? , createdAt = ?";
    await mysqlconnection.query(
      sql,
      [name, email, hash, createdAt],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({
            status: "ok",
            data: "Sign up Successfully!",
          });
          return;
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
    return;
  }
  return;
});

//for login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  let currentuser = "";

  try {
    var sql = "SELECT * FROM `user` WHERE email = ?";
    await mysqlconnection.query(sql, email, (err, result) => {
      console.log(result.length);
      if (result.length == 0) {
        return res.status(400).send({
          message: "Invalid Email !",
        });
      }
      if (!err) {
        if (result.length > 0) {
          currentuser = JSON.parse(JSON.stringify(result));

          let compairpassword = bcrypt.compareSync(
            password,
            currentuser[0].password
          );
          // console.log(compairpassword);
          if (!compairpassword) {
            res.status(400).send({
              message: "Invalid Password !",
            });
            return;
          }

          let { id, name } = currentuser[0];
          // console.log(currentuser[0]);
          // let date = new Date();
          // let hour = date.getHours();
          let expHour = "10";
          console.log(expHour);
          let token = jwt.sign(
            {
              id,
              email,
              name,
            },
            SECRET_KEY,
            { expiresIn: "10h" }
          );
          res.status(200).json({
            token,
            name,
            // date,
            // hour,
            expHour,
          });
        }
        return;
      }
    });
  } catch (err) {
    return res.json({
      message: err,
    });
  }
});

//get all user
router.get("/", async (req, res) => {
  try {
    var sql = "SELECT * FROM user";
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
//get user by id
router.get("/:id", async (req, res) => {
  try {
    var sql = "SELECT * FROM user WHERE id = ?";
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

// delete user by id
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM user WHERE id = ?";
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
