const express = require("express");
const router = express.Router();
const { registerStore, loginStore, logoutStore } = require("../../controllers/storeController");

router.post("/register", registerStore);
router.post("/login", loginStore);
router.post("/logout", logoutStore);

module.exports = router;
