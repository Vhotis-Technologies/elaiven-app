import { Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PropertyArrangement } from "@/types/agency/properties/PropertyInterface";

export type PropertyFilter = "all" | PropertyArrangement;

const OPTIONS: { id: PropertyFilter; label: string }[] = [
  { id: "all", label: "All properties" },
  { id: "whole", label: "Whole" },
  { id: "shared_room", label: "Shared" },
  { id: "owner_room", label: "In home" },
];

type Props = {
  value: PropertyFilter;
  onChange: (filter: PropertyFilter) => void;
};

const PropertyFilters = ({ value, onChange }: Props) => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              { backgroundColor: selected ? textColor : cardColor },
            ]}
          >
            <StyledText
              style={styles.label}
              color={selected ? backgroundColor : textColor}
            >
              {option.label}
            </StyledText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default PropertyFilters;

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingRight: 20,
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
