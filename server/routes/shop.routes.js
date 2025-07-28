const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");

router.post("/register", shopController.registerShop);
router.post("/login", shopController.loginShop);
router.get("/", shopController.getAllShops);
router.get("/:shopId", shopController.getShopById);
router.put("/:shopId/status", shopController.updateShopStatus);
router.post("/products", shopController.addOrUpdateProducts);
router.post("/products/order", shopController.decrementProductStock);
router.get("/:shopId/products", shopController.getShopProducts);
router.delete("/:shopId/products/:productId", shopController.deleteProduct);

module.exports = router;
