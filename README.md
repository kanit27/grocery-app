# Grocery-Store

A full-stack grocery shopping application with a React Native (Expo) client and a Node.js/Express/MongoDB backend.

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
