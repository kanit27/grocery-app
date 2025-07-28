import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import products from "../../../assets/database/products.json";
import storeInventory from "../../../assets/database/store_inventory.json";

import { Product, StoreInventoryItem } from "../../../utils/type";

const ProductDetails = () => {
  const { productId, storeId } = useLocalSearchParams();
  const router = useRouter();

  // 1. Get product details
  const product: Product | undefined = products.find(
    (p: Product) => String(p.id) === String(productId)
  );

  // 2. Get inventory entry for this product in this store
  const inventory: StoreInventoryItem | undefined = storeInventory.find(
    (i: StoreInventoryItem) =>
      i.product_id === productId && i.store_id === storeId
  );

  if (!product || !inventory) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-xl font-bold text-red-600 mb-2">Product not found</Text>
        <Text className="text-gray-500">Please go back and try again.</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-2 rounded-full mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-gray-900 mb-2">{product.name}</Text>
      <Text className="text-sm text-gray-500 mb-4">{product.brand} • {product.category}</Text>

      <Text className="text-xl text-gray-800 font-semibold mb-2">₹{inventory.price}</Text>

      <Text className="text-sm text-green-600 mb-4">
        {inventory.stock_qty > 0
          ? `${inventory.stock_qty} in stock`
          : "Out of stock"}
      </Text>

      {product.description && (
        <Text className="text-sm text-gray-700 leading-relaxed">
          {product.description}
        </Text>
      )}

      <TouchableOpacity
        className="mt-8 self-start"
        onPress={() => router.back()}
      >
        <Text className="text-blue-600 font-semibold">← Back to Store</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductDetails;
