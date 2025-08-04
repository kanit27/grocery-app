const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.getOrders = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    const orders = await Order.find({ user_id, store_id: storeId })
      .sort({ createdAt: -1 })
      .populate("items.product_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    let { items } = req.body;

    if (!items || !items.length) {
      // fallback: get from cart
      const cart = await Cart.findOne({ user_id, store_id: storeId });
      items = cart ? cart.items : [];
    }
    if (!items.length) return res.status(400).json({ message: "Cart is empty" });

    // Calculate estimated delivery time (example: 30 min, or use getTravelTime)
    

    const order = await Order.create({
      user_id,
      store_id: storeId,
      items,
      status: "Placed",
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ user_id, store_id: storeId });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { storeId, orderId } = req.params;
    const user_id = req.userId;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user_id, store_id: storeId },
      { status: "Confirmed" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUserOrders = async (req, res) => {
  try {
    const user_id = req.userId;
    const orders = await Order.find({ user_id })
      .sort({ createdAt: -1 })
      .populate("items.product_id")
      .populate("store_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};