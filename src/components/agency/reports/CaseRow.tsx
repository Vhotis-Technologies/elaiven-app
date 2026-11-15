import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CaseDetail } from "@/types/agency/CaseInterface";
import { CATEGORY_LABEL, STATUS_LABEL, URGENCY_LABEL } from "./caseText";

type Props = {
  item: CaseDetail;
};

const CaseRow = ({ item }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const warning = useThemeColor({}, "warning");
  const error = useThemeColor({}, "error");
  const opening = item.messages[0]?.body ?? "";
  const tone = item.urgency === "emergency" ? error : item.urgency === "urgent" ? warning : iconColor;
  const line = [CATEGORY_LABEL[item.category], STATUS_LABEL[item.status], item.urgency === "routine" ? "" : URGENCY_LABEL[item.urgency]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Pressable
      style={[styles.row, { backgroundColor: cardColor, borderColor }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${line}`}
      onPress={() =>
        router.push({
          pathname: "/agency/report/[caseId]",
          params: { caseId: item.id },
        })
      }
    >
      <View style={styles.body}>
        <StyledText style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {item.title}
        </StyledText>
        <StyledText style={[styles.status, { color: tone }]} numberOfLines={1}>
          {line}
        </StyledText>
        <StyledText style={[styles.preview, { color: iconColor }]} numberOfLines={1}>
          {opening}
        </StyledText>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={iconColor} />
    </Pressable>
  );
};

export default CaseRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  body: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  status: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  preview: {
    fontSize: 13,
    lineHeight: 18,
  },
});
