import { Stack } from 'expo-router'
import React from 'react'

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='index' options={{title: "Thanh toán"}}/>
    </Stack>
  )
}
