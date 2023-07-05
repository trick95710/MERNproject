const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, callback) {
  let result;
  try {
    //第一個password是使用者輸入的密碼，第二個參數是存在userSchema Model裡的hash 的password
    result = await bcrypt.compare(password, this.password);
  } catch (e) {
    return callback(e, result);
  }

  return callback(null, result);
};

//mongoose middlewares
//若使用者為新用戶，或者是正在更改密碼，則將密碼進行雜湊處理
//在被儲存前，要先執行pre function
userSchema.pre("save", async function (next) {
  // this 代表mongoDB內的document
  if (this.isNew || this.isModified("password")) {
    //將密碼進行處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

//
module.exports = mongoose.model("User", userSchema);
