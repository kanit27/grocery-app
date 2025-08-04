const StorePartner = require("../models/StorePartner");

exports.getStorePartnerProfile = async (req, res) => {
  try {
    const store = await StorePartner.findById(req.storePartnerId).select("-passwordHash");
    if (!store) return res.status(404).json({ message: "Store partner not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStorePartnerProfile = async (req, res) => {
  try {
    const storeId = req.storePartnerId;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.storeImage = `/uploads/${req.file.filename}`;
    }
    const store = await StorePartner.findByIdAndUpdate(storeId, updateData, { new: true });
    if (!store) return res.status(404).json({ message: "Store partner not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};