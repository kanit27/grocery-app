const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  vehicleNumber: String,
  currentLocation: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model("DeliveryPartner", deliverySchema);
