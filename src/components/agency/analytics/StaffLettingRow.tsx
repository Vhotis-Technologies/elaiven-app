import { StyleSheet, Pressable, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StaffLetting } from "@/types/agency/AnalyticsInterfaces";
import { formatDate, formatFull } from "./format";

type Props = {
  letting: StaffLetting;
  isLast: boolean;
};

const StaffLettingRow = ({ letting, isLast }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const borderColor = useThemeColor({}, "borders");
  const success = useThemeColor({}, "success");
  const tint = useThemeColor({}, "tint");

  const active = letting.status === "active";
  const statusColor = active ? success : tint;
  const frequency = letting.rentFrequency === "weekly" ? "week" : "month";

  return (
    <Pressable
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
      onPress={() =>
        router.push({
          pathname: "/agency/analytics/letting/[agreementId]",
          params: { agreementId: letting.agreementId },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={letting.address}
    >
      <View style={styles.top}>
        <StyledText style={[styles.address, { color: textColor }]} numberOfLines={2}>
          {letting.address}
        </StyledText>
        <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
          <StyledText style={[styles.badgeText, { color: statusColor }]}>
            {active ? "Active" : "Signed"}
          </StyledText>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={iconColor} />
      </View>

      <StyledText style={styles.rent}>
        {formatFull(letting.rentAmount, letting.currency)} / {frequency}
      </StyledText>
      <StyledText style={[styles.dates, { color: iconColor }]}>
        Signed {formatDate(letting.signedAt)} · Starts {formatDate(letting.startDate)}
      </StyledText>
    </Pressable>
  );
};

export default StaffLettingRow;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    gap: 4,
  },

  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  address: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  badge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },

  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  rent: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  dates: {
    fontSize: 13,
    lineHeight: 18,
  },
});
