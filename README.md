# Grocery-Store

This is a **full-stack grocery shopping application** with a **React Native (Expo)** client and a **Node.js/Express/MongoDB** backend.

### 📱 How to Try the App
1. Visit this link to get the QR code:  
   **[Open QR Code on Expo](https://expo.dev/preview/update?message=removed+the+unnecessary+files&updateRuntimeVersion=1.0.0&createdAt=2025-08-04T23%3A38%3A20.731Z&slug=exp&projectId=7782f0fa-9a69-4e88-a46f-b0bb45a371e9&group=074fd6fa-9179-4e83-8e9a-e66731afadf4)**
2. Install the **Expo Go** app on your phone (available on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) and [App Store](https://apps.apple.com/app/expo-go/id982107779)).
3. Open the **Expo Go** app and scan the QR code.
4. The Grocery-Store app will load on your phone.

---

### 🔑 Test Login Credentials

#### 🛒 User
- **Email**: `kanit@gmail.com`  
- **Password**: `Kanit123`

#### 🏬 Shopkeeper / Business
- **Email**: `dmart@mumbai1.com`  
- **Password**: `store123`

#### 🚚 Delivery Partner
- **Email**: `bhavesh@kumar.com`  
- **Password**: `delivery123`

---

## Getting Started

1. **Install dependencies** in both `client` and `server` folders.
2. **Start the server**:  
   ```sh
   cd server && npm install && npm run dev
   ```
3. **Start the client**:  
   ```sh
   cd client && npm install && npm expo start
   ```  

---

## Client (`/client`)

- **React Native (Expo) App**: Mobile app for users, stores, and delivery partners.
- **Navigation**: Organized by user roles (`user`, `store`, `delivery`) with tab and stack navigation.
- **Screens**: Includes authentication, shop browsing, cart, product management, profiles, and order tracking.
- **Components**: Reusable UI elements (e.g., `StoreCard`, `ProductCard`, custom buttons, text, images).
- **Assets**: Store and product images, icons, fonts, and sample JSON data for stores/products.
- **Utils**: Helper functions for distance, time, and types.
- **Styling**: Tailwind CSS and NativeWind for consistent UI.
- **Testing**: Basic tests in `__tests__/`.

## Server (`/server`)

- **Express API**: RESTful endpoints for users, stores, delivery partners, carts, and orders.
- **Authentication**: Separate routes/controllers for user, store, and delivery partner auth.
- **Database**: MongoDB models for users, stores, products, orders, carts, and delivery partners.
- **Controllers**: Business logic for CRUD operations and order management.
- **Middleware**: Auth middleware for protected routes.
- **File Uploads**: Multer config for handling image uploads (stored in `/uploads`).
- **Utils**: Utility functions for server-side logic.
- **Environment**: Configurable via `.env`.

---
