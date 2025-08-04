import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await fetch("https://corner-l14t.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/auth");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-700">No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12">
      
        <View className="flex-row items-center justify-start py-3 mb-4 gap-4 ">
            <Feather
            name="arrow-left"
            size={24}
            color="black"
            onPress={() => router.back()}
            />
            <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        </View>

      <View className="bg-slate-50 rounded-2xl p-5 mb-8 shadow-sm">
        <View className="mb-4">
            <Text className="text-xs text-gray-400 mb-1">Name</Text>
            <Text className="text-base text-gray-700">{user.name || "-"}</Text>
        </View>
        <View className="mb-4">
            <Text className="text-xs text-gray-400 mb-1">Email</Text>
            <Text className="text-base text-gray-700">{user.email || "-"}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-400 mb-1">Phone</Text>
          <Text className="text-base text-gray-700">{user.phone || "-"}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-400 mb-1">Address</Text>
          <Text className="text-base text-gray-700">{user.address || "-"}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-400 mb-1">Location</Text>
          <Text className="text-base text-gray-700">
            {user.location?.lat && user.location?.lng
              ? `${user.location.lat}, ${user.location.lng}`
              : "-"}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-400 mb-1">Role</Text>
          <Text className="text-base text-gray-700 capitalize">
            {user.role || "user"}
          </Text>
        </View>
      </View>

      <Pressable
        className="w-full bg-red-500 py-3 rounded-xl items-center mt-8 mb-12"
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: handleLogout },
          ])
        }
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
