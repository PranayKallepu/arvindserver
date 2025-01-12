const express = require("express");
const middleware = require('../middleware/authMiddleware');
const {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
  webhookUpdate,
  manualStatusUpdate,
} = require("../controllers/transactionController");

const router = express.Router();

// // Apply auth middleware to all routes
// router.use(middleware);

// Fetch all transactions
router.get("/transactions", middleware, getAllTransactions);

// Fetch transactions by school_id
router.get("/transactions/school/:school_id", middleware, getTransactionsBySchool);

// Check transaction status by custom_order_id
router.get("/transactions/status/:custom_order_id", middleware, checkTransactionStatus);

// Webhook to update transaction status
router.post("/transactions/webhook", webhookUpdate);

// Manual status update
router.post("/transactions/update-status", manualStatusUpdate);

module.exports = router;
