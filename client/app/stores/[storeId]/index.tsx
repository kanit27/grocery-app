
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

import stores from "../../../assets/database/stores.json";
import products from "../../../assets/database/products.json";
import storeInventory from "../../../assets/database/store_inventory.json";

import { Store, Product, StoreInventoryItem, StoreProduct } from "../../../utils/type"; // adjust path as needed

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

const StoreScreen = () => {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();

  // 🔒 Types applied
  const store: Store | undefined = stores.find(
    (s: Store) => String(s.id) === String(storeId)
  );

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

  const inventoryForStore: StoreInventoryItem[] = storeInventory.filter(
    (item: StoreInventoryItem) => item.store_id === store.id
  );

  const storeProducts: StoreProduct[] = inventoryForStore
    .map((inv) => {
      const product = products.find((p: Product) => p.id === inv.product_id);
      return product
        ? {
            ...product,
            price: inv.price,
            stock_qty: inv.stock_qty,
          }
        : null;
    })
    .filter(Boolean) as StoreProduct[];

  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* header */}
      <View className="items-center py-6">
        <Image
          source={logoMap[store.logo]}
          style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-gray-900">{store.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {store.area}, {store.pincode}
        </Text>
      </View>

      {/* products */}
      <View className="mt-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Available Products</Text>
        {storeProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => router.push(`/stores/${store.id}/${product.id}`)}
            className="mb-5"
          >
            <Text className="text-base text-gray-900 font-medium">{product.name}</Text>
            <Text className="text-sm text-gray-500">₹{product.price}</Text>
            <Text className="text-xs text-green-600 mt-1">
              {product.stock_qty > 0
                ? `${product.stock_qty} in stock`
                : "Out of stock"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default StoreScreen;
