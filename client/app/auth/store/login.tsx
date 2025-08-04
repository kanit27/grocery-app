import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function StoreLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://corner-l14t.onrender.com/api/auth/store/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      const res = contentType?.includes("application/json")
        ? await response.json()
        : { message: "Server error. Please try again." };

      if (!response.ok) {
        throw new Error(res.message || "Login failed");
      }

      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify({ ...res.store, role: "store_partner" }));

      router.replace("/store/tabs");
    } catch (err) {
      Alert.alert("Login Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-6">
        Login as Store Partner
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 py-3 rounded-md"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-sm text-gray-400">
          Login using credentials provided after onboarding
        </Text>
      </View>
    </View>
  );
}
