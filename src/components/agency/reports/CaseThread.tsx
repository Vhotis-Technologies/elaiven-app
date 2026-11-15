import { StyleSheet, View } from "react-native";
import React from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CaseMessage } from "@/types/agency/CaseInterface";
import { formatWhen } from "./caseText";

type Props = {
  messages: CaseMessage[];
};

const KIND_LABEL = {
  user: "",
  acknowledgement: "Acknowledgement",
  reminder: "Reminder",
};

const CaseThread = ({ messages }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={styles.list}>
      <StyledText style={[styles.heading, { color: textColor }]}>What was said</StyledText>
      {messages.map((message) => (
        <View key={message.id} style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <StyledText style={[styles.meta, { color: iconColor }]}>
            {[KIND_LABEL[message.kind], message.authorName, formatWhen(message.createdAt)].filter(Boolean).join(" · ")}
          </StyledText>
          <StyledText style={[styles.body, { color: textColor }]}>{message.body}</StyledText>
        </View>
      ))}
    </View>
  );
};

export default CaseThread;

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },

  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },

  meta: {
    fontSize: 12,
    lineHeight: 16,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
