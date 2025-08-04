import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function UpdateStoreProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [pickedImage, setPickedImage] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Editable fields
  const [brandName, setBrandName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [storeHours, setStoreHours] = useState("");
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState("");
  const [storeImage, setStoreImage] = useState("");

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
        setBrandName(data.brandName || "");
        setStoreName(data.storeName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setPincode(data.pincode || "");
        setCity(data.city || "");
        setState(data.state || "");
        setLat(data.location?.lat ? String(data.location.lat) : "");
        setLng(data.location?.lng ? String(data.location.lng) : "");
        setContactPersonName(data.contactPersonName || "");
        setContactPersonPhone(data.contactPersonPhone || "");
        setStoreHours(data.storeHours || "");
        setDeliveryRadiusKm(data.deliveryRadiusKm ? String(data.deliveryRadiusKm) : "");
        setStoreImage(data.storeImage || "");
      } catch (err) {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPickedImage(result.assets[0]);
    }
  };

  const handleSaveProfile = async () => {
    setMessage(""); // Clear previous message
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("storeName", storeName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("pincode", pincode);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("location[lat]", lat);
    formData.append("location[lng]", lng);
    formData.append("contactPersonName", contactPersonName);
    formData.append("contactPersonPhone", contactPersonPhone);
    formData.append("storeHours", storeHours);
    formData.append("deliveryRadiusKm", deliveryRadiusKm);

    if (Platform.OS === "web") {
      if (pickedImage && pickedImage.file) {
        formData.append("storeImage", pickedImage.file);
      }
    } else {
      if (pickedImage) {
        formData.append("storeImage", {
          uri: pickedImage.uri,
          name: "store.jpg",
          type: "image/jpeg",
        } as any);
      }
    }

    try {
      const res = await fetch("https://corner-l14t.onrender.com/api/store/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(Platform.OS !== "web" && { "Content-Type": "multipart/form-data" }),
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => router.back(), 1200);
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center p-6">
        {message !== "" && (
          <View className="mb-3 w-full">
            <Text className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"} font-semibold`}>
              {message}
            </Text>
          </View>
        )}
        {(pickedImage || storeImage) ? (
          <Image
            source={{
              uri: pickedImage
                ? pickedImage.uri
                : storeImage.startsWith("http")
                ? storeImage
                : `https://corner-l14t.onrender.com${storeImage}`,
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
        {Platform.OS === "web" ? (
          <input
            type="file"
            accept="image/*"
            style={{ marginBottom: 12 }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setPickedImage({
                  uri: URL.createObjectURL(file),
                  name: file.name,
                  type: file.type,
                  file,
                });
              }
            }}
          />
        ) : (
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg mb-3"
            onPress={pickImage}
          >
            <Text className="text-center text-gray-700">
              {pickedImage ? "Change Image" : "Pick Image"}
            </Text>
          </TouchableOpacity>
        )}
        <TextInput placeholder="Brand Name" value={brandName} onChangeText={setBrandName} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Store Name" value={storeName} onChangeText={setStoreName} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Address" value={address} onChangeText={setAddress} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="numeric" className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="City" value={city} onChangeText={setCity} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="State" value={state} onChangeText={setState} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <View className="flex-row mb-3">
          <TextInput placeholder="Latitude" value={lat} onChangeText={setLat} keyboardType="numeric" className="border border-gray-300 rounded-lg px-4 py-2 mr-2 flex-1" />
          <TextInput placeholder="Longitude" value={lng} onChangeText={setLng} keyboardType="numeric" className="border border-gray-300 rounded-lg px-4 py-2 flex-1" />
        </View>
        <TextInput placeholder="Contact Person Name" value={contactPersonName} onChangeText={setContactPersonName} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Contact Person Phone" value={contactPersonPhone} onChangeText={setContactPersonPhone} keyboardType="phone-pad" className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Store Hours" value={storeHours} onChangeText={setStoreHours} className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TextInput placeholder="Delivery Radius (km)" value={deliveryRadiusKm} onChangeText={setDeliveryRadiusKm} keyboardType="numeric" className="border border-gray-300 rounded-lg px-4 py-2 mb-3" />
        <TouchableOpacity className="bg-green-600 p-4 rounded-lg mb-3" onPress={handleSaveProfile}>
          <Text className="text-white text-center font-semibold">Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}