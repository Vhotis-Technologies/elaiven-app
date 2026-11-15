import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PropertyLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="PropertyScreen" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="people" />
        <Stack.Screen name="viewings" />
        <Stack.Screen name="new-report" />
        <Stack.Screen name="report/[reportId]" />
        <Stack.Screen name="new-invite" />
        <Stack.Screen name="invite/[personId]" />
        <Stack.Screen name="viewing/[viewingId]" />
      </Stack>
    </View>
  )
}

export default PropertyLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})