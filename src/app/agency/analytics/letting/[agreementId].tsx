import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate, formatFull } from "@/components/agency/analytics/format";
import LettingHistory from "@/components/agency/lettings/LettingHistory";
import LettingTenantCard from "@/components/agency/lettings/LettingTenantCard";
import { lettingDetail } from "@/data/agency/lettings";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const JURISDICTION: Record<string, string> = {
  IE: "Ireland",
  EN: "England",
  SC: "Scotland",
  WA: "Wales",
  NI: "Northern Ireland",
};

const LettingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ agreementId: string }>();
  const letting = lettingDetail(asId(params.agreementId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const success = useThemeColor({}, "success");
  const tint = useThemeColor({}, "tint");

  if (!letting) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This letting isn't in the sample data.</StyledText>
      </View>
    );
  }

  const active = letting.status === "active";
  const statusColor = active ? success : tint;
  const frequency = letting.rentFrequency === "weekly" ? "week" : "month";
  const registrationLabel = letting.jurisdiction === "IE" ? "RTB" : "Registration";

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <View style={styles.titleRow}>
        <StyledText style={[styles.address, { color: textColor }]}>{letting.address}</StyledText>
        <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
          <StyledText style={[styles.badgeText, { color: statusColor }]}>
            {active ? "Active" : "Signed"}
          </StyledText>
        </View>
      </View>
      <StyledText style={[styles.meta, { color: iconColor }]}>
        {letting.kind === "tenancy" ? "Tenancy" : "Licence"} · {JURISDICTION[letting.jurisdiction]}
      </StyledText>

      <View style={styles.facts}>
        <Fact label="Rent" value={`${formatFull(letting.rentAmount, letting.currency)} / ${frequency}`} />
        <Fact label="Deposit" value={formatFull(letting.depositAmount, letting.currency)} />
        <Fact label="Starts" value={formatDate(letting.startDate)} />
        <Fact label="Ends" value={letting.endDate ? formatDate(letting.endDate) : "Open"} />
      </View>

      <View style={[styles.parties, { backgroundColor: cardColor, borderColor }]}>
        <StyledText style={[styles.party, { color: textColor }]}>Owner · {letting.ownerName}</StyledText>
        <StyledText style={[styles.party, { color: textColor }]}>Agent · {letting.agentName}</StyledText>
        {letting.registration ? (
          <StyledText style={[styles.party, { color: iconColor }]}>
            {registrationLabel} · {letting.registration}
          </StyledText>
        ) : (
          <StyledText style={[styles.party, { color: iconColor }]}>
            {registrationLabel} · not registered yet
          </StyledText>
        )}
      </View>

      <StyledText style={[styles.section, { color: textColor }]}>
        {letting.tenantCount === 1 ? "Tenant" : "Tenants"}
      </StyledText>
      {letting.tenants.length > 0 ? (
        <View style={styles.tenantList}>
          {letting.tenants.map((tenant) => (
            <LettingTenantCard key={tenant.email} tenant={tenant} />
          ))}
        </View>
      ) : (
        <StyledText style={[styles.withheld, { color: iconColor }]}>
          {letting.tenantCount === 1 ? "One tenant is" : `${letting.tenantCount} tenants are`} on
          this agreement. Contact details stay with the agent who signed it.
        </StyledText>
      )}

      <StyledText style={[styles.section, { color: textColor }]}>History</StyledText>
      <LettingHistory events={letting.history} />
    </ScrollView>
  );
};

function Fact({ label, value }: { label: string; value: string }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={[styles.fact, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.factLabel, { color: iconColor }]}>{label}</StyledText>
      <StyledText style={[styles.factValue, { color: textColor }]}>{value}</StyledText>
    </View>
  );
}

export default LettingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  address: {
    flex: 1,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  badge: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 6,
  },

  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  meta: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: -6,
  },

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  fact: {
    width: "48%",
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 12,
    gap: 2,
  },

  factLabel: {
    fontSize: 12,
    lineHeight: 16,
  },

  factValue: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  parties: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },

  party: {
    fontSize: 14,
    lineHeight: 20,
  },

  section: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
    marginTop: 8,
  },

  tenantList: {
    gap: 8,
  },

  withheld: {
    fontSize: 14,
    lineHeight: 20,
  },
});
