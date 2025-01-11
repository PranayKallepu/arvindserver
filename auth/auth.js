const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// User Schema (Model)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
const User = mongoose.model("User", userSchema);

// Initialize Express Router
const router = express.Router();

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";  // Make sure to keep it in .env file

//SignUp Controller
const signup = async(req,res) =>{
  try {
    const {name,email, password} = req.body 
    const exitingUser = await User.findOne({email});
    if(exitingUser){
      return res.status(400).json({message: 'Email already Exits'})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    //CREATING NEW USER
    const newUser = new User({
      name,email,
      password: hashedPassword
    })
    await newUser.save()
    return res.status(200).json({message: 'User Registered Successfully'})
  } catch (error) {
    res.status(500).json({message: 'Server Error'}, error.message)
  }
}
//Login Controller
const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    // Find user by name
    const user = await User.findOne({ name });
    console.log("User Found:", user);

    // If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    // Generate JWT
    const payload = { name: user.name, email: user.email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login Successful..!", jwtToken });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Middleware to protect routes using JWT authentication
const protectRoute = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming the token is passed as "Bearer <token>"

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();  // Move to the next middleware/route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

//SignUp Route
router.post('/signup', signup)
//Login Route
router.post("/login", login);

// A protected route (only accessible if the user is authenticated)
// router.get("/protected", protectRoute, (req, res) => {
//   res.status(200).json({ message: "This is a protected route", user: req.user });
// });

// Export router
module.exports = router;
