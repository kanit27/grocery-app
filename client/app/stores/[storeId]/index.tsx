import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StoreScreen() {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const res = await fetch(`https://corner-l14t.onrender.com/api/store/stores/${storeId}`);
      setStore(await res.json());
    };
    const fetchProducts = async () => {
      const res = await fetch(`https://corner-l14t.onrender.com/api/store/stores/${storeId}/products`);
      setProducts(await res.json());
    };
    const fetchCart = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`https://corner-l14t.onrender.com/api/cart/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
      await AsyncStorage.setItem(`cart_${storeId}`, JSON.stringify(data.items || []));
    };
    setLoading(true);
    Promise.all([fetchStore(), fetchProducts(), fetchCart()]).finally(() => setLoading(false));
  }, [storeId]);

  const handleAddToCart = async (productId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const existing = cart.find(
      (item) => item.product_id === productId || item.product_id?._id === productId
    );
    const quantity = existing ? existing.quantity + 1 : 1;
    const res = await fetch(`https://corner-l14t.onrender.com/api/cart/${storeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    const data = await res.json();
    setCart(data.items || []);
    await AsyncStorage.setItem(`cart_${storeId}`, JSON.stringify(data.items || []));
  };

  const isInCart = (productId: string) =>
    cart.some((item) => item.product_id === productId || item.product_id?._id === productId);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!store) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-red-600 mb-2">Store not found</Text>
      </View>
    );
  }

  // Arrange products into rows of 3
  const productRows = [];
  for (let i = 0; i < products.length; i += 3) {
    productRows.push(products.slice(i, i + 3));
  }

  // Helper to get product details from cart item
  const getProductDetails = (cartItem: any) => {
    if (cartItem.product_id && typeof cartItem.product_id === "object") {
      return cartItem.product_id;
    }
    return products.find((p) => p._id === cartItem.product_id) || {};
  };

  return (
    <View className="flex-1 bg-white">

        {/* Store Info */}
        <View className="flex-row justify-between items-start px-16 pt-12 pb-4 bg-white">
          <Image
            source={{
              uri: store.storeImage
                ? `https://corner-l14t.onrender.com${store.storeImage}`
                : "https://via.placeholder.com/120",
            }}
            className="w-28 h-20 rounded-2xl mb-3 border-[1px] border-gray-200"
            resizeMode="cover"
          />
          <View className="mb-4 items-end">
            <Text className="text-2xl font-bold text-gray-900 mb-1">{store.brandName}</Text>
            <Text className="text-base text-gray-700 mb-1">
              {store.storeName}, {store.pincode}
            </Text>
            <Text className="text-base text-gray-500 mb-1">
              Delivery in {store.deliveryRadiusKm} km
            </Text>
          </View>
        </View>

      <ScrollView className="flex-1 bg-white">
        {/* Products Grid */}
        <Text className="text-lg font-bold text-gray-800 px-6 mb-2">Products</Text>
        {products.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No products found.</Text>
        ) : (
          <View className="px-2 pb-6">
            {productRows.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row mb-4">
                {row.map((product: any) => (
                  <Pressable
                    key={product._id}
                    className="flex-1 mx-2 bg-white rounded-xl items-center p-3 border-[1px] border-gray-100"
                    onPress={() => router.push(`/stores/${storeId}/${product._id}`)}
                    style={{ minWidth: 0 }}
                  >
                    <View className="relative w-full items-center">
                      <Image
                        source={{
                          uri: product.image
                            ? product.image.startsWith("http")
                              ? product.image
                              : `https://corner-l14t.onrender.com${product.image}`
                            : "https://via.placeholder.com/60",
                        }}
                        className="w-20 h-20 rounded-lg mb-2"
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2"
                        onPress={() => handleAddToCart(product._id)}
                      >
                        <Text className="text-xs text-white">
                          {isInCart(product._id) ? "Added" : "Add"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-sm font-bold text-gray-900 text-center" numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text className="text-xs text-gray-500">{product.unit || "1 pc"}</Text>
                    <Text className="text-base text-green-700 font-bold">₹{product.price}</Text>
                  </Pressable>
                ))}
                {/* Fill empty columns if needed for alignment */}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View key={`empty-${i}`} className="flex-1 mx-2" />
                  ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Horizontal Cart Scroller */}
      {cart.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white py-2 border-t border-gray-200">
          <View className="flex-row items-center">
            <FlatList
              data={[...cart].reverse()}
              horizontal
              keyExtractor={(item) =>
                item.product_id?._id || item.product_id || Math.random().toString()
              }
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const product = getProductDetails(item);
                return (
                  <View className=" mb-6 mt-2 items-center w-28">
                    <Image
                      source={{
                        uri: product.image
                          ? product.image.startsWith("http")
                            ? product.image
                            : `https://corner-l14t.onrender.com${product.image}`
                          : "https://via.placeholder.com/60",
                      }}
                      className="w-16 h-16 rounded-lg mb-1"
                      resizeMode="contain"
                    />
                  </View>
                );
              }}
            />
            <TouchableOpacity
              className="rounded-xl px-8 bg-slate-100 py-4 items-center"
              onPress={async () => {
                // Place the order with current cart
                const token = await AsyncStorage.getItem("token");
                if (!token) return;
                const res = await fetch(`https://corner-l14t.onrender.com/api/orders/${storeId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ items: cart }),
                });
                // Optionally handle errors here
                router.push(`/stores/${storeId}/orders`);
              }}
            >
              <Ionicons name="cart" size={24} color="#000000" />
              <Text className="text-xs text-gray-500">Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}