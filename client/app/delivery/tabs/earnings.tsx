import { View, Text, ScrollView } from "react-native";

export default function DeliveryEarnings() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">My Earnings</Text>

      <View className="bg-green-100 p-4 rounded-lg mb-6">
        <Text className="text-xl font-semibold text-gray-800">Today: ₹450</Text>
        <Text className="text-sm text-gray-600">Deliveries Completed: 5</Text>
      </View>

      <Text className="text-lg font-semibold text-gray-800 mb-2">This Week</Text>

      <View className="space-y-3">
        <Text className="text-sm text-gray-700">Mon: ₹200</Text>
        <Text className="text-sm text-gray-700">Tue: ₹180</Text>
        <Text className="text-sm text-gray-700">Wed: ₹450</Text>
        <Text className="text-sm text-gray-700">Thu: ₹310</Text>
      </View>
    </ScrollView>
  );
}
