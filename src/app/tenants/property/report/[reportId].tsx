import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import { useTenantReport } from "@/hooks/useTenantProperty";
import Fact from "@/components/agency/properties/Fact";
import { CaseCategory, CaseStatus, CaseUrgency } from "@/types/agency/CaseInterface";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

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

const ReportScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ reportId: string; fileId?: string }>();
  const report = useTenantReport(asId(params.fileId), asId(params.reportId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const warning = useThemeColor({}, "warning");

  if (!report) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This report isn't on the property file.</StyledText>
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
      <View style={[styles.badge, { backgroundColor: warning + "22" }]}>
        <StyledText style={[styles.badgeText, { color: warning }]}>{STATUS[report.status]}</StyledText>
      </View>
      <StyledText style={[styles.title, { color: textColor }]}>{report.title}</StyledText>
      <StyledText style={[styles.note, { color: iconColor }]}>
        Raised {formatDate(report.openedOn)}
      </StyledText>
      <View style={styles.facts}>
        <Fact label="Where" value={report.location} />
        <Fact label="Kind" value={CATEGORY[report.category]} />
        <Fact label="Urgency" value={URGENCY[report.urgency]} />
      </View>
    </ScrollView>
  );
};

export default ReportScreen;

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

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
});
