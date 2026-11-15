import { StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { DashboardCardUiProps } from "@/types/agency/HomeInterfaces";
import { useThemeColor } from "@/hooks/useThemeColor";

const POSITIVE_COLOR = "#2E9E4F";
const NEGATIVE_COLOR = "#D32F2F";

const DashboardCardUi = ({
  title,
  value,
  icon,
  backgroundColor,
  percentage,
  period,
}: DashboardCardUiProps) => {
  const isPositive = percentage >= 0;
  const trendColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  const iconColor = useThemeColor({}, "icons");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <MaterialIcons
          name={icon as React.ComponentProps<typeof MaterialIcons>["name"]}
          size={34}
          color={iconColor}
        />
        <StyledText style={styles.title} numberOfLines={2}>
          {title}
        </StyledText>
      </View>

      <StyledText style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </StyledText>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <MaterialIcons
            name={isPositive ? "arrow-drop-up" : "arrow-drop-down"}
            size={18}
            color={trendColor}
            style={styles.badgeIcon}
          />
          <StyledText style={[styles.badgeText, { color: trendColor }]}>
            {Math.abs(percentage)}%
          </StyledText>
        </View>
        <StyledText style={styles.period} numberOfLines={1}>
          {period}
        </StyledText>
      </View>
    </View>
  );
};

export default DashboardCardUi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 150,
    borderRadius: 24,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  value: {
    fontSize: 38,
    lineHeight: 44,
    fontFamily: "BarlowMedium",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 3,
    paddingLeft: 4,
    paddingRight: 8,
  },

  badgeIcon: {
    marginRight: -2,
  },

  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  period: {
    flexShrink: 1,
    fontSize: 10,
    lineHeight: 14,
  },
});
