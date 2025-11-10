import { getImageById } from '@/apis/room.api';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bedroomImage = {
  uri: 'https://images.unsplash.com/photo-1616486338810-a4d3718803c5?fit=crop&w=800&q=80',
};

export default function ImageModalScreen() {
  const router = useRouter(); 
  const {imageId, roomId} = useLocalSearchParams();

  const {
    data: photo
  } = useQuery({
    queryFn: async () => {
      const response = await getImageById(+imageId, +roomId);
      return response.data;
    },
    queryKey: ["image"]
  })

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View className="absolute top-10 left-4 z-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2" 
        >
          <Feather name="x" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center">
        <Image
          source={{uri: photo?.imageURL}}
          className={`w-full ${photo?.size === "large" ? "h-64" : "h-56"}`}
          resizeMode="cover" 
        />
      </View>
    </SafeAreaView>
  );
}