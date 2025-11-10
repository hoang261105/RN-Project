import ProvinceItem from "@/components/item/ProvinceItem";
import { useProvinces } from "@/hooks/useProvinces";
import { useReviews } from "@/hooks/useReviews";
import { useRooms } from "@/hooks/useRooms";
import { ProvinceResponse } from "@/interface/province";
import { RoomResponse } from "@/interface/room";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HotelCardSmall = ({
  room,
  onPress,
}: {
  room: RoomResponse;
  onPress: () => void;
}) => {
  // --- Gọi review hook cho từng phòng ---
  const { data: reviews, isLoading } = useReviews(room.hotelId, room.id);

  // --- Tính trung bình sao ---
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-2xl shadow p-3 mb-4"
      onPress={onPress}
    >
      <Image
        source={{ uri: room.imageUrl }}
        className="w-20 h-20 rounded-xl mr-3"
      />
      <View className="flex-1">
        <Text
          className="text-base font-bold text-gray-800 mb-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {room.title}
        </Text>

        <View className="flex-row items-center mb-2">
          <MaterialIcons
            name="location-pin"
            size={14}
            color="#888"
            style={{ marginTop: 2 }}
          />
          <Text
            className="text-xs text-gray-500 ml-1 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexShrink: 1 }}
          >
            {room.hotelName}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color="#504DE4" />
        ) : (
          <View className="flex-row items-center gap-1">
            <FontAwesome
              name="star"
              size={14}
              color="#FFD700"
              style={{ marginTop: 2 }}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1}}
              className="flex-row gap-2"
            >
              <Text className="font-bold text-black">
                {averageRating.toFixed(1)}{" "}
              </Text>
              <Text className="text-gray-500">
                ({reviews?.length || 0} lượt đánh giá)
              </Text>
            </Text>
          </View>
        )}
      </View>

      <Text className="text-md font-bold text-gray-900 ml-3 mt-2">
        {room.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
        <Text className="text-base font-normal text-gray-500">/đêm</Text>
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { data: rooms } = useRooms();

  const handlePress = (id: number) => {
    router.push({
      pathname: "/(tabs)/(client)/home/hotel/[provinceId]",
      params: {
        provinceId: id,
      },
    });
  };

  const handleDetail = (id: number, hotelId: number) => {
    router.push({
      pathname: "/(tabs)/(client)/home/room/roomDetail/[roomId]",
      params: {
        hotelId: hotelId,
        roomId: id,
      },
    });
  };

  const { data: provinces, isLoading, isError } = useProvinces();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#504DE4" className="mt-10" />;
  }
  if (isError) {
    return (
      <Text className="text-center text-red-500 mt-10">
        Có lỗi xảy ra khi tải dữ liệu.
      </Text>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#504DE4" />

      {/* --- 1. Header & Search --- */}
      <View className="bg-primary pt-4 pb-6 px-4 rounded-b-3xl bg-[#504DE4]">
        {/* Top bar */}
        <View className="flex-row justify-between items-center mb-4">
          {/* 1. Icon bên trái (Bọc trong View để set kích thước) */}
          <View className="w-8 h-8 justify-center">
            <TouchableOpacity>
              <Feather name="grid" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* 2. Logo (Tự động căn giữa) */}
          <Image
            source={require("../../../../assets/images/live-green-blue.jpg")}
            style={{ width: 200, height: 50 }}
            className="bg-[#504DE4]"
          />

          {/* 3. View "ma" bên phải (Phải có cùng chiều rộng w-8) */}
          <View className="w-8 h-8" />
        </View>

        {/* Search Bar & Filter */}
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center bg-white/30 rounded-lg px-3 py-2.5">
            <Feather name="search" size={20} color="white" />
            <TextInput
              placeholder="Tìm kiếm phòng tại đây"
              placeholderTextColor="#FFFFFF"
              className="flex-1 ml-2 text-white"
              onPress={() => router.push("/home/search")}
            />
          </View>
          <TouchableOpacity className="ml-3 bg-white/30 p-3 rounded-lg">
            <Ionicons name="options" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        className="flex-1"
        data={rooms}
        keyExtractor={(item: RoomResponse) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }: { item: RoomResponse }) => (
          <View className="px-4">
            <HotelCardSmall
              room={item}
              onPress={() => handleDetail(item.id, item.hotelId)}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="mt-6">
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                data={provinces}
                keyExtractor={(item: ProvinceResponse) => item.id.toString()}
                renderItem={({ item }: { item: ProvinceResponse }) => (
                  <ProvinceItem
                    pro={item}
                    onPress={() => handlePress(item.id)}
                  />
                )}
              />
            </View>

            {/* --- Tiêu đề section 'Danh sách phòng' --- */}
            <View className="mt-8 px-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">
                  Danh sách phòng
                </Text>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
