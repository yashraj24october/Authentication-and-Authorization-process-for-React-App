let userModel = require("../model/Auth.model.js");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let registerUser = async (req, res) => {
  let userData = req.body;
  console.log("Registering user:", userData.username);
  try {
    if (!userData.password || !userData.confirm_password || typeof userData.password !== "string" || typeof userData.confirm_password !== "string") {
      return res.status(400).json({user_data: null, message: "Password and confirm password are required and must be strings.", status: "Error"});
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedConfirmPassword = await bcrypt.hash(userData.confirm_password, 10);

    let newUser = new userModel({
      username: userData.username,
      password: hashedPassword,
      confirm_password: hashedConfirmPassword,
      email: userData.email,
      profile_image: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
      gender: userData.gender,
      contact_number: userData.contact_number,
      address: userData.address
    });
    await newUser.save();
    console.log("User registered successfully:", newUser.username);
    res.status(201).json({user_data: userData, message: "User registered successfully", status: "Success"});
  } catch (error) {
    console.log("User registration failed:", error.message);
    res.status(500).json({user_data: null, message: error.message, status: "Error"});
  }
};

let loginUser = async (req, res) => {
  const {username, password, remember_me} = req.body;

  try {
    // Find user by username
    const user = await userModel.findOne({username});
    console.log(user);
    if (!user) {
      return res.status(401).json({user_data: null, message: "Invalid username or password.", status: "Error"});
      console.log("user not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({user_data: null, message: "Invalid username or password.", status: "Error"});
      console.log("Invalid username or password.");
    }
    // Always use short-lived access token
    const accessToken = jwt.sign({
      id: user._id,
      username: user.username
    }, process.env.LOGIN_JWT_KEY || "Qw8!vZ2@rT7#pL6$eF9^bN4&xS1*oM3%jH5", {expiresIn: "1h"});

    // Generate refresh token with longer expiry for remember_me
    const refreshToken = jwt.sign({
      id: user._id,
      username: user.username
    }, process.env.JWT_REFRESH_SECRET || "R7!kLp2@xV9#zQ4$wT8^nB3&sF6*mJ1%yH0", {
      expiresIn: remember_me
        ? "30d"
        : "7d"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: remember_me
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
    });

    res.status(200).json({
      user_data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        gender: user.gender,
        contact_number: user.contact_number,
        address: user.address,
        role: user.role
      },
      accessToken,
      message: "Login successful",
      status: "Success"
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({user_data: null, message: error.message, status: "Error"});
  }
};

let getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find({});
    res.status(200).json({user_data: users, status: "Success"});
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({user_data: null, status: "Error", message: error.message});
  }
};

let getUserByUsername = async (req, res) => {
  let username = req.query.username;
  console.log("Fetching user by username:", username);
  try {
    let user = await userModel.findOne({username: username});
    if (user) {
      res.status(200).json({user_data: user, status: "Success"});
    } else {
      res.status(404).json({user_data: null, status: "Not Found"});
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(200).json({user_data: user, status: "Error"});
  }
};

let getUserById = async (req, res) => {
  let userId = req.params.id;
  console.log("Fetching user by ID:", userId);
  try {
    let user = await userModel.findOne({_id: userId});
    if (user) {
      res.status(200).json({user_data: user, status: "Success"});
    } else {
      res.status(404).json({user_data: null, status: "Not Found"});
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(200).json({user_data: user, status: "Error"});
  }
};

// Check Auth API
const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({isAuthenticated: false, message: "No token provided", status: "Error"});
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.LOGIN_JWT_KEY || "Qw8!vZ2@rT7#pL6$eF9^bN4&xS1*oM3%jH5", async (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        // Try to get refresh token from cookies
        const refreshToken = req.cookies && req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({isAuthenticated: false, message: "Session expired. Please login again.", status: "Error"});
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "R7!kLp2@xV9#zQ4$wT8^nB3&sF6*mJ1%yH0", async (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            return res.status(401).json({isAuthenticated: false, message: "Refresh token expired. Please login again.", status: "Error"});
          }
          // Generate new access token
          const newAccessToken = jwt.sign({
            id: refreshDecoded.id,
            username: refreshDecoded.username
          }, process.env.LOGIN_JWT_KEY || "Qw8!vZ2@rT7#pL6$eF9^bN4&xS1*oM3%jH5", {expiresIn: "1h"});

          // Optionally, refresh the refresh token as well (rolling refresh)
          // Fetch user data from DB for latest info (including role)
          const user = await userModel.findById(refreshDecoded.id).select("-password -confirm_password");
          if (!user) {
            return res.status(401).json({isAuthenticated: false, message: "User not found", status: "Error"});
          }
          // Optionally, set new refresh token cookie here if you want rolling refresh
          return res.status(200).json({isAuthenticated: true, user, accessToken: newAccessToken, status: "Success", message: "Token refreshed"});
        });
        return;
      } else if (err) {
        return res.status(401).json({isAuthenticated: false, message: "Invalid or expired token", status: "Error"});
      }
      // Fetch user data from DB for latest info (including role)
      const user = await userModel.findById(decoded.id).select("-password -confirm_password");
      if (!user) {
        return res.status(401).json({isAuthenticated: false, message: "User not found", status: "Error"});
      }
      return res.status(200).json({isAuthenticated: true, user, status: "Success"});
    });
  } catch (error) {
    return res.status(500).json({isAuthenticated: false, message: error.message, status: "Error"});
  }
};

module.exports = {
  registerUser,
  getUserByUsername,
  getAllUsers,
  getUserById,
  loginUser,
  checkAuth
};
