import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const headerImage = {
  uri: "https://ik.imagekit.io/tvlk/blog/2022/11/resort-5-sao-phu-quoc-1.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2",
};

export default function SecondPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* 1️⃣ Ảnh trên cùng */}
      <View className="flex-[3] bg-black">
        <Image source={headerImage} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* 2️⃣ Phần nội dung */}
      <View
        className={`flex-[2] bg-white rounded-t-[30px] -mt-10 pt-6 px-6 ${
          Platform.OS === "ios" ? "shadow-lg shadow-black/10" : "elevation-10"
        }`}
      >
        {/* Dấu chấm phân trang */}
        <View className="flex-row justify-center items-center">
          <View className="w-[6px] h-[6px] bg-gray-300 rounded-full mx-1" />
          <View className="w-5 h-[6px] bg-blue-600 rounded-full mx-1" />
          <View className="w-[6px] h-[6px] bg-gray-300 rounded-full mx-1" />
        </View>

        {/* Tiêu đề */}
        <Text className="text-[28px] font-bold text-gray-900 text-center mt-8">
          Discover and find your perfect healing place
        </Text>

        {/* Mô tả */}
        <Text className="text-[16px] text-gray-500 text-center mt-4 mb-10">
          It is a long established fact that a reader will be distracted by the
          readable content.
        </Text>

        {/* Thanh nút */}
        <View className="flex-row justify-between items-center pb-8">
          <TouchableOpacity onPress={() => router.push("/(tabs)/(auth)/login")}>
            <Text className="text-lg text-gray-500 font-medium">Bỏ qua</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/(introduce)/thirdPage")}
            className="flex-row items-center bg-blue-600 rounded-lg px-6 py-3"
          >
            <Text className="text-white text-lg font-medium mr-2">Tiếp</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
