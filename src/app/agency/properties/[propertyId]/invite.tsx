import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { propertyDetail } from "@/data/agency/properties";
import HouseholdInviteForm from "@/components/agency/applications/HouseholdInviteForm";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const InviteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId: string }>();
  const propertyId = asId(params.propertyId);
  const property = propertyDetail(propertyId);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  if (!property) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor }]}>
        <StyledText>This property isn't in the sample data.</StyledText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>
      <StyledText style={[styles.title, { color: textColor }]}>Add a household</StyledText>
      <StyledText style={[styles.note, { color: iconColor }]}>
        {property.title}. Enter the people you already have, then send them the link.
      </StyledText>
      <HouseholdInviteForm
        propertyId={propertyId}
        availableFrom={property.availableFrom}
        onCreated={(applicationId) =>
          router.replace({
            pathname: "/agency/properties/[propertyId]/application/[applicationId]",
            params: { propertyId, applicationId },
          })
        }
      />
    </ScrollView>
  );
};

export default InviteScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  missing: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 8,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  note: {
    fontSize: 14,
    lineHeight: 20,
  },
});
