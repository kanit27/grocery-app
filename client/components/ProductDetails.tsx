import React, { useState } from "react";
import { View, Text, Image, Button, ScrollView } from "react-native";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  description?: string;
  availability: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Props {
  product: Product;
  store: Store;
}

const ProductDetails: React.FC<Props> = ({ product, store }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <ScrollView className="p-4">
      <Image
        source={{ uri: product.image }}
        className="w-full h-60 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-2xl font-bold mb-1">{product.name}</Text>
      <Text className="text-gray-500 text-sm mb-2">{product.category}</Text>
      <Text className="text-green-700 text-lg font-semibold mb-2">
        ₹{product.price} / {product.unit}
      </Text>
      <Text className={`mb-3 ${product.availability === "In Stock" ? "text-green-600" : "text-red-600"}`}>
        {product.availability}
      </Text>
      <View className="flex-row items-center mb-4">
        <Button title="-" onPress={() => setQuantity(q => Math.max(1, q - 1))} />
        <Text className="mx-4 text-lg">{quantity}</Text>
        <Button title="+" onPress={() => setQuantity(q => q + 1)} />
      </View>
      <Button title="Add to Cart" onPress={() => alert(`Added ${quantity} to cart!`)} />
      <View className="mt-4">
        <Text className="font-semibold">Sold by:</Text>
        <Text className="text-gray-700">{store.name}</Text>
        <Text className="text-gray-500 text-sm">{store.address}</Text>
      </View>
      {product.description && (
        <View className="mt-4">
          <Text className="font-semibold mb-1">Description</Text>
          <Text className="text-gray-600">{product.description}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProductDetails;