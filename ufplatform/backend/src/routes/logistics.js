const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Logistics = require("../models/Logistics");
const Product = require("../models/Product");
const User = require("../models/User");

const router = express.Router();

// **Request Transportation (Farmers only)**
router.post("/request", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "farmer") return res.status(403).json({ message: "Only farmers can request logistics" });

    const { productId, pickupLocation, dropLocation, price } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const request = new Logistics({
      farmer: req.user.id,
      product: productId,
      pickupLocation,
      dropLocation,
      price,
    });

    await request.save();
    res.status(201).json({ message: "Logistics request created successfully", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **View Available Logistics Requests (Transporters only)**
router.get("/available", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "transporter") return res.status(403).json({ message: "Only transporters can view requests" });

    const requests = await Logistics.find({ status: "pending" }).populate("farmer", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Accept a Logistics Request (Transporters only)**
router.post("/accept/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "transporter") return res.status(403).json({ message: "Only transporters can accept requests" });

    const request = await Logistics.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") return res.status(400).json({ message: "Request already accepted" });

    request.transporter = req.user.id;
    request.status = "accepted";
    await request.save();

    res.json({ message: "Logistics request accepted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Update Delivery Status (Transporters only)**
router.post("/update-status/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "transporter") return res.status(403).json({ message: "Only transporters can update status" });

    const { status } = req.body;
    const validStatuses = ["in transit", "delivered"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status update" });

    const request = await Logistics.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.transporter.toString() !== req.user.id) return res.status(403).json({ message: "You are not assigned to this request" });

    request.status = status;
    await request.save();

    res.json({ message: "Status updated successfully", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
