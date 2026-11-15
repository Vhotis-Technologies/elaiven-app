import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import RaiseReportForm from "@/components/tenants/property/RaiseReportForm";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const NewReportScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId: string }>();
  const fileId = asId(params.fileId);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const file = useTenantProperty(fileId);
  const canReport = file?.holding === "given";

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>
      {canReport ? (
        <RaiseReportForm
          fileId={fileId}
          onCreated={(reportId) =>
            router.replace({
              pathname: "/tenants/property/report/[reportId]",
              params: { reportId, fileId },
            })
          }
        />
      ) : (
        <View>
          <StyledText style={[styles.note, { color: textColor }]}>
            Reports open once the agency gives you the property.
          </StyledText>
        </View>
      )}
    </ScrollView>
  );
};

export default NewReportScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 128,
    gap: 12,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
  },

  note: {
    fontSize: 15,
    lineHeight: 22,
  },
});
