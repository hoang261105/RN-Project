import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { getRoomById } from "@/apis/room.api";
import { RoomImage } from "@/interface/room";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const allPhotos = [
  {
    id: 1,
    uri: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=800&q=80",
    size: "large",
  },
  {
    id: 2,
    uri: "https://images.unsplash.com/photo-1578683010236-d716f9d3d525?fit=crop&w=400&q=80",
    size: "small",
  },
  {
    id: 3,
    uri: "https://images.unsplash.com/photo-1616788220163-f9d9c28e932c?fit=crop&w=800&q=80",
    size: "large",
  },
  {
    id: 4,
    uri: "https://images.unsplash.com/photo-1560440021-33f9b867899d?fit=crop&w=400&q=80",
    size: "small",
  },
  {
    id: 5,
    uri: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?fit=crop&w=400&q=80",
    size: "small",
  },
  {
    id: 6,
    uri: "https://images.unsplash.com/photo-1590490359854-3ba491fb1733?fit=crop&w=400&q=80",
    size: "small",
  },
  {
    id: 7,
    uri: "https://images.unsplash.com/photo-1582719508461-905c673771fd?fit=crop&w=800&q=80",
    size: "large",
  },
  {
    id: 8,
    uri: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?fit=crop&w=400&q=80",
    size: "small",
  },
];

export default function AllPhotosScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();

  const { data: room, isLoading } = useQuery({
    queryFn: async () => {
      const response = await getRoomById(+roomId);
      return response.data;
    },
    queryKey: ["room"],
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#504DE4" />
        <Text className="mt-2 text-gray-600">Đang tải dữ liệu ảnh...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- 1. Header --- */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Photos</Text>
        <View className="w-6" />
      </View>

      {/* --- 2. Lưới Ảnh (Grid) --- */}
      <View className="flex-row flex-wrap justify-between">
        <FlatList
          className="flex-1 p-2"
          showsVerticalScrollIndicator={false}
          data={room.images}
          keyExtractor={(item: RoomImage) => item.id.toString()}
          renderItem={({ item }: { item: RoomImage }) => (
            <TouchableOpacity
              className={`mb-2 rounded-lg overflow-hidden ${
                item.size === "large" ? "w-full" : "w-[49%]"
              }`}
              onPress={() =>
                router.push({
                  pathname: "/home/room/roomDetail/imageDetail/[imageId]",
                  params: {
                    roomId: +roomId,
                    imageId: item.id,
                  },
                })
              }
            >
              <Image
                source={{ uri: item.imageURL }}
                className={`w-full ${item.size === "large" ? "h-64" : "h-40"}`}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
