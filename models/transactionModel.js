const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  collect_id: { type: String, required: true },
  school_id: { type: String, required: true },
  gateway: { type: String, required: true },
  order_amount: { type: Number, required: true },
  transaction_amount: { type: Number, required: true },
  status: { type: String, enum: ["Success", "Pending", "Failed"], required: true },
  custom_order_id: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
