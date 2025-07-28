const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');
const { authUser, authShop } = require('../middlewares/auth.middleware');

router.post('/place', authUser, orderController.placeOrder);
router.get('/shop', authShop, orderController.getShopHistory);
router.get('/history', authUser, orderController.getUserHistory);


module.exports = router;
