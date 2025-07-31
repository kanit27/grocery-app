import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import "../global.css"; // Only affects web, but OK to keep

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Cabin-Regular": require("../assets/fonts/CabinCondensed-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <GluestackUIProvider>
      <StatusBar style="dark" />
      <Slot />
    </GluestackUIProvider>
  );
}
