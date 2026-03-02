import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' options={{title: "Trang chủ"}}/>
        <Stack.Screen name='search' options={{title: "Tìm kiếm"}}/>
        <Stack.Screen name='(hotel)/[provinceId]' options={{title: "Danh sách khách sạn"}}/>
        <Stack.Screen 
        name='room' 
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
