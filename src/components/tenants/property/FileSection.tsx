import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  title: string;
  detail: string;
  children: React.ReactNode;
};

/** One group on the property file: reports, invites, or viewings. */
const FileSection = ({ title, detail, children }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  return (
    <View style={styles.section}>
      <StyledText style={[styles.title, { color: textColor }]}>{title}</StyledText>
      <StyledText style={[styles.detail, { color: iconColor }]}>{detail}</StyledText>
      <View style={styles.items}>{children}</View>
    </View>
  );
};

export default FileSection;

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginTop: 8,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
  },

  detail: {
    fontSize: 14,
    lineHeight: 20,
  },

  items: {
    gap: 8,
  },
});
