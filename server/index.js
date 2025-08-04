const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Routes
const userAuth = require("./routes/auth/userAuth");
const storeAuthRoutes = require("./routes/auth/storeAuth");
const deliveryAuth = require("./routes/auth/deliveryAuth");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
// const deliveryRoutes = require("./routes/deliveryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth/user", userAuth);
app.use("/api/auth/store", storeAuthRoutes);
app.use("/api/auth/delivery", deliveryAuth);
app.use("/api/user", userRoutes);
app.use("/api/store", storeRoutes);
// app.use("/api/delivery", deliveryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running ✅");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT,'0.0.0.0', () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
