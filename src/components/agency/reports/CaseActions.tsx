import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { availableCaseActions, CaseActionOption } from "@/data/agency/caseMachine";
import { CaseAction, CaseDetail } from "@/types/agency/CaseInterface";

type Props = {
  item: CaseDetail;
  onAct: (action: CaseAction) => void;
};

const CaseActions = ({ item, onAct }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const [choosing, setChoosing] = useState<CaseActionOption | null>(null);
  const [body, setBody] = useState("");
  const options = availableCaseActions(item.status);

  const press = (option: CaseActionOption) => {
    if (option.needsBody) {
      setChoosing(choosing?.type === option.type ? null : option);
      setBody("");
      return;
    }
    setChoosing(null);
    onAct({ type: option.type } as CaseAction);
  };

  const send = () => {
    if (!choosing || !body.trim()) return;
    const action =
      choosing.type === "reply" ? { type: "reply" as const, body } : { type: "remind" as const, body };
    setChoosing(null);
    setBody("");
    onAct(action);
  };

  if (options.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
        <StyledText style={[styles.note, { color: iconColor }]}>This case is closed.</StyledText>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.title, { color: textColor }]}>Next step</StyledText>
      {options.map((option) => {
        const selected = choosing?.type === option.type;
        return (
          <Pressable
            key={option.type}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            style={[styles.button, { borderColor: textColor }, selected && { backgroundColor: textColor }]}
            onPress={() => press(option)}
          >
            <StyledText style={styles.buttonLabel} color={selected ? backgroundColor : textColor}>
              {option.label}
            </StyledText>
          </Pressable>
        );
      })}
      {choosing?.needsBody ? (
        <View style={styles.composer}>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder={choosing.type === "remind" ? "What should they be reminded of?" : "What do you want to say?"}
            placeholderTextColor={iconColor}
            multiline
            style={[styles.input, { color: textColor, borderColor }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={choosing.type === "remind" ? "Send the reminder" : "Send the reply"}
            style={[styles.button, { borderColor: textColor }, body.trim() ? { backgroundColor: textColor } : null]}
            disabled={!body.trim()}
            onPress={send}
          >
            <StyledText style={styles.buttonLabel} color={body.trim() ? backgroundColor : iconColor}>
              {choosing.type === "remind" ? "Send the reminder" : "Send the reply"}
            </StyledText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default CaseActions;

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },

  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  note: {
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  composer: {
    gap: 8,
  },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 80,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowRegular",
    textAlignVertical: "top",
  },
});
