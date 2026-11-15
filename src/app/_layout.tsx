import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PaperProvider } from "react-native-paper";
import ThemeProvider from "@/context/ThemeProvider";
import { store } from "@/api/api_store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="agency" />
              <Stack.Screen name="tenants" />
              <Stack.Screen name="config" />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
