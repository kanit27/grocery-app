import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [stock_qty, setStockQty] = useState("");
  const [pickedImage, setPickedImage] = useState<any>(null);
  const [message, setMessage] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPickedImage(result.assets[0]);
    }
  };

  const handleAddProduct = async () => {
    setMessage("");
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("unit", unit);
    formData.append("price", price);
    formData.append("stock_qty", stock_qty);

    if (Platform.OS === "web") {
      if (pickedImage && pickedImage.file) {
        formData.append("image", pickedImage.file);
      }
    } else {
      if (pickedImage) {
        formData.append("image", {
          uri: pickedImage.uri,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }
    }

    try {
      const res = await fetch("http://10.54.32.81:5000/api/store/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type for web, browser will set it
          ...(Platform.OS !== "web" && { "Content-Type": "multipart/form-data" }),
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Product added successfully!");
        setName(""); setDescription(""); setCategory(""); setBrand(""); setUnit(""); setPrice(""); setStockQty(""); setPickedImage(null);
      } else {
        setMessage(data.message || "Failed to add product.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Add Product</Text>
      {message !== "" && (
        <View className="mb-3">
          <Text className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"} font-semibold`}>
            {message}
          </Text>
        </View>
      )}
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Name" value={name} onChangeText={setName} />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Brand" value={brand} onChangeText={setBrand} />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Unit (e.g. kg, packet)" value={unit} onChangeText={setUnit} />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput className="border border-gray-300 rounded-lg px-4 py-2 mb-3" placeholder="Stock Quantity" value={stock_qty} onChangeText={setStockQty} keyboardType="numeric" />
      {Platform.OS === "web" ? (
        <input
          type="file"
          accept="image/*"
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
        <TouchableOpacity className="bg-gray-200 p-3 rounded-lg mb-3" onPress={pickImage}>
          <Text className="text-center text-gray-700">{pickedImage ? "Change Image" : "Pick Image"}</Text>
        </TouchableOpacity>
      )}
      {pickedImage && (
        <Image source={{ uri: pickedImage.uri }} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 12, borderRadius: 12 }} />
      )}
      <TouchableOpacity className="bg-green-600 p-4 rounded-lg mb-3" onPress={handleAddProduct}>
        <Text className="text-white text-center font-semibold">Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}