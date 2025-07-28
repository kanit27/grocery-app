const cartService = require('../Backend/services/cart.service');
const { validationResult } = require('express-validator');

module.exports.addToCart = async (req, res, next) => {
    console.log('--- CART CONTROLLER: addToCart called ---');
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation failed:', errors.array());
            return res.status(400).json({ 
                success: false, 
                errors: errors.array(),
                message: 'Validation failed'
            });
        }

        const { productId, name, price, quantity = 1, icon, shopId } = req.body;
        const userId = req.user._id;

        console.log('Add to cart request:', { userId, productId, name, price, quantity, shopId });

        const cart = await cartService.addToCart({
            userId,
            productId,
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            icon,
            shopId
        });

        console.log('Cart after add:', cart);
        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        console.log('Remove from cart request:', { userId, productId });

        const cart = await cartService.removeFromCart({ userId, productId });

        res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        console.log('Get cart request for user:', userId);

        const cart = await cartService.getCart(userId);

        res.status(200).json({
            success: true,
            cart: cart
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        console.log('Clear cart request for user:', userId);

        const cart = await cartService.clearCart(userId);

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.updateCartItemQuantity = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        console.log('Update cart quantity request:', { userId, productId, quantity });

        const cart = await cartService.updateCartItemQuantity({ 
            userId, 
            productId, 
            quantity: parseInt(quantity) 
        });

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
