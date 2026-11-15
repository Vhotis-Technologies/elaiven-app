import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import StyledText from "@/components/helpers/StyledText";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import EntryList from "@/components/tenants/property/EntryList";
import EntryRow from "@/components/tenants/property/EntryRow";
import { CaseCategory, CaseStatus, CaseUrgency } from "@/types/agency/CaseInterface";

const CATEGORY: Record<CaseCategory, string> = {
  repair: "Repair",
  complaint: "Complaint",
  rent_query: "Rent",
  neighbour: "Neighbour",
};

const URGENCY: Record<CaseUrgency, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
};

const STATUS: Record<CaseStatus, string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  answered: "Answered",
  closed: "Closed",
};

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const ReportsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId?: string }>();
  const fileId = asId(params.fileId);
  const file = useTenantProperty(fileId);
  const canReport = file?.holding === "given";

  if (!file) {
    return (
      <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.missing}>
        <StyledText>This property isn't in the sample data.</StyledText>
      </LinearGradient>
    );
  }

  return (
    <EntryList
      title="Reports"
      action={canReport ? "Raise" : undefined}
      onAction={
        canReport
          ? () =>
              router.push({
                pathname: "/tenants/property/new-report",
                params: { fileId: file.id },
              })
          : undefined
      }
    >
      {!canReport ? (
        <StyledText style={styles.note}>Reports open once the agency gives you the property.</StyledText>
      ) : null}
      {file.reports.length === 0 && canReport ? (
        <StyledText style={styles.note}>Nothing reported yet.</StyledText>
      ) : null}
      {file.reports.map((report) => (
        <EntryRow
          key={report.id}
          title={report.title}
          detail={`${report.location} · ${CATEGORY[report.category]} · ${URGENCY[report.urgency]}`}
          status={STATUS[report.status]}
          onPress={() =>
            router.push({
              pathname: "/tenants/property/report/[reportId]",
              params: { reportId: report.id, fileId: file.id },
            })
          }
        />
      ))}
    </EntryList>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  note: {
    fontSize: 15,
    lineHeight: 21,
    color: "#8E8E93",
  },
});
