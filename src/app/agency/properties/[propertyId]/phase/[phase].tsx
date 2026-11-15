import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePhaseApplications } from "@/hooks/useApplications";
import { ApplicationPhase, PHASES } from "@/data/agency/applicationMachine";
import { propertyDetail } from "@/data/agency/properties";
import ApplicationRow from "@/components/agency/applications/ApplicationRow";
import { ApplicationDetail } from "@/types/properties/ApplicationInterface";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function asPhase(value: string | string[] | undefined): ApplicationPhase | null {
  const id = asId(value);
  return PHASES.some((phase) => phase.id === id) ? (id as ApplicationPhase) : null;
}

const PhaseScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId: string; phase: string }>();
  const propertyId = asId(params.propertyId);
  const phase = asPhase(params.phase);
  const property = propertyDetail(propertyId);
  const applications = usePhaseApplications(propertyId, phase ?? "viewing");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const info = PHASES.find((item) => item.id === phase);

  if (!phase || !info) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This phase isn't part of the flow.</StyledText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <StyledText style={[styles.title, { color: textColor }]}>{info.title}</StyledText>
      <StyledText style={[styles.detail, { color: textColor }]}>{info.detail}</StyledText>
      {property ? (
        <StyledText style={[styles.note, { color: iconColor }]}>{property.title}</StyledText>
      ) : null}
      <StyledText style={[styles.note, { color: iconColor }]}>{info.note}</StyledText>

      {phase === "viewing" ? (
        <Pressable
          style={[styles.add, { backgroundColor: textColor }]}
          onPress={() =>
            router.push({
              pathname: "/agency/properties/[propertyId]/invite",
              params: { propertyId },
            })
          }
        >
          <StyledText style={styles.addLabel} color={backgroundColor}>
            Add a household
          </StyledText>
        </Pressable>
      ) : null}

      {phase === "viewing" ? (
        <View style={styles.groups}>
          <Group
            title="Applied"
            note="They applied on Elaiven and passed the filter."
            applications={applications.filter((application) => application.state === "eligible")}
            empty="No one is waiting for an invite."
          />
          <Group
            title="Invited"
            note="A viewing is booked, including households you entered."
            applications={applications.filter((application) => application.state === "viewing_invited")}
            empty="No viewing is booked yet."
          />
        </View>
      ) : applications.length === 0 ? (
        <StyledText style={[styles.note, { color: iconColor }]}>No one is in this phase.</StyledText>
      ) : (
        applications.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))
      )}
    </ScrollView>
  );
};

function Group({
  title,
  note,
  applications,
  empty,
}: {
  title: string;
  note: string;
  applications: ApplicationDetail[];
  empty: string;
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  return (
    <View style={styles.group}>
      <StyledText style={[styles.groupTitle, { color: textColor }]}>{title}</StyledText>
      <StyledText style={[styles.note, { color: iconColor }]}>{note}</StyledText>
      {applications.length === 0 ? (
        <StyledText style={[styles.note, { color: iconColor }]}>{empty}</StyledText>
      ) : (
        applications.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))
      )}
    </View>
  );
}

export default PhaseScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 5,
  },

  title: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  detail: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
    marginTop: -6,
  },

  note: {
    fontSize: 14,
    lineHeight: 20,
  },

  add: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  addLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  groups: {
    gap: 16,
    marginTop: 8,
  },

  group: {
    gap: 6,
  },

  groupTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
  },
});
