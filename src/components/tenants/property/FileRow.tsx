import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";

type Tone = "neutral" | "attention" | "done";

type Props = {
  title: string;
  detail: string;
  status: string;
  tone: Tone;
  onPress?: () => void;
};

const TONE_COLOR = {
  neutral: "icons",
  attention: "warning",
  done: "success",
} as const;

/** One line on the file. `onPress` opens it. */
const FileRow = ({ title, detail, status, tone, onPress }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const statusColor = useThemeColor({}, TONE_COLOR[tone]);
  const body = (
    <>
      <View style={styles.body}>
        <StyledText style={[styles.title, { color: textColor }]}>{title}</StyledText>
        <StyledText style={[styles.detail, { color: iconColor }]}>{detail}</StyledText>
      </View>
      <StyledText style={[styles.status, { color: statusColor }]}>{status}</StyledText>
      {onPress ? <MaterialIcons name="chevron-right" size={22} color={iconColor} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, { backgroundColor: cardColor, borderColor }]}>{body}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.row, { backgroundColor: cardColor, borderColor }]}
    >
      {body}
    </Pressable>
  );
};

export default FileRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  body: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  detail: {
    fontSize: 13,
    lineHeight: 18,
  },

  status: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
    flexShrink: 0,
  },
});
