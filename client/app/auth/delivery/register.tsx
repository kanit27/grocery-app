import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function DeliveryRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://10.54.32.81:5000/api/auth/delivery/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          vehicleNumber,
          currentLocation,
        }),
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message || "Registration failed");

      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("delivery", JSON.stringify(res.user)); // or res.delivery

      router.replace("/delivery/tabs");
    } catch (err) {
      Alert.alert("Registration Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Register as Delivery Partner</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3" />
      <TextInput placeholder="Current Location (e.g. Virar West)" value={currentLocation} onChangeText={setCurrentLocation} className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6" />

      <TouchableOpacity onPress={handleRegister} disabled={loading} className="w-full bg-green-600 py-3 rounded-md">
        <Text className="text-white text-center font-semibold">{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/auth/delivery/login")} className="mt-4">
        <Text className="text-sm text-blue-600">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
