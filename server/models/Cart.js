const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorePartner", required: true },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.index({ user_id: 1, store_id: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);