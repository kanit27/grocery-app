const mongoose = require("mongoose");

const storePartnerSchema = new mongoose.Schema({
  brandName: { type: String, required: true },         // e.g., "D-Mart"
  storeName: { type: String },         // e.g., "D-Mart Virar West"
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  phone: { type: String },
  address: { type: String },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
  location: {
    lat: Number,
    lng: Number
  },

  contactPersonName: { type: String },
  contactPersonPhone: { type: String },
  storeImage: { type: String },    // Optional: URL or filename
  storeHours: { type: String },    // e.g., "9am - 10pm"
  deliveryRadiusKm: { type: Number, default: 5 },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("StorePartner", storePartnerSchema);
