import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

// Import category images
import groceryImg from "../../../assets/images/grocery.png";
import foodImg from "../../../assets/images/burger.png";
import clothingImg from "../../../assets/images/brand.png";
import electronicsImg from "../../../assets/images/device.png";
import employeesImg from "../../../assets/images/employees.png";



// Categories array
const categories = [
  { label: "Grocery", image: groceryImg },
  { label: "Restaurant", image: foodImg },
  { label: "Household", image: clothingImg },
  { label: "Electronics", image: electronicsImg },
  { label: "Helpers", image: employeesImg },
];

// const cartData = [
//   {
//     id: "1",
//     storeName: "Walmart",
//     logo: require("../../assets/images/walmart.png"),
//     delivery: "1:35pm",
//     products: [require("../../assets/products/apple.png")],
//   },
//   {
//     id: "2",
//     storeName: "7-Eleven",
//     logo: require("../../assets/images/7-eleven.png"),
//     delivery: "1:40pm",
//     products: [
//       require("../../assets/products/broccoli.png"),
//       require("../../assets/products/carrot.png"),
//       require("../../assets/products/chili-pepper.png"),
//       require("../../assets/products/cucumber.png"),
//       require("../../assets/products/milk.png"),
//       require("../../assets/products/strawberry.png"),
//       require("../../assets/products/apple.png"),
//       require("../../assets/products/watermelon.png"),
//     ],
//     extra: 5,
//   },
//   {
//     id: "3",
//     storeName: "The Home Depot",
//     logo: require("../../assets/images/jiffy.png"),
//     delivery: "1:35pm",
//     products: [require("../../assets/products/strawberry.png")],
//   },
//   {
//     id: "4",
//     storeName: "Big Bazaar",
//     logo: require("../../assets/images/big-bazaar.png"),
//     delivery: "1:40pm",
//     products: [require("../../assets/products/apple.png")],
//   },
//   {
//     id: "5",
//     storeName: "Spencer's",
//     logo: require("../../assets/images/spencers.png"),
//     delivery: "1:35pm",
//     products: [require("../../assets/products/chili-pepper.png")],
//   }
// ];

export default function Orders() {
  return (
    <View className="flex-1 bg-white">
      {/* Fixed Header */}
      <View className="w-full px-8 pt-12 pb-2 bg-slate-100 flex flex-row justify-between items-center rounded-md z-10">
        <Text className="text-lg font-bold text-gray-900">
          Bhavnagar, Gujarat
        </Text>
        <Pressable className="active:opacity-40">
          <Feather name="shopping-cart" size={20} color="black" />
        </Pressable>
      </View>

      {/* Fixed Search Bar and Categories */}
      <View className="w-full px-4 pt-2 pb-2 bg-slate-100 z-10">
        {/* Search Bar */}
        <View className="flex-row items-center gap-4 px-2 pb-2 mb-2">
          <View className="flex-1">
            <Pressable className="bg-white rounded-2xl px-4 py-3 flex-row items-center">
              <Feather name="search" size={18} color="black" />
              <Text className="text-base ml-2 text-gray-700">
                Search orders
              </Text>
            </Pressable>
          </View>
        </View>
        {/* Categories */}
        <View className="flex flex-row items-center justify-between rounded-lg py-2">
          {categories.map((cat) => (
            <View key={cat.label} className="items-center flex-1">
              <Image
                source={cat.image}
                style={{ width: 36, height: 36, marginBottom: 4 }}
                resizeMode="contain"
              />
              <Text className="text-sm font-bold text-gray-900 mb-2">
                {cat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cart List */}
      <ScrollView className="px-4 mt-1 mb-2">
        {/* Example Order Item */}
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <Text className="text-base font-semibold text-gray-900">Order #12345</Text>
          <Text className="text-sm text-gray-600">2 items | ₹480 | Pending</Text>
          <Text className="text-xs text-gray-400">To: Rakesh, Virar East</Text>
        </View>

        {/* Another Order Item */}
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <Text className="text-base font-semibold text-gray-900">Order #12346</Text>
          <Text className="text-sm text-gray-600">5 items | ₹1320 | Packed</Text>
          <Text className="text-xs text-gray-400">To: Shruti, Virar West</Text>
        </View>

        {/* Add more orders as needed */}
      </ScrollView>
    </View>
  );
}
