import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";

const INK = "#1C1C1E";

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
};

/** The cream page behind Reports, People, and Viewings. */
const EntryList = ({ title, action, onAction, children }: Props) => {
  const router = useRouter();

  return (
    <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.column}>
          <View style={styles.head}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} hitSlop={8}>
              <MaterialIcons name="chevron-left" size={28} color={INK} />
            </Pressable>
            {action && onAction ? (
              <Pressable accessibilityRole="button" accessibilityLabel={action} onPress={onAction}>
                <StyledText style={styles.action}>{action}</StyledText>
              </Pressable>
            ) : (
              <View />
            )}
          </View>
          <StyledText style={styles.title}>{title}</StyledText>
          <View style={styles.list}>{children}</View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default EntryList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    alignItems: "center",
    paddingBottom: 140,
  },

  column: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  action: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  title: {
    marginTop: 12,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  list: {
    marginTop: 18,
    gap: 10,
  },
});
