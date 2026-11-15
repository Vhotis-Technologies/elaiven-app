import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import StyledText from "@/components/helpers/StyledText";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import EntryList from "@/components/tenants/property/EntryList";
import EntryRow from "@/components/tenants/property/EntryRow";
import { HouseholdInviteStatus } from "@/types/tenants/PropertyFile";

const STATUS: Record<HouseholdInviteStatus, string> = {
  sent: "Link sent",
  opened: "Opened",
  joined: "Joined",
};

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function personDetail(isLead: boolean, invitedBy: "agency" | "tenant"): string {
  if (isLead) return "Lead";
  if (invitedBy === "tenant") return "You sent this link";
  return "Invited by the agency";
}

const PeopleScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId?: string }>();
  const file = useTenantProperty(asId(params.fileId));
  const canInvite = file?.household.some((person) => person.isLead && person.inviteStatus === "joined");

  if (!file) {
    return (
      <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.missing}>
        <StyledText>This property isn't in the sample data.</StyledText>
      </LinearGradient>
    );
  }

  return (
    <EntryList
      title="People"
      action={canInvite ? "Invite" : undefined}
      onAction={
        canInvite
          ? () =>
              router.push({
                pathname: "/tenants/property/new-invite",
                params: { fileId: file.id },
              })
          : undefined
      }
    >
      {file.household.map((person) => (
        <EntryRow
          key={person.id}
          title={`${person.givenName} ${person.familyName}`}
          detail={personDetail(person.isLead, person.invitedBy)}
          status={STATUS[person.inviteStatus]}
          onPress={() =>
            router.push({
              pathname: "/tenants/property/invite/[personId]",
              params: { personId: person.id, fileId: file.id },
            })
          }
        />
      ))}
    </EntryList>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
