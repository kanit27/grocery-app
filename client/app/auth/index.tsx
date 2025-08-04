import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AnimatedSloganBlock } from "@/components/AnimatedSloganBlock"; // path where you save it

export default function AuthIndex() {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "delivery" | "store">("user");

  const bgColor =
    role === "user"
      ? "bg-[#e0fbfc]"
      : role === "delivery"
      ? "bg-[#fdf0d5]"
      : "bg-[#f1faee]";
  const btnColor =
    role === "user"
      ? "bg-[#003049]"
      : role === "delivery"
      ? "bg-[#640d14]"
      : "bg-[#457b9d]";
  const slogan =
    role === "user"
      ? "Groceries delivered from your favorite stores "
      : role === "delivery"
      ? "Deliver with speed, earn with flexibility."
      : "Grow your business with our platform.";

  return (
    <View className={`flex-1 ${bgColor} pt-16 justify-between items-center`}>
      {/* 👤 Role Toggle */}
      <View className="flex-row bg-white rounded-full p-2 ">
        <TouchableOpacity
          onPress={() => setRole("user")}
          className={`px-5 py-2 rounded-full ${
            role === "user" ? "bg-black" : ""
          }`}
        >
          <Text
            className={`font-medium text-lg ${
              role === "user" ? "text-white" : "text-black"
            }`}
          >
            Shopper
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("delivery")}
          className={`px-5 py-2 rounded-full ${
            role === "delivery" ? "bg-black" : ""
          }`}
        >
          <Text
            className={`font-medium text-lg ${
              role === "delivery" ? "text-white" : "text-black"
            }`}
          >
            Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("store")}
          className={`px-5 py-2 rounded-full ${
            role === "store" ? "bg-black" : ""
          }`}
        >
          <Text
            className={`font-medium text-lg ${
              role === "store" ? "text-white" : "text-black"
            }`}
          >
            Business
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✨ Animated Slogan and Icons */}
      <AnimatedSloganBlock key={role} slogan={slogan} />

      {/* 🔘 Auth Buttons */}
      <View className="w-full px-6 mb-10">
        <TouchableOpacity
          onPress={() => router.push(`/auth/${role}/register`)}
          className={`${btnColor} py-4 rounded-full mb-3`}
        >
          <Text className="text-white text-center font-bold text-xl">
            Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/auth/${role}/login`)}
          className="bg-gray-100 py-4 rounded-full"
        >
          <Text className="text-black text-center font-bold text-xl">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
