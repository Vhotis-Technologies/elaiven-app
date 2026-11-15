import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledText from "@/components/helpers/StyledText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/components/agency/analytics/format";
import { propertyDetail } from "@/data/agency/properties";
import { hasJoinedHouseBoard, housePosts } from "@/data/tenants/houseBoard";

function asId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const BoardScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId: string }>();
  const propertyId = asId(params.propertyId);
  const property = propertyDetail(propertyId);
  const joined = hasJoinedHouseBoard(propertyId);
  const posts = joined ? housePosts(propertyId) : [];
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icons");

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.column}>
      <Pressable hitSlop={10} accessibilityLabel="Go back" onPress={() => router.back()}>
        <MaterialIcons name="chevron-left" size={28} color={textColor} />
      </Pressable>
      <StyledText style={[styles.title, { color: textColor }]}>House</StyledText>
      {property ? (
        <StyledText style={[styles.address, { color: iconColor }]}>{property.addressLine1}</StyledText>
      ) : null}
      {!joined ? (
        <StyledText style={[styles.note, { color: textColor }]}>Join the house board.</StyledText>
      ) : posts.length === 0 ? (
        <StyledText style={[styles.note, { color: iconColor }]}>Nothing new on the house board.</StyledText>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <StyledText style={[styles.author, { color: textColor }]}>{post.authorName}</StyledText>
            <StyledText style={[styles.body, { color: textColor }]}>{post.body}</StyledText>
            <StyledText style={[styles.when, { color: iconColor }]}>{formatDate(post.createdOn)}</StyledText>
          </View>
        ))
      )}
      </View>
    </ScrollView>
  );
};

export default BoardScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 140,
  },

  column: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 28,
    paddingTop: 16,
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "BarlowMedium",
  },

  address: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
  },

  post: {
    marginTop: 36,
    gap: 6,
  },

  author: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BarlowMedium",
  },

  note: {
    marginTop: 28,
    fontSize: 16,
    lineHeight: 23,
  },

  body: {
    fontSize: 16,
    lineHeight: 23,
  },

  when: {
    fontSize: 13,
    lineHeight: 18,
  },
});
