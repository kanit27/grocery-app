const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },           // Product name
  description: { type: String },                     // Product description
  image: { type: String },                           // Image URL or filename
  category: { type: String },                        // e.g., "Fruits", "Snacks"
  brand: { type: String },                           // e.g., "Nestle"
  unit: { type: String },                            // e.g., "kg", "packet"
  // Price and stock are managed per store in StoreInventory
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);