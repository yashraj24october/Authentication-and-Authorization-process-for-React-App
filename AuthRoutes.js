let userRoutes = require("express").Router();
// const { upload} = require('../middleware/AuthMiddleware.js');
const {upload} = require("../middleware/ImageUploadMiddleware.js");
let {
  registerUser,
  getUserByUsername,
  getAllUsers,
  getUserById,
  loginUser,
  checkAuth
} = require("../controller/AuthController.js");

userRoutes.post("/register", upload.single("profile_image"), registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/check-auth", checkAuth);

userRoutes.get("/user-check", getUserByUsername);
userRoutes.get("/users", getAllUsers);
userRoutes.get("/user/:id", getUserById);

module.exports = {
  userRoutes
};
