import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { openTenantReport } from "@/data/tenants/propertyFile";
import {
  REPORT_LOCATIONS,
  ReportConfidence,
  ReportLocation,
  categoryLabel,
  reportConfidence,
  suggestReport,
} from "@/data/tenants/reportSuggestion";
import { CaseCategory, CaseUrgency } from "@/types/agency/CaseInterface";

type Props = {
  fileId: string;
  onCreated: (reportId: string) => void;
};

const MAX_PHOTOS = 5;

const CATEGORIES: CaseCategory[] = ["repair", "complaint", "rent_query", "neighbour"];
const URGENCIES: CaseUrgency[] = ["routine", "urgent", "emergency"];

const URGENCY_LABEL: Record<CaseUrgency, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
};

const CONFIDENCE: Record<ReportConfidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

type Editor = "category" | "location" | "priority" | null;

const RaiseReportForm = ({ fileId, onCreated }: Props) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");
  const success = useThemeColor({}, "success");
  const warning = useThemeColor({}, "warning");
  const primary = useThemeColor({}, "primary");
  const tint = useThemeColor({}, "tint");
  const error = useThemeColor({}, "error");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [categoryChoice, setCategoryChoice] = useState<CaseCategory | null>(null);
  const [urgencyChoice, setUrgencyChoice] = useState<CaseUrgency | null>(null);
  const [locationChoice, setLocationChoice] = useState<ReportLocation | null>(null);
  const [editor, setEditor] = useState<Editor>(null);
  const suggestion = suggestReport(body);
  const category = categoryChoice ?? suggestion.category;
  const urgency = urgencyChoice ?? suggestion.urgency;
  const location = locationChoice ?? suggestion.location;
  const shownCategory = categoryChoice ? categoryLabel(categoryChoice) : suggestion.categoryLabel;
  const confidence = reportConfidence(body, suggestion, photos.length);
  const ready = body.trim().length >= 8 && location !== null && suggestion.problem !== null;

  const addPhoto = async () => {
    // if (photos.length >= MAX_PHOTOS) return;
    // const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (!permission.granted) return;
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ["images"],
    //   quality: 0.6,
    // });
    // const uri = result.canceled ? null : result.assets[0]?.uri;
    // if (!uri) return;
    // setPhotos((current) => [...current, uri].slice(0, MAX_PHOTOS));
  };

  const submit = () => {
    if (!ready || !location || !suggestion.problem) return;
    const id = openTenantReport({
      fileId,
      title: body.trim(),
      problem: suggestion.problem,
      photos,
      location,
      category,
      urgency,
    });
    if (id) onCreated(id);
  };

  const photoCount =
    photos.length === 1 ? "1 photo uploaded" : `${photos.length} photos uploaded`;

  return (
    <View style={styles.form}>
      <View style={[styles.photoCard, { backgroundColor: cardColor, borderColor }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add a photo" onPress={addPhoto}>
          {photos[0] ? (
            <Image source={{ uri: photos[0] }} style={styles.hero} contentFit="cover" />
          ) : (
            <View style={[styles.hero, styles.heroEmpty, { borderColor }]}>
              <MaterialIcons name="photo-camera" size={28} color={iconColor} />
              <StyledText style={[styles.heroEmptyText, { color: iconColor }]}>
                Add a photo of the problem
              </StyledText>
            </View>
          )}
          <View style={[styles.camera, { backgroundColor: backgroundColor }]}>
            <MaterialIcons name="photo-camera" size={18} color={textColor} />
          </View>
        </Pressable>

        <View style={styles.photoRow}>
          {photos[0] ? (
            <Image source={{ uri: photos[0] }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={[styles.thumb, { backgroundColor: borderColor }]} />
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add more"
            onPress={addPhoto}
            style={styles.addMore}
          >
            <View style={[styles.plus, { borderColor }]}>
              <MaterialIcons name="add" size={22} color={textColor} />
            </View>
            <View style={[styles.addPill, { backgroundColor: textColor }]}>
              <StyledText style={styles.addPillText} color={backgroundColor}>
                Add more
              </StyledText>
            </View>
          </Pressable>
          <View style={styles.photoCopy}>
            <StyledText style={[styles.photoCount, { color: textColor }]}>
              {photos.length === 0 ? "No photo yet" : photoCount}
            </StyledText>
            <StyledText style={[styles.photoHint, { color: iconColor }]}>
              You can add up to 5 photos
            </StyledText>
          </View>
        </View>

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="What can you see?"
          placeholderTextColor={iconColor}
          multiline
          style={[styles.input, { color: textColor }]}
        />
      </View>

      <StyledText style={[styles.issueTitle, { color: textColor }]}>Issue Details</StyledText>

      <View style={[styles.detail, { backgroundColor: cardColor, borderColor }]}>
        <View style={[styles.iconBubble, { backgroundColor: error + "22" }]}>
          <MaterialIcons name="water-drop" size={22} color={error} />
        </View>
        <View style={styles.detailBody}>
          <StyledText style={[styles.detailLabel, { color: iconColor }]}>Possible Problem</StyledText>
          <StyledText style={[styles.detailValue, { color: textColor }]}>
            {suggestion.problem ?? "Not enough to tell yet"}
          </StyledText>
        </View>
        {confidence ? (
          <View style={[styles.confidence, { backgroundColor: success + "22" }]}>
            <StyledText style={[styles.confidenceText, { color: success }]}>
              {CONFIDENCE[confidence]}
            </StyledText>
          </View>
        ) : null}
      </View>

      <DetailRow
        icon="plumbing"
        iconColor={tint}
        bubble={tint + "22"}
        label="Suggested Category"
        value={shownCategory}
        editing={editor === "category"}
        onEdit={() => setEditor(editor === "category" ? null : "category")}
      >
        <View style={styles.choices}>
          {CATEGORIES.map((item) => (
            <Choice
              key={item}
              label={categoryLabel(item)}
              selected={item === category}
              onPress={() => {
                setCategoryChoice(item);
                setEditor(null);
              }}
            />
          ))}
        </View>
      </DetailRow>

      <DetailRow
        icon="bathtub"
        iconColor={primary}
        bubble={primary + "22"}
        label="Suggested Location"
        value={location ?? "Choose a room"}
        editing={editor === "location"}
        onEdit={() => setEditor(editor === "location" ? null : "location")}
      >
        <View style={styles.choices}>
          {REPORT_LOCATIONS.map((item) => (
            <Choice
              key={item}
              label={item}
              selected={item === location}
              onPress={() => {
                setLocationChoice(item);
                setEditor(null);
              }}
            />
          ))}
        </View>
      </DetailRow>

      <DetailRow
        icon="priority-high"
        iconColor={warning}
        bubble={warning + "22"}
        label="Suggested Priority"
        value={URGENCY_LABEL[urgency]}
        editing={editor === "priority"}
        onEdit={() => setEditor(editor === "priority" ? null : "priority")}
      >
        <View style={styles.choices}>
          {URGENCIES.map((item) => (
            <Choice
              key={item}
              label={URGENCY_LABEL[item]}
              selected={item === urgency}
              onPress={() => {
                setUrgencyChoice(item);
                setEditor(null);
              }}
            />
          ))}
        </View>
      </DetailRow>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create Report"
        accessibilityState={{ disabled: !ready }}
        style={[styles.create, { backgroundColor: ready ? textColor : borderColor }]}
        disabled={!ready}
        onPress={submit}
      >
        <StyledText style={styles.createLabel} color={ready ? backgroundColor : iconColor}>
          Create Report
        </StyledText>
        <MaterialIcons name="arrow-forward" size={18} color={ready ? backgroundColor : iconColor} />
      </Pressable>
    </View>
  );
};

function DetailRow({
  icon,
  iconColor,
  bubble,
  label,
  value,
  editing,
  onEdit,
  children,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
  bubble: string;
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icons");
  const cardColor = useThemeColor({}, "cards");
  const borderColor = useThemeColor({}, "borders");

  return (
    <View style={[styles.detail, styles.detailStack, { backgroundColor: cardColor, borderColor }]}>
      <View style={styles.detailLine}>
        <View style={[styles.iconBubble, { backgroundColor: bubble }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.detailBody}>
          <StyledText style={[styles.detailLabel, { color: muted }]}>{label}</StyledText>
          <StyledText style={[styles.detailValue, { color: textColor }]}>{value}</StyledText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${label}`} onPress={onEdit} style={styles.edit}>
          <MaterialIcons name="edit" size={16} color={muted} />
          <StyledText style={[styles.editText, { color: muted }]}>Edit</StyledText>
        </Pressable>
      </View>
      {editing ? children : null}
    </View>
  );
}

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "borders");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.choice,
        { borderColor },
        selected && { backgroundColor: textColor, borderColor: textColor },
      ]}
      onPress={onPress}
    >
      <StyledText style={styles.choiceLabel} color={selected ? backgroundColor : textColor}>
        {label}
      </StyledText>
    </Pressable>
  );
}

export default RaiseReportForm;

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },

  photoCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 28,
    padding: 12,
    gap: 12,
  },

  hero: {
    width: "100%",
    height: 210,
    borderRadius: 20,
  },

  heroEmpty: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  heroEmptyText: {
    fontSize: 15,
    lineHeight: 20,
  },

  camera: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  thumb: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },

  addMore: {
    width: 64,
    alignItems: "center",
    gap: 4,
  },

  plus: {
    width: 54,
    height: 40,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  addPill: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  addPillText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: "BarlowMedium",
  },

  photoCopy: {
    flex: 1,
    gap: 2,
  },

  photoCount: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  photoHint: {
    fontSize: 13,
    lineHeight: 18,
  },

  input: {
    minHeight: 44,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowRegular",
    textAlignVertical: "top",
  },

  issueTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "BarlowMedium",
    marginTop: 8,
  },

  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  detailStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  detailLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  detailBody: {
    flex: 1,
    gap: 2,
  },

  detailLabel: {
    fontSize: 13,
    lineHeight: 18,
  },

  detailValue: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "BarlowMedium",
  },

  confidence: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  confidenceText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "BarlowMedium",
  },

  edit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  editText: {
    fontSize: 14,
    lineHeight: 18,
  },

  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  choice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  choiceLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
  },

  create: {
    marginTop: 8,
    borderRadius: 28,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  createLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },
});
