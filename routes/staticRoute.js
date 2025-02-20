const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allurls = await URL.find({});
  res.render("Home.ejs", { urls: allurls });
});

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allurls = await URL.find({ createdBy: req.user._id });
  res.render("Home.ejs", { urls: allurls });
});

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

module.exports = router;
