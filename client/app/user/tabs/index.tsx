import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getDistance } from "../../../utils/distance";
import { getTravelTime } from "../../../utils/time";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function UserHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);

  // Fetch user profile
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

  // Fetch stores from backend
  const fetchStores = async () => {
    setStoresLoading(true);
    try {
      const res = await fetch("http://10.54.32.81:5000/api/store/stores");
      const data = await res.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    } finally {
      setStoresLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchStores();
  }, []);

  // Step 1: Add _distance to all stores and filter those within 15 km
  const storesWithDistance = stores
    .map((store: any) => {
      const distance =
        user?.location?.lat &&
        user?.location?.lng &&
        store?.location?.lat &&
        store?.location?.lng
          ? getDistance(
              user.location.lat,
              user.location.lng,
              store.location.lat,
              store.location.lng
            )
          : Infinity;

      return { ...store, _distance: distance };
    })
    .filter((store) => store._distance <= 15);

  // Step 2: Sort by distance
  storesWithDistance.sort((a, b) => a._distance - b._distance);

  // Step 3: Select only one nearest store per brand
  const uniqueNearestStores: any[] = [];
  const seenBrands = new Set();

  storesWithDistance.forEach((store) => {
    const brandKey = store.brandName?.trim().toLowerCase();
    if (!seenBrands.has(brandKey)) {
      uniqueNearestStores.push(store);
      seenBrands.add(brandKey);
    }
  });

  // --- Shop Grid Logic ---
  // Show up to 7 stores, if more, 8th cell is "See All" icon
  const gridStores = uniqueNearestStores.slice(0, 8);
  const showSeeAll =
    uniqueNearestStores.length > 8 || (uniqueNearestStores.length > 7 && gridStores.length === 8);

  // Prepare grid cells (max 8: 7 stores + 1 see all if needed)
  let gridCells = gridStores.slice(0, showSeeAll ? 7 : 8);
  if (showSeeAll) {
    gridCells.push({ isSeeAll: true });
  }

  // Arrange into 2 rows of 4 columns
  const gridRows = [];
  for (let i = 0; i < gridCells.length; i += 4) {
    gridRows.push(gridCells.slice(i, i + 4));
  }

  if (loading || !user || storesLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Top section: User address and profile icon */}
      <View className="flex-row items-center justify-between px-4 py-3 pt-10 bg-white border-b border-gray-100 z-10">
        <View className="flex-1">
          <Text className="text-xs text-gray-400">Deliver to</Text>
          <Text
            className="text-base font-semibold text-gray-800"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.address || "No address set"}
          </Text>
        </View>
        <View className="flex-row items-center space-x- ml-2">
          <TouchableOpacity
            onPress={() => router.push("/screens/userProfile")}
            className="w-10 h-10 rounded-full mr-4 items-center justify-center"
          >
            <Ionicons name="person-circle-outline" size={32} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/screens/cart")}
            className="w-10 h-10 rounded-full items-center justify-center mr-2"
          >
            <Ionicons name="cart-outline" size={28} color="#00000" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Scrollable stores list */}
      <ScrollView className="flex-1 bg-white">
      {/* Shop grid view */}
      <View className="px-4 pt-6">
        {gridRows.map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row justify-between mb-4">
            {row.map((store, colIdx) =>
              store.isSeeAll ? (
                <TouchableOpacity
                  key={`seeall-${colIdx}`}
                  className="flex-1 mx-1 items-center justify-center bg-gray-100 rounded-2xl h-28"
                  onPress={() => router.push("/user/tabs/stores")}
                  style={{ minWidth: 0 }}
                >
                  <MaterialIcons name="apps" size={36} color="#2563eb" />
                  <Text className="text-xs text-gray-700 mt-2 font-semibold">See All</Text>
                </TouchableOpacity>
              ) : (
                <Pressable
                  key={store._id || store.id || colIdx}
                  className="flex-1 mx-1 items-center bg-white rounded-2xl h-28 shadow"
                  onPress={() => router.push(`/stores/${store._id || store.id}`)}
                  style={{ minWidth: 0 }}
                >
                  <Image
                    source={{
                      uri: store.storeImage
                        ? `http://10.54.32.81:5000${store.storeImage}`
                        : "https://via.placeholder.com/80",
                    }}
                    className="w-14 h-14 rounded-xl mt-3 bg-gray-100"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs font-semibold text-gray-800 mt-2 text-center px-1"
                    numberOfLines={2}
                  >
                    {store.brandName}
                  </Text>
                </Pressable>
              )
            )}
            {/* Fill empty columns if needed for alignment */}
            {row.length < 4 &&
              Array.from({ length: 4 - row.length }).map((_, i) => (
                <View key={`empty-${i}`} className="flex-1 mx-1" />
              ))}
          </View>
        ))}
      </View>
        <Text className="text-xl font-bold text-start mt-4 mb-2 mx-8">
          Nearby Stores
        </Text>
        {uniqueNearestStores.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">
            No stores found.
          </Text>
        ) : (
          uniqueNearestStores.map((store: any) => {
            const distance = store._distance;
            const time = getTravelTime(distance);

            return (
              <Pressable
                            key={store._id}
                            className="mx-4 my-2 p-4  rounded-xl flex-row items-center"
                            onPress={() => router.push(`/stores/${store._id}`)}
                          >
                            <Image
                              source={{
                                uri: store.storeImage
                                  ? `http://10.54.32.81:5000${store.storeImage}`
                                  : "https://via.placeholder.com/80",
                              }}
                              style={{
                                width: 72,
                                height: 60,
                                borderRadius: 12,
                                marginRight: 16,
                              }}
                              className="border-[1px] border-gray-200"
                              resizeMode="contain"
                            />
                            <View>
                              <Text className="text-lg font-bold text-gray-900">
                                {store.brandName}
                              </Text>
                              <Text className="text-base text-gray-700">{store.city}, {store.pincode}</Text>
                              {distance !== null && time !== null && (
                                <Text className="text-base text-gray-400 mt-1">
                                  {distance.toFixed(2)} km • {time} min away
                                </Text>
                              )}
                            </View>
                          </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
