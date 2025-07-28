const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');

// Add to cart
router.post('/add', 
    authMiddleware.authUser,
    [
        body('productId').notEmpty().withMessage('Product ID is required'),
        body('name').notEmpty().withMessage('Product name is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('shopId').notEmpty().withMessage('Shop ID is required'),
        body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
    ],
    cartController.addToCart
);

// Remove from cart
router.delete('/remove/:productId', 
    authMiddleware.authUser,
    cartController.removeFromCart
);

// Get cart
router.get('/', 
    authMiddleware.authUser,
    cartController.getCart
);

// Clear cart
router.delete('/clear', 
    authMiddleware.authUser,
    cartController.clearCart
);

// Update cart item quantity
router.put('/update/:productId', 
    authMiddleware.authUser,
    [
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
    ],
    cartController.updateCartItemQuantity
);

module.exports = router;
