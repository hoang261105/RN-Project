import { addReview } from "@/apis/review.api";
import StarRating from "@/components/item/StarRating";
import { useReviews } from "@/hooks/useReviews";
import { useCurrentUser } from "@/hooks/useUser";
import { ReviewRequest, ReviewResponse } from "@/interface/review";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsScreen() {
  const { data: user, isLoading } = useCurrentUser();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { roomId, hotelId } = useLocalSearchParams();

  const [review, setReview] = useState<ReviewRequest>({
    rating: 0,
    comment: "",
  });

  const { data: reviews } = useReviews(+hotelId, +roomId);

  const handleRating = (value: number) =>
    setReview({
      ...review,
      rating: value,
    });

  const { mutate: addReviewMutation, isPending } = useMutation({
    mutationFn: addReview,
    mutationKey: ["addReview"],
    onSuccess: () => {
      Alert.alert(
        "Thành công!",
        `Cảm ơn bạn đã đánh giá ${review.rating} sao!`
      );
      setReview({
        rating: 0,
        comment: "",
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", +hotelId, +roomId],
      });

      router.back();
    },
    onError: () => {
      Alert.alert("Thất bại!", "Thêm đánh giá thất bại!");
    },
  });

  const handleSubmit = () => {
    if (review.rating == 0 || review.comment.trim() === "") {
      Alert.alert("Thất bại!", "Vui lòng chọn số sao và nhập đánh giá!");
      return;
    }

    const newReview: ReviewRequest = {
      hotelId: +hotelId,
      roomId: +roomId,
      userId: user?.id,
      rating: review.rating,
      comment: review.comment,
    };

    addReviewMutation(newReview);
  };

  // Tính trung bình sao
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: ReviewResponse) => sum + r.rating, 0) /
        reviews.length
      : 0;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải dữ liệu người dùng...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft size={22} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          Thêm đánh giá phòng
        </Text>
        <View className="w-8" />
      </View>

      {/* FlatList chính */}
      <FlatList
        data={reviews}
        keyExtractor={(item: ReviewResponse) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 24 }}
        ListHeaderComponent={
          <View>
            {/* Tổng quan đánh giá */}
            <View className="items-center my-6">
              <Text className="text-5xl font-bold text-yellow-400">
                {averageRating.toFixed(1)}
              </Text>
              <View className="flex-row mt-2 mb-1">
                <StarRating rating={averageRating} size={20} />
              </View>
              <Text className="text-gray-500 text-sm">
                Dựa trên {reviews?.length || 0} đánh giá
              </Text>
            </View>

            {/* Form nhập đánh giá */}
            <View className="bg-gray-50 p-4 rounded-2xl mb-8 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Image
                  source={{
                    uri: user?.avatar,
                  }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <Text className="text-base font-semibold text-gray-800">
                  {user?.fullName}
                </Text>
              </View>

              {/* 5 sao chọn */}
              <View className="flex-row mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRating(star)}
                  >
                    <FontAwesome
                      name={star <= review.rating ? "star" : "star-o"}
                      size={28}
                      color={star <= review.rating ? "#FFD700" : "#D1D5DB"}
                      style={{ marginRight: 6 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Ô nhập đánh giá */}
              <TextInput
                value={review.comment}
                onChangeText={(prev) => setReview({ ...review, comment: prev })}
                placeholder="Nhập đánh giá của bạn..."
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-xl p-3 text-gray-700 text-base mb-4 bg-white"
              />

              {/* Nút gửi */}
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-blue-500 py-3 rounded-xl"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Gửi đánh giá
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Các đánh giá gần đây
            </Text>
          </View>
        }
        renderItem={({ item }: { item: ReviewResponse }) => (
          <View className="flex-row mb-6 border-b border-gray-100 pb-4">
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-800">
                  {item.fullName}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {item.commentDate}
                </Text>
              </View>

              <View className="flex-row my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name={star <= item.rating ? "star" : "star-o"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>

              <Text className="text-gray-600 text-sm">{item.comment}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
