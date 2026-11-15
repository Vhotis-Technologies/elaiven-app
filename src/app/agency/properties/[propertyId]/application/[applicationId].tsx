import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useApplication } from "@/hooks/useApplications";
import { applyApplicationAction } from "@/data/agency/applications";
import { REASON_LABEL, phaseOf } from "@/data/agency/applicationMachine";
import { propertyDetail } from "@/data/agency/properties";
import { formatDate } from "@/components/agency/analytics/format";
import Fact from "@/components/agency/properties/Fact";
import ApplicationActions from "@/components/agency/applications/ApplicationActions";
import ChecksSummaryCard from "@/components/agency/applications/ChecksSummaryCard";
import IncomeSourceCard from "@/components/agency/applications/IncomeSourceCard";
import { householdLine } from "@/components/agency/applications/applicationText";
import ApplicationForm from "@/components/agency/applications/ApplicationForm";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const ApplicationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId: string; applicationId: string }>();
  const application = useApplication(asId(params.applicationId));
  const property = propertyDetail(asId(params.propertyId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  if (!application) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This application isn't in the sample data.</StyledText>
      </View>
    );
  }

  const phase = phaseOf(application.state);
  const currency = property?.currency ?? "£";

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <StyledText style={[styles.title, { color: textColor }]}>{application.leadName}</StyledText>
      {property ? (
        <StyledText style={[styles.sub, { color: iconColor }]}>
          {property.title} · {application.origin === "operator" ? "Entered" : "Applied"}{" "}
          {formatDate(application.appliedAt)}
        </StyledText>
      ) : null}

      {application.reason ? (
        <StyledText style={[styles.reason, { color: textColor }]}>
          {REASON_LABEL[application.reason]}
        </StyledText>
      ) : null}

      <ApplicationActions
        application={application}
        onAct={(action) => applyApplicationAction(application.id, action)}
      />

      {phase === "viewing" && property ? (
        <ApplicationForm application={application} property={property} />
      ) : (
        <View style={styles.facts}>
          <Fact label="Household" value={householdLine(application)} />
          <Fact label="Move-in" value={formatDate(application.desiredMoveIn)} />
          <Fact label="Phone" value={application.phone} />
        </View>
      )}

      {phase === "checks" && application.checks ? <ChecksSummaryCard checks={application.checks} /> : null}

      {phase === "agreement" && application.incomeSources ? (
        <IncomeSourceCard sources={application.incomeSources} currency={currency} />
      ) : null}
    </ScrollView>
  );
};

export default ApplicationScreen;

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

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  sub: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: -6,
  },

  reason: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
});
