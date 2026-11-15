import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import DashboardCardUi from "@/components/agency/home/DashboardCardUi";
import RevenueCardUi from "@/components/agency/home/RevenueCardUi";
import {
  DashboardCardUiProps,
  RevenueCardUiProps,
} from "@/types/agency/HomeInterfaces";

// Placeholder data - replace with real API data.
const USER_NAME = "Sohan Talukder";

const REVENUE: RevenueCardUiProps = {
  title: "Total Revenue",
  value: "3.4M",
  currency: "£",
  percentage_before: 1.65,
  percentage_after: 2.65,
  period: "vs last month",
};

const OVERVIEW: DashboardCardUiProps[] = [
  {
    title: "Total Properties",
    value: "13,248",
    icon: "apartment",
    backgroundColor: "#7040E0",
    percentage: 7.6,
    period: "vs last month",
  },
  {
    title: "Active Deals",
    value: "432",
    icon: "handshake",
    backgroundColor: "#4E9470",
    percentage: 2.2,
    period: "vs last month",
  },
  {
    title: "Occupancy rate",
    value: "91%",
    icon: "group",
    backgroundColor: "#7B9AEA",
    percentage: 24.2,
    period: "vs last month",
  },
  {
    title: "Total Revenue",
    value: "$3.4M",
    icon: "account-balance-wallet",
    backgroundColor: "#E8854A",
    percentage: 5.67,
    period: "vs last month",
  },
];

// Split the cards into rows of two for the grid.
const OVERVIEW_ROWS = OVERVIEW.reduce<DashboardCardUiProps[][]>(
  (rows, card, index) => {
    if (index % 2 === 0) rows.push([card]);
    else rows[rows.length - 1].push(card);
    return rows;
  },
  [],
);

const HomeScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topActions}>
          <Pressable hitSlop={8} accessibilityLabel="Notifications">
            <MaterialIcons name="notifications-none" size={26} color={textColor} />
          </Pressable>
        </View>
      </View>

      {/* Welcome */}
      <View style={styles.welcome}>
        <StyledText style={[styles.welcomeLabel, { color: iconColor }]}>
          👋 Welcome back,
        </StyledText>
        <StyledText style={[styles.welcomeName, { color: textColor }]}>
          {USER_NAME}
        </StyledText>
        <StyledText style={[styles.welcomeSub, { color: iconColor }]}>
          Here&apos;s what&apos;s happening with your real estate business today.
        </StyledText>
      </View>

      {/* Revenue */}
      <RevenueCardUi {...REVENUE} />

      {/* Overview */}
      <StyledText style={[styles.sectionTitle, { color: textColor }]}>Overview</StyledText>
      <View style={styles.grid}>
        {OVERVIEW_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((card) => (
              <DashboardCardUi key={card.title} {...card} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "BarlowMedium",
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  welcome: {
    gap: 4,
  },

  welcomeLabel: {
    fontSize: 17,
    fontFamily: "BarlowMedium",
  },

  welcomeName: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: "BarlowMedium",
  },

  welcomeSub: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "BarlowMedium",
  },

  grid: {
    gap: 5,
  },

  gridRow: {
    flexDirection: "row",
    gap: 5,
  },
});
