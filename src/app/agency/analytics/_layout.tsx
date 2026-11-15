import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AnalyticLayout = () => {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AnalyticScreen" />
        <Stack.Screen name="[staffId]" />
        <Stack.Screen name="letting" />
      </Stack>
    </View>
  );
};

export default AnalyticLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});