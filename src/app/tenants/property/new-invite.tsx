import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTenantProperty } from "@/hooks/useTenantProperty";
import SendInviteForm from "@/components/tenants/property/SendInviteForm";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const NewInviteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ fileId: string }>();
  const fileId = asId(params.fileId);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const file = useTenantProperty(fileId);
  const canInvite = file?.household.some((person) => person.isLead && person.inviteStatus === "joined");

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
      <StyledText style={[styles.title, { color: textColor }]}>Send an invite</StyledText>
      {canInvite ? (
        <>
          <StyledText style={[styles.note, { color: textColor }]}>
            Send a join link to someone who will share this property. They open it themselves.
          </StyledText>
          <SendInviteForm
            fileId={fileId}
            onCreated={(personId) =>
              router.replace({
                pathname: "/tenants/property/invite/[personId]",
                params: { personId, fileId },
              })
            }
          />
        </>
      ) : (
        <View>
          <StyledText style={[styles.note, { color: textColor }]}>
            You can send an invite once you have joined this property.
          </StyledText>
        </View>
      )}
    </ScrollView>
  );
};

export default NewInviteScreen;

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
