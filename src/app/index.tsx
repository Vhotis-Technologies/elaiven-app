import { Text, View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.buttons} onPress={() => router.push('/tenants/dashboard/DashboardScreen')}>
        <Text>Go to Tenants</Text>
      </Pressable>

      <Pressable style={styles.buttons} onPress={() => router.push('/agency/home/HomeScreen')}>
        <Text>Go to Agency</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttons:{
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
  }
});
