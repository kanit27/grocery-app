import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getTravelTime } from "../../../utils/time";
import { getDistance } from "../../../utils/distance"; 

export default function OrdersScreen() {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`https://corner-l14t.onrender.com/api/orders/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
    };
    const fetchCart = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`https://corner-l14t.onrender.com/api/cart/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
    };
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch("https://corner-l14t.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };
    const fetchStore = async () => {
      const res = await fetch(`https://corner-l14t.onrender.com/api/store/stores/${storeId}`);
      const data = await res.json();
      setStore(data);
    };
    setLoading(true);
    Promise.all([fetchOrders(), fetchCart(), fetchUser(), fetchStore()]).finally(() =>
      setLoading(false)
    );
  }, [storeId]);

  // Calculate estimated delivery time using getTravelTime
  let estimatedDeliveryTime = 30;
  if (
    user?.location?.lat &&
    user?.location?.lng &&
    store?.location?.lat &&
    store?.location?.lng
  ) {
    const distance = Math.abs(
      getDistance(
        user.location.lat,
        user.location.lng,
        store.location.lat,
        store.location.lng
      )
    );
    estimatedDeliveryTime = getTravelTime(distance);
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`https://corner-l14t.onrender.com/api/orders/${storeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart, estimatedDeliveryTime }),
    });
    const data = await res.json();
    setPlacing(false);
    if (res.ok) {
      Alert.alert(
        "Order Placed!",
        `Your order has been placed.\nEstimated delivery: ${estimatedDeliveryTime} min`
      );
      setOrders([data, ...orders]);
      setCart([]);
      await AsyncStorage.removeItem(`cart_${storeId}`);
    } else {
      Alert.alert("Error", data.message || "Could not place order.");
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`https://corner-l14t.onrender.com/api/orders/${storeId}/confirm/${orderId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold text-center mt-6 mb-4">Your Orders</Text>
      {orders.length === 0 ? (
        <Text className="text-center text-gray-500 mt-8">No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View className="mx-4 my-2 p-4 border-[1px] border-gray-100 rounded-xl">
              <Text className="font-bold text-gray-900 mb-1">
                Order #{item._id.slice(-6).toUpperCase()}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                Placed: {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                Status: {item.status}
              </Text>
              <Text className="text-xs text-gray-500 mb-1">
                Delivery in: {item.estimatedDeliveryTime || estimatedDeliveryTime} min
              </Text>
              <FlatList
                data={item.items}
                keyExtractor={(i) => i.product_id?._id || i.product_id}
                horizontal
                renderItem={({ item: prod }) => (
                  <View className="mr-4 items-center w-20">
                    <Image
                      source={{
                        uri: prod.product_id?.image
                          ? prod.product_id.image.startsWith("http")
                            ? prod.product_id.image
                            : `https://corner-l14t.onrender.com${prod.product_id.image}`
                          : "https://via.placeholder.com/60",
                      }}
                      className="w-10 h-10 rounded-lg mb-1 "
                      resizeMode="contain"
                    />
                    <Text className="text-xs text-gray-900 text-center" numberOfLines={1}>
                      {prod.product_id?.name}
                    </Text>
                    <Text className="text-xs text-gray-500">x{prod.quantity}</Text>
                  </View>
                )}
              />
              {index === 0 && (item.status === "Placed" || item.status === "Pending") && (
                <TouchableOpacity
                  className="mt-4 bg-green-600 rounded-xl py-2 px-4 items-center"
                  onPress={() => handleConfirmOrder(item._id)}
                >
                  <Text className="text-white font-bold text-lg">Confirm / Place Order</Text>
                </TouchableOpacity>
              )}
              {item.status === "Confirmed" && (
                <Text className="text-green-700 font-bold mt-2">
                  Order Confirmed! Delivery in {item.estimatedDeliveryTime || estimatedDeliveryTime} min
                </Text>
              )}
            </View>
          )}
        />
      )}

      {cart.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-8 left-8 right-8 bg-green-600 rounded-xl py-3 items-center"
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          <Text className="text-white font-bold text-lg">
            {placing ? "Placing Order..." : "Place Order"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
