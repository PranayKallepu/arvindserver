const Transaction = require("../models/transactionModel");

// Fetch all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { custom_order_id },
      { status },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
