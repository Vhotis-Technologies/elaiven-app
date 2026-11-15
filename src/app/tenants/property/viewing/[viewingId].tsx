import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import { recordTenantViewing } from "@/data/tenants/propertyFile";
import { useTenantViewing } from "@/hooks/useTenantProperty";
import { TenantViewingOutcome, TenantViewingStatus } from "@/types/tenants/PropertyFile";

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

const STATUS: Record<TenantViewingStatus, string> = {
  scheduled: "Scheduled",
  attended: "Attended",
  no_show: "Did not attend",
  cancelled: "Cancelled",
};

const OUTCOME: Record<TenantViewingOutcome, string> = {
  attended: "You attended this viewing.",
  no_show: "You did not attend this viewing.",
  cancelled: "This viewing was cancelled.",
};

const ACTIONS: { outcome: TenantViewingOutcome; label: string }[] = [
  { outcome: "attended", label: "I attended" },
  { outcome: "no_show", label: "I didn't attend" },
  { outcome: "cancelled", label: "Cancel the viewing" },
];

const ViewingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ viewingId: string; fileId?: string }>();
  const fileId = asId(params.fileId);
  const viewing = useTenantViewing(fileId, asId(params.viewingId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const warning = useThemeColor({}, "warning");
  const success = useThemeColor({}, "success");

  if (!viewing) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This viewing isn't on the property file.</StyledText>
      </View>
    );
  }

  const open = viewing.status === "scheduled";
  const badgeColor = viewing.status === "attended" ? success : warning;

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
        <StyledText style={[styles.badgeText, { color: badgeColor }]}>{STATUS[viewing.status]}</StyledText>
      </View>
      <StyledText style={[styles.title, { color: textColor }]}>
        {open ? "Upcoming viewing" : "Viewing"}
      </StyledText>
      <StyledText style={[styles.note, { color: textColor }]}>
        {formatWhen(viewing.scheduledFor)} with {viewing.withName}.
      </StyledText>
      {open ? (
        <View style={styles.actions}>
          <StyledText style={[styles.note, { color: iconColor }]}>
            Record what happened on the day.
          </StyledText>
          {ACTIONS.map((action) => (
            <Pressable
              key={action.outcome}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={() => recordTenantViewing(viewing.id, action.outcome, fileId)}
              style={[styles.action, { borderColor: textColor }]}
            >
              <StyledText style={[styles.actionLabel, { color: textColor }]}>{action.label}</StyledText>
            </Pressable>
          ))}
        </View>
      ) : (
        <StyledText style={[styles.note, { color: iconColor }]}>
          {OUTCOME[viewing.status as TenantViewingOutcome]}
        </StyledText>
      )}
    </ScrollView>
  );
};

export default ViewingScreen;

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

  actions: {
    gap: 8,
    marginTop: 8,
  },

  action: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  actionLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },
});
