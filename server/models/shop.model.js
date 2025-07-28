const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
});

const shopSchema = new mongoose.Schema({
  shopname: { type: String, required: true },
  ownername: {
    firstname: { type: String, required: true },
    lastname: String
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  location: { type: [Number], required: true }, // [lat, lng]
  isOpen: { type: Boolean, default: false },
  products: [productSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('Shop', shopSchema);