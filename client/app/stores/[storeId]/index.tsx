import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, FlatList } from "react-native";
import { useState, useMemo } from "react";
import stores from "../../../assets/database/stores.json";
import products from "../../../assets/database/products.json";
import storeInventory from "../../../assets/database/store_inventory.json";
import { Feather } from "@expo/vector-icons";

// Logos
const logoMap: Record<string, any> = {
  "assets/images/dmart.png": require("../../../assets/images/dmart.png"),
  "assets/images/reliance.png": require("../../../assets/images/reliance.png"),
  "assets/images/big-bazaar.png": require("../../../assets/images/big-bazaar.png"),
  "assets/images/7-eleven.png": require("../../../assets/images/7-eleven.png"),
  "assets/images/spencers.png": require("../../../assets/images/spencers.png"),
  "assets/images/walmart.png": require("../../../assets/images/walmart.png"),
  "assets/images/super-encorto.png": require("../../../assets/images/super-encorto.png"),
  "assets/images/jiffy.png": require("../../../assets/images/jiffy.png"),
  "assets/images/coles.png": require("../../../assets/images/coles.png"),
  "assets/images/pay-less.png": require("../../../assets/images/pay-less.png"),
  "assets/images/shell.png": require("../../../assets/images/shell.png"),
  "assets/images/natures-basket.png": require("../../../assets/images/natures-basket.png"),
  "assets/images/green-mart.png": require("../../../assets/images/green-mart.png"),
  "assets/images/hamleys.png": require("../../../assets/images/hamleys.png"),
};

// Placeholder product image
const productPlaceholder = require("../../../assets/images/grocery.png");

// Section categories (customize as needed)
const SECTIONS = [
  "Offers",
  "Grocery",
  "Fruits",
  "Vegetables",
  "Snacks",
  "Beverages",
  "Dairy",
  "Bakery",
  "Spices & Staples",
  "Noodles",
];

const StoreScreen = () => {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Find store
  const store = stores.find((s) => String(s.id) === String(storeId));

  if (!store) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-red-600 mb-2">Store not found</Text>
        <Text className="text-gray-500">Please try again</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-2 rounded-full mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get inventory for this store
  const inventoryForStore = storeInventory.filter(
    (item) => item.store_id === store.id
  );

  // Map inventory to products with details
  const storeProducts = inventoryForStore
    .map((inv) => {
      const product = products.find((p) => p.id === inv.product_id);
      return product
        ? {
            ...product,
            price: inv.price,
            stock_qty: inv.stock_qty,
            unit: inv.unit || "1 pc", // fallback unit
            image: productPlaceholder, // You can map real images if available
          }
        : null;
    })
    .filter(Boolean);

  // Group products by section/category
  const sectionedProducts = useMemo(() => {
    const sections: Record<string, any[]> = {};
    for (const section of SECTIONS) sections[section] = [];
    for (const prod of storeProducts) {
      const cat = prod.category || "Grocery";
      if (sections[cat]) sections[cat].push(prod);
      else sections["Grocery"].push(prod);
    }
    return sections;
  }, [storeProducts]);

  // Filter by search
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sectionedProducts;
    const lower = search.trim().toLowerCase();
    const filtered: Record<string, any[]> = {};
    for (const section in sectionedProducts) {
      filtered[section] = sectionedProducts[section].filter(
        (prod) =>
          prod.name?.toLowerCase().includes(lower) ||
          prod.category?.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [search, sectionedProducts]);

  // Responsive store info height
  const storeInfoHeight = Math.round(Dimensions.get("window").height * 0.15);

  return (
    <View className="flex-1 bg-white">
      {/* Store Info Header */}
      <View
        className="w-full mt-4 items-center justify-center px-6"
        style={{
          height: storeInfoHeight,
          backgroundColor: "white",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            left: 18,
            top: 25,
            padding: 8,
            zIndex: 20,
          }}
        >
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>

        <Image
          source={logoMap[store.logo]}
          style={{
            width: 67,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            backgroundColor: "#fff",
            marginBottom: 4,
          }}
          resizeMode="cover"
        />
        <Text className="text-xl font-bold text-gray-900 text-center">
          {store.name}
        </Text>
        <View className="flex-row items-center justify-center mt-1">
          <Feather name="clock" size={14} color="#64748b" />
          <Text className="text-xs text-gray-500 ml-1 mr-2">
            Delivery in 20-30 min
          </Text>
          <Feather name="map-pin" size={14} color="#64748b" />
          <Text className="text-xs text-gray-500 ml-1">
            {store.area || "Near you"}
            {store.pincode ? `, ${store.pincode}` : ""}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 pb-2 bg-white z-10">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
          <Feather name="search" size={18} color="#64748b" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-700"
            placeholder="Search for products..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Products Sections - Horizontal Scroll */}
      <ScrollView
        className="flex-1 px-0 pt-2 mb-6"
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => {
          const items = filteredSections[section] || [];
          if (!items.length) return null;
          return (
            <View key={section} className="mb-8">
              <Text className="text-lg font-bold text-gray-800 mb-3 px-4">
                {section}
              </Text>
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item: product }) => (
                  <View
                    className="bg-white rounded-2xl shadow-sm p-3 mr-4"
                    style={{ width: 170, position: "relative" }}
                  >
                    <View>
                      <Image
                        source={product.image}
                        className="w-full h-24 rounded-xl mb-2"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute right-2 top-2 bg-blue-600 rounded-full p-1"
                        onPress={() => {
                          /* Add to cart logic here */
                        }}
                        style={{ zIndex: 10 }}
                      >
                        <Feather name="plus" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <Text
                      className="text-base font-semibold text-gray-900 mb-1"
                      numberOfLines={2}
                    >
                      {product.name || "Product"}
                    </Text>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-xs text-gray-500">
                        {product.unit || "1 pc"}
                      </Text>
                      <Text className="text-sm text-green-700 font-bold">
                        ₹{product.price}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          );
        })}
        {/* If no products found */}
        {Object.values(filteredSections).flat().length === 0 && (
          <View className="items-center mt-16">
            <Feather name="search" size={48} color="#cbd5e1" />
            <Text className="text-lg text-gray-400 mt-4">
              No products found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default StoreScreen;