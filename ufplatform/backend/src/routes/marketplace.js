const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

// **Add a new product (Farmers only)**
router.post("/add", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "farmer") return res.status(403).json({ message: "Only farmers can add products" });

        const { name, description, price, quantity, category, image } = req.body;
        const newProduct = new Product({ name, description, price, quantity, category, image, seller: req.user.id });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **Get all products**
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "name email");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **Get products by category**
router.get("/category/:category", async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **Buy a product (Buyers only)**
router.post("/buy/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "buyer") return res.status(403).json({ message: "Only buyers can purchase products" });

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.quantity < 1) return res.status(400).json({ message: "Out of stock" });

        product.quantity -= 1;
        await product.save();

        res.json({ message: "Purchase successful", product })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

module.exports = router;
