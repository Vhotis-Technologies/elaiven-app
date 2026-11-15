import { StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { RevenueCardUiProps } from "@/types/agency/HomeInterfaces";
import { useThemeColor } from "@/hooks/useThemeColor";

const POSITIVE_COLOR = "#2E9E4F";
const NEGATIVE_COLOR = "#D32F2F";

/**
 * Large revenue summary card.
 * `percentage_before` is the amount change (e.g. 1.65) and
 * `percentage_after` is the percent change (e.g. 2.65).
 */
const RevenueCardUi = ({
  title,
  value,
  currency,
  percentage_before,
  percentage_after,
  period,
}: RevenueCardUiProps) => {
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  const isPositive = percentage_after >= 0;
  const trendColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;
  const sign = isPositive ? "+" : "-";

  return (
    <View style={[styles.container, { backgroundColor: cardColor, borderColor }]}>
      {/* Decorative wave in the bottom-right corner */}
      <View style={[styles.wave, { backgroundColor: borderColor }]} />
      <View style={[styles.waveInner, { backgroundColor: cardColor }]} />

      <View style={styles.header}>
        <StyledText style={[styles.title, { color: iconColor }]}>{title}</StyledText>
      </View>

      <View style={styles.valueRow}>
        <StyledText style={[styles.value, { color: textColor }]} numberOfLines={1}>
          {currency}
          {value}
        </StyledText>
        <View style={styles.trend}>
          <MaterialIcons
            name={isPositive ? "arrow-drop-up" : "arrow-drop-down"}
            size={20}
            color={trendColor}
            style={styles.trendIcon}
          />
          <StyledText style={[styles.trendText, { color: trendColor }]}>
            {currency}
            {Math.abs(percentage_before)} ({sign}
            {Math.abs(percentage_after)}%)
          </StyledText>
        </View>
      </View>

      <StyledText style={[styles.period, { color: iconColor }]}>{period}</StyledText>
    </View>
  );
};

export default RevenueCardUi;

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    overflow: "hidden",
    gap: 14,
  },

  wave: {
    position: "absolute",
    right: -60,
    bottom: -70,
    width: 260,
    height: 120,
    borderRadius: 130,
    opacity: 0.5,
  },

  waveInner: {
    position: "absolute",
    right: -60,
    bottom: -76,
    width: 260,
    height: 120,
    borderRadius: 130,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  currency: {
    fontSize: 22,
    lineHeight: 28,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    flexWrap: "wrap",
  },

  value: {
    fontSize: 44,
    lineHeight: 50,
    fontFamily: "BarlowMedium",
  },

  trend: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },

  trendIcon: {
    marginRight: -2,
  },

  trendText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  period: {
    fontSize: 15,
    lineHeight: 20,
  },
});
