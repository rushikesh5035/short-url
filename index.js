const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectToMongoDB } = require("./connection");
const { restrictTo, checkForAuthectication } = require("./middlewares/auth");

// Routes
const urlRoute = require("./routes/index");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRoute");
const userRoute = require("./routes/user");

// EJS Set-up
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthectication);

// Connection with MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("mongodb connected");
});

app.use("/", staticRoute);
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitedHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(8000, () => {
  console.log("Server Started...!");
});
