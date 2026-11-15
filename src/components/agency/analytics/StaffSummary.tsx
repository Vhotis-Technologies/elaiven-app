import { StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StaffPerformanceSummary } from "@/types/agency/AnalyticsInterfaces";
import { formatCompact } from "./format";

const POSITIVE_COLOR = "#2E9E4F";
const NEGATIVE_COLOR = "#D32F2F";

type Props = {
  summary: StaffPerformanceSummary;
  periodLabel: string;
};

const TILES: { key: keyof StaffPerformanceSummary; label: string }[] = [
  { key: "viewings", label: "Viewings" },
  { key: "attended", label: "Attended" },
  { key: "noShows", label: "No-shows" },
  { key: "offers", label: "Offers" },
  { key: "declines", label: "Declines" },
  { key: "lettings", label: "Lettings" },
];

/** Rent secured for the period, then the steps that led to it. */
const StaffSummary = ({ summary, periodLabel }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  const isPositive = summary.changePercent >= 0;
  const trendColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  return (
    <View style={styles.container}>
      <View style={styles.headline}>
        <StyledText style={[styles.kicker, { color: iconColor }]}>Rent secured</StyledText>
        <View style={[styles.pill, { backgroundColor: trendColor + "1A" }]}>
          <MaterialIcons
            name={isPositive ? "arrow-drop-up" : "arrow-drop-down"}
            size={18}
            color={trendColor}
            style={styles.pillIcon}
          />
          <StyledText style={[styles.pillText, { color: trendColor }]}>
            {isPositive ? "+" : ""}
            {summary.changePercent}%
          </StyledText>
        </View>
      </View>

      <StyledText style={[styles.total, { color: textColor }]}>
        {formatCompact(summary.rent, summary.currency)}
      </StyledText>
      <StyledText style={[styles.caption, { color: iconColor }]}>
        {summary.lettings} lettings · {periodLabel}
      </StyledText>

      <View style={styles.tiles}>
        {TILES.map((tile) => (
          <View key={tile.key} style={[styles.tile, { backgroundColor: cardColor, borderColor }]}>
            <StyledText style={[styles.tileValue, { color: textColor }]}>
              {summary[tile.key]}
            </StyledText>
            <StyledText style={[styles.tileLabel, { color: iconColor }]}>{tile.label}</StyledText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StaffSummary;

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },

  headline: {
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

  total: {
    fontSize: 40,
    lineHeight: 48,
    fontFamily: "BarlowMedium",
  },

  caption: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },

  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tile: {
    width: "31%",
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 2,
  },

  tileValue: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
  },

  tileLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
});
