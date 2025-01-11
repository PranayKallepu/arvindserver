// server.js

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./auth/auth"); // Import auth route

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());

// Use auth routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.error(error));

// Routes
app.use("/api", transactionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started and running at ${PORT}`);
});
