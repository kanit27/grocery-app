const express = require("express");
const router = express.Router();
const { storeLogin, storeRegister } = require("../../controllers/storeAuthController");

router.post("/login", storeLogin);
router.post("/register", storeRegister);

module.exports = router;
