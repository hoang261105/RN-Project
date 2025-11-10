import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MenuRow = ({
  iconLib,
  iconName,
  text,
  onPress,
}: {
  iconLib: any;
  iconName: string;
  text: string;
  onPress: () => void;
}) => {
  const IconComponent = iconLib;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-5 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <IconComponent name={iconName} size={24} color="#4B5563" />
        <Text className="text-base text-gray-800 ml-4">{text}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default MenuRow;