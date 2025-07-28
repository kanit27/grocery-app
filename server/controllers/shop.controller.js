const Shop = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.registerShop = async (req, res) => {
  try {
    const { shopname, ownername, email, password, location } = req.body;
    if (!shopname || !ownername?.firstname || !email || !password || !location) {
      return res.status(400).json({ message: "All fields including location are required" });
    }
    const exists = await Shop.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });
    const hash = await bcrypt.hash(password, 10);
    const shop = await Shop.create({
      shopname,
      ownername,
      email,
      password: hash,
      location,
    });
    // Generate token after successful registration
    const token = jwt.sign({ _id: shop._id, role: 'shop' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      shop: { _id: shop._id, shopname, ownername, email, location: shop.location }
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;
    const shop = await Shop.findOne({ email }).select('+password');
    if (!shop) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, shop.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ _id: shop._id, role: 'shop' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, shop: { _id: shop._id, shopname: shop.shopname, ownername: shop.ownername, email: shop.email } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all shops (for user map)
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({}, 'shopname ownername location isOpen products');
    res.json({ success: true, shops });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get shop by ID
exports.getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId, 'shopname ownername location isOpen products');
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json({ success: true, shop });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update shop status (open/close)
exports.updateShopStatus = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { isOpen } = req.body;
    
    const shop = await Shop.findByIdAndUpdate(
      shopId, 
      { isOpen }, 
      { new: true }
    );
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    
    res.json({ success: true, shop: { isOpen: shop.isOpen } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add or update products
exports.addOrUpdateProducts = async (req, res) => {
  try {
    const { shopId, products } = req.body;
    
    if (!shopId || !products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Shop ID and products array are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Process each product
    for (const newProduct of products) {
      const { name, icon, price, stock } = newProduct;
      
      if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ message: "Product name, price, and stock are required" });
      }

      // Check if product already exists
      const existingProductIndex = shop.products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      
      if (existingProductIndex !== -1) {
        // Update existing product
        shop.products[existingProductIndex].icon = icon || shop.products[existingProductIndex].icon;
        shop.products[existingProductIndex].price = price;
        shop.products[existingProductIndex].stock += parseInt(stock); // Add to existing stock
        shop.products[existingProductIndex].isAvailable = shop.products[existingProductIndex].stock > 0;
      } else {
        // Add new product
        shop.products.push({
          name,
          icon: icon || '🛍️',
          price: parseFloat(price),
          stock: parseInt(stock),
          isAvailable: parseInt(stock) > 0
        });
      }
    }

    await shop.save();
    res.json({ success: true, products: shop.products });
  } catch (e) {
    console.error('Add/Update products error:', e);
    res.status(500).json({ message: "Server error" });
  }
};

// Decrement product stock (when ordered)
exports.decrementProductStock = async (req, res) => {
  try {
    const { shopId, productId, quantity = 1 } = req.body;
    
    if (!shopId || !productId) {
      return res.status(400).json({ message: "Shop ID and Product ID are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const product = shop.products.id(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.stock -= quantity;
    product.isAvailable = product.stock > 0;

    await shop.save();
    res.json({ success: true, product });
  } catch (e) {
    console.error('Decrement stock error:', e);
    res.status(500).json({ message: "Server error" });
  }
};

// Get shop products
exports.getShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId, 'products');
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    
    res.json({ success: true, products: shop.products });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { shopId, productId } = req.params;
    
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.products.id(productId).remove();
    await shop.save();
    
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
