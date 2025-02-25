const express = require("express");
const GovernmentScheme = require("../models/GovernmentScheme");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// **Get all government schemes**
//filter by category using a query parameter: /schemes?category=finance
router.get("/schemes", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const schemes = await GovernmentScheme.find(filter);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Add a new scheme (Admins only)**
router.post("/add", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { title, description, eligibility, benefits, applicationLink, category } = req.body;
    const newScheme = new GovernmentScheme({
      title,
      description,
      eligibility,
      benefits,
      applicationLink,
      category,
    });
    await newScheme.save();
    res.status(201).json({ message: "Scheme added successfully", scheme: newScheme });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Update an existing scheme (Admins only)**
router.put("/update/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const updatedScheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedScheme) return res.status(404).json({ message: "Scheme not found" });
    res.json({ message: "Scheme updated successfully", scheme: updatedScheme });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Delete a scheme (Admins only)**
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json({ message: "Scheme deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
