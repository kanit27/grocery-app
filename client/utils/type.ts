// types.ts

export interface Store {
  id: string;
  chain_id: string;
  name: string;
  logo: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
  description?: string;
}

export interface StoreInventoryItem {
  id: string;
  store_id: string;
  product_id: string;
  price: number;
  stock_qty: number;
}

export interface StoreProduct extends Product {
  price: number;
  stock_qty: number;
}
