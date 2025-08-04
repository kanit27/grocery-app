const StorePartner = require("../models/StorePartner");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.storeRegister = async (req, res) => {
  try {
    const { brandName, email, password } = req.body;
    if (!email || !password || !brandName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await StorePartner.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Store already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const store = await StorePartner.create({
      brandName,
      email,
      passwordHash,
    });
    const token = jwt.sign({ id: store._id, role: "store" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, store: { id: store._id, brandName: store.brandName, email: store.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.storeLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Store Login Attempt:", email);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const store = await StorePartner.findOne({ email });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const isMatch = await bcrypt.compare(password, store.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: store._id, role: "store" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      store: {
        id: store._id,
        brandName: store.brandName,
        storeName: store.storeName,
        email: store.email,
        phone: store.phone,
        address: store.address,
        city: store.city,
        pincode: store.pincode,
        location: store.location,
        contactPersonName: store.contactPersonName,
        contactPersonPhone: store.contactPersonPhone,
        storeHours: store.storeHours,
        deliveryRadiusKm: store.deliveryRadiusKm,
      },
    });
  } catch (err) {
    console.error("❌ Store Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
