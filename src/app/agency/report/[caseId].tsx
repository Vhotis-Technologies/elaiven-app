import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCase } from "@/hooks/useCases";
import { applyCaseAction } from "@/data/agency/cases";
import Fact from "@/components/agency/properties/Fact";
import CaseActions from "@/components/agency/reports/CaseActions";
import CaseThread from "@/components/agency/reports/CaseThread";
import { CATEGORY_LABEL, STATUS_LABEL, URGENCY_LABEL, formatWhen } from "@/components/agency/reports/caseText";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const CaseScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ caseId: string }>();
  const item = useCase(asId(params.caseId));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  if (!item) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This case isn't in the sample data.</StyledText>
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

      <StyledText style={[styles.title, { color: textColor }]}>{CATEGORY_LABEL[item.category]}</StyledText>
      <StyledText style={[styles.sub, { color: iconColor }]}>
        {item.address} · Opened {formatWhen(item.createdAt)}
      </StyledText>
      <StyledText style={[styles.by, { color: textColor }]}>
        {item.openedByRole === "operator" ? `Opened by ${item.openedByName}` : `Raised by ${item.openedByName}`}
      </StyledText>

      <View style={styles.facts}>
        <Fact label="Status" value={STATUS_LABEL[item.status]} />
        <Fact label="Urgency" value={URGENCY_LABEL[item.urgency]} />
        {item.acknowledgedAt ? <Fact label="Acknowledged" value={formatWhen(item.acknowledgedAt)} /> : null}
      </View>

      <CaseActions item={item} onAct={(action) => applyCaseAction(item.id, action)} />
      <CaseThread messages={item.messages} />
    </ScrollView>
  );
};

export default CaseScreen;

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
    paddingBottom: 100,
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

  by: {
    fontSize: 15,
    lineHeight: 20,
  },

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
});
