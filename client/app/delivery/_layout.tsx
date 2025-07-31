import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Ionicons } from "@expo/vector-icons";

export default function DeliveryLayout() {
  return (
    <GluestackUIProvider>
      <StatusBar style="dark" />
      <Tabs screenOptions={{ tabBarActiveTintColor: "#ea580c" }}>
        <Tabs.Screen
          name="tabs/index"
          options={{
            title: "My Deliveries",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bicycle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/earnings"
          options={{
            title: "My Earnings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/settings"
          options={{
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
