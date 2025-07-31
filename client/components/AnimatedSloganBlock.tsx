import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ICON_SIZE = 40;
const RADIUS = 170; // how far icons are from center
const GAP_Y = 60; // vertical spacing between text and icons

// Center coordinates
const centerX = screenWidth / 2 - ICON_SIZE / 2;
const centerY = screenHeight * 0.35;

// Split icons: 4 top, 3 bottom (angles in degrees)
const iconConfigs = [
  // Top half icons
  { source: require("@/assets/icons/icon1.png"), angle: -115, ring: "top" },
  { source: require("@/assets/icons/icon2.png"), angle: -60, ring: "top" },
  { source: require("@/assets/icons/icon3.png"), angle: -15, ring: "top" },
  { source: require("@/assets/icons/icon7.png"), angle: 195, ring: "top" },
  // Bottom half icons
  { source: require("@/assets/icons/icon5.png"), angle: 90, ring: "bottom" },
  { source: require("@/assets/icons/icon4.png"), angle: 30, ring: "bottom" },
  { source: require("@/assets/icons/icon6.png"), angle: 160, ring: "bottom" },
];

// Animated icon component
const FlyingIcon = ({ source, finalX, finalY }: any) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    x.value = withTiming(finalX, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    y.value = withTiming(finalY, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, { duration: 900 });
  }, []);

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[
        {
          width: ICON_SIZE,
          height: ICON_SIZE,
          position: "absolute",
          top: centerY,
          left: centerX,
        },
        animStyle,
      ]}
    />
  );
};

export const AnimatedSloganBlock = ({ slogan }: { slogan: string }) => {
  const scale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);

  const textAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: textOpacity.value,
  }));

  useEffect(() => {
    // Start text animation immediately
    scale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });
    textOpacity.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  return (
    <View className="w-full h-[75vh] relative items-center justify-center">
      {/* Animated ring icons */}
      {iconConfigs.map((icon, idx) => {
        const angleRad = (icon.angle * Math.PI) / 180;
        const offsetX = RADIUS * Math.cos(angleRad);
        const offsetY =
          RADIUS * Math.sin(angleRad) + (icon.ring === "top" ? -GAP_Y : GAP_Y);

        return (
          <FlyingIcon
            key={idx}
            source={icon.source}
            finalX={offsetX}
            finalY={offsetY}
          />
        );
      })}

      {/* Center animated text */}
      <Animated.Text
        style={textAnim}
        className="w-[80%] text-center text-3xl font-semibold text-black z-10"
      >
        {slogan}
      </Animated.Text>
    </View>
  );
};
