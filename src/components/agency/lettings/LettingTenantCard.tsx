import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LettingTenant } from "@/types/agency/LettingInterfaces";

type Props = {
  tenant: LettingTenant;
};

function workLine(tenant: LettingTenant): string {
  if (tenant.employmentStatus === "student") return `Student at ${tenant.employerName}`;
  if (tenant.employmentStatus === "retired") return "Retired";
  if (tenant.employmentStatus === "not_working") return "Not working";
  if (tenant.employmentStatus === "self_employed") {
    return tenant.jobTitle ? `Self-employed ${tenant.jobTitle}` : "Self-employed";
  }
  if (tenant.jobTitle && tenant.employerName) return `${tenant.jobTitle} at ${tenant.employerName}`;
  return tenant.jobTitle || tenant.employerName;
}

const LettingTenantCard = ({ tenant }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const tint = useThemeColor({}, "tint");
  const initials = `${tenant.givenName[0] ?? ""}${tenant.familyName[0] ?? ""}`.toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
      <View style={[styles.avatar, { borderColor }]}>
        <StyledText style={styles.initials}>{initials}</StyledText>
      </View>
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <StyledText style={[styles.name, { color: textColor }]}>
            {tenant.givenName} {tenant.familyName}
          </StyledText>
          {tenant.isLead && (
            <View style={[styles.badge, { backgroundColor: tint + "22" }]}>
              <StyledText style={[styles.badgeText, { color: tint }]}>Lead</StyledText>
            </View>
          )}
        </View>
        <StyledText style={[styles.meta, { color: iconColor }]}>{workLine(tenant)}</StyledText>
        <StyledText style={[styles.meta, { color: iconColor }]}>
          {tenant.email} · {tenant.phone}
        </StyledText>
      </View>
    </View>
  );
};

export default LettingTenantCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  text: {
    flex: 1,
    gap: 2,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  name: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  badge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: "BarlowMedium",
  },

  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
});
