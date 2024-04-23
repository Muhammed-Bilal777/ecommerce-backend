const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized, please login");
    }

    //verify token

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    //get user id from token

    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500);
    throw new Error("Not authorized please login");
  }
});

module.exports = {
  protect,
};
