import { Image, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatFull } from "@/components/agency/analytics/format";
import { PropertyCardData } from "@/types/agency/properties/PropertyInterface";
import { propertyImageSource } from "./propertyImage";

type Props = {
  property: PropertyCardData;
};

const STATUS_LABEL: Record<PropertyCardData["status"], string> = {
  draft: "Draft",
  published: "Available",
  let: "Let",
  withdrawn: "Withdrawn",
};

const PropertyCard = ({ property }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const success = useThemeColor({}, "success");
  const frequency = property.rentFrequency === "weekly" ? "wk" : "mo";

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardColor, borderColor }]}
      onPress={() =>
        router.push({
          pathname: "/agency/properties/[propertyId]",
          params: { propertyId: property.id },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={property.title}
    >
      <Image
        source={propertyImageSource(property.imageUrl)}
        style={styles.image}
      />
      <View style={[styles.status, { backgroundColor: textColor }]}>
        <StyledText style={styles.statusText}>
          {STATUS_LABEL[property.status]}
        </StyledText>
      </View>

      <StyledText
        style={[styles.title, { color: textColor }]}
        numberOfLines={1}
      >
        {property.title}
      </StyledText>
      <View style={styles.meta}>
        <StyledText
          style={[styles.place, { color: iconColor }]}
          numberOfLines={1}
        >
          {property.city}, {property.county}
        </StyledText>
        <StyledText style={[styles.rent, { color: success }]}>
          {formatFull(property.rentAmount, property.currency)}/{frequency}
        </StyledText>
      </View>
    </Pressable>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: 10,
    paddingBottom: 10,
    gap: 4,
  },

  image: {
    width: "100%",
    height: 150,
    maxHeight: 150,
  },

  status: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: "BarlowMedium",
    color: "#212121",
  },

  title: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
    paddingHorizontal: 4,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },

  place: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },

  rent: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },
});
