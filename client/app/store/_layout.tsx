import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Ionicons } from "@expo/vector-icons";

export default function StoreLayout() {
  return (
    <GluestackUIProvider>
      <StatusBar style="dark" />
      <Tabs screenOptions={{ tabBarActiveTintColor: "#16a34a" }}>
        <Tabs.Screen
          name="tabs/index"
          options={{
            headerShown: false,
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/orders"
          options={{
            headerShown: false,
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/inventory"
          options={{
            headerShown: false,
            title: "Inventory",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/settings"
          options={{
            headerShown: false,
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GluestackUIProvider>
  );
}
