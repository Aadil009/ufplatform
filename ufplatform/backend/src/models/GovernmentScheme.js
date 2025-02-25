const mongoose = require("mongoose");

const GovernmentSchemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String },
    benefits: { type: String },
    applicationLink: { type: String },
    category: { type: String }, // e.g., finance, crop, insurance, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovernmentScheme", GovernmentSchemeSchema);
