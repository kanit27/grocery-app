import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await fetch("https://corner-l14t.onrender.com/api/store/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">Store partner not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center p-6">
        {profile.storeImage ? (
          <Image
            source={{
              uri: profile.storeImage.startsWith("http")
                ? profile.storeImage
                : `https://corner-l14t.onrender.com${profile.storeImage}`,
            }}
            style={{
              width: 150,
              height: 128,
              borderRadius: 12,
              marginBottom: 16,
              backgroundColor: "#f3f4f6",
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: 150,
              height: 128,
              borderRadius: 12,
              marginBottom: 16,
              backgroundColor: "#f3f4f6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text className="text-gray-400">No image</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-gray-900 mb-2">{profile.brandName}</Text>
        <Text className="text-lg text-gray-700 mb-1">{profile.storeName}</Text>
        <Text className="text-base text-gray-500 mb-1">{profile.email}</Text>
        <View className="w-full mt-2">
          <Info label="Phone" value={profile.phone} />
          <Info label="Address" value={profile.address} />
          <Info label="Pincode" value={profile.pincode} />
          <Info label="City" value={profile.city} />
          <Info label="State" value={profile.state} />
          <Info label="Latitude" value={profile.location?.lat} />
          <Info label="Longitude" value={profile.location?.lng} />
          <Info label="Contact Person Name" value={profile.contactPersonName} />
          <Info label="Contact Person Phone" value={profile.contactPersonPhone} />
          <Info label="Store Hours" value={profile.storeHours} />
          <Info label="Delivery Radius (km)" value={profile.deliveryRadiusKm} />
        </View>
        <TouchableOpacity
          className="bg-yellow-500 p-4 rounded-lg mt-6 mb-3 w-full"
          onPress={() => router.push("/screens/updateStoreProfile")}
        >
          <Text className="text-white text-center font-semibold">
            Edit Profile
          </Text>
        </TouchableOpacity>
        <Text className="text-base text-gray-500 mt-2">
          Status: {profile.isActive ? "Active" : "Inactive"}
        </Text>
      </View>
    </ScrollView>
  );
}

// Helper for info rows
function Info({ label, value }: { label: string; value: any }) {
  const display =
    value || value === 0
      ? value
      : `No ${label.toLowerCase()}`;
  return (
    <View className="flex-row mb-2">
      <Text className="font-semibold text-gray-700 w-40">{label}:</Text>
      <Text className="text-gray-600">{display}</Text>
    </View>
  );
}