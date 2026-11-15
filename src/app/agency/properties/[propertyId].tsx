import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useApplications } from "@/hooks/useApplications";
import { formatDate, formatFull } from "@/components/agency/analytics/format";
import { propertyImageSource } from "@/components/agency/properties/propertyImage";
import { PHASES, phaseOf } from "@/data/agency/applicationMachine";
import Fact from "@/components/agency/properties/Fact";
import PhaseRow from "@/components/agency/properties/PhaseRow";
import { propertyDetail } from "@/data/agency/properties";
import { PropertyArrangement } from "@/types/agency/properties/PropertyInterface";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const ARRANGEMENT: Record<PropertyArrangement, string> = {
  whole: "Whole property",
  shared_room: "Room in a shared property",
  owner_room: "Room in the owner's home",
};

const STATUS: Record<string, string> = {
  draft: "Draft",
  published: "Available",
  let: "Let",
  withdrawn: "Withdrawn",
};

const PropertyScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId: string }>();
  const propertyId = asId(params.propertyId);
  const property = propertyDetail(propertyId);
  const applications = useApplications(propertyId);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const success = useThemeColor({}, "success");

  if (!property) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This property isn't in the sample data.</StyledText>
      </View>
    );
  }

  const frequency = property.rentFrequency === "weekly" ? "week" : "month";
  const address = [property.addressLine1, property.addressLine2, property.city, property.postcode]
    .filter(Boolean)
    .join(", ");

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>

      <Image source={propertyImageSource(property.imageUrl)} style={styles.image} />

      <View style={styles.titleRow}>
        <StyledText style={[styles.title, { color: textColor }]}>{property.title}</StyledText>
        <View style={[styles.badge, { backgroundColor: success + "22" }]}>
          <StyledText style={[styles.badgeText, { color: success }]}>
            {STATUS[property.status]}
          </StyledText>
        </View>
      </View>

      <StyledText style={[styles.address, { color: iconColor }]}>{address}</StyledText>
      <StyledText style={[styles.rent, { color: success }]}>
        {formatFull(property.rentAmount, property.currency)} / {frequency}
      </StyledText>

      <View style={styles.facts}>
        <Fact label="Deposit" value={formatFull(property.depositAmount, property.currency)} />
        <Fact label="Available" value={formatDate(property.availableFrom)} />
        <Fact label="Arrangement" value={ARRANGEMENT[property.arrangement]} />
        <Fact label="Owner" value={property.ownerName} />
      </View>

      <StyledText style={[styles.body, { color: textColor }]}>{property.description}</StyledText>

      {PHASES.map((phase) => (
        <PhaseRow
          key={phase.id}
          phase={phase.id}
          count={applications.filter((application) => phaseOf(application.state) === phase.id).length}
          onPress={() =>
            router.push({
              pathname: "/agency/properties/[propertyId]/phase/[phase]",
              params: { propertyId, phase: phase.id },
            })
          }
        />
      ))}
    </ScrollView>
  );
};

export default PropertyScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 12,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  title: {
    flex: 1,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 6,
  },

  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  address: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: -4,
  },

  rent: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "BarlowMedium",
  },

  facts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
