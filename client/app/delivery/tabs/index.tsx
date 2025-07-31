import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeliveryHome() {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const stored = await AsyncStorage.getItem("delivery");
        if (stored) {
          setDelivery(JSON.parse(stored));
        }
        // Optionally, try to fetch from server here and update if online
      } catch (e) {
        // fallback to local only
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!delivery) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>No delivery info found. Please log in.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Hello, Delivery Partner 🚴‍♂️
      </Text>

      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Active Deliveries
        </Text>
        <View className="bg-orange-100 p-4 rounded-lg">
          <Text className="text-sm text-gray-700">🛍 2 Orders in progress</Text>
          <Text className="text-sm text-gray-700">
            📍 Next Pickup: Dmart, Virar
          </Text>
          <Text className="text-sm text-gray-700">
            📦 Next Drop: Rakesh, Global City
          </Text>
        </View>
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Quick Access
        </Text>
        <View className="space-y-2">
          <Text className="text-blue-600">→ View All Deliveries</Text>
          <Text className="text-blue-600">→ Mark as Delivered</Text>
          <Text className="text-blue-600">→ Track Navigation</Text>
        </View>
      </View>
    </ScrollView>
  );
}
