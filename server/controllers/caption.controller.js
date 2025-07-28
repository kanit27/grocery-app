const captionModel = require('../models/caption.model');
const captionService = require('../services/caption.service');
const { validationResult } = require('express-validator');
const BlackListToken = require('../models/blackListToken.model');
const jwt = require('jsonwebtoken');

module.exports.registerCaption = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptionAlreadyExists = await captionModel.findOne({ email });
        if (isCaptionAlreadyExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const caption = await captionService.createCaption({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
            vehicleModel: vehicle.vehicleModel
        });

        const token = caption.generateAuthToken();

        // 🔥 PRODUCTION COOKIE FIX
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            domain: isProduction ? undefined : "localhost"
        });

        res.status(201).json({
            caption,
            token,
            message: "Caption registered successfully"
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports.loginCaption = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const caption = await captionModel
            .findOne({ email })
            .select('+password');

        if (!caption) {
            return res.status(404).json({ message: 'Caption not found' });
        }

        const isMatch = await caption.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password not matched' });
        }

        const token = caption.generateAuthToken();

        // 🔥 PRODUCTION COOKIE FIX
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            domain: isProduction ? undefined : "localhost"
        });

        res.status(200).json({
            caption,
            token,
            message: "Login successful"
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports.getCaptionProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.caption);
    }
    catch (error) {
        next(error);
    }
};

module.exports.logoutCaption = async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const caption = await captionModel.findById(decoded._id);

        if (!caption) {
            return res.status(404).json({ message: "Caption not found" });
        }

        await BlackListToken.create({ token });

        // 🔥 CLEAR COOKIE with same options as set
        const isProduction = process.env.NODE_ENV === 'production';

        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            domain: isProduction ? undefined : "localhost"
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
