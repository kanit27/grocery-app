import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Cart() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCarts = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://10.54.32.81:5000/api/cart/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCarts(data || []);
      setLoading(false);
    };
    fetchCarts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-6">
      {/* Sticky Header */}
      <View className="px-4 py-6 bg-white z-10">
        <Text className="text-xl font-bold">Your Carts</Text>
      </View>
      <ScrollView className="px-4 mt-3 mb-20">
        {carts.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No products in cart.</Text>
        ) : (
          carts.map((cart) => (
            <View key={cart._id} className="mb-6 border-[1px] border-gray-100 rounded-xl p-4">
              <Text className="font-semibold mb-1">
                {cart.store_id?.brandName || "Store"} - {cart.store_id?.storeName}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                {cart.items.length} items in cart
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                {cart.items.map((item) => (
                  <View key={item.product_id?._id || item.product_id} className="mr-4 items-center w-16">
                    <Image
                      source={{
                        uri: item.product_id?.image
                          ? item.product_id.image.startsWith("http")
                            ? item.product_id.image
                            : `http://10.54.32.81:5000${item.product_id.image}`
                          : "https://via.placeholder.com/60",
                      }}
                      className="w-10 h-10 rounded-lg mb-1 bg-gray-100"
                      resizeMode="cover"
                    />
                    <Text className="text-xs text-gray-900 text-center" numberOfLines={1}>
                      {item.product_id?.name}
                    </Text>
                    <Text className="text-xs text-gray-500">x{item.quantity}</Text>
                  </View>
                ))}
              </ScrollView>
              <Pressable
                className="mt-3 bg-green-700 py-2 rounded-full items-center"
                onPress={() => router.push(`/stores/${cart.store_id?._id}/orders`)}
              >
                <Text className="text-white font-semibold">Go to Store Orders</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}