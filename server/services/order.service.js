const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Shop = require('../models/shop.model');

module.exports.placeOrder = async ({ userId }) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || !cart.products.length) throw new Error('Cart is empty');

  const shopId = cart.products[0].shopId;
  if (!shopId) throw new Error('Shop ID not found in cart products');

  // Create the order
  const order = await Order.create({
    user: userId,
    shop: shopId,
    products: cart.products,
    totalAmount: cart.totalAmount,
    status: 'placed',
    placedAt: new Date()
  });

  // Append order to user and shop
  await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
  await Shop.findByIdAndUpdate(shopId, { $push: { orders: order._id } });

  // Clear the cart
  cart.products = [];
  cart.totalAmount = 0;
  await cart.save();

  return { order, shopId };
};

module.exports.getUserOrders = (userId) => {
  return Order.find({ user: userId }).sort('-placedAt');
};

module.exports.getShopOrders = (shopId) => {
  return Order.find({ shop: shopId }).sort('-placedAt');
};