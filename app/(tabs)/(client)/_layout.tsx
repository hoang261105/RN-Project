import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#ddd' },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} onPress={() => router.push("/home")}/>
          ),
        }}
      />

      <Tabs.Screen
        name='favourite'
        options={{
          title: "Yêu thích",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bookmark-outline" size={24} color={color}/>
          ),
        }}
      />

      <Tabs.Screen
        name='booking'
        options={{
          title: "Đặt phòng",
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={28} color={color}/>
          ),
        }}
      />

      <Tabs.Screen
        name='notification'
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color }) => (
            <Feather name="divide-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} onPress={() => router.push("/(tabs)/(client)/profile")}/>
          ),
        }}
      />
    </Tabs>
  )
}
