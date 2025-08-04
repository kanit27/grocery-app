import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function StoreRegister() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://10.54.32.81:5000/api/auth/store/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, email, password }),
      });
      const res = await response.json();
      if (!response.ok) throw new Error(res.message || "Registration failed");
      router.replace("/store/tabs");
    } catch (err) {
      Alert.alert("Registration Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 pt-8 justify-start items-center px-4 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Register as Store Partner</Text>
      <TextInput placeholder="Brand Name" value={brandName} onChangeText={setBrandName}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address"
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TouchableOpacity onPress={handleRegister} disabled={loading}
        className="w-full bg-blue-600 py-3 rounded-md mt-4">
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}