import RoomCard from "@/components/item/RoomCard";
import { useSearchRooms } from "@/hooks/useSearchRooms";
import { RoomResponse } from "@/interface/room";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const nearbyHotels = [
  {
    id: 1,
    name: "Peradise Mint",
    location: "Mumbai, Maharashtra",
    price: 120,
    rating: 4.0,
    reviews: 115,
    image:
      "https://images.unsplash.com/photo-1587061949409-02df43d75b3d?fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Sabro Prime",
    location: "Mumbai, Maharashtra",
    price: 90,
    rating: 5.0,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Malon Greens",
    location: "Mumbai, Maharashtra",
    price: 110,
    rating: 4.0,
    reviews: 80,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=200&q=80",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [keyboard, setKeyboard] = useState("");

  const [debouncedKeyboard, setDebouncedKeyboard] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyboard(keyboard);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [keyboard]);

  const {
    data: rooms,
    isLoading,
    isError,
  } = useSearchRooms(debouncedKeyboard);

  const handlePress = (roomId: number) => {
    router.push({
      pathname: "/(tabs)/(client)/home/room/roomDetail/[roomId]",
      params: {
        roomId: roomId,
      },
    });
  };

  const handleClear = () => {
    setKeyboard("");
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="large" color="#504DE4" className="mt-10" />
      );
    }
    if (isError) {
      return (
        <Text className="text-center text-red-500 mt-10">
          Có lỗi xảy ra khi tải dữ liệu.
        </Text>
      );
    }
    if (!rooms || rooms.length === 0) {
      return (
        <Text className="text-center text-gray-500 mt-10">
          Không tìm thấy phòng nào.
        </Text>
      );
    }
    return (
      <FlatList
        data={rooms}
        keyExtractor={(item: RoomResponse) => item.id.toString()}
        renderItem={({ item }: { item: RoomResponse }) => (
          <RoomCard room={item} onPress={() => handlePress(item.id)} />
        )}
      />
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- 1. Header (Search Bar) --- */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mx-4 mt-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/(client)/home")}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          placeholder="Tìm kiếm phòng..."
          className="flex-1 mx-3 text-base text-gray-900"
          placeholderTextColor="#888"
          value={keyboard}
          onChangeText={setKeyboard}
        />

        <TouchableOpacity>
          <Feather
            name="x"
            size={24}
            color="#333"
            onPress={handleClear}
          />
        </TouchableOpacity>
      </View>

      {/* --- 3. Nội dung cuộn (Danh sách) --- */}
      <View className="flex-1 mt-2">
        {/* Tiêu đề "Nearby your location" */}
        <Text className="text-lg font-bold text-gray-800 px-4 mb-3 mt-4">
          Danh sách phòng phù hợp
        </Text>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
