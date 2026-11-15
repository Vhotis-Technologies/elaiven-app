import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";

const INK = "#1C1C1E";
const MUTED = "#8E8E93";

type Props = {
  title: string;
  detail: string;
  status?: string;
  onPress?: () => void;
};

/** One quiet row on a property list. */
const EntryRow = ({ title, detail, status, onPress }: Props) => {
  const body = (
    <>
      <View style={styles.copy}>
        <StyledText style={styles.title}>{title}</StyledText>
        {detail ? <StyledText style={styles.detail}>{detail}</StyledText> : null}
      </View>
      {status ? <StyledText style={styles.status}>{status}</StyledText> : null}
      {onPress ? <MaterialIcons name="chevron-right" size={20} color={MUTED} /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{body}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
};

export default EntryRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  copy: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  detail: {
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },

  status: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
    color: MUTED,
  },

  pressed: {
    opacity: 0.72,
  },
});
