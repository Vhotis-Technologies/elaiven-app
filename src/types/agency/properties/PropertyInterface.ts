/** How the property is occupied. Matches listings.Property.arrangement. */
export type PropertyArrangement = "whole" | "shared_room" | "owner_room";

/** Matches listings.Listing.status. */
export type ListingStatus = "draft" | "published" | "let" | "withdrawn";

export type RentFrequency = "monthly" | "weekly";

export type Jurisdiction = "IE" | "EN" | "SC" | "WA" | "NI";

/**
 * One card in the property catalogue.
 * `imageUrl` is a storage-bucket URL. Null means the bundled sample photo.
 */
export interface PropertyCardData {
  id: string;
  listingId: string;
  title: string;
  city: string;
  county: string;
  rentAmount: number;
  rentFrequency: RentFrequency;
  currency: string;
  arrangement: PropertyArrangement;
  status: ListingStatus;
  imageUrl: string | null;
}

/** The property page. Applicants and their progress are a later step. */
export interface PropertyDetailData extends PropertyCardData {
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  jurisdiction: Jurisdiction;
  description: string;
  depositAmount: number;
  availableFrom: string;
  maxOccupants: number;
  ownerName: string;
}
