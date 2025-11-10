import { ProvinceResponse } from "@/interface/province";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProvinceItem({pro, onPress}: {pro: ProvinceResponse, onPress: () => void}) {
  return (
    <TouchableOpacity
      className="items-center mr-5"
      onPress={onPress}
    >
      <View className="w-16 h-16 rounded-2xl bg-white shadow p-2">
        <Image source={{ uri: pro?.imageURL }} className="w-full h-full" />
      </View>
      <Text className="mt-2 text-sm font-semibold text-gray-700">
        {pro?.provinceName}
      </Text>
    </TouchableOpacity>
  );
}
