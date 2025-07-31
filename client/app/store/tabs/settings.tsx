import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function StoreSettings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("store");
      router.replace("/auth");
    } catch (err) {
      Alert.alert("Logout Error", "Unable to logout. Try again.");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>

      <TouchableOpacity
        className="bg-red-500 p-4 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
