import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import shops from "../../assets/database/stores.json";
import dmartLogo from "../../assets/images/dmart.png";
import relianceLogo from "../../assets/images/reliance.png";
import bigBazaarLogo from "../../assets/images/big-bazaar.png";
import jiffyLogo from "../../assets/images/jiffy.png";
import colesLogo from "../../assets/images/coles.png";
import spencersLogo from "../../assets/images/spencers.png";

const logoMap: Record<string, any> = {
  "assets/images/dmart.png": dmartLogo,
  "assets/images/reliance.png": relianceLogo,
  "assets/images/big-bazaar.png": bigBazaarLogo,
  "assets/images/jiffy.png": jiffyLogo,
  "assets/images/coles.png": colesLogo,
  "assets/images/spencers.png": spencersLogo,
};

export default function AllShopsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pt-12 pb-4 bg-slate-100">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-900">All Shops</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {shops.map((shop) => (
          <Pressable
            key={shop.id}
            className="bg-white rounded-2xl p-4 flex-row items-center mb-4 border border-gray-100"
            onPress={() => router.push(`/stores/${shop.id}`)}
          >
            <Image
              source={logoMap[shop.logo]}
              className="w-16 h-16 rounded-xl border border-gray-200 mr-4"
              style={{ borderWidth: 1 }}
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">{shop.name}</Text>
              <Text className="text-xs text-gray-500">{shop.address}</Text>
              <Text className="text-xs text-gray-400">
                {shop.city}, {shop.pincode}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}