const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/tasks", verifyToken, requireRole("delivery_partner"), (req, res) => {
  res.json({ message: "Welcome Delivery Partner", user: req.user });
});

// Later: update status, accept task, delivery logs

module.exports = router;
