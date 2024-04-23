const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema({
  name: {
    require: [true, "Please enter your name"],
    type: String,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      "please enter valid email address",
    ],
  },
  password: {
    type: String,
    require: [true, "please enter the password"],
    minLength: [9, "Please enter atleast 9 characters"],
    // maxLength: [20, "password must be less then 20 characters"],
  },
  role: {
    type: String,
    require: true,
    default: "customer",
    enum: ["customer", "admin"],
  },
  photo: {
    type: String,
    require: [true, "please add a photo"],
    default: "https://ibb.co/GHK1FLj",
  },
  phone: {
    type: String,
    default: "+123-456-789",
  },
  address: {
    type: Object,
  },
});

//encrypting password before saving to database

// userSchema.pre("save", async (next) => {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   // hashing password using bcrypt
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashedPassword;
//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
