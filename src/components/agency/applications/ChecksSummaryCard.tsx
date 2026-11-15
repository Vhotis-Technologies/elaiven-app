import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatFull } from "@/components/agency/analytics/format";
import { recommendation } from "@/data/agency/applicationMachine";
import { ChecksSummary } from "@/types/properties/ApplicationInterface";

type Props = {
  checks: ChecksSummary;
};

type Tone = "good" | "bad" | "neutral";

function Line({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const success = useThemeColor({}, "success");
  const error = useThemeColor({}, "error");
  const color = tone === "good" ? success : tone === "bad" ? error : textColor;

  return (
    <View style={styles.line}>
      <StyledText style={[styles.label, { color: iconColor }]}>{label}</StyledText>
      <StyledText style={[styles.value, { color }]}>{value}</StyledText>
    </View>
  );
}

function result(value: ChecksSummary["affordability"]): { value: string; tone: Tone } {
  return value === "pass" ? { value: "Passed", tone: "good" } : { value: "Not passed", tone: "bad" };
}

/** The decision screen. One income figure and results. No income source here. */
const ChecksSummaryCard = ({ checks }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  const advice = recommendation(checks);
  const affordability = result(checks.affordability);
  const identity = result(checks.identity);
  const reference =
    checks.reference === "not_required"
      ? { value: "Not required", tone: "neutral" as Tone }
      : result(checks.reference);
  const credit =
    checks.credit === "unavailable"
      ? { value: "Not available", tone: "neutral" as Tone }
      : result(checks.credit);

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.title, { color: textColor }]}>What Elaiven noted</StyledText>
      <Line
        label="Recommendation"
        value={advice}
        tone={advice === "Proceed" ? "good" : "bad"}
      />
      <Line
        label="Verified income"
        value={`${formatFull(checks.verifiedMonthlyIncome, checks.currency)} / month`}
        tone="neutral"
      />
      <Line label="Affordability" {...affordability} />
      <Line label="Reference" {...reference} />
      <Line label="ID" {...identity} />
      <Line label="Credit" {...credit} />
      <Line
        label="Occupancy fit"
        value={checks.occupancyFit === "within" ? "Within the limit" : "Over the limit"}
        tone={checks.occupancyFit === "within" ? "good" : "bad"}
      />
      <StyledText style={[styles.note, { color: iconColor }]}>
        A recommendation only. Passing someone on is still your decision.
      </StyledText>
    </View>
  );
};

export default ChecksSummaryCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },

  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
  },

  value: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  note: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
