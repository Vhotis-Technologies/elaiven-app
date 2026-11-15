import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatFull } from "@/components/agency/analytics/format";
import { IncomeSource } from "@/types/agency/properties/ApplicationInterface";

type Props = {
  sources: IncomeSource[];
  currency: string;
};

/** Only rendered once the application is accepted. */
const IncomeSourceCard = ({ sources, currency }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const total = sources.reduce((sum, source) => sum + source.amountMonthly, 0);

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.title, { color: textColor }]}>
        Income sources
      </StyledText>
      <StyledText style={[styles.note, { color: iconColor }]}>
        Opened because this application is accepted. For the paperwork and the
        payment split.
      </StyledText>
      {sources.map((source) => (
        <View key={source.label} style={styles.line}>
          <StyledText style={[styles.label, { color: textColor }]}>
            {source.label}
          </StyledText>
          <StyledText style={[styles.value, { color: textColor }]}>
            {formatFull(source.amountMonthly, currency)}
          </StyledText>
        </View>
      ))}
      <View style={[styles.line, styles.total, { borderColor }]}>
        <StyledText style={[styles.label, { color: iconColor }]}>
          Total each month
        </StyledText>
        <StyledText style={[styles.value, { color: textColor }]}>
          {formatFull(total, currency)}
        </StyledText>
      </View>
    </View>
  );
};

export default IncomeSourceCard;

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

  note: {
    fontSize: 12,
    lineHeight: 16,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  total: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },

  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  value: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },
});
