import { Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import OpenCaseForm from "@/components/agency/reports/OpenCaseForm";

const NewCaseScreen = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

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
      <StyledText style={[styles.title, { color: textColor }]}>Open a case</StyledText>
      <StyledText style={[styles.note, { color: textColor }]}>
        A repair, a complaint, a rent query, or a neighbour issue on a tenancy you already hold.
      </StyledText>
      <OpenCaseForm
        onCreated={(caseId) =>
          router.replace({
            pathname: "/agency/report/[caseId]",
            params: { caseId },
          })
        }
      />
    </ScrollView>
  );
};

export default NewCaseScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 100,
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
