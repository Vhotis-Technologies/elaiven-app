import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import Fact from "@/components/agency/properties/Fact";
import {
  EmploymentStatus,
  HouseholdApplicant,
  HousingSituation,
  ApplicationDetail,
} from "@/types/agency/properties/ApplicationInterface";
import { PropertyDetailData } from "@/types/agency/properties/PropertyInterface";
import { formatViewing, householdLine } from "./applicationText";

type Props = {
  application: ApplicationDetail;
  property: PropertyDetailData;
};

const HOUSING: Record<HousingSituation, string> = {
  renting: "Renting",
  homeless: "Homeless",
  with_friends: "Staying with friends",
  family: "Living with family",
  owner: "Owns their current home",
  notice_given: "Notice given where they live now",
};

function workLine(person: HouseholdApplicant): string {
  const status: EmploymentStatus | null = person.employmentStatus;
  if (!status) return "";
  if (status === "student") return person.employerName ? `Student at ${person.employerName}` : "Student";
  if (status === "retired") return "Retired";
  if (status === "not_working" || status === "unemployed") return "Not working";
  if (status === "self_employed") return person.jobTitle ? `Self-employed ${person.jobTitle}` : "Self-employed";
  if (person.jobTitle && person.employerName) return `${person.jobTitle} at ${person.employerName}`;
  return person.jobTitle || "Employed";
}

function ApplicantBlock({ person }: { person: HouseholdApplicant }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const tint = useThemeColor({}, "tint");

  return (
    <View style={[styles.person, { backgroundColor: cardColor, borderColor }]}>
      <View style={styles.nameRow}>
        <StyledText style={[styles.name, { color: textColor }]}>
          {person.givenName} {person.familyName}
        </StyledText>
        {person.isLead ? (
          <View style={[styles.badge, { backgroundColor: tint + "22" }]}>
            <StyledText style={[styles.badgeText, { color: tint }]}>Lead</StyledText>
          </View>
        ) : null}
      </View>
      {person.dateOfBirth ? (
        <StyledText style={[styles.line, { color: iconColor }]}>
          Born {formatDate(person.dateOfBirth)}
        </StyledText>
      ) : null}
      {person.housingSituation ? (
        <StyledText style={[styles.line, { color: textColor }]}>{HOUSING[person.housingSituation]}</StyledText>
      ) : null}
      {workLine(person) ? (
        <StyledText style={[styles.line, { color: textColor }]}>{workLine(person)}</StyledText>
      ) : null}
      {person.currentAddress ? (
        <StyledText style={[styles.line, { color: iconColor }]}>{person.currentAddress}</StyledText>
      ) : null}
      <StyledText style={[styles.line, { color: iconColor }]}>
        {person.email} · {person.phone}
      </StyledText>
    </View>
  );
}

/** Phase 1. An applicant shows why the filter passed them. An operator invite shows the link. */
const ApplicationForm = ({ application, property }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const stay = application.intendedMonths ? `${application.intendedMonths} months` : "Open ended";
  const asked = application.applicants.length === 2 ? "both applicants" : "every applicant";
  const link = application.inviteLink;
  const applied = application.origin === "applicant";
  const people = application.adults + application.children;

  return (
    <View style={styles.wrap}>
      {applied ? (
        <>
          <StyledText style={[styles.heading, { color: textColor }]}>Why they qualify</StyledText>
          <StyledText style={[styles.point, { color: textColor }]}>
            {people} {people === 1 ? "person" : "people"} in the household. This property allows {property.maxOccupants}.
          </StyledText>
          <StyledText style={[styles.point, { color: textColor }]}>
            Move-in {formatDate(application.desiredMoveIn)}. The property is free from {formatDate(property.availableFrom)}.
          </StyledText>
          <StyledText style={[styles.point, { color: textColor }]}>The form is complete.</StyledText>
        </>
      ) : (
        <>
          <StyledText style={[styles.heading, { color: textColor }]}>Link sent</StyledText>
          {link ? (
            <>
              <StyledText style={[styles.point, { color: textColor }]}>{link.url}</StyledText>
              <StyledText style={[styles.point, { color: iconColor }]}>
                Sent {formatDate(link.sentAt.slice(0, 10))}. They open this to come onto Elaiven.
              </StyledText>
            </>
          ) : (
            <StyledText style={[styles.point, { color: iconColor }]}>No link has been sent.</StyledText>
          )}
        </>
      )}

      {application.referencesRequestedAt ? (
        <StyledText style={[styles.point, { color: iconColor }]}>
          References requested from {asked} on {formatDate(application.referencesRequestedAt.slice(0, 10))}.
        </StyledText>
      ) : null}

      <StyledText style={[styles.heading, { color: textColor }]}>
        {applied ? "What they sent" : "What you entered"}
      </StyledText>
      <View style={styles.facts}>
        <Fact label="Household" value={householdLine(application)} />
        <Fact label="Pets" value={application.petsNote} />
        <Fact label="Move-in" value={formatDate(application.desiredMoveIn)} />
        <Fact label="Stay" value={stay} />
        {application.viewing ? (
          <Fact label="Viewing" value={formatViewing(application.viewing.scheduledFor)} />
        ) : null}
      </View>
      {application.children > 0 ? (
        <StyledText style={[styles.point, { color: iconColor }]}>
          {application.children === 1 ? "One child" : `${application.children} children`} will live here. A reference is asked of the adults only.
        </StyledText>
      ) : null}

      {application.applicants.map((person) => (
        <ApplicantBlock key={person.email} person={person} />
      ))}
    </View>
  );
};

export default ApplicationForm;

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },

  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
    marginTop: 4,
  },

  point: {
    fontSize: 15,
    lineHeight: 21,
  },

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  person: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 12,
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

  line: {
    fontSize: 14,
    lineHeight: 20,
  },
});
