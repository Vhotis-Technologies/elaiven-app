import { formatDate } from "@/components/agency/analytics/format";
import { CaseCategory, CaseStatus, CaseUrgency } from "@/types/agency/CaseInterface";

export const CATEGORY_LABEL: Record<CaseCategory, string> = {
  repair: "Repair",
  complaint: "Complaint",
  rent_query: "Rent query",
  neighbour: "Neighbour",
};

export const STATUS_LABEL: Record<CaseStatus, string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  answered: "Answered",
  closed: "Closed",
};

export const URGENCY_LABEL: Record<CaseUrgency, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
};

/** 7 Nov 2026, 10:00. Date-only values stay as the date. */
export function formatWhen(iso: string): string {
  const date = formatDate(iso.slice(0, 10));
  const time = iso.length >= 16 ? iso.slice(11, 16) : "";
  return time ? `${date}, ${time}` : date;
}
