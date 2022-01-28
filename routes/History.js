const express = require("express");
const router = express.Router();
const BrowserHistory = require("node-browser-history");

router.get("/history", async (req, res) => {
  console.log("hello");
  BrowserHistory.getAllHistory(10).then(function (history) {
    console.log(history);
  });
});
module.exports = router;
