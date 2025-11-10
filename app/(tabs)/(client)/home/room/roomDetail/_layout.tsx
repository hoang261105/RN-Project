import { Stack } from "expo-router";
import React from "react";

export default function RoomDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="images" options={{ title: "Danh sách hình ảnh" }} />
      <Stack.Screen name="imageDetail" options={{ title: "Danh sách ảnh" }} />
      <Stack.Screen name="[roomId]" options={{ title: "Chi tiết phòng" }} />
      <Stack.Screen name="review" options={{title: "Đánh giá phòng"}}/>
      <Stack.Screen name="payment" options={{title: "Thanh toán"}}/>
    </Stack>
  );
}
