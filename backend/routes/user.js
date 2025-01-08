const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.js");
const mailer = require("../utils/mailer.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const authenticate = require("../utils/ForgetAuth.js");

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Route for user registration
router.post("/register", async function (req, res) {
  try {
    const { name, email, username, password, phoneNumber, confirm_password } =
      req.body;

    // Password match check
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists, choose another' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: hash,
      phoneNumber: phoneNumber,
      admin: 0,
    });

    await newUser.save();

    // Send a welcome email
    await mailer(
      email,
      "reg",
      "Welcome to Raattai and happy purchasing. Please confirm your registration by logging in at http://3.6.184.48:3000/login"
    );

    res.json({ success: "You will receive an email notification." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for user login
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: "Error authenticating user" });
    }
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ error: "Error logging in user" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        message: "Login successful",
        user: req.user,
        token: token,
      });
    });
  })(req, res, next);
});

// Route to logout (removes JWT from client)
router.get("/logout", function (req, res) {
  try {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "You are logged out!" });
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to initiate password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const OTP = generateOTP();
    // Send OTP to user's email
    await mailer(
      email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${OTP}`,
      `Your OTP for password reset is: <b>${OTP}</b>`
    );

    // Generate JWT token with email and OTP
    const token = jwt.sign({ email, OTP }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending email" });
  }
});

// Route to verify OTP during password reset
router.post("/verify-otp", authenticate, async (req, res) => {
  try {
    const { OTP } = req.body;

    if (req.OTP !== parseInt(OTP)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "OTP verified. You can now reset your password." });
  } catch (error) {
    console.error(error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Route to reset password after OTP verification
router.post("/reset-password", authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();
    res.json({ message: "Password reset successfully. Please log in again." });
  } catch (error) {
    console.error(error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Route to get user details (for authenticated user)
router.get("/get-user", (req, res) => {
  const user = req.user;
  res.json({ user });
});

module.exports = router;
