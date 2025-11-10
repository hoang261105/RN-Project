import { Stack } from 'expo-router'
import React from 'react'

export default function IntroduceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' options={{title: "Trang đầu tiên"}}/>
        <Stack.Screen name='secondPage' options={{title: "Trang thứ hai"}}/>
        <Stack.Screen name='thirdPage' options={{title: "Trang thứ ba"}}/>
    </Stack>
  )
}
