import { Stack } from 'expo-router'
import React from 'react'

export default function ReviewLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' options={{title: "Danh sách đánh giá"}}/>
        <Stack.Screen name='addReview' options={{title: "Thêm đánh giá phòng"}}/>
    </Stack>
  )
}
