const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// SignUp Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    const payload = { name: user.name, email: user.email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SignUp Route
router.post("/signup", signup);
// Login Route
router.post("/login", login);

module.exports = router;
