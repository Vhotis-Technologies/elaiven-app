import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ReportLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ReportScreen' />
        <Stack.Screen name='[caseId]' />
        <Stack.Screen name='new' />
      </Stack>
    </View>
  )
};

export default ReportLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});