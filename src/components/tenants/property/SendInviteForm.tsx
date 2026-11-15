import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { sendHouseholdInvite } from "@/data/tenants/propertyFile";

type Props = {
  fileId: string;
  onCreated: (personId: string) => void;
};

const SendInviteForm = ({ fileId, onCreated }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const ready = givenName.trim().length > 0 && familyName.trim().length > 0;

  const submit = () => {
    if (!ready) return;
    const id = sendHouseholdInvite({ fileId, givenName, familyName });
    if (id) onCreated(id);
  };

  return (
    <View style={styles.form}>
      <StyledText style={[styles.heading, { color: textColor }]}>Given name</StyledText>
      <TextInput
        value={givenName}
        onChangeText={setGivenName}
        placeholder="Given name"
        placeholderTextColor={iconColor}
        autoCapitalize="words"
        style={[styles.input, { color: textColor, backgroundColor: cardColor, borderColor }]}
      />
      <StyledText style={[styles.heading, { color: textColor }]}>Family name</StyledText>
      <TextInput
        value={familyName}
        onChangeText={setFamilyName}
        placeholder="Family name"
        placeholderTextColor={iconColor}
        autoCapitalize="words"
        style={[styles.input, { color: textColor, backgroundColor: cardColor, borderColor }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send the invite"
        accessibilityState={{ disabled: !ready }}
        style={[styles.send, { borderColor: textColor }, ready && { backgroundColor: textColor }]}
        disabled={!ready}
        onPress={submit}
      >
        <StyledText style={styles.sendLabel} color={ready ? backgroundColor : iconColor}>
          Send the invite
        </StyledText>
      </Pressable>
    </View>
  );
};

export default SendInviteForm;

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },

  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
    marginTop: 6,
  },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowRegular",
  },

  send: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  sendLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },
});
