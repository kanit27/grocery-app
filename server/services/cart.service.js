const cartModel = require('../models/cart.model');
const userModel = require('../models/user.model');

module.exports.addToCart = async ({ userId, productId, name, price, quantity = 1, icon, shopId }) => {
    if (!userId || !productId || !name || !price || !shopId) {
        throw new Error('Missing required fields');
    }

    try {
        // Find existing cart for user
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new cartModel({
                user: userId,
                products: [],
                totalAmount: 0
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.products.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (existingItemIndex > -1) {
            // Update quantity if product exists
            cart.products[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.products.push({
                productId,
                name,
                price,
                quantity,
                icon,
                shopId
            });
        }

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Error adding to cart: ${error.message}`);
    }
};

module.exports.removeFromCart = async ({ userId, productId }) => {
    if (!userId || !productId) {
        throw new Error('Missing required fields');
    }

    try {
        const cart = await cartModel.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Remove item from cart
        cart.products = cart.products.filter(
            item => item.productId.toString() !== productId.toString()
        );

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Error removing from cart: ${error.message}`);
    }
};

module.exports.getCart = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        const cart = await cartModel.findOne({ user: userId }).populate('user', 'fullname email');
        
        if (!cart) {
            // Return empty cart if none exists
            return {
                user: userId,
                products: [],
                totalAmount: 0
            };
        }

        return cart;
    } catch (error) {
        throw new Error(`Error fetching cart: ${error.message}`);
    }
};

module.exports.clearCart = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        const cart = await cartModel.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.products = [];
        cart.totalAmount = 0;
        await cart.save();
        
        return cart;
    } catch (error) {
        throw new Error(`Error clearing cart: ${error.message}`);
    }
};

module.exports.updateCartItemQuantity = async ({ userId, productId, quantity }) => {
    if (!userId || !productId || quantity < 1) {
        throw new Error('Invalid parameters');
    }

    try {
        const cart = await cartModel.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.products.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        cart.products[itemIndex].quantity = quantity;

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Error updating cart: ${error.message}`);
    }
};
