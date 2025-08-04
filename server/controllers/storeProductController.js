const StoreInventory = require("../models/StoreInventory");
const Product = require("../models/Product");

// Get all products for a store
exports.getStoreProducts = async (req, res) => {
  try {
    const inventory = await StoreInventory.find({ store_id: req.params.storeId, isActive: true });
    const products = await Promise.all(
      inventory.map(async (inv) => {
        const product = await Product.findById(inv.product_id);
        return product
          ? {
              ...product.toObject(),
              price: inv.price,
              stock_qty: inv.stock_qty,
              unit: product.unit,
            }
          : null;
      })
    );
    res.json(products.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product for a store
exports.getStorePartnerProductById = async (req, res) => {
  try {
    const store_id = req.storePartnerId;
    const productId = req.params.productId;

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    const inventory = await StoreInventory.findOne({
      store_id,
      product_id: productId,
    });
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    res.json({
      ...product,
      price: inventory.price,
      stock_qty: inventory.stock_qty,
      unit: product.unit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProductToStore = async (req, res) => {
  try {
    const store_id = req.storePartnerId;
    const { name, description, category, brand, unit, price, stock_qty } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

    // 1. Create the product (or find if it exists)
    let product = await Product.findOne({ name, brand, unit });
    if (!product) {
      product = await Product.create({ name, description, image, category, brand, unit });
    }

    // 2. Add to store inventory
    const inventory = await StoreInventory.create({
      store_id,
      product_id: product._id,
      price,
      stock_qty,
      isActive: true,
    });

    res.status(201).json({ message: "Product added to store!", inventory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStoreProduct = async (req, res) => {
  try {
    const store_id = req.storePartnerId;
    const { productId } = req.params;
    const { name, description, category, brand, unit, price, stock_qty } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    // Update product details
    const product = await Product.findByIdAndUpdate(

      productId,
      { name, description, image, category, brand, unit },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update store-specific inventory info
    const inventory = await StoreInventory.findOneAndUpdate(
      { store_id, product_id: productId },
      { price, stock_qty },
      { new: true }
    );
    if (!inventory) return res.status(404).json({ message: "Inventory not found for this store/product" });

    res.json({ message: "Product updated!", product, inventory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoreProductForStore = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    // Get the product
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Get the inventory for this store and product
    const inventory = await StoreInventory.findOne({
      store_id: storeId,
      product_id: productId,
    });
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    // Merge and return all fields needed by the frontend
    res.json({
      ...product,
      price: inventory.price,
      stock_qty: inventory.stock_qty,
      unit: product.unit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

