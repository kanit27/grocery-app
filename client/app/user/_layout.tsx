import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Ionicons } from "@expo/vector-icons";

export default function UserLayout() {
  return (
    <GluestackUIProvider>
      <StatusBar style="dark" />
      <Tabs screenOptions={{ tabBarActiveTintColor: "#2563eb" }}>
        <Tabs.Screen
          name="tabs/index"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/stores"
          options={{
            headerShown: false,
            title: "Stores",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="storefront-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/order"
          options={{
            headerShown: false,
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GluestackUIProvider>
  );
}