import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MenuRow from "@/components/item/MenuRow";
import MenuToggle from "@/components/item/MenuToggle";
import { useCurrentUser } from "@/hooks/useUser";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { data: userDetail, isLoading } = useCurrentUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải dữ liệu người dùng...</Text>
      </View>
    );
  }
  

  const handleProfile = () => {
    router.push({
      pathname: "/(tabs)/(client)/profile/update",
      params: {
        userId: userDetail?.id,
      },
    });
  };

  const handleLogOut = () => {
    Alert.alert("Xác nhận", "Bạn có muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert("Thành công", "Đăng xuất thành công!");
          router.push("/(tabs)/(auth)/login");
        },
      },
    ]);
  };

  return (
    // 1. Dùng View gốc, set màu nền là MÀU HEADER
    <View className="flex-1 bg-blue-600">
      <StatusBar barStyle="light-content" />

      {/* --- 1. Header (Chỉ dùng Safe Area cho 'top') --- */}
      <SafeAreaView edges={["top"]} className="bg-blue-600">
        {/* Header mới (không có avatar) */}
        <View className="px-5 pb-10 pt-4">
          <Text className="text-white text-xl font-bold text-center mb-4">
            Hồ sơ của tôi
          </Text>
          <View className="flex-row items-center">
            <Image
              source={{ uri: userDetail?.avatar }}
              className="w-16 h-16 rounded-full"
            />
            <View className="flex-1 ml-4">
              <Text className="text-white text-lg font-bold">
                {userDetail?.fullName}
              </Text>
              <Text className="text-blue-200 text-sm">{userDetail?.email}</Text>
            </View>
            <TouchableOpacity className="p-2 bg-white/30 rounded-full" onPress={handleProfile}>
              <Feather name="edit-3" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* --- 2. Nội dung chính (Phần màu trắng) --- */}
      <View className="flex-1 bg-white rounded-t-3xl">
        {/* ScrollView giờ là flex-1 để đẩy nút Logout xuống */}
        <ScrollView
          className="flex-1" // <-- THÊM DÒNG NÀY
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
        >
          {/* Các hàng menu */}
          <MenuRow
            iconLib={Feather}
            iconName="edit-3"
            text="Chỉnh sửa hồ sơ"
            onPress={handleProfile}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="lock-closed-outline"
            text="Thay đổi mật khẩu"
            onPress={() => console.log("Change Password")}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="card-outline"
            text="Phương thức thanh toán"
            onPress={() => console.log("Payment Method")}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="clipboard-outline"
            text="Các phòng đã đặt của tôi"
            onPress={() => router.push("/(tabs)/(client)/booking")}
          />
          <MenuToggle
            iconLib={Ionicons}
            iconName="eye-outline"
            text="Chế độ sáng/tối"
            value={isDarkMode}
            onValueChange={setIsDarkMode}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="shield-checkmark-outline"
            text="Chính sách riêng tư"
            onPress={() => console.log("Privacy Policy")}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="document-text-outline"
            text="Điều khoản và dịch vụ"
            onPress={() => console.log("Terms & Conditions")}
          />
        </ScrollView>
        {/* --- HẾT ScrollView --- */}

        {/* --- Nút Logout (BÊN NGOÀI ScrollView) --- */}
        <View className="px-5 pt-4">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-600 py-4 rounded-lg"
            onPress={handleLogOut}
          >
            <MaterialCommunityIcons name="logout" size={24} color="white" />
            <Text className="text-white text-lg font-bold text-center ml-2">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Thêm 1 SafeAreaView TRẮNG ở đây để che phần xanh ở đáy */}
        <SafeAreaView edges={["bottom"]} className="bg-white" />
      </View>
    </View>
  );
};

export default ProfileScreen;
