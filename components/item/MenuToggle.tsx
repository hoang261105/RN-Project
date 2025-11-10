import React from "react";
import { Switch, Text, View } from "react-native";

export default function MenuToggle({
  iconLib,
  iconName,
  text,
  value,
  onValueChange,
}: {
  iconLib: any;
  iconName: string;
  text: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}){
  const IconComponent = iconLib;
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <IconComponent name={iconName} size={24} color="#4B5563" />
        <Text className="text-base text-gray-800 ml-4">{text}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#34C759" }} // Màu giống iOS
        thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};