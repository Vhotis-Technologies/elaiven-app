import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import StyledText from "@/components/helpers/StyledText";
import { formatFull } from "@/components/agency/analytics/format";
import { propertyImageSource } from "@/components/agency/properties/propertyImage";
import { propertyDetail } from "@/data/agency/properties";
import { useTenantProperties } from "@/hooks/useTenantProperty";
import { holdingLabel } from "@/components/tenants/property/placeCopy";
import { TenantHolding } from "@/types/tenants/PropertyFile";

const INK = "#1C1C1E";
const MUTED = "#8E8E93";
const ORDER: Record<TenantHolding, number> = { given: 0, invited: 1, applied: 2 };

const PropertyIndex = () => {
  const router = useRouter();
  const files = useTenantProperties();
  const places = [...files].sort((a, b) => ORDER[a.holding] - ORDER[b.holding]);

  return (
    <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.column}>
          <StyledText style={styles.title}>My properties</StyledText>
          {places.map((file) => {
            const property = propertyDetail(file.propertyId);
            if (!property) return null;
            const rent = `${formatFull(property.rentAmount, property.currency)} / ${
              property.rentFrequency === "weekly" ? "week" : "month"
            }`;
            return (
              <Pressable
                key={file.id}
                accessibilityRole="button"
                accessibilityLabel={`${property.title}. ${holdingLabel(file.holding)}`}
                onPress={() =>
                  router.push({
                    pathname: "/tenants/property/PropertyScreen",
                    params: { fileId: file.id },
                  })
                }
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              >
                <View style={styles.photoWrap}>
                  <Image
                    source={propertyImageSource(property.imageUrl)}
                    style={styles.photo}
                    contentFit="cover"
                  />
                  <View style={styles.pill}>
                    <StyledText style={styles.pillText}>{holdingLabel(file.holding)}</StyledText>
                  </View>
                </View>
                <StyledText style={styles.name}>{property.title}</StyledText>
                <StyledText style={styles.meta}>
                  {property.city} · {rent}
                </StyledText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PropertyIndex;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    alignItems: "center",
    paddingBottom: 140,
  },

  column: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 22,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  card: {
    gap: 8,
  },

  photoWrap: {
    height: 196,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#111111",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  pill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  pillText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  name: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  meta: {
    fontSize: 14,
    lineHeight: 19,
    color: MUTED,
  },

  pressed: {
    opacity: 0.72,
  },
});
