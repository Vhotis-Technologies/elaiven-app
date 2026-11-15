import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import PeriodToggle, { PERIOD_OPTIONS } from "@/components/agency/analytics/PeriodToggle";
import RentChart from "@/components/agency/analytics/RentChart";
import StaffDetailHeader from "@/components/agency/analytics/StaffDetailHeader";
import StaffLettingRow from "@/components/agency/analytics/StaffLettingRow";
import StaffSummary from "@/components/agency/analytics/StaffSummary";
import { axisCeiling } from "@/components/agency/analytics/format";
import { staffDetail } from "@/data/agency/staffPerformance";
import { AnalyticsPeriod } from "@/types/agency/AnalyticsInterfaces";

function asPeriod(value: string | string[] | undefined): AnalyticsPeriod {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "weekly" || raw === "monthly" || raw === "yearly") return raw;
  return "monthly";
}

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const StaffPerformanceScreen = () => {
  const params = useLocalSearchParams<{ staffId: string; period?: string }>();
  const [period, setPeriod] = useState<AnalyticsPeriod>(asPeriod(params.period));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const detail = staffDetail(asId(params.staffId), period);
  const comparison = PERIOD_OPTIONS.find((option) => option.id === period)?.comparison ?? "";

  if (!detail) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This staff member isn't in the sample data.</StyledText>
      </View>
    );
  }

  const peak = detail.series.reduce(
    (best, point, index) => (point.rent > detail.series[best].rent ? index : best),
    0,
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StaffDetailHeader staff={detail.staff} />

      <PeriodToggle value={period} onChange={setPeriod} />

      <StaffSummary summary={detail.summary} periodLabel={comparison} />

      <RentChart
        points={detail.series.map((point) => ({ label: point.label, value: point.rent }))}
        axisMax={axisCeiling(detail.series[peak]?.rent ?? 0)}
        highlightIndex={peak}
        currency={detail.summary.currency}
      />

      <View>
        <StyledText style={[styles.section, { color: textColor }]}>Lettings</StyledText>
        {detail.lettings.map((letting, index) => (
          <StaffLettingRow
            key={letting.agreementId}
            letting={letting}
            isLast={index === detail.lettings.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default StaffPerformanceScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 22,
  },

  section: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
    marginBottom: 4,
  },
});
