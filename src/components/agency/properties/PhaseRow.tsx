import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ApplicationPhase, PHASES } from "@/data/agency/applicationMachine";

type Props = {
  phase: ApplicationPhase;
  count: number;
  onPress: () => void;
};

/** One row, used for all three phases on a property. */
const PhaseRow = ({ phase, count, onPress }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const info = PHASES.find((item) => item.id === phase);

  return (
    <Pressable
      style={[styles.row, { backgroundColor: cardColor, borderColor }]}
      accessibilityRole="button"
      accessibilityLabel={`${info?.title}, ${count}`}
      onPress={onPress}
    >
      <View style={styles.body}>
        <StyledText style={[styles.title, { color: textColor }]}>{info?.title}</StyledText>
        <StyledText style={[styles.detail, { color: iconColor }]}>{info?.detail}</StyledText>
      </View>
      <StyledText style={[styles.count, { color: textColor }]}>{count}</StyledText>
      <MaterialIcons name="chevron-right" size={22} color={iconColor} />
    </Pressable>
  );
};

export default PhaseRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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

  count: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
  },
});
