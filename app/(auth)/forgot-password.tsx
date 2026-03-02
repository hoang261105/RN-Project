import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// (Giả sử bạn đã cài đặt @expo/vector-icons)
import { forgotPassword } from "@/apis/auth.api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Component con: Thẻ Tùy chọn (Tái sử dụng) ---
const OptionCard = ({
  iconLib,
  iconName,
  title,
  subtitle,
  isSelected,
  onPress,
}: {
  iconLib: any;
  iconName: string;
  title: string;
  subtitle: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const IconComponent = iconLib;

  const containerStyle = isSelected
    ? "border-blue-600 bg-blue-50"
    : "border-gray-200 bg-white";
  const iconContainerStyle = isSelected ? "bg-blue-600" : "bg-gray-100";
  const iconColor = isSelected ? "white" : "#4B5563";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 border rounded-lg ${containerStyle}`}
    >
      {/* Icon */}
      <View
        className={`w-12 h-12 rounded-lg items-center justify-center ${iconContainerStyle}`}
      >
        <IconComponent name={iconName} size={24} color={iconColor} />
      </View>

      {/* Text */}
      <View className="ml-4">
        <Text className="text-sm text-gray-500">{title || ""}</Text>
        <Text className="text-base font-bold text-gray-900 mt-1">
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Màn hình chính ---
const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState("sms"); // 'sms' hoặc 'email'

  const { mutate: forgotPasswordMutate } = useMutation({
    mutationFn: async () => {
      const response = await forgotPassword(email as string);
      return response.data;
    },
    mutationKey: ["forgot-password", email],
    onSuccess: () => {
      router.push({
        pathname: "/(auth)/otp",
        params: {
          email: email,
        },
      });
    },
    onError: (error) => {
      console.error("Error sending forgot password OTP:", error);
    },
  });

  const handleNext = () => {
    if (selectedMethod === "email") {
      forgotPasswordMutate();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* 1. Header (Chỉ có nút back) */}
      <View className="p-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* View này chứa nội dung chính (flex-1)
        để đẩy nút "Continue" xuống dưới cùng 
      */}
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {/* Tiêu đề */}
          <Text className="text-3xl font-bold text-gray-900">
            Quên mật khẩu
          </Text>
          <Text className="text-base text-gray-500 mt-2 mb-6">
            Chọn thông tin liên hệ mà chúng tôi sẽ sử dụng để đặt lại mật khẩu
            của bạn
          </Text>
          {/* Ảnh minh họa */}
          <View className="items-center my-6">
            <Image
              source={require("../../assets/images/forgot_password_cuate.png")}
              className="w-full h-80"
              resizeMode="contain"
            />
          </View>
          {/* Các tùy chọn */}
          <OptionCard
            iconLib={Ionicons}
            iconName="chatbubble-ellipses-outline"
            title="Gửi OTP qua SMS"
            subtitle={<Text>0903599038</Text>}
            isSelected={selectedMethod === "sms"}
            onPress={() => setSelectedMethod("sms")}
          />
          <View className="h-4" /> {/* Khoảng cách */}
          <OptionCard
            iconLib={Feather}
            iconName="mail"
            title="Gửi OTP qua Email"
            subtitle={<Text>{typeof email === "string" ? email : ""}</Text>}
            isSelected={selectedMethod === "email"}
            onPress={() => setSelectedMethod("email")}
          />
        </ScrollView>
      </View>

      {/* 3. Nút Continue (Fixed ở dưới đáy) */}
      <View className="p-5 border-t border-gray-100 bg-white">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg"
          onPress={handleNext}
        >
          <Text className="text-white text-lg font-bold text-center">
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default ForgotPasswordScreen;
