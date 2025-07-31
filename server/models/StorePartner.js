const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  storeName: String,
  address: String,
  location: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model("StorePartner", storeSchema);
