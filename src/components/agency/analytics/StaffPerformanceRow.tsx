import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StaffPerformanceItem } from "@/types/agency/AnalyticsInterfaces";
import { formatCompact } from "./format";

const POSITIVE_COLOR = "#2E9E4F";
const NEGATIVE_COLOR = "#D32F2F";

type Props = StaffPerformanceItem & {
  currency: string;
  isLast: boolean;
  onPress: (staffId: string) => void;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const StaffPerformanceRow = ({
  staffId,
  name,
  lettings,
  rent,
  changePercent,
  currency,
  isLast,
  onPress,
}: Props) => {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "borders");
  const avatarColor = useThemeColor({}, "cards");

  const isPositive = changePercent >= 0;
  const trendColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  return (
    <TouchableOpacity
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
      onPress={() => onPress(staffId)}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${lettings} lettings`}
    >
      <View style={styles.person}>
        <View style={[styles.avatar, { backgroundColor: avatarColor, borderColor }]}>
          <StyledText style={styles.initials}>{initials(name)}</StyledText>
        </View>
        <StyledText style={styles.name} numberOfLines={1}>
          {name}
        </StyledText>
      </View>

      <StyledText style={[styles.lettings, { color: textColor }]}>
        {lettings}
      </StyledText>

      <View style={styles.rent}>
        <StyledText style={styles.rentValue}>
          {formatCompact(rent, currency)}
        </StyledText>
        <MaterialIcons
          name={isPositive ? "arrow-drop-up" : "arrow-drop-down"}
          size={18}
          color={trendColor}
          style={styles.trendIcon}
        />
        <StyledText style={[styles.trend, { color: trendColor }]}>
          {Math.abs(changePercent)}%
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

export default StaffPerformanceRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  person: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  name: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  lettings: {
    width: 64,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  rent: {
    width: 118,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  rentValue: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  trendIcon: {
    marginRight: -3,
    marginLeft: 2,
  },

  trend: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },
});
