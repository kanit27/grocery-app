const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/authMiddleware");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, address, location } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed, address, location });

    const token = generateToken({ userId: user._id, role: "user" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        phone: user.phone,
        address: user.address,
        location: user.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message }); // FIXED: use message
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ userId: user._id, role: "user" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        phone: user.phone,
        address: user.address,
        location: user.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message }); // FIXED: use message
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message }); // FIXED: use message
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // FIXED: use message
  }
};