const Store = require("../models/StorePartner");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/authMiddleware");

exports.registerStore = async (req, res) => {
  try {
    const { name, email, phone, password, storeName, address, location } = req.body;

    const existing = await Store.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const store = await Store.create({ name, email, phone, password: hashed, storeName, address, location });

    const token = generateToken({ userId: store._id, role: "store_partner" });

    res.json({
      token,
      user: { _id: store._id, name: store.name, email: store.email, role: "store_partner" },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = await Store.findOne({ email });
    if (!store) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, store.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ userId: store._id, role: "store_partner" });

    res.json({
      token,
      user: { _id: store._id, name: store.name, email: store.email, role: "store_partner" },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.logoutStore = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};