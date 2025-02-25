const mongoose = require("mongoose");

const LogisticsSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "in transit", "delivered"], default: "pending" },
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Logistics", LogisticsSchema);
