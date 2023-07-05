const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const passport = require("passport");
//執行這個行程式碼時，馬上執行，並套入passport套件
require("./config/passport")(passport);
const cors = require("cors");

const courseRoute = require("./routes").course;

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("成功連結到DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);
//course route 應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unathorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);
// 只有登入系統的人，才能夠去新增課程或是註冊課程
// jwt

app.listen(8080, () => {
  console.log("後端伺服器聆聽port 8080....");
});
