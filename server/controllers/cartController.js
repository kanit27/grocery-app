const Cart = require("../models/Cart");

// Get cart for a user and store
exports.getCart = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    let cart = await Cart.findOne({ user_id, store_id: storeId }).populate("items.product_id");
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add/update product in cart
exports.addToCart = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    const { product_id, quantity } = req.body;

    let cart = await Cart.findOne({ user_id, store_id: storeId });
    if (!cart) {
      cart = await Cart.create({
        user_id,
        store_id: storeId,
        items: [{ product_id, quantity }],
      });
    } else {
      const item = cart.items.find((i) => i.product_id.toString() === product_id);
      if (item) {
        item.quantity = quantity;
      } else {
        cart.items.push({ product_id, quantity });
      }
      cart.updatedAt = new Date();
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const user_id = req.userId;
    let cart = await Cart.findOne({ user_id, store_id: storeId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter((i) => i.product_id.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all carts for a user
exports.getAllUserCarts = async (req, res) => {
  try {
    const user_id = req.userId;
    const carts = await Cart.find({ user_id })
      .populate("items.product_id")
      .populate("store_id");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};