import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { propertyImageSource } from "@/components/agency/properties/propertyImage";
import { propertyDetail } from "@/data/agency/properties";
import { useTenantProperties } from "@/hooks/useTenantProperty";
import { HomeTarget, tenantHome } from "@/components/tenants/home/home";

const INK = "#1C1C1E";
const MUTED = "#8E8E93";
const CREAM = "#F4F1EC";
const CARD = "#FFFFFF";
const ORANGE = "#F08A24";

function openHomeTarget(router: ReturnType<typeof useRouter>, target: HomeTarget) {
  switch (target.kind) {
    case "property":
      router.push({
        pathname: "/tenants/property/PropertyScreen",
        params: { fileId: target.fileId },
      });
      return;
    case "report":
      router.push({
        pathname: "/tenants/property/report/[reportId]",
        params: { reportId: target.reportId, fileId: target.fileId },
      });
      return;
    case "invite":
      router.push({
        pathname: "/tenants/property/invite/[personId]",
        params: { personId: target.personId, fileId: target.fileId },
      });
      return;
    case "viewing":
      router.push({
        pathname: "/tenants/property/viewing/[viewingId]",
        params: { viewingId: target.viewingId, fileId: target.fileId },
      });
      return;
    case "board":
      router.push({
        pathname: "/tenants/dashboard/board",
        params: { propertyId: target.propertyId },
      });
  }
}

function fileIdOf(target: HomeTarget): string | null {
  return target.kind === "board" ? null : target.fileId;
}

const DashboardScreen = () => {
  const router = useRouter();
  const files = useTenantProperties();
  const home = tenantHome(files);
  const scrollRef = useRef<ScrollView>(null);
  const rentOffset = useRef(0);

  const placeFileId = home.place ? fileIdOf(home.place.target) : null;
  const placeFile = placeFileId ? files.find((file) => file.id === placeFileId) : undefined;
  const property = placeFile ? propertyDetail(placeFile.propertyId) : undefined;
  const canReport = placeFile?.holding === "given";
  const pin = property
    ? [property.city, property.postcode].filter(Boolean).join(", ")
    : home.place?.detail ?? "";

  function open(target: HomeTarget) {
    openHomeTarget(router, target);
  }

  function openProperty() {
    if (home.place) open(home.place.target);
  }

  function openReport() {
    if (!placeFile || !canReport) {
      openProperty();
      return;
    }
    router.push({
      pathname: "/tenants/property/new-report",
      params: { fileId: placeFile.id },
    });
  }

  function showRent() {
    scrollRef.current?.scrollTo({ y: Math.max(rentOffset.current - 8, 0), animated: true });
  }

  const maintenance = [...(home.board ? [home.board] : []), ...home.needs];

  return (
    <LinearGradient colors={["#F7F1E8", "#E7F0E4"]} style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          <View style={styles.header}>
            <View style={styles.identity}>
              <View style={styles.avatar}>
                <StyledText style={styles.avatarLetter}>{home.name.slice(0, 1) || "E"}</StyledText>
              </View>
              <View>
                <StyledText style={styles.greeting}>{home.greeting},</StyledText>
                <StyledText style={styles.name}>{home.name} 👋</StyledText>
              </View>
            </View>
            <View style={styles.bell} accessibilityLabel="Notifications">
              <MaterialIcons name="notifications-none" size={22} color={INK} />
            </View>
          </View>

          {home.place ? (
            <View style={styles.propertyCard}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${home.place.title}. ${pin}`}
                onPress={openProperty}
                style={({ pressed }) => [styles.propertyRow, pressed && styles.pressed]}
              >
                <View style={styles.propertyIcon}>
                  <MaterialIcons name="apartment" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.propertyCopy}>
                  <StyledText style={styles.propertyTitle}>{home.place.title}</StyledText>
                  <View style={styles.pinRow}>
                    <MaterialIcons name="location-on" size={13} color="#C7C7CC" />
                    <StyledText style={styles.pinText} numberOfLines={1}>
                      {pin}
                    </StyledText>
                  </View>
                </View>
              </Pressable>

              <View style={styles.assistant}>
                <View style={styles.assistantHead}>
                  <View style={styles.spark}>
                    <MaterialIcons name="auto-awesome" size={16} color="#FFFFFF" />
                  </View>
                  <StyledText style={styles.assistantTitle}>AI Property Assistant</StyledText>
                </View>
                <StyledText style={styles.assistantBody}>
                  Ask about rent, lease, property or maintenance.
                </StyledText>
                <View style={styles.assistantRow}>
                  <View style={styles.chips}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Next rent due?"
                      onPress={showRent}
                      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                    >
                      <StyledText style={styles.chipText}>Next rent due?</StyledText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Report a problem?"
                      onPress={openReport}
                      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                    >
                      <StyledText style={styles.chipText}>Report a problem?</StyledText>
                    </Pressable>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Report a problem"
                    onPress={openReport}
                    style={({ pressed }) => [styles.send, pressed && styles.pressed]}
                  >
                    <MaterialIcons name="send" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          {home.rentCard && property ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${home.rentCard.title}. ${home.rentCard.detail} ${home.rentCard.amount}`}
              onPress={openProperty}
              onLayout={(event) => {
                rentOffset.current = event.nativeEvent.layout.y;
              }}
              style={({ pressed }) => [styles.rentCard, pressed && styles.pressed]}
            >
              <Image
                source={propertyImageSource(property.imageUrl)}
                style={styles.rentImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={["#111111", "#111111F2", "#11111199", "#11111100"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
              <StyledText style={styles.rentTitle}>{home.rentCard.title}</StyledText>
              <StyledText style={styles.rentDetail}>{home.rentCard.detail}</StyledText>
              <StyledText style={styles.rentAmount}>{home.rentCard.amount}</StyledText>
              <View style={styles.rentButton}>
                <StyledText style={styles.rentButtonText}>{home.rentCard.action}</StyledText>
                <MaterialIcons name="arrow-forward" size={16} color={INK} />
              </View>
            </Pressable>
          ) : null}

          <View style={styles.sectionHead}>
            <StyledText style={styles.sectionTitle}>Quick Actions</StyledText>
            <Pressable accessibilityRole="button" accessibilityLabel="See all" onPress={openProperty}>
              <StyledText style={styles.seeAll}>See all</StyledText>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Report Issue"
              onPress={openReport}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <View style={styles.actionTop}>
                <View style={styles.actionIcon}>
                  <MaterialIcons name="build" size={18} color={INK} />
                </View>
                <MaterialIcons name="arrow-outward" size={16} color={MUTED} />
              </View>
              <StyledText style={styles.actionTitle}>Report Issue</StyledText>
              <StyledText style={styles.actionDetail}>Something not working?</StyledText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Documents"
              onPress={openProperty}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <View style={styles.actionTop}>
                <View style={styles.actionIcon}>
                  <MaterialIcons name="description" size={18} color={INK} />
                </View>
                <MaterialIcons name="arrow-outward" size={16} color={MUTED} />
              </View>
              <StyledText style={styles.actionTitle}>Documents</StyledText>
              <StyledText style={styles.actionDetail}>Lease & important docs</StyledText>
            </Pressable>
          </View>

          {maintenance.length > 0 ? (
            <>
              <StyledText style={[styles.sectionTitle, styles.maintenanceTitle]}>Maintenance</StyledText>
              {maintenance.map((row) => (
                <Pressable
                  key={row.id}
                  accessibilityRole="button"
                  accessibilityLabel={row.text}
                  onPress={() => open(row.target)}
                  style={({ pressed }) => [styles.maintenance, pressed && styles.pressed]}
                >
                  <View style={styles.actionIcon}>
                    <MaterialIcons name={iconFor(row.target)} size={18} color={INK} />
                  </View>
                  <StyledText style={styles.maintenanceText}>{row.text}</StyledText>
                  <MaterialIcons name="chevron-right" size={20} color={MUTED} />
                </Pressable>
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

function iconFor(target: HomeTarget): React.ComponentProps<typeof MaterialIcons>["name"] {
  switch (target.kind) {
    case "report":
      return "build";
    case "viewing":
      return "event";
    case "invite":
      return "person-add";
    case "board":
      return "campaign";
    default:
      return "apartment";
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 80,
  },

  column: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 10,
    paddingTop: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E4CDB8",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetter: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  greeting: {
    fontSize: 14,
    lineHeight: 18,
    color: MUTED,
  },

  name: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  bell: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  propertyCard: {
    marginTop: 16,
    backgroundColor: INK,
    borderRadius: 28,
    padding: 12,
    gap: 10,
  },

  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
    paddingTop: 4,
  },

  propertyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },

  propertyCopy: {
    flex: 1,
    gap: 2,
  },

  propertyTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: "#FFFFFF",
  },

  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  pinText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#C7C7CC",
  },

  assistant: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 14,
    gap: 6,
  },

  assistantHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  spark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  assistantTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  assistantBody: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
  },

  assistantRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 8,
  },

  chips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: CREAM,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  chipText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#3A3A3C",
  },

  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
  },

  rentCard: {
    marginTop: 12,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#111111",
    minHeight: 148,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "center",
    gap: 2,
  },

  rentImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "62%",
  },

  rentTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontFamily: "BarlowMedium",
    color: "#FFFFFF",
    maxWidth: "68%",
  },

  rentDetail: {
    fontSize: 13,
    lineHeight: 18,
    color: "#D1D1D6",
    maxWidth: "70%",
  },

  rentAmount: {
    marginTop: 4,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "BarlowMedium",
    color: "#FFFFFF",
  },

  rentButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  rentButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  sectionHead: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  seeAll: {
    fontSize: 14,
    lineHeight: 18,
    color: MUTED,
  },

  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },

  action: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 14,
    minHeight: 118,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  actionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "BarlowMedium",
    color: INK,
  },

  actionDetail: {
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },

  maintenanceTitle: {
    marginTop: 22,
  },

  maintenance: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  maintenanceText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: INK,
  },

  pressed: {
    opacity: 0.72,
  },
});
