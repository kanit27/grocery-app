const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captionController = require('../controllers/caption.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('fullname.firstname').isLength({ min:3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be a number'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Vehicle type must be car, motorcycle, or auto'),
    body('vehicle.vehicleModel').isLength({ min: 3 }).withMessage('Vehicle model must be at least 3 characters long'),
],
    captionController.registerCaption
);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],
 captionController.loginCaption
);

router.get('/profile', authMiddleware.authCaption, captionController.getCaptionProfile);

router.get('/logout', authMiddleware.authCaption, captionController.logoutCaption);

module.exports = router;