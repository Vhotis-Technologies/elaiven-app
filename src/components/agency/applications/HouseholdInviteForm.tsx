import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import { inviteHousehold } from "@/data/agency/applications";
import { HouseholdApplicant } from "@/types/properties/ApplicationInterface";
import { formatViewing } from "./applicationText";

type Props = {
  propertyId: string;
  availableFrom: string;
  onCreated: (applicationId: string) => void;
};

function blankPerson(): HouseholdApplicant {
  return {
    givenName: "",
    familyName: "",
    isLead: false,
    dateOfBirth: "",
    email: "",
    phone: "",
    currentAddress: "",
    housingSituation: null,
    employmentStatus: null,
    jobTitle: "",
    employerName: "",
    onboardedAt: null,
  };
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localIso(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00:00`;
}

function named(person: HouseholdApplicant): boolean {
  return (
    person.givenName.trim().length > 0 &&
    person.familyName.trim().length > 0 &&
    person.email.includes("@") &&
    person.phone.trim().length >= 6
  );
}

const HouseholdInviteForm = ({ propertyId, availableFrom, onCreated }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const [lead, setLead] = useState(blankPerson);
  const [second, setSecond] = useState(blankPerson);
  const [twoAdults, setTwoAdults] = useState(false);
  const [children, setChildren] = useState(0);
  const [petsNote, setPetsNote] = useState("No pets");
  const [moveIn, setMoveIn] = useState(availableFrom);
  const moveInDates = useMemo(
    () => [availableFrom, addDays(availableFrom, 7), addDays(availableFrom, 14)],
    [availableFrom],
  );
  const slots = useMemo(() => {
    const now = new Date();
    return [
      [1, 10],
      [2, 14],
      [3, 17],
    ].map(([days, hour]) => {
      const iso = localIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour));
      return { iso, label: formatViewing(iso) };
    });
  }, []);
  const [viewingAt, setViewingAt] = useState(slots[0]?.iso ?? "");

  const ready = named(lead) && (!twoAdults || named(second)) && moveIn !== "" && viewingAt !== "";

  const field = (person: HouseholdApplicant, key: "givenName" | "familyName" | "email" | "phone", value: string) =>
    ({ ...person, [key]: value });

  const send = () => {
    if (!ready) return;
    const id = inviteHousehold({
      propertyId,
      lead: { ...lead, isLead: true },
      secondAdult: twoAdults ? { ...second, isLead: false } : null,
      children,
      petsNote,
      desiredMoveIn: moveIn,
      intendedMonths: 12,
      viewingAt,
    });
    onCreated(id);
  };

  return (
    <View style={styles.form}>
      <StyledText style={[styles.heading, { color: textColor }]}>Lead</StyledText>
      <PersonFields person={lead} onChange={setLead} field={field} />

      <Pressable
        style={[styles.choice, twoAdults && { backgroundColor: textColor, borderColor: textColor }]}
        onPress={() => setTwoAdults((current) => !current)}
      >
        <StyledText style={styles.choiceLabel} color={twoAdults ? backgroundColor : textColor}>
          Two adults
        </StyledText>
      </Pressable>

      {twoAdults ? (
        <>
          <StyledText style={[styles.heading, { color: textColor }]}>Second adult</StyledText>
          <PersonFields person={second} onChange={setSecond} field={field} />
        </>
      ) : null}

      <StyledText style={[styles.heading, { color: textColor }]}>Children</StyledText>
      <View style={styles.row}>
        {[0, 1, 2].map((count) => (
          <Choice
            key={count}
            label={String(count)}
            selected={children === count}
            onPress={() => setChildren(count)}
          />
        ))}
      </View>

      <StyledText style={[styles.heading, { color: textColor }]}>Pets</StyledText>
      <View style={styles.row}>
        {["No pets", "One pet"].map((note) => (
          <Choice key={note} label={note} selected={petsNote === note} onPress={() => setPetsNote(note)} />
        ))}
      </View>

      <StyledText style={[styles.heading, { color: textColor }]}>Move-in</StyledText>
      <View style={styles.row}>
        {moveInDates.map((date) => (
          <Choice
            key={date}
            label={formatDate(date)}
            selected={moveIn === date}
            onPress={() => setMoveIn(date)}
          />
        ))}
      </View>

      <StyledText style={[styles.heading, { color: textColor }]}>Viewing</StyledText>
      <View style={styles.stack}>
        {slots.map((slot) => (
          <Choice
            key={slot.iso}
            label={slot.label}
            selected={viewingAt === slot.iso}
            onPress={() => setViewingAt(slot.iso)}
          />
        ))}
      </View>

      <Pressable
        style={[styles.send, { backgroundColor: ready ? textColor : cardColor, borderColor }]}
        onPress={send}
        disabled={!ready}
      >
        <StyledText style={styles.choiceLabel} color={ready ? backgroundColor : iconColor}>
          Send the link
        </StyledText>
      </Pressable>
      <StyledText style={[styles.hint, { color: iconColor }]}>
        They are invited to the viewing, and the link is how they come onto Elaiven.
      </StyledText>
    </View>
  );
};

function PersonFields({
  person,
  onChange,
  field,
}: {
  person: HouseholdApplicant;
  onChange: (next: HouseholdApplicant) => void;
  field: (
    person: HouseholdApplicant,
    key: "givenName" | "familyName" | "email" | "phone",
    value: string,
  ) => HouseholdApplicant;
}) {
  return (
    <View style={styles.stack}>
      <Field label="Given name" value={person.givenName} onChange={(value) => onChange(field(person, "givenName", value))} />
      <Field label="Family name" value={person.familyName} onChange={(value) => onChange(field(person, "familyName", value))} />
      <Field label="Email" value={person.email} onChange={(value) => onChange(field(person, "email", value))} keyboard="email-address" />
      <Field label="Phone" value={person.phone} onChange={(value) => onChange(field(person, "phone", value))} keyboard="phone-pad" />
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboard = "default",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboard?: "default" | "email-address" | "phone-pad";
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={label}
      placeholderTextColor={iconColor}
      keyboardType={keyboard}
      autoCapitalize={keyboard === "default" ? "words" : "none"}
      style={[styles.input, { color: textColor, backgroundColor: cardColor, borderColor }]}
    />
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "borders");

  return (
    <Pressable
      style={[styles.choice, { borderColor }, selected && { backgroundColor: textColor, borderColor: textColor }]}
      onPress={onPress}
    >
      <StyledText style={styles.choiceLabel} color={selected ? backgroundColor : textColor}>
        {label}
      </StyledText>
    </Pressable>
  );
}

export default HouseholdInviteForm;

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

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "BarlowRegular",
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

  send: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
});
