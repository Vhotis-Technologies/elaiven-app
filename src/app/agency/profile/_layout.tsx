import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ProfileScreen' />
      </Stack>
    </View>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});