const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  shop:      { type: mongoose.Schema.Types.ObjectId, ref: 'shop', required: true },
  products:  [{
    productId: String,
    name:      String,
    price:     Number,
    quantity:  Number,
    icon:      String
  }],
  totalAmount: { type: Number, required: true },
  status:      { type: String, default: 'Pending' },
  placedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
