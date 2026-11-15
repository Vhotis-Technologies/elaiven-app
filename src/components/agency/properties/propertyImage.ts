import { ImageSourcePropType } from "react-native";

/** Stand-in for a storage-bucket URL. Every sample card points here. */
const SAMPLE_HOUSE = require("@/assets/images/house image.jpg");

export function propertyImageSource(imageUrl: string | null): ImageSourcePropType {
  if (imageUrl) return { uri: imageUrl };
  return SAMPLE_HOUSE;
}
