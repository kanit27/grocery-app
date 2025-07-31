import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        const parsed = JSON.parse(user);
        if (parsed.role === "user") {
          router.replace("/user/tabs");
        } else if (parsed.role === "store_partner") {
          router.replace("/store/tabs");
        } else if (parsed.role === "delivery_partner") {
          router.replace("/delivery/tabs");
        } else {
          router.replace("/auth");
        }
      } else {
        router.replace("/auth");
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View className="flex-1 font-cabin justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return null;
}
