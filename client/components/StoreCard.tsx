import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Text } from "@/components/ui/text";

const logoMap: Record<string, any> = {
  "assets/images/dmart.png": require("../assets/images/dmart.png"),
  "assets/images/7-eleven.png": require("../assets/images/7-eleven.png"),
  "assets/images/big-bazaar.png": require("../assets/images/big-bazaar.png"),
  "assets/images/spencers.png": require("../assets/images/spencers.png"),
  "assets/images/reliance.png": require("../assets/images/reliance.png"),
  "assets/images/walmart.png": require("../assets/images/walmart.png"),
  "assets/images/super-encorto.png": require("../assets/images/super-encorto.png"),
  "assets/images/jiffy.png": require("../assets/images/jiffy.png"),
};

function getLogoSource(logo: string) {
  if (logo.startsWith("http")) return { uri: logo };
  if (logoMap[logo]) return logoMap[logo];
  return require("../assets/images/placeholder-store.jpg");
}

interface Store {
  id: string;
  name: string;
  logo: string;
  rating?: number;
}

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  cardWidth?: number;
  fontFamily?: string;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onPress,
  cardWidth = 80,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      width: cardWidth,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      backgroundColor: "#fff",
      borderRadius: 12,
      paddingVertical: 10,
    }}
  >
    <Image
      source={getLogoSource(store.logo)}
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
        marginBottom: 6,
      }}
      resizeMode="contain"
    />
    <Text
      className="text-xs text-black text-center"
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {store.name}
    </Text>
  </TouchableOpacity>
);

export default StoreCard;