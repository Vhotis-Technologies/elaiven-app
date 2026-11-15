import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AnalyticsPeriod } from "@/types/agency/AnalyticsInterfaces";
import PeriodToggle from "./PeriodToggle";

type Props = {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
};

/** Back control and the Weekly / Monthly / Yearly toggle. */
const AnalyticsTopBar = ({ period, onPeriodChange }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.row}>
      <Pressable
        hitSlop={10}
        accessibilityLabel="Go back"
        onPress={() => router.back()}
      >
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <PeriodToggle value={period} onChange={onPeriodChange} />
    </View>
  );
};

export default AnalyticsTopBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});
