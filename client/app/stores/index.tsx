

import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import StoreCard from "../../components/StoreCard";


const StoreListScreen = () => {
  const router = useRouter();




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
