import { Stack } from 'expo-router'
import React from 'react'

export default function RoomLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='roomDetail' options={{title: "Phòng chi tiết"}}/>
        <Stack.Screen name='[hotelId]' options={{title: "Hotel"}}/>
    </Stack>
  )
}
