import React from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getDistance } from "../../utils/distance";

// Load JSON data
import stores from "../../assets/database/stores.json";
import users from "../../assets/database/users.json";

// Category icons
import groceryImg from "../../assets/images/grocery.png";
import foodImg from "../../assets/images/burger.png";
import clothingImg from "../../assets/images/brand.png";
import electronicsImg from "../../assets/images/device.png";
import employeesImg from "../../assets/images/employees.png";

// Shop logos
import dmartLogo from "../../assets/images/dmart.png";
import relianceLogo from "../../assets/images/reliance.png";
import bigbazaarLogo from "../../assets/images/big-bazaar.png";

const logoMap: Record<string, any> = {
  "assets/images/dmart.png": dmartLogo,
  "assets/images/reliance.png": relianceLogo,
  "assets/images/big-bazaar.png": bigbazaarLogo,
};

const categories = [
  { label: "Grocery", image: groceryImg },
  { label: "Restaurant", image: foodImg },
  { label: "Household", image: clothingImg },
  { label: "Electronics", image: electronicsImg },
  { label: "Helpers", image: employeesImg },
];

export default function HomeScreen() {
  const router = useRouter();

  // Step 1: Assume current user
  const currentUser = users[0];

  // Step 2: Group all stores by chain_id
  const storesByChain: Record<string, any[]> = {};
  stores.forEach((store) => {
    if (!storesByChain[store.chain_id]) {
      storesByChain[store.chain_id] = [];
    }
    storesByChain[store.chain_id].push(store);
  });

  // Step 3: For each chain, find the nearest store to the user
  const nearbyStores = Object.keys(storesByChain)
    .map((chainId) => {
      const storeGroup = storesByChain[chainId];

      let nearestStore = null;
      let minDistance = Infinity;

      storeGroup.forEach((store) => {
        const distance = getDistance(
          currentUser.latitude,
          currentUser.longitude,
          store.latitude,
          store.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestStore = {
            ...store,
            distance,
            logoImage: logoMap[store.logo] || null,
          };
        }
      });

      return nearestStore; // could be null
    })
    .filter(Boolean); // remove any nulls just in case

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full px-8 pt-12 pb-2 bg-slate-100 flex flex-row justify-between items-center rounded-md z-10">
        <Text className="text-base font-bold text-gray-900">
          Shopping from: {currentUser.address}
        </Text>
        <Pressable className="active:opacity-40">
          <Feather name="shopping-cart" size={20} color="black" />
        </Pressable>
      </View>

      {/* Search & Categories */}
      <View className="w-full px-4 pt-2 pb-2 bg-slate-100 z-10">
        <View className="flex-row items-center gap-4 px-2 pb-2 mb-2">
          <View className="flex-1">
            <Pressable className="bg-white rounded-2xl px-4 py-3 flex-row items-center">
              <Feather name="search" size={18} color="black" />
              <Text className="text-base ml-2 text-gray-700">
                Search products and stores
              </Text>
            </Pressable>
          </View>
        </View>

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

      {/* Nearby Shops */}
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        <View className="w-full px-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Shops Near You
          </Text>
          {nearbyStores.length === 0 && (
            <Text className="text-center text-gray-400">
              No stores available in your area.
            </Text>
          )}
          {nearbyStores.map((shop, idx) => (
  shop ? (
    <Pressable
      key={String(shop.id)}
      onPress={() => router.push(`/stores/${shop.id}`)}
      className="w-full flex-row items-center justify-between mb-2 bg-white rounded-xl p-3"
    >
      <Image
        source={shop.logoImage || require("../../assets/images/placeholder-store.jpg")}
        style={{
          width: 56,
          height: 46,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E6E6E6",
        }}
        resizeMode="contain"
      />
      <View className="flex-1 ml-4">
        <Text
          className="text-base font-bold text-gray-900"
          style={{ textDecorationLine: "none" }}
        >
          {shop.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-green-500">
            Delivery Available
          </Text>
          <Text className="text-xs text-gray-400 ml-1 font-semibold">
            | {shop.location}
          </Text>
        </View>
      </View>
      <Text className="text-xs text-gray-500 ml-2">Nearby</Text>
    </Pressable>
  ) : null
))}
        </View>
      </ScrollView>
    </View>
  );
}
