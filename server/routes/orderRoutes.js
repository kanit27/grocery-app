const express = require("express");
const router = express.Router();
const { verifyUserToken } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

router.get("/:storeId", verifyUserToken, orderController.getOrders);
router.post("/:storeId", verifyUserToken, orderController.placeOrder);
router.post("/:storeId/confirm/:orderId", verifyUserToken, orderController.confirmOrder);
router.get("/user/all", verifyUserToken, orderController.getAllUserOrders);

module.exports = router;