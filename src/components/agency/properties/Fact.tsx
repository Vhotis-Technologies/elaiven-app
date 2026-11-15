import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  label: string;
  value: string;
};

const Fact = ({ label, value }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={[styles.fact, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.label, { color: iconColor }]}>
        {label}
      </StyledText>
      <StyledText style={[styles.value, { color: textColor }]}>
        {value}
      </StyledText>
    </View>
  );
};

export default Fact;

const styles = StyleSheet.create({
  fact: {
    width: "48%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 12,
    gap: 2,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
  },

  value: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },
});
