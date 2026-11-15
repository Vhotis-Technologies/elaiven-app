import { ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import AnalyticsTopBar from "@/components/agency/analytics/AnalyticsTopBar";
import LettingsOverview from "@/components/agency/analytics/LettingsOverview";
import StaffPerformance from "@/components/agency/analytics/StaffPerformance";
import { PERIOD_OPTIONS } from "@/components/agency/analytics/PeriodToggle";
import { axisCeiling } from "@/components/agency/analytics/format";
import { staffList } from "@/data/agency/staffPerformance";
import {
  AnalyticsPeriod,
  ChartPoint,
  LettingsOverviewData,
} from "@/types/agency/AnalyticsInterfaces";

const CURRENCY = "£";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** The five years before this one. 2026 shows 2021–2025. */
function previousYears(): string[] {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => String(thisYear - 5 + index));
}

function overviewFrom(points: ChartPoint[], changePercent: number): LettingsOverviewData {
  const peak = points.reduce(
    (best, point, index) => (point.value > points[best].value ? index : best),
    0,
  );
  return {
    total: points.reduce((sum, point) => sum + point.value, 0),
    changePercent,
    currency: CURRENCY,
    axisMax: axisCeiling(points[peak].value),
    highlightIndex: peak,
    points,
  };
}

// Placeholder rent until agreements can be totalled. The highlighted bar is the peak.
const OVERVIEW: Record<AnalyticsPeriod, LettingsOverviewData> = {
  weekly: overviewFrom(
    [18000, 22000, 41000, 19000, 27000, 12000, 8000].map((value, index) => ({
      label: DAYS[index],
      value,
    })),
    4.2,
  ),
  monthly: overviewFrom(
    [42000, 38000, 55000, 48000, 62000, 44000, 51000, 70000, 46000, 58000, 40000, 36000].map(
      (value, index) => ({ label: MONTHS[index], value }),
    ),
    -8.6,
  ),
  yearly: overviewFrom(
    [1_100_000, 1_400_000, 1_250_000, 1_800_000, 2_100_000].map((value, index) => ({
      label: previousYears()[index],
      value,
    })),
    12.4,
  ),
};

const AnalyticScreen = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const comparison = PERIOD_OPTIONS.find((option) => option.id === period)?.comparison;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AnalyticsTopBar period={period} onPeriodChange={setPeriod} />

      <StyledText style={[styles.title, { color: textColor }]}>
        Analytics Overview
      </StyledText>

      <LettingsOverview {...OVERVIEW[period]} periodLabel={comparison ?? ""} />

      <StaffPerformance
        staff={staffList(period)}
        currency={CURRENCY}
        onStaffPress={(staffId) =>
          router.push({
            pathname: "/agency/analytics/[staffId]",
            params: { staffId, period },
          })
        }
      />
    </ScrollView>
  );
};

export default AnalyticScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 22,
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: "BarlowMedium",
  },
});
