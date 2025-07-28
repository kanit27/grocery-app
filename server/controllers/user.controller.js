const userModel = require("../../../Uber/Backend/models/user.model");
const userService = require("../../../Uber/Backend/services/user.service");
const { validationResult } = require("express-validator");
const BlackListToken = require("../../../Uber/Backend/models/blackListToken.model");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const isEmailExists = await userModel.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ message: "Email already Exists" });
    }

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password,
    });

    const token = user.generateAuthToken();
    
    // 🔥 PRODUCTION COOKIE FIX
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: isProduction ? "none" : "lax", // "none" only in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isProduction ? undefined : "localhost" // Let browser handle domain in production
    });

    // 🔥 SEND TOKEN IN RESPONSE for localStorage fallback
    res.status(201).json({ 
      user, 
      token, // ✅ Include token in response
      message: "User registered successfully" 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    
    // 🔥 PRODUCTION COOKIE FIX
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      domain: isProduction ? undefined : "localhost"
    });

    // 🔥 SEND TOKEN IN RESPONSE for localStorage fallback
    res.status(200).json({ 
      user, 
      token, // ✅ Include token in response
      message: "Login successful" 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await BlackListToken.create({ token });

    user.token = null;
    await user.save();

    // 🔥 CLEAR COOKIE with same options as set
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      domain: isProduction ? undefined : "localhost"
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};