import { CaseCategory, CaseUrgency } from "@/types/agency/CaseInterface";

/** Rooms a tenant can put a report in. */
export const REPORT_LOCATIONS = [
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living room",
  "Hall",
  "Outside",
] as const;

export type ReportLocation = (typeof REPORT_LOCATIONS)[number];

export type ReportConfidence = "low" | "medium" | "high";

export type ReportSuggestion = {
  problem: string | null;
  category: CaseCategory;
  /** Shown on the suggestion card. Water repairs read as Plumbing. */
  categoryLabel: string;
  urgency: CaseUrgency;
  location: ReportLocation | null;
};

function has(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function room(text: string): ReportLocation | null {
  if (has(text, ["bathroom", "shower", "toilet", "bath"])) return "Bathroom";
  if (has(text, ["kitchen", "oven", "hob"])) return "Kitchen";
  if (has(text, ["bedroom", "bed"])) return "Bedroom";
  if (has(text, ["living", "lounge"])) return "Living room";
  if (has(text, ["hall", "stairs"])) return "Hall";
  if (has(text, ["garden", "outside"])) return "Outside";
  return null;
}

const CATEGORY_LABEL: Record<CaseCategory, string> = {
  repair: "Repair",
  complaint: "Complaint",
  rent_query: "Rent",
  neighbour: "Neighbour",
};

/** The label for a category the tenant picked themselves. */
export function categoryLabel(category: CaseCategory): string {
  return CATEGORY_LABEL[category];
}

/**
 * A starting point from the tenant's own words.
 * It only names a room when they named one.
 */
export function suggestReport(text: string): ReportSuggestion {
  const value = text.toLowerCase();
  const location = room(value);

  if (has(value, ["gas", "fire", "flood", "spark"])) {
    return { problem: "Emergency repair", category: "repair", categoryLabel: "Repair", urgency: "emergency", location };
  }
  if (has(value, ["neighbour", "neighbor", "noise", "loud"])) {
    return { problem: "Neighbour issue", category: "neighbour", categoryLabel: "Neighbour", urgency: "routine", location };
  }
  if (has(value, ["rent", "payment", "invoice"])) {
    return { problem: "Rent question", category: "rent_query", categoryLabel: "Rent", urgency: "routine", location };
  }
  if (has(value, ["leak", "drip", "dripping", "burst", "pipe", "water"])) {
    return { problem: "Water leakage", category: "repair", categoryLabel: "Plumbing", urgency: "urgent", location };
  }
  if (has(value, ["heat", "boiler", "radiator", "cold"])) {
    return { problem: "Heating", category: "repair", categoryLabel: "Heating", urgency: "urgent", location };
  }
  return { problem: null, category: "repair", categoryLabel: "Repair", urgency: "routine", location };
}

export function reportConfidence(
  text: string,
  suggestion: ReportSuggestion,
  photoCount: number,
): ReportConfidence | null {
  if (text.trim().length < 8) return null;
  if (suggestion.problem && suggestion.location && photoCount > 0) return "high";
  if (suggestion.problem && (suggestion.location || photoCount > 0)) return "medium";
  return "low";
}
