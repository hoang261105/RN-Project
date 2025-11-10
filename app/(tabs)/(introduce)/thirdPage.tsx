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
  uri: "https://mia.vn/media/uploads/blog-du-lich/the-five--villas-resort-quang-nam-resort-5-sao-ho-tro-dich-vu-quan-gia-cao-cap-9-1618028895.jpg",
};

export default function ThirdPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Ảnh trên cùng */}
      <View className="flex-[3] bg-black">
        <Image source={headerImage} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* Nội dung phía dưới */}
      <View
        className={`flex-[2] bg-white rounded-t-[30px] -mt-10 pt-6 px-6 ${
          Platform.OS === "ios" ? "shadow-lg shadow-black/10" : "elevation-10"
        }`}
      >
        {/* Dấu chấm phân trang */}
        <View className="flex-row justify-center items-center">
          <View className="w-[6px] h-[6px] bg-gray-300 rounded-full mx-1" />
          <View className="w-[6px] h-[6px] bg-gray-300 rounded-full mx-1" />
          <View className="w-5 h-[6px] bg-blue-600 rounded-full mx-1" />
        </View>

        {/* Tiêu đề */}
        <Text className="text-[28px] font-bold text-gray-900 text-center mt-8">
          Easy way to book hotels with us
        </Text>

        {/* Mô tả */}
        <Text className="text-[16px] text-gray-500 text-center mt-4 mb-10">
          It is a long established fact that a reader will be distracted by the
          readable content.
        </Text>

        {/* Nút Bắt đầu */}
        <View className="flex-1 items-center pb-8">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="flex-row justify-center items-center w-full bg-blue-600 rounded-lg px-6 py-3"
          >
            <Text className="text-white text-lg font-medium mr-2">Bắt đầu</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
