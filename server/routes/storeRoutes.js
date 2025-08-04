const express = require("express");
const router = express.Router();
const { protectStore } = require("../middleware/authMiddleware");
const {
  getStorePartnerProfile,
} = require("../controllers/storePartnerController");
const storeProductController = require("../controllers/storeProductController");
const storeController = require("../controllers/storeController");
const {
  addProductToStore,
  updateStoreProduct,
} = require("../controllers/storeProductController");
const upload = require("../config/multer");
const storePartnerController = require("../controllers/storePartnerController");

router.put(
  "/profile",
  protectStore,
  upload.single("storeImage"),
  storePartnerController.updateStorePartnerProfile
);

// Get all stores
router.get("/stores", storeController.getAllStores);

// Get a specific store by ID
router.get("/stores/:storeId", storeController.getStoreById);

// Add product with image upload
router.post(
  "/products",
  protectStore,
  upload.single("image"),
  storeProductController.addProductToStore
);

// Update a product in the store inventory
router.put(
  "/products/:productId",
  protectStore,
  upload.single("image"),
  storeProductController.updateStoreProduct
);

// Get the profile details
router.get("/profile", protectStore, getStorePartnerProfile);

// Get all products for a store
router.get(
  "/stores/:storeId/products",
  storeProductController.getStoreProducts
);

// Get a single product for the logged-in store partner
router.get(
  "/products/:productId",
  protectStore,
  storeProductController.getStorePartnerProductById
);

router.get(
  "/stores/:storeId/products/:productId",
  storeProductController.getStoreProductForStore
);

module.exports = router;
