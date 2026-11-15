import { Pressable, StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ActionOption,
  REASON_LABEL,
  availableActions,
} from "@/data/agency/applicationMachine";
import { ApplicationAction, ApplicationDetail } from "@/types/properties/ApplicationInterface";
import { formatViewing } from "./applicationText";

type Props = {
  application: ApplicationDetail;
  onAct: (action: ApplicationAction) => void;
};

const CLOSED_NOTE: Partial<Record<ApplicationDetail["state"], string>> = {
  filtered_out: "The property's own limits stopped this application. There is nothing to do.",
  declined: "Recorded as not accepted, with a reason. There is nothing more to do.",
  agreement_sent: "The agreement has been sent.",
  active: "The tenancy is running. Cases, notices and documents are handled from the tenancy.",
};

function localIso(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00:00`;
}

/** Three sample slots. A live calendar replaces these. */
function nextSlots(): { iso: string; label: string }[] {
  const now = new Date();
  return [
    [1, 10],
    [2, 14],
    [3, 17],
  ].map(([days, hour]) => {
    const iso = localIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour));
    return { iso, label: formatViewing(iso) };
  });
}

const ApplicationActions = ({ application, onAct }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const errorColor = useThemeColor({}, "error");
  const [choosing, setChoosing] = useState<ActionOption | null>(null);
  const slots = useMemo(nextSlots, []);
  const options = availableActions(application);

  const run = (action: ApplicationAction) => {
    setChoosing(null);
    onAct(action);
  };

  const press = (option: ActionOption) => {
    if (option.needsSlot || option.reasons) {
      setChoosing(choosing?.type === option.type ? null : option);
      return;
    }
    run({ type: option.type } as ApplicationAction);
  };

  if (options.length === 0) {
    const note = CLOSED_NOTE[application.state];
    return note ? (
      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
        <StyledText style={[styles.note, { color: iconColor }]}>{note}</StyledText>
      </View>
    ) : null;
  }

  return (
    <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
      <StyledText style={[styles.title, { color: textColor }]}>Next step</StyledText>

      {options.map((option) => {
        const filled = option.kind === "primary";
        const danger = option.kind === "danger";
        const tone = danger ? errorColor : textColor;
        return (
          <View key={option.type} style={styles.option}>
            <Pressable
              onPress={() => press(option)}
              accessibilityRole="button"
              style={[
                styles.button,
                filled
                  ? { backgroundColor: textColor, borderColor: textColor }
                  : { borderColor: danger ? errorColor : borderColor },
                option.standIn && styles.standIn,
              ]}
            >
              <StyledText
                style={styles.buttonLabel}
                color={filled ? backgroundColor : tone}
              >
                {option.label}
              </StyledText>
            </Pressable>
            {option.hint ? (
              <StyledText style={[styles.hint, { color: iconColor }]}>{option.hint}</StyledText>
            ) : null}

            {choosing?.type === option.type && option.needsSlot && (
              <View style={styles.choices}>
                {slots.map((slot) => (
                  <Pressable
                    key={slot.iso}
                    style={[styles.choice, { borderColor }]}
                    onPress={() => run({ type: "invite", scheduledFor: slot.iso })}
                  >
                    <StyledText style={[styles.choiceLabel, { color: textColor }]}>{slot.label}</StyledText>
                  </Pressable>
                ))}
              </View>
            )}

            {choosing?.type === option.type && option.reasons && (
              <View style={styles.choices}>
                <StyledText style={[styles.hint, { color: iconColor }]}>
                  Choose the reason. It is logged with your name.
                </StyledText>
                {option.reasons.map((reason) => (
                  <Pressable
                    key={reason}
                    style={[styles.choice, { borderColor }]}
                    onPress={() => run({ type: "decline", reason })}
                  >
                    <StyledText style={[styles.choiceLabel, { color: textColor }]}>
                      {REASON_LABEL[reason]}
                    </StyledText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ApplicationActions;

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    gap: 12,
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

  option: {
    gap: 6,
  },

  button: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  standIn: {
    borderStyle: "dashed",
  },

  buttonLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "BarlowMedium",
  },

  hint: {
    fontSize: 13,
    lineHeight: 18,
  },

  choices: {
    gap: 6,
  },

  choice: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  choiceLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
});
