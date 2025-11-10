import { registerUser } from "@/apis/auth.api";
import { UserRequest } from "@/interface/user";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const [inputValue, setInputValue] = useState<UserRequest>({
    fullName: "",
    email: "",
    password: "",
    gender: true,
    phoneNumber: "",
    dateOfBirth: new Date(),
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: registerUser,
    mutationKey: ["registerUser"],
    onSuccess: () => {
      Alert.alert("Thành công!", "Đăng ký thành công!");
      router.push("/(tabs)/(auth)/login");
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.error) {
          const newErrorState = {
            fullName: responseData.error.fullName || "",
            email: responseData.error.email || "",
            password: responseData.error.password || "",
            phoneNumber: responseData.error.phoneNumber || "",
          };

          setError(newErrorState);
        } else {
          const message =
            responseData.message || "Đã xảy ra lỗi, vui lòng thử lại!";
          Alert.alert("Thất bại!", message);
        }
      } else {
        Alert.alert(
          "Lỗi mạng!",
          error.message || "Không thể kết nối đến máy chủ."
        );
      }
    },
  });

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      setInputValue({ ...inputValue, dateOfBirth: selectedDate });
    }
  };

  const handleSubmit = () => {
    setError({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });
    registerMutation(inputValue);
  };

  const handleChange = (field: string, value: any) => {
    setInputValue({
      ...inputValue,
      [field]: value,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View className="items-center mb-5 px-[90px] w-[100px] h-[100px] bg-[#E6F0FF] justify-center self-start rounded-xl overflow-hidden">
              <Image
                source={require("../../assets/images/live-green.png")}
              />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-[#000] mb-2">
              Register Now!
            </Text>
            <Text className="text-[#888] text-base mb-8">
              Enter your information below
            </Text>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Họ tên</Text>
              <TextInput
                placeholder="Curtis Weaver"
                onChangeText={(text) => handleChange("fullName", text)}
                placeholderTextColor="#000"
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.fullName && (
                <Text className="text-red-500 text-md mt-2">
                  {error.fullName}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Email</Text>
              <TextInput
                placeholder="curtis.weaver@example.com"
                onChangeText={(text) => handleChange("email", text)}
                placeholderTextColor="#000"
                keyboardType="email-address"
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.email && (
                <Text className="text-red-500 text-md mt-2">{error.email}</Text>
              )}
            </View>

            {/* Mobile */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Số điện thoại</Text>
              <TextInput
                placeholder="(209) 555-0104"
                onChangeText={(text) => handleChange("phoneNumber", text)}
                keyboardType="phone-pad"
                placeholderTextColor="#000"
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.phoneNumber && (
                <Text className="text-red-500 text-md mt-2">
                  {error.phoneNumber}
                </Text>
              )}
            </View>

            {/* Date of Birth */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Ngày sinh</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between border border-[#5B7FFF] rounded-xl px-4 py-3"
              >
                <Text className="text-base text-[#000]">
                  {date.toLocaleDateString("vi-VN")}
                </Text>
                <Feather name="calendar" size={20} color="#5B7FFF" />
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Mật khẩu */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Mật khẩu</Text>
              <TextInput
                placeholder="Mật khẩu"
                onChangeText={(text) => handleChange("password", text)}
                placeholderTextColor="#000"
                secureTextEntry={true}
                value={inputValue.password}
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.password && (
                <Text className="text-red-500 text-md mt-2">
                  {error.password}
                </Text>
              )}
            </View>

            {/* Gender */}
            <View className="mb-6">
              <Text className="text-[#000] font-semibold mb-2">Gender</Text>
              <View className="flex-row items-center gap-3 space-x-6">
                {/* Male */}
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => setInputValue({ ...inputValue, gender: true })}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      inputValue.gender ? "border-[#5B7FFF]" : "border-gray-400"
                    } items-center justify-center`}
                  >
                    {inputValue.gender && (
                      <View className="w-2.5 h-2.5 rounded-full bg-[#5B7FFF]" />
                    )}
                  </View>
                  <Text className="ml-2 text-[#000] text-base">Nam</Text>
                </TouchableOpacity>

                {/* Female */}
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() =>
                    setInputValue({ ...inputValue, gender: false })
                  }
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      inputValue.gender === false
                        ? "border-[#5B7FFF]"
                        : "border-gray-400"
                    } items-center justify-center`}
                  >
                    {inputValue.gender === false && (
                      <View className="w-2.5 h-2.5 rounded-full bg-[#5B7FFF]" />
                    )}
                  </View>
                  <Text className="ml-2 text-[#000] text-base">Nữ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-[#5B7FFF] py-4 rounded-2xl items-center mb-6 ${
                isPending ? "opacity-70" : ""
              }`}
              onPress={!isPending ? handleSubmit : undefined}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Đăng ký
                </Text>
              )}
            </TouchableOpacity>

            {/* Login link */}
            <View className="flex-row justify-center">
              <Text className="text-[#888] text-base">Đã có tài khoản? </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/(auth)/login")}
              >
                <Text className="text-[#5B7FFF] font-semibold text-base">
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
