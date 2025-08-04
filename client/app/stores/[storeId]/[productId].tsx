import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductScreen() {
  const { storeId, productId } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`http://10.54.32.81:5000/api/store/stores/${storeId}/products/${productId}`)
      .then(res => res.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [storeId, productId]);

  const handleAddToCart = async () => {
    setAdding(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to add to cart.");
      setAdding(false);
      return;
    }
    // Fetch current cart for this store
    let cartItems: any[] = [];
    try {
      const res = await fetch(`http://10.54.32.81:5000/api/cart/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      cartItems = data.items || [];
    } catch {}
    // Find if product is already in cart
    const existing = cartItems.find(
      (item) => item.product_id === productId || item.product_id?._id === productId
    );
    const quantity = existing ? existing.quantity + 1 : 1;
    // Add/update cart
    const res = await fetch(`http://10.54.32.81:5000/api/cart/${storeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    setAdding(false);
    if (res.ok) {
      Alert.alert("Added to Cart", `${product?.name} added to cart.`);
    } else {
      Alert.alert("Error", "Could not add to cart.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!product) return <Text className="text-center mt-10">Product not found.</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="bg-white rounded-2xl p-4 items-center">
        <Image
          source={{
            uri: product.image
              ? product.image.startsWith("http")
                ? product.image
                : `http://10.54.32.81:5000${product.image}`
              : "https://via.placeholder.com/120",
          }}
          className="w-40 h-40 rounded-xl mb-4"
          resizeMode="contain"
        />
        <View className="flex items-start justify-start w-full">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </Text>
          <Text className="text-lg text-gray-700 mb-2">
            {product.description}
          </Text>
          <Text className="text-base text-gray-500 mb-2">
            Category: {product.category}
          </Text>
          <Text className="text-base text-gray-500 mb-2">
            Brand: {product.brand}
          </Text>
          <Text className="text-base text-gray-500 mb-2">
            Unit: {product.unit}
          </Text>
          <Text className="text-xl text-green-700 font-bold mb-2">
            ₹{product.price}
          </Text>
          <Text className="text-base text-gray-500 mb-2">
            Stock: {product.stock_qty}
          </Text>
        </View>
        <TouchableOpacity
          className="mt-6 bg-green-600 rounded-xl py-3 px-8 items-center"
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Text className="text-white font-bold text-lg">
            {adding ? "Adding..." : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}