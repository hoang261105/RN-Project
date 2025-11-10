import { HotelResponse } from '@/interface/hotel'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function HotelCard({ hotel, onPress}: {hotel: HotelResponse, onPress: () => void}) {
  return (
    <TouchableOpacity className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden" onPress={onPress}>
    {/* Phần ảnh */}
    <View>
      <Image
        source={{ uri: hotel.imageURL }}
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
      {/* <View className="flex-row items-center">
        <FontAwesome name="star" size={16} color="#F59E0B" />
        <FontAwesome name="star" size={16} color="#F59E0B" />
        <FontAwesome name="star" size={16} color="#F59E0B" />
        <FontAwesome name="star" size={16} color="#F59E0B" />
        <FontAwesome name="star" size={16} color="#F59E0B" />
        <Text className="text-sm font-bold text-gray-700 ml-2">{hotel.rating.toFixed(1)}</Text>
        <Text className="text-sm text-gray-500 ml-1.5">({hotel.reviews} Reviews)</Text>
      </View> */}

      {/* Tên khách sạn */}
      <Text className="text-lg font-bold text-gray-900 mt-1">{hotel.name}</Text>

      {/* Vị trí */}
      <View className="flex-row items-center mt-1">
        <MaterialIcons name="location-pin" size={16} color="#888" />
        <Text className="text-sm text-gray-500 ml-1">{hotel.address}, {hotel.provinceName}, Việt Nam</Text>
      </View>
    </View>
  </TouchableOpacity>
  )
}
