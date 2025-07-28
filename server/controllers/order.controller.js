const orderService = require('../Backend/services/order.service');
const Order = require('../Backend/models/order.model');

module.exports.placeOrder = async (req, res, next) => {
  try {
    console.log("➤ placeOrder body:", req.body);
    console.log("➤ placeOrder user:", req.user._id);

    // Use the service to handle order placement and cart clearing
    const { order, shopId } = await orderService.placeOrder({
      userId: req.user._id
    });

    // notify shop
    const io = req.app.get("io");
    if (io && shopId) {
      io.to(`shop_${shopId}`).emit("new-order", order);
    }

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error in placeOrder:", err);
    const status = err.message === "Cart is empty" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

module.exports.getUserHistory = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

module.exports.getShopHistory = async (req, res, next) => {
  try {
    const orders = await orderService.getShopOrders(req.shop._id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};