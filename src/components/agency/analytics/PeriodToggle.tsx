import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AnalyticsPeriod } from "@/types/agency/AnalyticsInterfaces";

export const PERIOD_OPTIONS: {
  id: AnalyticsPeriod;
  label: string;
  comparison: string;
}[] = [
  { id: "weekly", label: "Weekly", comparison: "vs last week" },
  { id: "monthly", label: "Monthly", comparison: "vs last month" },
  { id: "yearly", label: "Yearly", comparison: "vs last year" },
];

type Props = {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
};

/** Weekly / Monthly / Yearly, one of which is selected. */
const PeriodToggle = ({ value, onChange }: Props) => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={[styles.track, { borderColor }]} accessibilityRole="tablist">
      {PERIOD_OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && { backgroundColor: textColor }]}
          >
            <StyledText
              style={styles.label}
              color={selected ? backgroundColor : textColor}
            >
              {option.label}
            </StyledText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default PeriodToggle;

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 20,
    padding: 3,
  },

  segment: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },
});
