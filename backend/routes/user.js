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
const authenticateToken = require("../utils/AuthDecode.js");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.get("/role", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get the total count of users
router.get("/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Failed to fetch user count." });
  }
});

// Get the list of new registrations (e.g., users who registered in the last 7 days)
router.get("/new-registrations", async (req, res) => {
  try {
    const newRegistrations = await User.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, 
    }).sort({ createdAt: -1 });
    res.status(200).json({ registrations: newRegistrations });
  } catch (error) {
    console.error("Error fetching new registrations:", error);
    res.status(500).json({ message: "Failed to fetch new registrations." });
  }
});

router.post("/register", async function (req, res) {
  try {

    const { name, email, username, password, phoneNumber, confirm_password, address } = req.body;

    // Validate required fields
    if (!name || !email || !username || !password || !confirm_password || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required except address' });
    }

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
      admin: 0, // Assuming admin is by default 0 (non-admin)
      address: address || '', // Optional address field
    });

    await newUser.save();

    // // Send a welcome email
    // await mailer(
    //   email,
    //   "reg",
    //   "Welcome to curcumin and happy purchasing. Please confirm your registration by logging in at http://3.6.184.48:3000/login"
    // );

    res.json({ success: "You will receive an email notification." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for user login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the user by username (or email, depending on your schema)
    const user = await User.findOne({ email }); // Use email if you're validating by email

    // Step 2: Check if user exists
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Step 3: Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Step 4: Generate JWT token upon successful login
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h', // Set expiration time for the token
    });

    // Step 5: Send a success response with the token and user info
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },
      token, // Include the generated token in the response
    });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in user' });
  }
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
router.post("/forgot", async (req, res) => {
  try {
      console.log("Forgot password route hit");

    console.log('Request Body:', req.body); 
    const { email } = req.body;
    const allUsers = await User.find({});
console.log('All Users:', allUsers);

    // Find user by email
   const user = await User.findOne({ email });
if (!user) {
  console.log('User with this email does not exist.');
  return res.status(404).json({ error: 'User not found' });
}

    const OTP = generateOTP();
    await mailer(
      email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${OTP}`,
      `Your OTP for password reset is: <b>${OTP}</b>`
    );

    const token = jwt.sign({ email, OTP }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
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
router.post('/reset-password', authenticate, async (req, res) => {
  try {
    console.log("Reset password route hit");
    console.log("Request Body:", req.body);
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
