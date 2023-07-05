const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const courseSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, //primary key , (連結到 mongoose 裡面的User Model)
    ref: "User", // 連結到User
  },
  students: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);
