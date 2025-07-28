import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';

const cartData = [
  {
    id: '1',
    storeName: 'Walmart',
    logo: require('../../assets/images/walmart.png'),
    delivery: '1:35pm',
    products: [require('../../assets/products/apple.png')],
  },
  {
    id: '2',
    storeName: '7-Eleven',
    logo: require('../../assets/images/7-eleven.png'),
    delivery: '1:40pm',
    products: [
      require('../../assets/products/broccoli.png'),
      require('../../assets/products/carrot.png'),
      require('../../assets/products/chili-pepper.png'),
      require('../../assets/products/cucumber.png'),
      require('../../assets/products/milk.png'),
    ],
    extra: 5,
  },
  {
    id: '3',
    storeName: 'The Home Depot',
    logo: require('../../assets/images/jiffy.png'),
    delivery: '1:35pm',
    products: [require('../../assets/products/strawberry.png')],
  },
];

export default function Cart() {
  const [selectedTab, setSelectedTab] = useState<'Grocery' | 'Restaurants'>('Grocery');

  return (
    <View className="flex-1 bg-white pt-6">
      {/* Header */}
      <View className="px-4 pb-2">
        <Text className="text-xl font-bold">Your carts</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 mx-4">
        {['Grocery', 'Restaurants'].map(tab => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab as 'Grocery' | 'Restaurants')}
            className={`flex-1 pb-2 ${
              selectedTab === tab ? 'border-b-2 border-black' : ''
            }`}
          >
            <Text className={`text-center font-medium ${selectedTab === tab ? 'text-black' : 'text-gray-400'}`}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Cart List */}
      <ScrollView className="px-4 mt-3 mb-20">
        {cartData.map((store) => (
          <View key={store.id} className="mb-6">
            {/* Store Info */}
            <View className="flex-row items-center mb-2">
              <Image source={store.logo} className="w-8 h-8 mr-2" resizeMode="contain" />
              <View>
                <Text className="font-semibold">{store.storeName}</Text>
                <Text className="text-sm text-gray-600">Personal Cart</Text>
                <Text className="text-sm text-green-600">⚡ Delivery by {store.delivery}</Text>
              </View>
            </View>

            {/* Products */}
            <View className="flex-row items-center space-x-2 mb-2">
              {store.products.slice(0, 5).map((img, index) => (
                <Image key={index} source={img} className="w-8 h-8 rounded" />
              ))}
              {store.extra && (
                <View className="w-8 h-8 bg-gray-200 rounded items-center justify-center">
                  <Text className="text-xs">+{store.extra}</Text>
                </View>
              )}
            </View>

            {/* Continue Shopping Button */}
            <Pressable className="bg-green-700 py-2 rounded-full items-center">
              <Text className="text-white font-semibold">Continue shopping</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Close Button */}
      <View className="absolute bottom-4 w-full px-4">
        <Pressable className="bg-gray-100 py-3 rounded-full items-center">
          <Text className="text-black font-medium">Close</Text>
        </Pressable>
      </View>
    </View>
  );
}
