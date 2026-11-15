import { StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LettingsOverviewData } from "@/types/agency/AnalyticsInterfaces";
import { formatCompact } from "./format";
import RentChart from "./RentChart";

const POSITIVE_COLOR = "#2E9E4F";
const NEGATIVE_COLOR = "#D32F2F";

type Props = LettingsOverviewData & {
  /** "vs last month", "vs last week", ... */
  periodLabel: string;
};

/** Period total, its change, and the rent chart beneath. */
const LettingsOverview = ({
  total,
  changePercent,
  currency,
  axisMax,
  points,
  highlightIndex,
  periodLabel,
}: Props) => {
  const labelColor = useThemeColor({}, "icons");
  const textColor = useThemeColor({}, "text");

  const isPositive = changePercent >= 0;
  const trendColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText style={[styles.kicker, { color: labelColor }]}>
          Rent secured
        </StyledText>
        <View
          style={[styles.pill, { backgroundColor: trendColor + "1A" }]}
        >
          <MaterialIcons
            name={isPositive ? "arrow-drop-up" : "arrow-drop-down"}
            size={18}
            color={trendColor}
            style={styles.pillIcon}
          />
          <StyledText style={[styles.pillText, { color: trendColor }]}>
            {isPositive ? "+" : ""}
            {changePercent}%
          </StyledText>
        </View>
      </View>

      <View style={styles.totalRow}>
        <StyledText style={[styles.total, { color: textColor }]}>
          {formatCompact(total, currency)}
        </StyledText>
        <StyledText style={[styles.period, { color: labelColor }]}>
          {periodLabel}
        </StyledText>
      </View>

      <RentChart
        points={points}
        axisMax={axisMax}
        highlightIndex={highlightIndex}
        currency={currency}
      />
    </View>
  );
};

export default LettingsOverview;

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  kicker: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 4,
    paddingLeft: 2,
    paddingRight: 10,
  },

  pillIcon: {
    marginRight: -2,
  },

  pillText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  total: {
    fontSize: 40,
    lineHeight: 48,
    fontFamily: "BarlowMedium",
  },

  period: {
    fontSize: 14,
    lineHeight: 20,
    paddingBottom: 6,
  },
});
