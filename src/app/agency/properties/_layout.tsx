import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PropertiesLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='PropertiesScreen' />
        <Stack.Screen name='[propertyId]' />
        <Stack.Screen name='[propertyId]/phase/[phase]' />
        <Stack.Screen name='[propertyId]/invite' />
        <Stack.Screen name='[propertyId]/application/[applicationId]' />
      </Stack>
    </View>
  );
};

export default PropertiesLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
