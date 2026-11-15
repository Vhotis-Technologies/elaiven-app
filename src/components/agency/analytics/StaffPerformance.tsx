import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StaffPerformanceItem } from "@/types/agency/AnalyticsInterfaces";
import StaffPerformanceRow from "./StaffPerformanceRow";

type Props = {
  staff: StaffPerformanceItem[];
  currency: string;
  onStaffPress: (staffId: string) => void;
  onViewAll?: () => void;
};

/**
 * Owner and admins, ranked by the lettings they signed
 * and the rent on those agreements.
 */
const StaffPerformance = ({ staff, currency, onStaffPress, onViewAll }: Props) => {
  const textColor = useThemeColor({}, "text");
  const labelColor = useThemeColor({}, "icons");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText style={[styles.title, { color: textColor }]}>
          Staff performance
        </StyledText>
        <Pressable hitSlop={8} onPress={onViewAll} accessibilityRole="button">
          <StyledText style={styles.viewAll}>View all</StyledText>
        </Pressable>
      </View>

      <View style={styles.columns}>
        <StyledText style={[styles.columnStaff, styles.columnLabel, { color: labelColor }]}>
          Staff
        </StyledText>
        <StyledText style={[styles.columnLettings, styles.columnLabel, { color: labelColor }]}>
          Lettings
        </StyledText>
        <StyledText style={[styles.columnRent, styles.columnLabel, { color: labelColor }]}>
          Rent
        </StyledText>
      </View>

      {staff.map((person, index) => (
        <StaffPerformanceRow
          key={person.staffId}
          {...person}
          currency={currency}
          isLast={index === staff.length - 1}
          onPress={onStaffPress}
        />
      ))}
    </View>
  );
};

export default StaffPerformance;

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
  },

  viewAll: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  columns: {
    flexDirection: "row",
    alignItems: "center",
  },

  columnLabel: {
    fontSize: 13,
    lineHeight: 18,
  },

  columnStaff: {
    flex: 1,
  },

  columnLettings: {
    width: 64,
    textAlign: "center",
  },

  columnRent: {
    width: 118,
    textAlign: "right",
  },
});
