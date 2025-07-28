const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

// 🔥 FIXED CORS CONFIGURATION
app.use(cors({
    origin: [
        // "https://uber-1-0tlr.onrender.com", 
        "https://uber-production-4170.up.railway.app",    
        "http://localhost:5173"         
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
}));

// For preflight requests
app.options('*', cors());

// 🔥 DATABASE CONNECTION WITH ERROR HANDLING
const connectToDb = require("./db/db.js");
connectToDb().catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const userRoutes = require("./routes/user.routes");
const captionRoutes = require("./routes/caption.routes");
const shopRoutes = require("./routes/shop.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/users", userRoutes);
app.use("/caption", captionRoutes);
app.use("/shops", shopRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: [
        // "https://uber-1-0tlr.onrender.com",
        "https://uber-production-4170.up.railway.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  },
});

// Store user data with more details
const riders = {};   // { socketId: { location: [lat, lng] } }
const drivers = {};  // { socketId: { location: [lat, lng], driverId: string } }
const shops = {};    // { shopId: { location: [lat, lng], isOpen: boolean } }

// --- HELPER FUNCTIONS for broadcasting updates ---
const broadcastDriversUpdate = () => {
    const driverLocations = Object.values(drivers).map(driver => driver.location);
    io.to('riders_room').emit("drivers_update", driverLocations);
    console.log(`Broadcasted ${driverLocations.length} drivers to all riders.`);
};

const broadcastRidersUpdate = () => {
    const riderLocations = Object.values(riders).map(rider => rider.location);
    io.to('drivers_room').emit("riders_update", riderLocations);
    console.log(`Broadcasted ${riderLocations.length} riders to all drivers.`);
};

// --- NEW: Broadcast shop updates to all riders ---
const broadcastShopUpdate = () => {
    // Send all shops (could be just one in your case)
    io.to('riders_room').emit("shop_location_update", Object.values(shops));
    console.log(`Broadcasted ${Object.keys(shops).length} shops to all riders.`);
};

app.set("io", io);

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // 🔥 AUTO‐JOIN SHOP ROOM (so you can emit new orders directly to it)
  //    If your front end passes ?shopId=… in the socket‐io handshake URL
  //    e.g. io(SERVER_URL, { query: { shopId: "123" } })
  const { shopId } = socket.handshake.query || {};
  if (shopId) {
    socket.join(`shop_${shopId}`);
    console.log(`Shop socket ${socket.id} joined room shop_${shopId}`);
  }

  // R I D E R  LOGIC ==========================
  socket.on("register_rider", (location) => {
    console.log(`Rider ${socket.id} registered at:`, location);
    socket.join('riders_room');
    riders[socket.id] = { location: location };

    // Send current drivers list to the new rider
    const driverLocations = Object.values(drivers).map(driver => driver.location);
    socket.emit("drivers_update", driverLocations);

    // --- Send current shop(s) to the new rider ---
    socket.emit("shop_location_update", Object.values(shops));

    // Notify all drivers about the new/updated rider list
    broadcastRidersUpdate();
  });

  socket.on("rider_location_update", (location) => {
    if (riders[socket.id]) {
      riders[socket.id].location = location;
      // Broadcast updated rider list to all drivers
      broadcastRidersUpdate();
    }
  });

  // D R I V E R  LOGIC ==========================
  socket.on("register_driver", (data) => {
    const { location, driverId } = data;
    console.log(`Driver ${socket.id} (${driverId}) registered at:`, location);
    socket.join('drivers_room');
    drivers[socket.id] = { location, driverId };

    // --- FIX 2: Send ALL rider locations to the new driver ---
    const riderLocations = Object.values(riders).map(rider => rider.location);
    socket.emit("riders_update", riderLocations);

    // Update all riders with the new driver list
    broadcastDriversUpdate();
  });

  socket.on("driver_location_update", (location) => {
    if (drivers[socket.id]) {
      drivers[socket.id].location = location;
      // Broadcast updated driver list to all riders
      broadcastDriversUpdate();
    }
  });

  // R I D E  R E Q U E S T  LOGIC ==========================
  
  // Rider requests a ride
  socket.on("ride_request", (data) => {
    console.log(`🚗 RIDE REQUEST: Rider ${socket.id} requested a ride:`, data);
    
    // Broadcast to all drivers
    io.to("drivers_room").emit("ride_request", {
      riderId: socket.id,
      location: data.location, // [lat, lng]
      destination: data.destination, // [lat, lng]
      startingLocationName: data.startingLocationName,
      destinationLocationName: data.destinationLocationName,
      timestamp: Date.now(),
    });
    
    console.log(`📡 Ride request broadcasted to all drivers in drivers_room`);
  });

  // Driver accepts a ride - MOVED OUTSIDE of ride_request listener
socket.on("ride_accept", ({ rideRequest, driverId, driverName, vehiclePlate, vehicleColor, vehicleType, vehicleCapacity, vehicleModel }) => {
  const { riderId } = rideRequest;
  if (riders[riderId]) {
    const driverInfo = {
      driverId,
      name: driverName,
      vehicle: {
        plate: vehiclePlate,
        color: vehicleColor,
        vehicleType: vehicleType,
        capacity: vehicleCapacity,
        model: vehicleModel
      },
    };
    io.to(riderId).emit("ride_accepted", driverInfo); // ✅ Emit to specific rider
    console.log(`📤 Emitting 'ride_accepted' to rider ${riderId} with:`, driverInfo);
  } else {
    console.log(`❌ Rider ${riderId} not found for ride acceptance.`);
  }
});

  // Driver rejects a ride
  socket.on("ride_reject", ({ rideRequest }) => {
    console.log(`❌ RIDE REJECT: Driver ${socket.id} rejected ride:`, rideRequest);
    
    const { riderId } = rideRequest;
    if (riders[riderId]) {
      // Notify the specific rider that their ride has been rejected
      io.to(riderId).emit("ride_rejected", {
        driverId: socket.id,
        timestamp: Date.now(),
      });
      console.log(`📤 Ride rejection sent to rider ${riderId}`);
    } else {
      console.log(`❌ Rider ${riderId} not found for ride rejection.`);
    }
  });

  // --- SHOP LOGIC ---
  socket.on("shop_location_update", (data) => {
    // data: { shopId, location: [lat, lng], isOpen }
    if (!data || !data.shopId) return;
    shops[data.shopId] = {
      location: data.location,
      isOpen: data.isOpen,
      shopId: data.shopId,
    };
    broadcastShopUpdate();
  });

  // --- SHOP REALTIME: Join shop room for order notifications ---
  socket.on("join_shop", (shopId) => {
    if (shopId) {
      socket.join(`shop_${shopId}`);
      console.log(`Shop socket ${socket.id} joined room shop_${shopId}`);
    }
  });

  // DISCONNECT HANDLERS ==========================
  socket.on("disconnect", () => {
    console.log(`🔌 Socket ${socket.id} disconnected`);
    
    // Clean up if the socket was a rider
    if (riders[socket.id]) {
      delete riders[socket.id];
      console.log(`👤 Rider ${socket.id} removed.`);
      // Update all drivers that a rider has left
      broadcastRidersUpdate();
    }
    
    // Clean up if the socket was a driver
    if (drivers[socket.id]) {
      delete drivers[socket.id];
      console.log(`🚗 Driver ${socket.id} removed.`);
      // Update all riders that a driver has left
      broadcastDriversUpdate();
    }
    console.log(`📊 Active riders: ${Object.keys(riders).length}, Active drivers: ${Object.keys(drivers).length}`);
  });
});

// 🔥 HEALTH CHECK ENDPOINT
app.get("/", (req, res) => {
  res.json({
    message: "Uber Clone Backend is running.",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 🔥 DATABASE STATUS ENDPOINT
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    environment: process.env.NODE_ENV
  });
});



module.exports = server;