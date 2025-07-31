const Delivery = require("../models/DeliveryPartner");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/authMiddleware");

exports.registerDelivery = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleNumber, currentLocation } = req.body;

    const existing = await Delivery.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const delivery = await Delivery.create({
      name,
      email,
      phone,
      password: hashed,
      vehicleNumber,
      currentLocation,
    });

    const token = generateToken({ userId: delivery._id, role: "delivery_partner" });

    res.json({
      token,
      user: { _id: delivery._id, name: delivery.name, email: delivery.email, role: "delivery_partner" },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body;
    const delivery = await Delivery.findOne({ email });
    if (!delivery) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, delivery.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ deliveryId: delivery._id, role: "delivery" });

    res.json({
      token,
      delivery: {
        _id: delivery._id,
        name: delivery.name,
        email: delivery.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logoutDelivery = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};