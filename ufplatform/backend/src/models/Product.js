const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, enum: ["grains", "vegetables", "fruits", "dairy", "others"], required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
}, { timestamps: true })

module.exports = mongoose.model("Product", ProductSchema)
