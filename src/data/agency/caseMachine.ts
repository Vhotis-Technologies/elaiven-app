import { CaseAction, CaseDetail, CaseStatus } from "@/types/agency/CaseInterface";

export interface CaseActionOption {
  type: CaseAction["type"];
  label: string;
  needsBody: boolean;
}

const OPEN: CaseActionOption[] = [{ type: "acknowledge", label: "Acknowledge", needsBody: false }];

const IN_HAND: CaseActionOption[] = [
  { type: "reply", label: "Reply", needsBody: true },
  { type: "remind", label: "Send a reminder", needsBody: true },
  { type: "close", label: "Close the case", needsBody: false },
];

/** The next things a person can do. Nothing here runs by itself. */
export function availableCaseActions(status: CaseStatus): CaseActionOption[] {
  if (status === "open") return OPEN;
  if (status === "acknowledged" || status === "answered") return IN_HAND;
  return [];
}

export function reduceCase(item: CaseDetail, action: CaseAction, by: string, at: string): CaseDetail {
  if (action.type === "acknowledge" && item.status === "open") {
    return {
      ...item,
      status: "acknowledged",
      acknowledgedAt: at,
      messages: [
        ...item.messages,
        {
          id: `${item.id}-ack-${at}`,
          kind: "acknowledgement",
          authorName: by,
          body: "Acknowledged.",
          createdAt: at,
        },
      ],
    };
  }

  if (action.type === "reply" && (item.status === "acknowledged" || item.status === "answered")) {
    const body = action.body.trim();
    if (!body) return item;
    return {
      ...item,
      status: "answered",
      messages: [
        ...item.messages,
        {
          id: `${item.id}-reply-${at}`,
          kind: "user",
          authorName: by,
          body,
          createdAt: at,
        },
      ],
    };
  }

  if (action.type === "remind" && (item.status === "acknowledged" || item.status === "answered")) {
    const body = action.body.trim();
    if (!body) return item;
    return {
      ...item,
      messages: [
        ...item.messages,
        {
          id: `${item.id}-remind-${at}`,
          kind: "reminder",
          authorName: by,
          body,
          createdAt: at,
        },
      ],
    };
  }

  if (action.type === "close" && (item.status === "acknowledged" || item.status === "answered")) {
    return { ...item, status: "closed" };
  }

  return item;
}
