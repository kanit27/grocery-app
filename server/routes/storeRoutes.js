const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, requireRole("store_partner"), (req, res) => {
  res.json({ message: "Welcome Store Partner", user: req.user });
});

// Later: add-product, view-inventory, get-orders

module.exports = router;
