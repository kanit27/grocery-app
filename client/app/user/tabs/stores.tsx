import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

// Import category images
import groceryImg from "../../../assets/images/grocery.png";
import foodImg from "../../../assets/images/burger.png";
import clothingImg from "../../../assets/images/brand.png";
import electronicsImg from "../../../assets/images/device.png";
import employeesImg from "../../../assets/images/employees.png";

// Import shops data
import shops from "../../../assets/database/stores.json";
// Import all possible shop logos
import dmartLogo from "../../../assets/images/dmart.png";
import relianceLogo from "../../../assets/images/reliance.png";
import sevenElevenLogo from "../../../assets/images/7-eleven.png";
import bigBazaarLogo from "../../../assets/images/big-bazaar.png";
import spencersLogo from "../../../assets/images/spencers.png";
import walmartLogo from "../../../assets/images/walmart.png";
import superEncortoLogo from "../../../assets/images/super-encorto.png";
import jiffyLogo from "../../../assets/images/jiffy.png";
import greenMartLogo from "../../../assets/images/green-mart.png";
import naturesBasketLogo from "../../../assets/images/natures-basket.png";
import farmerMartLogo from "../../../assets/images/farmer-mart.png";
import colesLogo from "../../../assets/images/coles.png";
import payLessLogo from "../../../assets/images/pay-less.png";
import vmartLogo from "../../../assets/images/dmart.png";
import moreSupermarketLogo from "../../../assets/images/jiffy.png";
import starBazaarLogo from "../../../assets/images/big-bazaar.png";
import nilgirisLogo from "../../../assets/images/walmart.png";
import metroLogo from "../../../assets/images/dmart.png";
import relianceFreshLogo from "../../../assets/images/reliance.png";

// Map logo path string to imported image
const logoMap: Record<string, any> = {
  "assets/images/dmart.png": dmartLogo,
  "assets/images/reliance.png": relianceLogo,
  "assets/images/7-eleven.png": sevenElevenLogo,
  "assets/images/big-bazaar.png": bigBazaarLogo,
  "assets/images/spencers.png": spencersLogo,
  "assets/images/walmart.png": walmartLogo,
  "assets/images/super-encorto.png": superEncortoLogo,
  "assets/images/jiffy.png": jiffyLogo,
  "assets/images/green-mart.png": greenMartLogo,
  "assets/images/natures-basket.png": naturesBasketLogo,
  "assets/images/farmer-mart.png": farmerMartLogo,
  "assets/images/coles.png": colesLogo,
  "assets/images/pay-less.png": payLessLogo,
  "assets/images/vmart.png": vmartLogo,
  "assets/images/more-supermarket.png": moreSupermarketLogo,
  "assets/images/star-bazaar.png": starBazaarLogo,
  "assets/images/nilgiris.png": nilgirisLogo,
  "assets/images/metro.png": metroLogo,
  "assets/images/reliance-fresh.png": relianceFreshLogo,
};

// Define the categories array
const categories = [
  { label: "Grocery", image: groceryImg },
  { label: "Restaurant", image: foodImg },
  { label: "Household", image: clothingImg },
  { label: "Electronics", image: electronicsImg },
  { label: "Helpers", image: employeesImg },
];

export default function Stores() {
  return (
    <View className="flex-1 bg-white">
      {/* Fixed Header */}
      <View className="w-full px-8 pt-12 pb-2 bg-slate-100 flex flex-row justify-between items-center rounded-md z-10">
        <Text className="text-lg font-bold text-gray-900">Bhavnagar, Gujarat</Text>
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
                Search stores
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

      {/* All Stores List */}
      <ScrollView className="px-4 mt-3 mb-6">
        {shops.map((shop, idx) => (
          <View key={shop.id} className="mb-6 bg-white rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Image
                source={logoMap[shop.logo]}
                className="w-12 h-12 mr-4 rounded-lg"
                resizeMode="contain"
              />
              <View className="flex-1">
                  <Text className="font-semibold text-lg text-gray-900">
                    {shop.name}
                  </Text>
                  
              <View className="flex-row items-center justify-start">
                <Text className="text-xs text-green-500 font-semibold">
                  Delivery by {store.delivery} 
                </Text>
                <Text className="text-xs text-gray-500 ml-2">
                   || {store.distance} km away
                </Text>
              </View>
                <Text className="text-xm tracking-tighter text-gray-600 font-bold">{store.category}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
