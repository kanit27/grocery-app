const StorePartner = require("../models/StorePartner");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await StorePartner.find({ isActive: true });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await StorePartner.findById(req.params.storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};