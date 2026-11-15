import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTenantPerson, useTenantProperty } from "@/hooks/useTenantProperty";
import { inviteUrl } from "@/data/agency/inviteLink";
import { HouseholdInviteStatus } from "@/types/tenants/PropertyFile";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const STATUS: Record<HouseholdInviteStatus, string> = {
  sent: "Link sent",
  opened: "Opened",
  joined: "Joined",
};

function followLine(status: HouseholdInviteStatus, fromYou: boolean): string {
  if (status === "joined") return "They have joined this property.";
  if (status === "opened") return "They opened the link and have not joined yet.";
  if (fromYou) return "You sent this link. They have not opened it.";
  return "The agency sent this link. They have not opened it.";
}

const InviteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ personId: string; fileId?: string }>();
  const fileId = asId(params.fileId);
  const file = useTenantProperty(fileId);
  const person = useTenantPerson(fileId, asId(params.personId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const warning = useThemeColor({}, "warning");
  const success = useThemeColor({}, "success");

  if (!person || !file) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This invite isn't on the property file.</StyledText>
      </View>
    );
  }

  const fromYou = person.invitedBy === "tenant";
  const badgeColor = person.inviteStatus === "joined" ? success : warning;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>
      <View style={[styles.badge, { backgroundColor: badgeColor + "22" }]}>
        <StyledText style={[styles.badgeText, { color: badgeColor }]}>
          {STATUS[person.inviteStatus]}
        </StyledText>
      </View>
      <StyledText style={[styles.title, { color: textColor }]}>
        {person.givenName} {person.familyName}
      </StyledText>
      <StyledText style={[styles.note, { color: textColor }]}>
        {followLine(person.inviteStatus, fromYou)}
      </StyledText>
      <StyledText style={[styles.note, { color: iconColor }]}>
        {fromYou ? "You sent the link." : `${file.invitedByName} sent the link for the agency.`}
      </StyledText>
      <StyledText style={[styles.linkLabel, { color: iconColor }]}>Join link</StyledText>
      <StyledText selectable style={[styles.link, { color: textColor }]}>
        {inviteUrl(person.token)}
      </StyledText>
    </ScrollView>
  );
};

export default InviteScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 128,
    gap: 12,
  },

  badge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  note: {
    fontSize: 15,
    lineHeight: 22,
  },

  linkLabel: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },

  link: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },
});
