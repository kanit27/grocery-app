import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UserRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://corner-l14t.onrender.com/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          address,
          location: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          },
        }),
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message || "Registration failed");

      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.user));

      router.replace("/user/tabs");
    } catch (err) {
      Alert.alert("Registration Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 font-Questrial bg-gradient-to-b from-[#E1F1FF] to-white">
      <View className="px-6 pt-16 pb-10">
       <View className="flex-row items-center gap-2 mb-10">
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} color="black" />
        <Text className="text-2xl font-semibold text-black">Sign Up</Text>
        </View>
       

        {[
          { placeholder: "Full Name", value: name, set: setName },
          { placeholder: "Email address", value: email, set: setEmail, keyboard: "email-address" },
          { placeholder: "Phone", value: phone, set: setPhone, keyboard: "phone-pad" },
          { placeholder: "Password", value: password, set: setPassword, secure: true },
          { placeholder: "Address", value: address, set: setAddress },
          { placeholder: "Latitude", value: latitude, set: setLatitude, keyboard: "decimal-pad" },
          { placeholder: "Longitude", value: longitude, set: setLongitude, keyboard: "decimal-pad" },
        ].map((field, idx) => (
          <TextInput
            key={idx}
            placeholder={field.placeholder}
            value={field.value}
            onChangeText={field.set}
            keyboardType={field.keyboard}
            secureTextEntry={field.secure}
            className="bg-white border border-gray-300 rounded-full px-6 py-3.5 mb-4 text-black text-xl"
            placeholderTextColor="#A3A3A3"
          />
        ))}

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
           className="bg-[#003049] py-4 rounded-full"
        >
          <Text className="text-white text-xl text-center font-semibold">
            {loading ? "Registering..." : "Sign in"}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
