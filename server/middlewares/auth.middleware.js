const userModel = require('../models/user.model');
const captionModel = require('../models/caption.model');
const shopModel = require('../models/shop.model');
const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken.model');

// Helper to extract token from header or cookies
function extractToken(req, cookieKey = 'token') {
    let token = null;
    if (req.cookies && req.cookies[cookieKey]) {
        token = req.cookies[cookieKey];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    return token;
}

// Helper to send consistent 401 error
function send401(res, msg = 'Unauthorized') {
    return res.status(401).json({ message: msg });
}

module.exports.authUser = async (req, res, next) => {
    console.log('--- AUTH MIDDLEWARE ---');
    console.log('Request headers:', req.headers);
    console.log('Request cookies:', req.cookies);
    const token = extractToken(req, 'token');
    console.log('Extracted token:', token);
    if (!token) {
        console.log('No token provided');
        return send401(res, 'Login first');
    }
    try {
        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted:', token);
            return send401(res, 'Login first');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const user = await userModel.findById(decoded._id);
        console.log('User found:', user);
        if (!user) {
            console.log('User not found for token:', token);
            return send401(res, 'Login first');
        }
        req.user = user;
        return next();
    } catch (error) {
        console.log('JWT error:', error.message);
        return send401(res, 'Login first');
    }
};

module.exports.authCaption = async (req, res, next) => {
    const token = extractToken(req, 'token');
    if (!token) {
        console.log('No token provided (caption)');
        return send401(res);
    }
    try {
        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted (caption):', token);
            return send401(res);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token (caption):', decoded);
        const caption = await captionModel.findById(decoded._id);
        if (!caption) {
            console.log('Caption not found for token:', token);
            return send401(res);
        }
        req.caption = caption;
        return next();
    } catch (error) {
        console.log('JWT error (caption):', error.message);
        return send401(res);
    }
};

module.exports.authShop = async (req, res, next) => {
    const token = extractToken(req, 'shopToken');
    if (!token) {
        console.log('No shop token provided');
        return send401(res, 'Unauthorized - No token provided');
    }
    try {
        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Shop token is blacklisted:', token);
            return send401(res, 'Unauthorized - Token blacklisted');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'shop') {
            console.log('Invalid shop role in token:', decoded.role);
            return send401(res, 'Unauthorized - Invalid role');
        }
        const shop = await shopModel.findById(decoded._id);
        if (!shop) {
            console.log('Shop not found for token:', token);
            return send401(res, 'Unauthorized - Shop not found');
        }
        if (shop.status !== 'active') {
            console.log('Shop account suspended:', shop._id);
            return send401(res, 'Unauthorized - Shop account suspended');
        }
        req.shop = shop;
        next();
    } catch (error) {
        console.error('Shop Auth Error:', error.message);
        return send401(res, 'Unauthorized - Invalid token');
    }
};