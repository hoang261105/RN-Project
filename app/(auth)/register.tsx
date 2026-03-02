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
    dateOfBirth: "",
  });

  const validateField = (field: string, value: any) => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Họ tên không được để trống!";
        if (value.trim().length < 3) return "Họ tên phải ít nhất 3 ký tự!";
        return "";
      case "email":
        if (!value.trim()) return "Email không được để trống!";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email không hợp lệ!";
        return "";
      case "phoneNumber":
        if (!value.trim()) return "Số điện thoại không được để trống!";
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(value)) return "Số điện thoại không hợp lệ!";
        return "";
      case "password":
        if (!value.trim()) return "Mật khẩu không được để trống!";
        if (value.length < 6) return "Mật khẩu phải ít nhất 6 ký tự!";
        return "";
      case "dateOfBirth":
        if (!value) return "Ngày sinh không được để trống!";
        if (value > new Date()) return "Ngày sinh không được lớn hơn hôm nay!";
        return "";
      default:
        return "";
    }
  };

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: registerUser,
    mutationKey: ["registerUser"],
    onSuccess: () => {
      Alert.alert("Thành công!", "Đăng ký thành công!");
      router.push("/(auth)/login");
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.error) {
          setError({
            fullName: responseData.error.fullName || "",
            email: responseData.error.email || "",
            password: responseData.error.password || "",
            phoneNumber: responseData.error.phoneNumber || "",
            dateOfBirth: "",
          });
        } else {
          Alert.alert("Thất bại!", responseData.message || "Đã xảy ra lỗi!");
        }
      } else {
        Alert.alert("Lỗi mạng!", error.message || "Không thể kết nối đến máy chủ.");
      }
    },
  });

  const handleChange = (field: string, value: any) => {
    setInputValue(prev => ({ ...prev, [field]: value }));
    const errorMessage = validateField(field, value);
    setError(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      handleChange("dateOfBirth", selectedDate);
    }
  };

  const handleSubmit = () => {
    const fullNameError = validateField("fullName", inputValue.fullName);
    const emailError = validateField("email", inputValue.email);
    const phoneError = validateField("phoneNumber", inputValue.phoneNumber);
    const passwordError = validateField("password", inputValue.password);
    const dobError = validateField("dateOfBirth", inputValue.dateOfBirth);

    setError({
      fullName: fullNameError,
      email: emailError,
      phoneNumber: phoneError,
      password: passwordError,
      dateOfBirth: dobError,
    });

    if (fullNameError || emailError || phoneError || passwordError || dobError) return;

    registerMutation(inputValue);
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
              Đăng ký tài khoản
            </Text>
            <Text className="text-[#888] text-base mb-8">
              Vui lòng nhập các thông tin của bạn.
            </Text>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Họ tên</Text>
              <TextInput
                placeholder="Nhập họ tên"
                value={inputValue.fullName}
                onChangeText={text => handleChange("fullName", text)}
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.fullName ? <Text className="text-red-500 mt-1">{error.fullName}</Text> : null}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Email</Text>
              <TextInput
                placeholder="Nhập email"
                value={inputValue.email}
                onChangeText={text => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.email ? <Text className="text-red-500 mt-1">{error.email}</Text> : null}
            </View>

            {/* Mobile */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Số điện thoại</Text>
              <TextInput
                placeholder="Nhập số điện thoại"
                value={inputValue.phoneNumber}
                onChangeText={text => handleChange("phoneNumber", text)}
                keyboardType="phone-pad"
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.phoneNumber ? <Text className="text-red-500 mt-1">{error.phoneNumber}</Text> : null}
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
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              {error.dateOfBirth ? <Text className="text-red-500 mt-1">{error.dateOfBirth}</Text> : null}
            </View>

            {/* Mật khẩu */}
            <View className="mb-4">
              <Text className="text-[#5B7FFF] text-sm mb-1">Mật khẩu</Text>
              <TextInput
                placeholder="Nhập mật khẩu"
                value={inputValue.password}
                onChangeText={text => handleChange("password", text)}
                secureTextEntry
                className="border border-[#5B7FFF] rounded-xl px-4 py-3 text-base text-[#000]"
              />
              {error.password ? <Text className="text-red-500 mt-1">{error.password}</Text> : null}
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
                onPress={() => router.push("/(auth)/login")}
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
