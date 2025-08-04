import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function StoreDashboard() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <View className="flex-row items-center justify-between mb-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Welcome, Store Partner 👋</Text>
      <Feather name="user" size={24} color="#000" onPress={() => router.push("/screens/storeProfile")} />
      </View>
      

      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Today's Summary</Text>
        <View className="bg-green-100 p-4 rounded-lg">
          <Text className="text-sm text-gray-700">📦 Orders Received: 12</Text>
          <Text className="text-sm text-gray-700">✅ Orders Completed: 10</Text>
          <Text className="text-sm text-gray-700">💰 Earnings: ₹2,480</Text>
        </View>

      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-800 mb-2">Quick Links</Text>
        <View className="space-y-2">
          <Text className="text-blue-600">→ Manage Inventory</Text>
          <Text className="text-blue-600">→ View Pending Orders</Text>
          <Text className="text-blue-600">→ Add New Products</Text>
        </View>
      </View>
    </ScrollView>
  );
}
