import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getDistance } from "../../../utils/distance";
import { getTravelTime } from "../../../utils/time";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [storesLoading, setStoresLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://10.54.32.81:5000/api/store/stores")
      .then((res) => res.json())
      .then(setStores);

    // Fetch user profile for location
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        fetch("http://10.54.32.81:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(setUser);
      }
    });
  }, []);

  // Step 1: Add _distance to all stores and filter those within 15 km
  const storesWithDistance = stores.map((store: any) => {
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
  });

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

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Header */}
      <View className="flex-row items-center justify-between px-4 py-3 pt-10 bg-white z-10">
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
        <TouchableOpacity
          onPress={() => router.push("/screens/userProfile")}
          className="ml-4 w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="person-circle-outline" size={32} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <View className="px-4 pt-2 pb-2 bg-white z-10">
        <Text className="text-xl font-bold text-center">All Stores</Text>
      </View>
      <ScrollView className="flex-1 bg-white">
        {uniqueNearestStores.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No stores found.</Text>
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
                  <Text className="text-base text-gray-700">{store.address}</Text>
                  {distance !== null && time !== null && (
                    <Text className="text-base text-blue-600 mt-1">
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
