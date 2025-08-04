const express = require("express");
const router = express.Router();
const { verifyUserToken } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.get("/:storeId", verifyUserToken, cartController.getCart);
router.post("/:storeId", verifyUserToken, cartController.addToCart);
router.delete("/:storeId/:productId", verifyUserToken, cartController.removeFromCart);
router.get("/user/all", verifyUserToken, cartController.getAllUserCarts);

module.exports = router;