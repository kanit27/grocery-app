import { View, Text, ScrollView } from "react-native";

export default function StoreInventory() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Inventory</Text>

      <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
        <Text className="text-base font-semibold text-gray-900">Amul Milk 500ml</Text>
        <Text className="text-sm text-gray-600">Stock: 32 | Price: ₹28</Text>
      </View>

      <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
        <Text className="text-base font-semibold text-gray-900">Maggie Noodles 280g</Text>
        <Text className="text-sm text-gray-600">Stock: 18 | Price: ₹54</Text>
      </View>
    </ScrollView>
  );
}
