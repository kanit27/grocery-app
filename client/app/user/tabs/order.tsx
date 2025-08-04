import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch("https://corner-l14t.onrender.com/api/orders/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
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
        <Text className="text-xl font-bold">Your Orders</Text>
      </View>
      <ScrollView className="px-4 mt-3 mb-20">
        {orders.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No orders found.</Text>
        ) : (
          orders.map((order) => (
            <View key={order._id} className="mb-6 border-[1px] border-gray-100 rounded-xl p-4">
              <Text className="font-semibold mb-1">
                {order.store_id?.brandName || "Store"} - {order.store_id?.storeName}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                Order #{order._id.slice(-6).toUpperCase()} | {order.status}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </Text>
              <Text className="text-xs text-green-700 mb-1">
                Delivery in: {order.estimatedDeliveryTime || 30} min
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                {order.items.map((item) => (
                  <View key={item.product_id?._id || item.product_id} className="mr-4 items-center w-16">
                    <Image
                      source={{
                        uri: item.product_id?.image
                          ? item.product_id.image.startsWith("http")
                            ? item.product_id.image
                            : `https://corner-l14t.onrender.com${item.product_id.image}`
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}