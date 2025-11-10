import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import StarRating from "@/components/item/StarRating";
import { useReviews } from "@/hooks/useReviews";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Component con: Thẻ Đánh giá ---
const ReviewCard = ({ review }: any) => (
  <View className="flex-row p-4 border-b border-gray-100">
    {/* Avatar */}
    <Image source={{ uri: review.avatar }} className="w-12 h-12 rounded-full" />

    {/* Nội dung */}
    <View className="flex-1 ml-4">
      <View className="flex-row justify-between items-start">
        {/* Tên & Ngày */}
        <View>
          <Text className="text-base font-bold text-gray-900">
            {review.fullName}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {review.commentDate}
          </Text>
        </View>
        {/* Sao đánh giá */}
        <StarRating rating={review.rating} size={14} />
      </View>
      {/* Bình luận */}
      <Text className="text-sm text-gray-600 mt-2 leading-5">
        {review.comment}
      </Text>
    </View>
  </View>
);

// --- Component chính: Màn hình Đánh giá ---
export default function ReviewsScreen() {
  const router = useRouter();
  const { roomId, hotelId } = useLocalSearchParams();

  const { data: reviews, isLoading } = useReviews(+hotelId, +roomId);

  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        reviews?.length
      : 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#504DE4" />
        <Text className="mt-2 text-gray-600">Đang tải dữ liệu đánh giá...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Đánh giá phòng</Text>
        <View className="w-6" />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListHeaderComponent={
          <View className="flex-row items-center p-4 border-b border-gray-200">
            <Text className="text-5xl font-bold text-gray-900 mr-3">
              {averageRating.toFixed(1)}
            </Text>
            <View>
              <StarRating rating={averageRating} size={20} />
              <Text className="text-sm text-gray-500 mt-1">
                {reviews?.length ?? 0} lượt đánh giá
              </Text>
            </View>
          </View>
        }
      />

      <TouchableOpacity
        className="
          absolute bottom-6 right-6
          w-14 h-14 bg-blue-600 rounded-full
          flex items-center justify-center
          shadow-lg
        "
        onPress={() => router.push({
          pathname: "/home/room/roomDetail/review/addReview",
          params: {
            hotelId: hotelId,
            roomId: roomId
          }
        })}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
