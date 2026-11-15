/** A problem raised on a let property. Matches the tenancies.Case record. */
export type CaseCategory = "repair" | "complaint" | "rent_query" | "neighbour";

export type CaseUrgency = "routine" | "urgent" | "emergency";

export type CaseStatus = "open" | "acknowledged" | "answered" | "closed";

export type CaseMessageKind = "user" | "acknowledgement" | "reminder";

export interface CaseMessage {
  id: string;
  kind: CaseMessageKind;
  /** Null when the line was not written by a person. */
  authorName: string | null;
  body: string;
  createdAt: string;
}

/**
 * What the reports desk shows for one case.
 * Tenant names are already withheld when the viewer is not the signing agent.
 */
export interface CaseDetail {
  id: string;
  agreementId: string;
  propertyId: string | null;
  title: string;
  address: string;
  category: CaseCategory;
  urgency: CaseUrgency;
  status: CaseStatus;
  openedByName: string;
  openedByRole: "tenant" | "operator";
  acknowledgedAt: string | null;
  createdAt: string;
  messages: CaseMessage[];
}

export type CaseAction =
  | { type: "acknowledge" }
  | { type: "reply"; body: string }
  | { type: "remind"; body: string }
  | { type: "close" };
