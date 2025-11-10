import { useReviews } from '@/hooks/useReviews';
import { RoomResponse } from '@/interface/room';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import StarRating from './StarRating';

export default function RoomCard({ room, onPress }: {room: RoomResponse, onPress: () => void}) {
  const { data: reviews, isLoading } = useReviews(room.hotelId, room.id);

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <TouchableOpacity className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden" onPress={onPress}>
    {/* Phần ảnh */}
    <View>
      <Image
        source={{ uri: room.imageUrl }}
        className="w-full h-56"
      />
      {/* Nút yêu thích */}
      <TouchableOpacity className="absolute top-4 right-4 bg-black/30 p-2 rounded-full">
        <Ionicons name="heart-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>

    {/* Phần nội dung */}
    <View className="p-4">
      {/* Rating */}
      <View className="flex-row items-center">
        <StarRating rating={averageRating} size={20}/>
        <Text className="text-sm font-bold text-gray-700 ml-2">{averageRating.toFixed(1)}</Text>
        <Text className="text-sm text-gray-500 ml-1.5">({reviews?.length || 0} lượt đánh giá)</Text>
      </View>

      {/* Tên phòng */}
      <Text className="text-lg font-bold text-gray-900 mt-1">{room.title}</Text>

      <View className="flex-row items-center mt-1">
        <MaterialIcons name="location-pin" size={16} color="#888" />
        <Text className="text-sm text-gray-500 ml-1">{room.hotelName}</Text>
      </View>

      {/* Giá tiền */}
      <Text className="text-xl font-bold text-gray-900 mt-2">
        {room.price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        })}
        <Text className="text-base font-normal text-gray-500">/đêm</Text>
      </Text>
    </View>
  </TouchableOpacity>
  )
}
