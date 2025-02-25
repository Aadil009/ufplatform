const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()
const roleMiddleware = require("../middleware/roleMiddleware")
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user.id}, Role: ${req.user.role}` })
});

// Route only for farmers
router.get("/farmer-section", authMiddleware, roleMiddleware(["farmer"]), (req, res) => {
    res.json({ message: "Welcome to the farmer's section!" })
  });
  
  // Route only for buyers
  router.get("/buyer-section", authMiddleware, roleMiddleware(["buyer"]), (req, res) => {
    res.json({ message: "Welcome to the buyer's section!" })
  });
  
  // Route only for admins
  router.get("/admin-dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!" })
  });

module.exports = router
