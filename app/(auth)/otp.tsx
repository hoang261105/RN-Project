import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image, // Dùng Pressable để focus
  KeyboardAvoidingView,
  Platform, // Cần TextInput
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// (Giả sử bạn đã cài đặt @expo/vector-icons)
import { verifyOtp } from "@/apis/auth.api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Màn hình chính ---
const EnterOTPScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60); // State cho đếm ngược
  const [errorOtp, setErrorOtp] = useState("");
  const textInputRef = useRef<TextInput>(null); // Ref để focus vào TextInput ẩn
  const MAX_LENGTH = 6; // Độ dài mã OTP

  // Logic đếm ngược
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [timer]);

  const handleResendCode = () => {
    setTimer(60);
    setCode("");
  };

  // Hàm focus vào TextInput khi bấm vào ô
  const handleOnPress = () => {
    textInputRef.current?.focus();
  };

  const formattedTimer = `00:${timer < 10 ? "0" : ""}${timer}s`;

  const { mutate: verifyOtpMutate } = useMutation({
    mutationFn: async () => {
      const response = await verifyOtp(email as string, code);
      return response.data;
    },
    mutationKey: ["verify-otp", email, code],
    onSuccess: () => {
      router.replace({
        pathname: "/(auth)/reset-password",
        params: {
          email: email,
        },
      });
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.error) {
          const newErrorState = responseData.error.errorOtp;

          setErrorOtp(newErrorState);
        } else {
          const message =
            responseData.message || "Đã xảy ra lỗi, vui lòng thử lại!";
          Alert.alert("Thất bại!", message);
        }
      } else {
        Alert.alert("Thất bại!", "Lỗi mạng, vui lòng thử lại!");
      }
    },
  });

  const handleVerifyOtp = () => {
    setErrorOtp("");
    verifyOtpMutate();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* 1. Header (Chỉ có nút back) */}
        <View className="p-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 2. Nội dung cuộn
           Dùng flex-1 để đẩy nút "Verify" xuống */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            flexGrow: 1, // Đảm bảo scrollview có thể co giãn
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tiêu đề */}
          <Text className="text-3xl font-bold text-gray-900">Nhập mã OTP</Text>
          <Text className="text-base text-gray-500 mt-2">
            Mã OTP đã gửi về cho gmail {email}
          </Text>

          {/* Ô nhập OTP */}
          <Pressable onPress={handleOnPress} className="mt-8">
            <View className="flex-row justify-between">
              {/* Tạo 4 ô từ một mảng */}
              {[...Array(MAX_LENGTH)].map((_, index) => {
                const digit = code[index] || "";

                // Ô đang được focus là ô tiếp theo sẽ được nhập
                const isFocused = code.length === index;

                return (
                  <View
                    key={index}
                    className={`w-16 h-16 rounded-lg border items-center justify-center ${
                      isFocused ? "border-blue-600 border-2" : "border-gray-300"
                    }`}
                  >
                    <Text className="text-3xl font-semibold text-gray-900">
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </View>
            {
              errorOtp && <Text className="text-red-500 mt-2">{errorOtp}</Text>
            }
          </Pressable>

          {/* TextInput ẩn (Nơi thực sự xử lý nhập liệu) */}
          <TextInput
            ref={textInputRef}
            value={code}
            onChangeText={setCode}
            maxLength={MAX_LENGTH}
            keyboardType="number-pad"
            textContentType="oneTimeCode" // Tự động gợi ý OTP
            // Ẩn TextInput một cách thông minh
            className="absolute w-px h-px -m-px p-0 border-0 overflow-hidden"
            style={{ clip: "rect(0, 0, 0, 0)" }}
          />

          {/* Đếm ngược */}
          <View className="items-end mt-4">
            {timer > 0 ? (
              <Text className="text-base text-gray-500">
                Gửi lại mã sau{" "}
                <Text className="text-blue-600 font-medium">
                  {formattedTimer}
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode}>
                <Text className="text-base text-blue-600 font-semibold">
                  Gửi lại mã OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Ảnh minh họa */}
          <View className="items-center my-8">
            <Image
              source={require("../../assets/images/Enter-OTP-cuate-1024x1024.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Spacer để đẩy nút xuống nếu nội dung ngắn */}
          <View className="flex-1" />
        </ScrollView>
        {/* Hết phần cuộn */}

        {/* 3. Nút Verify (Fixed ở dưới đáy) */}
        <View className="p-5 border-t border-gray-100 bg-white">
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg"
            onPress={handleVerifyOtp}
          >
            <Text className="text-white text-lg font-bold text-center">
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterOTPScreen;
