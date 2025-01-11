const express = require("express");
const {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
  webhookUpdate,
  manualStatusUpdate,
} = require("../controllers/transactionController");

const router = express.Router();

// Fetch all transactions
router.get("/transactions", getAllTransactions);

// Fetch transactions by school_id
router.get("/transactions/school/:school_id", getTransactionsBySchool);

// Check transaction status by custom_order_id
router.get("/transactions/status/:custom_order_id", checkTransactionStatus);

// Webhook to update transaction status
router.post("/transactions/webhook", webhookUpdate);

// Manual status update
router.post("/transactions/update-status", manualStatusUpdate);

module.exports = router;
