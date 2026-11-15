import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import PropertyCard from "@/components/agency/properties/PropertyCard";
import PropertyFilters, { PropertyFilter } from "@/components/agency/properties/PropertyFilters";
import { propertyList } from "@/data/agency/properties";

const PropertiesScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [filter, setFilter] = useState<PropertyFilter>("all");
  const properties = propertyList().filter(
    (property) => filter === "all" || property.arrangement === filter,
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PropertyFilters value={filter} onChange={setFilter} />
      <View style={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </View>
    </ScrollView>
  );
};

export default PropertiesScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 15,
  },

  title: {
    fontSize: 28,
    lineHeight: 12,
    fontFamily: "BarlowMedium",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
});
