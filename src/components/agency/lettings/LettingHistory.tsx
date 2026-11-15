import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import { LettingEvent } from "@/types/agency/LettingInterfaces";

type Props = {
  events: LettingEvent[];
};

const ICONS: Record<LettingEvent["kind"], React.ComponentProps<typeof MaterialIcons>["name"]> = {
  application: "description",
  viewing: "event",
  offer: "handshake",
  signed: "draw",
  deposit: "account-balance",
  keys: "vpn-key",
  condition: "fact-check",
  rent: "payments",
  case: "build",
};

const LettingHistory = ({ events }: Props) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={styles.list}>
      {events.map((event, index) => {
        const last = index === events.length - 1;
        const openCase = () => {
          if (!event.caseId) return;
          router.push({
            pathname: "/agency/report/[caseId]",
            params: { caseId: event.caseId },
          });
        };
        return (
          <Pressable
            key={event.id}
            style={styles.row}
            disabled={!event.caseId}
            accessibilityRole={event.caseId ? "button" : undefined}
            accessibilityLabel={event.caseId ? event.title : undefined}
            onPress={openCase}
          >
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: tint }]}>
                <MaterialIcons name={ICONS[event.kind]} size={14} color="#FFFFFF" />
              </View>
              {!last && <View style={[styles.line, { backgroundColor: borderColor }]} />}
            </View>
            <View style={styles.body}>
              <StyledText style={[styles.title, { color: textColor }]}>{event.title}</StyledText>
              <StyledText style={[styles.date, { color: iconColor }]}>
                {formatDate(event.occurredOn)}
              </StyledText>
              <StyledText style={[styles.detail, { color: textColor }]}>{event.detail}</StyledText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default LettingHistory;

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  rail: {
    width: 28,
    alignItems: "center",
  },

  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  line: {
    width: 2,
    flex: 1,
    minHeight: 16,
  },

  body: {
    flex: 1,
    paddingBottom: 18,
    gap: 2,
  },

  title: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  date: {
    fontSize: 12,
    lineHeight: 16,
  },

  detail: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});
