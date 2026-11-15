import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import StyledText from "@/components/helpers/StyledText";
import { formatDate } from "@/components/agency/analytics/format";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import EntryList from "@/components/tenants/property/EntryList";
import EntryRow from "@/components/tenants/property/EntryRow";
import { TenantViewingStatus } from "@/types/tenants/PropertyFile";

const STATUS: Record<TenantViewingStatus, string> = {
  scheduled: "Scheduled",
  attended: "Attended",
  no_show: "Did not attend",
  cancelled: "Cancelled",
};

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatWhen(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  const date = formatDate(datePart);
  if (!timePart) return date;
  const [hour, minute] = timePart.split(":");
  return `${date}, ${hour}:${minute}`;
}

const ViewingsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId?: string }>();
  const file = useTenantProperty(asId(params.fileId));

  if (!file) {
    return (
      <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.missing}>
        <StyledText>This property isn't in the sample data.</StyledText>
      </LinearGradient>
    );
  }

  return (
    <EntryList title="Viewings">
      {file.viewings.length === 0 ? <StyledText style={styles.note}>No viewings yet.</StyledText> : null}
      {file.viewings.map((viewing) => (
        <EntryRow
          key={viewing.id}
          title={viewing.status === "scheduled" ? "Upcoming viewing" : "Viewing"}
          detail={`${formatWhen(viewing.scheduledFor)} · with ${viewing.withName}`}
          status={STATUS[viewing.status]}
          onPress={() =>
            router.push({
              pathname: "/tenants/property/viewing/[viewingId]",
              params: { viewingId: viewing.id, fileId: file.id },
            })
          }
        />
      ))}
    </EntryList>
  );
};

export default ViewingsScreen;

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
