import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PasswordUpdateSuccessModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      animationType="fade" // 'fade' đẹp hơn cho modal trung tâm
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Nền mờ, căn giữa nội dung */}
      <View className="flex-1 justify-center items-center bg-black/50">
        {/* Nội dung Modal (Dùng View thay vì Pressable) */}
        <View className="bg-white rounded-2xl p-6 items-center w-5/6 mx-auto">
          {/* Ảnh minh họa */}
          <Image
            source={require("../../assets/images/sucess_password.png")}
            className="w-full h-80" // Điều chỉnh kích thước
            resizeMode="contain"
          />

          {/* Text */}
          <Text className="text-2xl font-bold text-gray-900 mt-5">
            Thành công!
          </Text>
          <Text className="text-base text-gray-600 mt-2 text-center">
            Mật khẩu của bạn được cập nhật thành công!
          </Text>

          {/* Nút Back to Home */}
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg mt-6 w-full"
            onPress={onClose}
          >
            <Text className="text-white text-lg font-bold text-center">
              Quay về trang đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// (Giả sử bạn đã cài đặt @expo/vector-icons)
import { resetPasswordRequest } from "@/apis/auth.api";
import { ResetPasswordRequest } from "@/interface/user";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Màn hình chính ---
const EnterNewPasswordScreen = () => {
  // State cho ô mật khẩu MỚI
  const router = useRouter();
  const { email } = useLocalSearchParams();
  
  const [resetPassword, setRestPassword] = useState<ResetPasswordRequest>({
    email: email as string,
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const [error, setError] = useState({
    newPassword: "",
    newPasswordConfirm: "",
  });

  const { mutate: resetPasswordMutate } = useMutation({
    mutationKey: ["reset-password", resetPassword],
    mutationFn: async () => {
      const response = await resetPasswordRequest(resetPassword);
      return response.data;
    },
    onSuccess: () => {
      setSuccessModalVisible(true);
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.error) {
          const newErrorState = {
            newPassword: responseData.error.newPassword || "",
            newPasswordConfirm: responseData.error.newPasswordConfirm || "",
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
          "Cập nhật mật khẩu không thành công, vui lòng thử lại!"
        );
      }
    },
  });

  // Hàm xử lý khi bấm nút "Save"
  const handleSave = () => {
    // TODO: Thêm logic gọi API đổi mật khẩu ở đây
    resetPasswordMutate();
  };

  const handleBackToHome = () => {
    setSuccessModalVisible(false);
    router.push("/login");
  };

  const handleBackToLogin = () => {
    Alert.alert(
      "Quay lại đăng nhập",
      "Mọi thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn muốn quay lại?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => router.push("/login"),
        },
      ]
    );
  };

  const handleChange = (field: keyof ResetPasswordRequest, value: string) => {
    setRestPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <TouchableOpacity onPress={handleBackToLogin}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 2. Nội dung cuộn
           Dùng flex-1 để đẩy nút "Save" xuống */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            flexGrow: 1, // Đảm bảo scrollview có thể co giãn
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tiêu đề */}
          <Text className="text-3xl font-bold text-gray-900">
            Tạo mât khẩu mới
          </Text>
          <Text className="text-base text-gray-500 mt-2 mb-6">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </Text>

          {/* Ảnh minh họa */}
          <View className="items-center my-6">
            <Image
              source={require("../../assets/images/reset-password.png")}
              className="w-full h-80"
              resizeMode="contain"
            />
          </View>

          {/* --- Ô Mật khẩu Mới --- */}
          <View className="mb-5">
            <View className="absolute -top-2 left-3 bg-white z-10 px-1">
              <Text className="text-xs text-blue-600">Mật khẩu mới</Text>
            </View>
            <View className="flex-row items-center border border-blue-500 rounded-lg p-4">
              <TextInput
                value={resetPassword.newPassword}
                onChangeText={(text) => handleChange("newPassword", text)}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!isPasswordVisible} 
                className="flex-1 text-base"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Feather
                  name={isPasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {
              error.newPassword ? (
                <Text className="text-red-500 mt-2">{error.newPassword}</Text>
              ) : null
            }
          </View>

          {/* --- Ô Xác nhận Mật khẩu --- */}
          <View className="mb-5">
            <View className="absolute -top-2 left-3 bg-white z-10 px-1">
              <Text className="text-xs text-blue-600">
                Xác nhận mật khẩu mới
              </Text>
            </View>
            <View className="flex-row items-center border border-blue-500 rounded-lg p-4">
              <TextInput
                value={resetPassword.newPasswordConfirm}
                onChangeText={(text) =>
                  handleChange("newPasswordConfirm", text)
                }
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!isConfirmVisible} 
                className="flex-1 text-base"
              />
              <TouchableOpacity
                onPress={() => setIsConfirmVisible(!isConfirmVisible)}
              >
                <Feather
                  name={isConfirmVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {
              error.newPasswordConfirm ? (
                <Text className="text-red-500 mt-2">
                  {error.newPasswordConfirm}
                </Text>
              ) : null
            }
          </View>

          <View className="flex-1" />
        </ScrollView>

        <View className="p-5 border-t border-gray-100 bg-white">
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg"
            onPress={handleSave}
          >
            <Text className="text-white text-lg font-bold text-center">
              Cập nhật
            </Text>
          </TouchableOpacity>
        </View>

        <PasswordUpdateSuccessModal
          isVisible={isSuccessModalVisible}
          onClose={handleBackToHome}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterNewPasswordScreen;
