import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ApplicationDetail } from "@/types/agency/properties/ApplicationInterface";
import { rowStatus } from "./applicationText";

type Props = {
  application: ApplicationDetail;
};

/** The one row used in every phase. Open it for the step that phase allows. */
const ApplicationRow = ({ application }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <Pressable
      style={[styles.row, { backgroundColor: cardColor, borderColor }]}
      accessibilityRole="button"
      accessibilityLabel={application.leadName}
      onPress={() =>
        router.push({
          pathname: "/agency/properties/[propertyId]/application/[applicationId]",
          params: { propertyId: application.propertyId, applicationId: application.id },
        })
      }
    >
      <View style={styles.body}>
        <StyledText style={[styles.name, { color: textColor }]} numberOfLines={1}>
          {application.leadName}
        </StyledText>
        <StyledText style={[styles.status, { color: iconColor }]} numberOfLines={1}>
          {rowStatus(application)}
        </StyledText>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={iconColor} />
    </Pressable>
  );
};

export default ApplicationRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },

  body: {
    flex: 1,
    gap: 2,
  },

  name: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  status: {
    fontSize: 13,
    lineHeight: 18,
  },
});
``