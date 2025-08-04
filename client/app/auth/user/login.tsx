import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://corner-l14t.onrender.com/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message || res.error || "Login failed"); // FIXED

      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.user));

      router.replace("/user/tabs");
    } catch (err) {
      Alert.alert("Login Error", err.message || "Login failed"); // FIXED
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 font-cabin ">
      <View className="px-6 pt-16 pb-10">
        <View className="flex-row items-center gap-2 mb-10">
          <Ionicons
            name="arrow-back"
            size={24}
            onPress={() => router.back()}
            color="black"
          />
          <Text className="text-2xl font-semibold text-black">Log In</Text>
        </View>

        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          className="bg-white border border-gray-300 rounded-full px-6 py-4 mb-4 text-black text-xl"
          placeholderTextColor="#A3A3A3"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-white border border-gray-300 rounded-full px-6 py-3.5 mb-4 text-black text-xl"
          placeholderTextColor="#A3A3A3"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-[#003049] py-4 rounded-full"
        >
          <Text className="text-white text-center text-xl font-semibold">
            {loading ? "Logging in..." : "Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
