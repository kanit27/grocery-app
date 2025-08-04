import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

export default function InventoryScreen() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getStoreId = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setStoreId(user._id || user.id);
      }
    };
    getStoreId();
  }, []);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    fetch(`https://corner-l14t.onrender.com/api/store/stores/${storeId}/products`)
      .then(res => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [storeId]);

  return (
    <View className="flex-1 bg-white">
      {/* Header with Add Button */}
      <View className="flex-row justify-between items-center px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Inventory</Text>
        <TouchableOpacity
          className="bg-blue-600 p-2 flex flex-row rounded-full"
          onPress={() => router.push("/screens/addProduct")}
        >
          <Feather name="plus" size={24} color="#fff" />
          <Text className="text-lg font-bold text-white">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView className="px-4 pt-4">
          {products.length === 0 ? (
            <Text className="text-center text-gray-500 mt-8">
              No products found.
            </Text>
          ) : (
            products.map((product) => (
              <View
                key={product._id}
                className="flex-row items-center justify-between bg-slate-100 rounded-xl mb-4 p-4"
              >
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {product.name}
                  </Text>
                  <Text className="text-base text-gray-700">
                    {product.category}
                  </Text>
                  <Text className="text-base text-green-700 font-bold">
                    ₹{product.price}
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-yellow-500 px-4 py-2 rounded-lg ml-4"
                  onPress={() =>
                    router.push({
                      pathname: "/screens/updateProduct",
                      params: { storeId, productId: product._id },
                    })
                  }
                >
                  <Text className="text-white font-semibold">Update</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
