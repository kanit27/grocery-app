import { View, Text, ScrollView } from "react-native";

export default function StoreOrders() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Orders</Text>

      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
        <Text className="text-base font-semibold text-gray-900">Order #12345</Text>
        <Text className="text-sm text-gray-600">2 items | ₹480 | Pending</Text>
        <Text className="text-xs text-gray-400">To: Rakesh, Virar East</Text>
      </View>

      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
        <Text className="text-base font-semibold text-gray-900">Order #12346</Text>
        <Text className="text-sm text-gray-600">5 items | ₹1320 | Packed</Text>
        <Text className="text-xs text-gray-400">To: Shruti, Virar West</Text>
      </View>
    </ScrollView>
  );
}
