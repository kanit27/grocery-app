const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  products: {
    type: [
      {
        productId: String,
        name: String,
        icon: String,
        price: Number,
        quantity: Number,
        shopId: String
      }
    ],
    default: []
  },
  totalAmount : {type : Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
