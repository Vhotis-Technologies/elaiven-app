import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StaffMember } from "@/types/agency/AnalyticsInterfaces";

type Props = {
  staff: StaffMember;
};

function initials(staff: StaffMember): string {
  return `${staff.givenName[0] ?? ""}${staff.familyName[0] ?? ""}`.toUpperCase();
}

const StaffDetailHeader = ({ staff }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const tint = useThemeColor({}, "tint");

  const roleLabel = staff.role === "owner" ? "Owner" : "Agent";

  return (
    <View style={styles.container}>
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: cardColor, borderColor }]}>
          <StyledText style={styles.initials}>{initials(staff)}</StyledText>
        </View>
        <View style={styles.text}>
          <StyledText style={styles.name}>
            {staff.givenName} {staff.familyName}
          </StyledText>
          <StyledText style={[styles.email, { color: iconColor }]} numberOfLines={1}>
            {staff.email}
          </StyledText>
        </View>
        <View style={[styles.role, { backgroundColor: tint + "22" }]}>
          <StyledText style={[styles.roleLabel, { color: tint }]}>{roleLabel}</StyledText>
        </View>
      </View>
    </View>
  );
};

export default StaffDetailHeader;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
  },

  text: {
    flex: 1,
    gap: 2,
  },

  name: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "BarlowMedium",
  },

  email: {
    fontSize: 14,
    lineHeight: 18,
  },

  role: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  roleLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },
});
