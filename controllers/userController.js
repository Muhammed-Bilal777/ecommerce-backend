const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { use } = require("../routes/userRoutes");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_secret, {
    expiresIn: "1D",
  });
};

//User Register

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill all the required fields");
  }
  if (password.length < 5) {
    res.status(400);
    throw new Error("password must be greater 5 characters");
  }

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email is already registered please use different email");
  }

  //creating User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  //generate token

  const token = generateToken(user._id);
  if (user) {
    const { _id, name, email, role } = user;
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // secure: true,
      // sameSite:none
    });
    res.status(201).json({
      _id,
      name,
      email,
      token,
      role,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong please login again");
  }

  res.send("resgistered User");
});

//Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    throw new Error("please fill all the fields");
  }

  //checking user exists or not

  const newuser = await User.findOne({ email });
  if (!newuser) {
    throw new Error("Email or password is not valid");
  }
  //checking password is correct or not
  const passwordCorrect = await bcrypt.compare(password, newuser.password);

  // generating token
  const token = generateToken(newuser._id);
  if (newuser && passwordCorrect) {
    const user = await User.findOne({ email }).select("-password");
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      //   secure: true,
      //   sameSite:none,
    });
    res.status(201).json({ user });
  } else {
    throw new Error("Invalid Password or email ");
  }
});

//logging out user
const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    //   secure: true,
    //   sameSite:none,
  });
  res.status(200).json({ message: "Successfully Logout" });
});

//get user

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(201).json(user);
  } else {
    throw new Error("user not found");
  }
});

//get login status

const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify token

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    res.json(true);
  }
  res.json(false);
});

//updating  user

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, phone, address, password } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;
    user.password = req.body.password || password;

    const updatedUser = await user.save();

    res.status(201).json({ message: "User Updated Successfully" });
  } else {
    throw new Error("user not found");
  }
});

//updating user photo

const updateUserPhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;

  const user = await User.findById(req.user._id);
  user.photo = photo;
  const updateUser = await user.save();
  res.status(201).json({ message: "photo updated successfully" });
});

module.exports = {
  userRegister,
  loginUser,
  logOut,
  getUser,
  getLoginStatus,
  updateUser,
  updateUserPhoto,
};
