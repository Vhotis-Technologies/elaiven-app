import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { formatFull } from "@/components/agency/analytics/format";
import { propertyImageSource } from "@/components/agency/properties/propertyImage";
import { propertyDetail } from "@/data/agency/properties";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import {
  holdingLabel,
  peopleSummary,
  placeDate,
  reportSummary,
  viewingSummary,
} from "@/components/tenants/property/placeCopy";

const INK = "#1C1C1E";
const MUTED = "#8E8E93";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const PropertyScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId?: string }>();
  const file = useTenantProperty(asId(params.fileId));
  const property = file ? propertyDetail(file.propertyId) : undefined;

  function leave() {
    if (router.canGoBack()) router.back();
    else router.replace("/tenants/property/index");
  }

  if (!file || !property) {
    return (
      <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.screen}>
        <View style={styles.missing}>
          <StyledText style={styles.missingText}>This property isn't in the sample data.</StyledText>
        </View>
      </LinearGradient>
    );
  }

  const frequency = property.rentFrequency === "weekly" ? "week" : "month";
  const rows = [
    {
      key: "reports",
      icon: "build" as const,
      title: "Reports",
      detail: reportSummary(file),
      pathname: "/tenants/property/reports" as const,
    },
    {
      key: "people",
      icon: "group" as const,
      title: "People",
      detail: peopleSummary(file),
      pathname: "/tenants/property/people" as const,
    },
    {
      key: "viewings",
      icon: "event" as const,
      title: "Viewings",
      detail: viewingSummary(file),
      pathname: "/tenants/property/viewings" as const,
    },
  ];

  return (
    <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.column}>
          <View style={styles.hero}>
            <Image source={propertyImageSource(property.imageUrl)} style={styles.photo} contentFit="cover" />
            <LinearGradient
              colors={["#00000000", "#00000066", "#000000CC"]}
              style={styles.shade}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={leave}
              style={styles.back}
            >
              <MaterialIcons name="chevron-left" size={26} color={INK} />
            </Pressable>
            <View style={styles.heroCopy}>
              <View style={styles.pill}>
                <StyledText style={styles.pillText}>{holdingLabel(file.holding)}</StyledText>
              </View>
              <StyledText style={styles.heroTitle}>{property.title}</StyledText>
              <StyledText style={styles.heroCity}>{property.city}</StyledText>
            </View>
          </View>

          <StyledText style={styles.rent}>
            {formatFull(property.rentAmount, property.currency)}
            <StyledText style={styles.frequency}> / {frequency}</StyledText>
          </StyledText>
          <StyledText style={styles.date}>{placeDate(file)}</StyledText>

          <View style={styles.rows}>
            {rows.map((row) => (
              <Pressable
                key={row.key}
                accessibilityRole="button"
                accessibilityLabel={`${row.title}. ${row.detail}`}
                onPress={() =>
                  router.push({
                    pathname: row.pathname,
                    params: { fileId: file.id },
                  })
                }
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <View style={styles.icon}>
                  <MaterialIcons name={row.icon} size={18} color={INK} />
                </View>
                <View style={styles.rowCopy}>
                  <StyledText style={styles.rowTitle}>{row.title}</StyledText>
                  <StyledText style={styles.rowDetail}>{row.detail}</StyledText>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={MUTED} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PropertyScreen;

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
    paddingTop: 8,
  },

  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  missingText: {
    fontSize: 16,
    lineHeight: 22,
    color: INK,
  },

  hero: {
    height: 280,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#111111",
    justifyContent: "flex-end",
  },

  photo: StyleSheet.absoluteFill,

  shade: StyleSheet.absoluteFill,

  back: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCopy: {
    padding: 18,
    gap: 4,
  },

  pill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  pillText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
    color: "#FFFFFF",
  },

  heroCity: {
    fontSize: 15,
    lineHeight: 20,
    color: "#E5E5EA",
  },

  rent: {
    marginTop: 20,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  frequency: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowRegular",
    color: MUTED,
  },

  date: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: MUTED,
  },

  rows: {
    marginTop: 22,
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F1EC",
    alignItems: "center",
    justifyContent: "center",
  },

  rowCopy: {
    flex: 1,
    gap: 2,
  },

  rowTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  rowDetail: {
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },

  pressed: {
    opacity: 0.72,
  },
});
