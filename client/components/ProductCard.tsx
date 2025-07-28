import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  category: string;
  availability: string;
  badges?: string[];
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  variant?: "list" | "grid";
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPress, 
  variant = "list" 
}) => {
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isOnSale 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  if (variant === "grid") {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-2xl shadow-sm p-4 m-2 w-44"
        activeOpacity={0.8}
      >
        {/* Product Image */}
        <View className="relative items-center mb-3">
          <Image
            source={{ uri: product.image }}
            className="w-24 h-24 rounded-xl"
            resizeMode="cover"
          />
          {isOnSale && (
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 py-1">
              <Text className="text-xs font-bold text-white">{discountPercent}% OFF</Text>
            </View>
          )}
          {product.availability !== "In Stock" && (
            <View className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl items-center justify-center">
              <Text className="text-white font-semibold text-xs">Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-xs text-gray-500 mb-2">{product.category}</Text>
          
          {/* Price Section */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-green-600">
                ₹{product.price}
              </Text>
              {isOnSale && (
                <Text className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </Text>
              )}
              <Text className="text-xs text-gray-500">/ {product.unit}</Text>
            </View>
            
            {product.availability === "In Stock" && (
              <TouchableOpacity className="bg-green-600 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-semibold">+ Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {product.badges.slice(0, 2).map((badge, index) => (
              <View key={index} className="bg-blue-100 px-2 py-1 rounded-full mr-1 mb-1">
                <Text className="text-xs font-medium text-blue-700">{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // List variant (default)
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row bg-white rounded-2xl shadow-sm p-4 mb-3 mx-3"
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View className="relative mr-4">
        <Image
          source={{ uri: product.image }}
          className="w-20 h-20 rounded-xl"
          resizeMode="cover"
        />
        {isOnSale && (
          <View className="absolute -top-2 -right-2 bg-red-500 rounded-full px-1.5 py-0.5">
            <Text className="text-xs font-bold text-white">{discountPercent}%</Text>
          </View>
        )}
        {product.availability !== "In Stock" && (
          <View className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl items-center justify-center">
            <Text className="text-white font-semibold text-xs">Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View className="flex-1 justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {product.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-1">{product.category}</Text>
          
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <View className="flex-row flex-wrap mb-2">
              {product.badges.slice(0, 2).map((badge, index) => (
                <View key={index} className="bg-blue-100 px-2 py-1 rounded-full mr-1 mb-1">
                  <Text className="text-xs font-medium text-blue-700">{badge}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Price and Add Button */}
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-green-600">
                ₹{product.price}
              </Text>
              {isOnSale && (
                <Text className="text-sm text-gray-400 line-through ml-2">
                  ₹{product.originalPrice}
                </Text>
              )}
            </View>
            <Text className="text-xs text-gray-500">per {product.unit}</Text>
          </View>
          
          {product.availability === "In Stock" ? (
            <TouchableOpacity className="bg-green-600 rounded-full px-4 py-2">
              <Text className="text-white font-semibold text-sm">+ Add</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-gray-300 rounded-full px-4 py-2">
              <Text className="text-gray-600 font-semibold text-sm">Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;