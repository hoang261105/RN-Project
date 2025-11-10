import { Stack } from 'expo-router'
import React from 'react'

export default function ImageLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='[imageId]' options={{title: "Chi tiết hình ảnh"}}/>
    </Stack>
  )
}
