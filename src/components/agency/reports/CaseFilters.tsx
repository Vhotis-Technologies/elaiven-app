import { Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CaseStatus } from "@/types/agency/CaseInterface";
import { STATUS_LABEL } from "./caseText";

const OPTIONS: CaseStatus[] = ["open", "acknowledged", "answered", "closed"];

type Props = {
  value: CaseStatus;
  onChange: (status: CaseStatus) => void;
};

const CaseFilters = ({ value, onChange }: Props) => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {OPTIONS.map((status) => {
        const selected = status === value;
        return (
          <Pressable
            key={status}
            onPress={() => onChange(status)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, { backgroundColor: selected ? textColor : cardColor }]}
          >
            <StyledText style={styles.label} color={selected ? backgroundColor : textColor}>
              {STATUS_LABEL[status]}
            </StyledText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default CaseFilters;

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingRight: 10,
  },

  chip: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },
});
