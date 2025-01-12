const Transaction = require("../models/transactionModel");

// Fetch all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch transactions by school_id
exports.getTransactionsBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const transactions = await Transaction.find({ school_id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check transaction status by custom_order_id
exports.checkTransactionStatus = async (req, res) => {
  const { custom_order_id } = req.params;
  try {
    const transaction = await Transaction.findOne({ custom_order_id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Webhook to update transaction status
exports.webhookUpdate = async (req, res) => {
  const { order_info } = req.body;
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { collect_id: order_info.order_id },
      { status: order_info.status, transaction_amount: order_info.transaction_amount },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manual status update
exports.manualStatusUpdate = async (req, res) => {
  const { custom_order_id, status } = req.body;

  // Validate request body
  if (!custom_order_id || !status) {
    return res.status(400).json({ message: "custom_order_id and status are required" });
  }

  // Validate status value
  const validStatuses = ["Success", "Pending", "Failed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(", ")}` });
  }

  try {
    // Find and update the transaction
    const transaction = await Transaction.findOneAndUpdate(
      { custom_order_id },
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return the updated transaction
    res.status(200).json({ message: "Transaction status updated successfully", transaction });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "An error occurred while updating the transaction", error: error.message });
  }
};

