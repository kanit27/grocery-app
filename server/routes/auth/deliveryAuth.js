const express = require("express");
const router = express.Router();
const { registerDelivery, loginDelivery, logoutDelivery } = require("../../controllers/deliveryController");

router.post("/register", registerDelivery);
router.post("/login", loginDelivery);
router.post("/logout", logoutDelivery);

module.exports = router;
