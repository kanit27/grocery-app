import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function Layout() {
  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="dark" />
      <Slot />
    </GluestackUIProvider>
  );
}