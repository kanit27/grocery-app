const mongoose = require("mongoose");

const storeInventorySchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorePartner", required: true }, // Reference to store
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },    // Reference to product
  price: { type: Number, required: true },           // Store-specific price
  stock_qty: { type: Number, required: true },       // Store-specific stock quantity
  isActive: { type: Boolean, default: true },        // Is product available in this store
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StoreInventory", storeInventorySchema);