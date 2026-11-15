import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCases } from "@/hooks/useCases";
import CaseFilters from "@/components/agency/reports/CaseFilters";
import CaseRow from "@/components/agency/reports/CaseRow";
import { STATUS_LABEL } from "@/components/agency/reports/caseText";
import { CaseStatus } from "@/types/agency/CaseInterface";

const ReportScreen = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const [status, setStatus] = useState<CaseStatus>("open");
  const cases = useCases(status);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open a case"
        style={[styles.add, { backgroundColor: textColor }]}
        onPress={() => router.push("/agency/report/new")}
      >
        <StyledText style={styles.addLabel} color={backgroundColor}>
          Open a case
        </StyledText>
      </Pressable>
      <CaseFilters value={status} onChange={setStatus} />
      {cases.length === 0 ? (
        <StyledText style={[styles.empty, { color: iconColor }]}>
          Nothing is {STATUS_LABEL[status].toLowerCase()}.
        </StyledText>
      ) : (
        <View style={styles.list}>
          {cases.map((item) => (
            <CaseRow key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 12,
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

  list: {
    gap: 8,
  },

  empty: {
    fontSize: 14,
    lineHeight: 20,
  },
});
