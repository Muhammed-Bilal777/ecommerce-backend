const express = require("express");
const {
  userRegister,
  loginUser,
  logOut,
  getUser,
  getLoginStatus,
  updateUser,
  updateUserPhoto,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/getuser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updateUserPhoto", protect, updateUserPhoto);

module.exports = router;
