import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getDistance } from "../../../utils/distance";
import { getTravelTime } from "../../../utils/time"; // <-- Add this import

import groceryImg from "../../../assets/images/grocery.png";
import foodImg from "../../../assets/images/burger.png";
import clothingImg from "../../../assets/images/brand.png";
import electronicsImg from "../../../assets/images/device.png";
import employeesImg from "../../../assets/images/employees.png";
import dmartLogo from "../../../assets/images/dmart.png";
import relianceLogo from "../../../assets/images/reliance.png";
import bigBazaarLogo from "../../../assets/images/big-bazaar.png";
import jiffyLogo from "../../../assets/images/jiffy.png";
import colesLogo from "../../../assets/images/coles.png";
import spencersLogo from "../../../assets/images/spencers.png";

// Import shops and chains data
import shops from "../../../assets/database/stores.json";
import chains from "../../../assets/database/chain.json";

// Map logo path string to imported image
const logoMap: Record<string, any> = {
  "assets/images/dmart.png": dmartLogo,
  "assets/images/reliance.png": relianceLogo,
  "assets/images/big-bazaar.png": bigBazaarLogo,
  "assets/images/jiffy.png": jiffyLogo,
  "assets/images/coles.png": colesLogo,
  "assets/images/spencers.png": spencersLogo,
};

export default function UserHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://10.54.32.81:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setUser(data);
      else console.error("Error fetching profile:", data.message);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Get user's lat/lng (assume user.location.lat/lng)
  const userLat = user.location?.lat;
  const userLng = user.location?.lng;

  // Attach chain info to each shop and calculate distance
  const shopsWithChain = shops
    .map((shop: any) => {
      const chain = chains.find((c: any) => c.id === shop.chain_id);
      return {
        ...shop,
        chainName: chain?.name || "Supermarket",
        chainLogo: chain?.logo,
        distance:
          shop.latitude && shop.longitude && userLat && userLng
            ? getDistance(userLat, userLng, shop.latitude, shop.longitude)
            : Infinity,
      };
    });

  // Filter: Only closest shop for each chain
  const closestShopsByChain: any[] = [];
  const seenChains = new Set();
  shopsWithChain
    .sort((a, b) => a.distance - b.distance)
    .forEach((shop) => {
      if (!seenChains.has(shop.chainName)) {
        closestShopsByChain.push(shop);
        seenChains.add(shop.chainName);
      }
    });

  // 4x2 grid logic (use sorted, unique shops)
  const numColumns = 4;
  const numRows = 2;
  const totalCells = numColumns * numRows;

  let shopsToShow: any[] = [];
  if (closestShopsByChain.length > 7) {
    shopsToShow = closestShopsByChain.slice(0, 7);
    shopsToShow.push({ showAll: true });
  } else {
    shopsToShow = closestShopsByChain.slice(0, 8);
    while (shopsToShow.length < 8) {
      shopsToShow.push(null);
    }
  }

  // Build rows for the grid
  const shopRows = [];
  for (let i = 0; i < totalCells; i += numColumns) {
    shopRows.push(shopsToShow.slice(i, i + numColumns));
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with real user address */}
      <View className="w-full px-8 pt-12 pb-2 bg-slate-100 flex-row justify-between items-center rounded-lg z-10">
        <Text className="text-xl font-bold text-gray-900" numberOfLines={1} ellipsizeMode="tail">
          {user.address || "Your Address"}
        </Text>
        <Pressable>
          <View className="flex-row items-center gap-8">
            <Feather onPress={() => router.push("/screens/cart")} name="shopping-cart" size={22} color="black" />
            <Feather onPress={() => router.push("/screens/profile")} name="user" size={22} color="black" />
          </View>
        </Pressable>
      </View>

      {/* Search Bar and Categories */}
      <View className="w-full px-4 pt-4 pb-4 bg-slate-100 z-10">
        {/* Search Bar */}
        <View className="flex-row items-center gap-4 px-2 pb-2">
          <Pressable className="bg-white rounded-2xl px-4 py-3 flex-row items-center flex-1">
            <Feather name="search" size={18} color="black" />
            <Text className="text-base ml-2 text-gray-700">
              Search products and stores
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 4x2 Shop Grid */}
      <ScrollView contentContainerStyle={{ paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {shopRows.map((row, rowIdx) => (
          <View
            key={rowIdx}
            className="flex-row items-center justify-center mb-4"
          >
            {row.map((shop, colIdx) => {
              // Show All button logic
              if (shop && shop.showAll) {
                return (
                  <Pressable
                    key="show-all-shops"
                    className="items-center mx-1"
                    style={{ width: 80 }}
                    onPress={() => router.push("/screens/allshops")}
                  >
                    <View
                      className="w-[57px] h-[48px] rounded-xl bg-slate-50 items-center justify-center mb-1.5 border border-slate-200"
                      style={{ borderWidth: 1.5 }}
                    >
                      <Feather name="grid" size={24} color="#6b7280" />
                    </View>
                    <Text
                      className="text-xs font-bold text-gray-800 text-center"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ width: 72, overflow: "hidden" }}
                    >
                      All Shops
                    </Text>
                  </Pressable>
                );
              }
              // Normal shop cell
              if (!shop || !shop.chainName) {
                return <View key={colIdx} className="mx-1" style={{ width: 80 }} />;
              }
              return (
                <Pressable
                  key={shop.id}
                  className="items-center mx-1"
                  style={{ width: 90 }}
                  onPress={() => router.push(`/stores/${shop.id}`)}
                >
                  <Image
                    source={logoMap[shop.chainLogo]}
                    className="w-[57px] h-[48px] mb-1.5 rounded-xl border border-gray-200"
                    style={{ borderWidth: 1 }}
                    resizeMode="cover"
                  />
                  <Text
                    className="text-sm font-bold text-gray-900 text-center"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ width: 80, overflow: "hidden" }}
                  >
                    {shop.chainName}
                  </Text>
                  {/* Show distance and time if available */}
                  {shop.distance !== undefined && shop.distance !== Infinity && (
                    <View className="flex-row items-center justify-center mt-1">
                      <Text className="text-xs text-gray-500">
                        {shop.distance.toFixed(1)} km
                      </Text>
                      <Text className="text-xs text-gray-400 mx-1">•</Text>
                      <Text className="text-xs text-gray-500">
                        {getTravelTime(shop.distance)} min
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}