import { updateUser } from "@/apis/auth.api";
import { useCurrentUser } from "@/hooks/useUser";
import { UserDetail } from "@/interface/user";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RadioButton = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center mb-3">
    <View
      className={`w-6 h-6 rounded-full border-2 ${
        selected ? "border-blue-600" : "border-gray-300"
      } items-center justify-center`}
    >
      {selected && <View className="w-3 h-3 rounded-full bg-blue-600" />}
    </View>
    <Text className="ml-3 text-base text-gray-800">{label}</Text>
  </TouchableOpacity>
);

const EditProfileScreen = () => {
  const queryClient = useQueryClient();
  const { data: userDetail, isLoading } = useCurrentUser();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "livePhoto" | "pairedVideo" | undefined
  >("image");
  const [inputValue, setInputValue] = useState<UserDetail>({
    fullName: userDetail?.fullName || "",
    email: userDetail?.email || "",
    phoneNumber: userDetail?.phoneNumber || "",
    avatar: userDetail?.avatar || "",
    gender: userDetail?.gender ?? true,
    dateOfBirth: userDetail?.dateOfBirth
      ? new Date(userDetail.dateOfBirth)
      : new Date(),
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải dữ liệu người dùng...</Text>
      </View>
    );
  }

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    mutationKey: ["updateUser", inputValue],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      (Alert.alert("Thành công", "Cập nhật thành công!"), router.back());
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
      setInputValue({ ...inputValue, dateOfBirth: selectedDate });
    }
  };

  const handleChange = (field: string, value: any) => {
    setInputValue({
      ...inputValue,
      [field]: value,
    });
  };

  const handleSave = () => {
    updateUserMutation({ ...inputValue, id: userDetail?.id });
  }

  const pickMediaFromCamera = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        "Thông báo",
        "Bạn cần cấp quyền truy cập vào thư viện để thực hiện chức năng này."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true)
      const localUri = result.assets[0].uri;
      // Lấy ra uri của file
      const cloudUrl = await uploadImageToCloudinary(localUri);
      setInputValue({ ...inputValue, avatar: cloudUrl });

      setUploading(false);

      // Lấy ra loại file (image Or video)
      setMediaType(result?.assets[0]?.type);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* 1. Header */}
      <View className="flex-row items-center p-5 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900">
          Chỉnh sửa hồ sơ
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* 2. Ảnh đại diện */}
          <View className="items-center my-6">
            <View className="relative">
              {uploading && <ActivityIndicator size="large" color="#504DE4" />}
              {
                inputValue.avatar && <Image source={{ uri: inputValue.avatar }} className="w-24 h-24 round-5"/>
              }
              <TouchableOpacity
                className="absolute -bottom-2 -right-2 bg-blue-600 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                onPress={pickMediaFromCamera}
              >
                <Feather name="edit-3" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Các ô nhập liệu (KHÔNG TÁI SỬ DỤNG) */}
          <View className="px-5">
            {/* --- Ô Name --- */}
            <View className="mb-5">
              <View className="absolute -top-2 left-3 bg-white z-10 px-1">
                <Text className="text-xs text-blue-600">Họ và tên</Text>
              </View>
              <TextInput
                value={inputValue.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                className="border border-blue-500 rounded-lg p-4 text-base"
              />
              {error.fullName && (
                <Text className="text-red-500 text-md mt-2">
                  {error.fullName}
                </Text>
              )}
            </View>

            {/* --- Ô Email Address --- */}
            <View className="mb-5">
              <View className="absolute -top-2 left-3 bg-white z-10 px-1">
                <Text className="text-xs text-blue-600">Email</Text>
              </View>
              <TextInput
                value={inputValue.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                className="border border-blue-500 rounded-lg p-4 text-base"
              />
              {error.email && (
                <Text className="text-red-500 text-md mt-2">{error.email}</Text>
              )}
            </View>

            {/* --- Ô Mobile Number --- */}
            <View className="mb-5">
              <View className="absolute -top-2 left-3 bg-white z-10 px-1">
                <Text className="text-xs text-blue-600">Số điện thoại</Text>
              </View>
              <TextInput
                value={inputValue.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
                placeholder="Enter your mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                className="border border-blue-500 rounded-lg p-4 text-base"
              />
              {error.phoneNumber && (
                <Text className="text-red-500 text-md mt-2">
                  {error.phoneNumber}
                </Text>
              )}
            </View>

            {/* --- HẾT PHẦN TÁCH --- */}

            {/* Ô chọn ngày sinh */}
            <View className="mb-6">
              <View className="absolute -top-2 left-3 bg-white z-10 px-1">
                <Text className="text-xs text-blue-600">Ngày sinh</Text>
              </View>
              <TouchableOpacity
                className="flex-row justify-between items-center border border-blue-500 rounded-lg p-4"
                activeOpacity={0.7}
                onPress={() => setShow(true)}
              >
                <Text className="text-base text-gray-800">
                  {inputValue.dateOfBirth
                    ? new Date(inputValue.dateOfBirth).toLocaleDateString(
                        "vi-VN"
                      )
                    : ""}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={inputValue.dateOfBirth}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* 4. Chọn giới tính */}
            <View>
              <Text className="text-base font-medium text-gray-800 mb-3">
                Giới tính
              </Text>
              <RadioButton
                label="Nam"
                selected={inputValue.gender == true}
                onPress={() => handleChange("gender", true)}
              />
              <RadioButton
                label="Nữ"
                selected={inputValue.gender == false}
                onPress={() => handleChange("gender", false)}
              />
            </View>
          </View>
        </ScrollView>

        {/* 5. Nút Update (Fixed ở dưới) */}
        <View
          className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100"
          style={{ bottom: -40 }}
        >
          <TouchableOpacity className="bg-blue-600 py-4 rounded-lg" onPress={handleSave}>
            <Text className="text-white text-lg font-bold text-center">
              Lưu
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
