const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorePartner", required: true },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: { type: String, default: "Placed" },
  estimatedDeliveryTime: { type: Number, default: 30 }, // in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);