import { Stack } from 'expo-router'
import React from 'react'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' options={{title: "Hồ sơ cá nhân"}}/>
        <Stack.Screen name='update' options={{title: "Cập nhật tài khoản"}}/>
        <Stack.Screen name='term-condition' options={{title: "Điều khoản dịch vụ"}}/>
        <Stack.Screen name='privacy-policy' options={{title: "Chính sách bảo mật"}}/>
    </Stack>
  )
}
