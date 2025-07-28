

import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import StoreCard from "../../components/StoreCard";
import storesData from "../../assets/data/stores_with_products.json";

type Store = typeof storesData[number];

const StoreListScreen = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    setStores(storesData);
  }, []);

  const handleStorePress = (storeId: string) => {
    router.push(`/stores/${storeId}`);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-xl font-bold mb-4">Nearby & Franchise Stores</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            onPress={() => handleStorePress(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default StoreListScreen;
