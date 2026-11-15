import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DashboardLayout = () => {
  return (
    <View style={styles.container}>
        <Stack>
            <Stack.Screen name='DashboardScreen' options={{ headerShown: false }} />
            <Stack.Screen name='BoardScreen' options={{ headerShown: false }} />
        </Stack>
    </View>
  )
}

export default DashboardLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})