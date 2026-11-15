import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { caseTenancies, openCase } from "@/data/agency/cases";
import { CaseCategory, CaseUrgency } from "@/types/agency/CaseInterface";
import { CATEGORY_LABEL, URGENCY_LABEL } from "./caseText";

type Props = {
  onCreated: (caseId: string) => void;
};

const CATEGORIES: CaseCategory[] = ["repair", "complaint", "rent_query", "neighbour"];
const URGENCIES: CaseUrgency[] = ["routine", "urgent", "emergency"];

const OpenCaseForm = ({ onCreated }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const homes = caseTenancies();
  const [agreementId, setAgreementId] = useState(homes[0]?.agreementId ?? "");
  const [category, setCategory] = useState<CaseCategory>("repair");
  const [urgency, setUrgency] = useState<CaseUrgency>("routine");
  const [body, setBody] = useState("");
  const ready = agreementId.length > 0 && body.trim().length >= 8;

  const submit = () => {
    if (!ready) return;
    const id = openCase({ agreementId, category, urgency, body });
    onCreated(id);
  };

  return (
    <View style={styles.form}>
      <StyledText style={[styles.heading, { color: textColor }]}>Tenancy</StyledText>
      <View style={styles.stack}>
        {homes.map((home) => (
          <Choice
            key={home.agreementId}
            label={home.title}
            selected={home.agreementId === agreementId}
            onPress={() => setAgreementId(home.agreementId)}
          />
        ))}
      </View>

      <StyledText style={[styles.heading, { color: textColor }]}>What kind of case</StyledText>
      <View style={styles.row}>
        {CATEGORIES.map((item) => (
          <Choice
            key={item}
            label={CATEGORY_LABEL[item]}
            selected={item === category}
            onPress={() => setCategory(item)}
          />
        ))}
      </View>

      <StyledText style={[styles.heading, { color: textColor }]}>How urgent</StyledText>
      <View style={styles.row}>
        {URGENCIES.map((item) => (
          <Choice
            key={item}
            label={URGENCY_LABEL[item]}
            selected={item === urgency}
            onPress={() => setUrgency(item)}
          />
        ))}
      </View>

      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="What happened?"
        placeholderTextColor={iconColor}
        multiline
        style={[styles.input, { color: textColor, backgroundColor: cardColor, borderColor }]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open the case"
        style={[styles.send, { borderColor: textColor }, ready && { backgroundColor: textColor }]}
        disabled={!ready}
        onPress={submit}
      >
        <StyledText style={styles.sendLabel} color={ready ? backgroundColor : iconColor}>
          Open the case
        </StyledText>
      </Pressable>
    </View>
  );
};

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "borders");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.choice, { borderColor }, selected && { backgroundColor: textColor, borderColor: textColor }]}
      onPress={onPress}
    >
      <StyledText style={styles.choiceLabel} color={selected ? backgroundColor : textColor}>
        {label}
      </StyledText>
    </Pressable>
  );
}

export default OpenCaseForm;

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

  stack: {
    gap: 8,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  choice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  choiceLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 96,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowRegular",
    textAlignVertical: "top",
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
