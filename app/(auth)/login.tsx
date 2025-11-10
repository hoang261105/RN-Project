import { loginUser } from "@/apis/auth.api";
import { UserLogin } from "@/interface/user";
import { Feather, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [secureEntry, setSecureEntry] = useState(true);
  const router = useRouter();

  const [inputValue, setInputValue] = useState<UserLogin>({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: loginUser,
    mutationKey: ["loginUser"],
    onSuccess: async (res) => {
      Alert.alert("Thành công", "Đăng nhập thành công!");
      await AsyncStorage.setItem(
        "accessToken",
        JSON.stringify(res.data.accessToken)
      );
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.id,
          fullName: res.data.fullName,
          email: res.data.email,
          avatar: res.data.avatar,
          phoneNumber: res.data.phoneNumber,
        })
      );
      router.push("/(tabs)/(client)/home");
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.error) {
          const newErrorState = {
            email: responseData.error.email || "",
            password: responseData.error.password || ""
          };

          setError(newErrorState);
        } else {
          const message =
            responseData.message || "Đã xảy ra lỗi, vui lòng thử lại!";
          Alert.alert("Thất bại!", message);
        }
      } else {
        Alert.alert(
          "Thất bại!",
          "Email hoặc mật khẩu không đúng."
        );
      }
    },
  });

  const handleLogin = () => {
    setError({
      email: "",
      password: ""
    })
    loginMutation(inputValue);
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
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-5 px-[90px] w-[100px] h-[100px] bg-[#E6F0FF] justify-center self-start rounded-xl overflow-hidden">
            <Image source={require("../../assets/images/live-green.png")} />
          </View>

          {/* Title */}
          <Text className="text-[28px] font-bold text-[#333] mb-2">
            Let's get you Login!
          </Text>
          <Text className="text-base text-[#888] mb-6">
            Enter your information below
          </Text>

          {/* Social Login */}
          <View className="flex-row justify-between mb-7">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3.5 rounded-lg border border-[#E0E0E0] mx-2">
              <FontAwesome name="google" size={22} color="#DB4437" />
              <Text className="ml-2 text-[16px] font-semibold text-[#555]">
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3.5 rounded-lg border border-[#E0E0E0] mx-2">
              <FontAwesome name="facebook-f" size={22} color="#4267B2" />
              <Text className="ml-2 text-[16px] font-semibold text-[#555]">
                Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center justify-center mb-6">
            <View className="flex-1 h-[1px] bg-[#E0E0E0]" />
            <Text className="mx-3 text-sm text-[#AAA]">Hoặc đăng nhập với</Text>
            <View className="flex-1 h-[1px] bg-[#E0E0E0]" />
          </View>

          {/* Email */}
          <View className="flex-row items-center bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg px-3">
            <Feather name="mail" size={20} color="#888" />
            <TextInput
              className="flex-1 h-[50px] text-[16px] text-[#333] ml-2"
              placeholder="Nhập email"
              placeholderTextColor="#AAA"
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              value={inputValue.email}
            />
          </View>
          {error.email && (
            <Text className="text-red-500 text-md mt-2">{error.email}</Text>
          )}

          {/* Password */}
          <View className="flex-row items-center bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg px-3 mt-2">
            <Feather name="lock" size={20} color="#888" />
            <TextInput
              className="flex-1 h-[50px] text-[16px] text-[#333] ml-2"
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#AAA"
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={secureEntry}
              value={inputValue.password}
            />
            <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
              <Feather
                name={secureEntry ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {error.password && (
            <Text className="text-red-500 text-md mt-2">{error.password}</Text>
          )}

          {/* Forgot password */}
          <TouchableOpacity>
            <Text className="text-sm text-[#4285F4] text-right mb-6">
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            className={`py-4 rounded-lg items-center mb-6 border border-white ${
              isPending ? "bg-gray-400" : "bg-[#2772db]"
            }`}
            onPress={!isPending ? handleLogin : undefined} // Không cho bấm khi đang loading
            disabled={isPending}
          >
            {isPending ? (
              <Text className="text-lg font-semibold text-white">
                Đang đăng nhập...
              </Text>
            ) : (
              <Text className="text-lg font-semibold text-white">
                Đăng nhập
              </Text>
            )}
          </TouchableOpacity>

          {/* Register */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-sm text-[#888]">Chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/(auth)/register")}
            >
              <Text className="text-sm text-[#4285F4] font-bold">
                Đăng ký tại đây
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
