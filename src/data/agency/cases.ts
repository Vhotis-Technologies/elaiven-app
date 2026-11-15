import { CURRENT_VIEWER_ID, CURRENT_VIEWER_NAME } from "@/data/agency/currentViewer";
import { reduceCase } from "@/data/agency/caseMachine";
import { CaseAction, CaseCategory, CaseDetail, CaseUrgency } from "@/types/agency/CaseInterface";

/**
 * Sample cases. A live list is the agency's Case records.
 * Reload puts this list back.
 */

type Tenancy = {
  agreementId: string;
  propertyId: string | null;
  title: string;
  address: string;
  agentId: string;
  privateNames: string[];
};

type CaseRecord = CaseDetail & {
  agentId: string;
  privateNames: string[];
};

const BOOK: Tenancy[] = [
  tenancy("agr-1", "prop-1", "14 Camden Street", "14 Camden Street, Dublin", "1", ["Aoife Byrne"]),
  tenancy("agr-2", "prop-2", "8 Harbour View", "8 Harbour View, Cork", "1", ["Cian Murphy", "Lara Murphy"]),
  tenancy("agr-3", "prop-3", "22 King Street", "22 King Street, Galway", "1", ["Oisin Walsh"]),
  tenancy("agr-4", "prop-4", "Room at 3 Quay Lane", "3 Quay Lane, Waterford", "1", ["Maeve Foley"]),
  tenancy("agr-5", "prop-5", "61 Rathmines Road", "61 Rathmines Road, Dublin", "1", ["Sean Reid"]),
  tenancy("agr-6", null, "9 Strand Road", "9 Strand Road, Bray", "1", ["Grainne Nolan"]),
  tenancy("agr-7", null, "17 Pearse Street", "17 Pearse Street, Dublin", "2", ["Hannah Clarke"]),
  tenancy("agr-8", null, "4 Chapel Lane", "4 Chapel Lane, Limerick", "2", ["Darragh Quinn"]),
  tenancy("agr-9", null, "30 Main Street", "30 Main Street, Kilkenny", "2", ["Eva Kelly"]),
  tenancy("agr-10", null, "12 Dock Road", "12 Dock Road, Belfast", "2", ["Jack Moore"]),
  tenancy("agr-11", null, "5 Castle Street", "5 Castle Street, Sligo", "3", ["Nora Gallagher"]),
  tenancy("agr-12", null, "41 High Street", "41 High Street, Drogheda", "3", ["Liam Carroll"]),
  tenancy("agr-13", null, "2 Market Square", "2 Market Square, Wexford", "3", ["Ruth Barry"]),
];

function tenancy(
  agreementId: string,
  propertyId: string | null,
  title: string,
  address: string,
  agentId: string,
  privateNames: string[],
): Tenancy {
  return { agreementId, propertyId, title, address, agentId, privateNames };
}

function fromBook(agreementId: string): Tenancy {
  const found = BOOK.find((item) => item.agreementId === agreementId);
  if (!found) throw new Error(`No sample tenancy ${agreementId}`);
  return found;
}

let cases: CaseRecord[] = [
  {
    id: "case-1",
    ...place("agr-3"),
    category: "repair",
    urgency: "urgent",
    status: "acknowledged",
    openedByName: "Oisin Walsh",
    openedByRole: "tenant",
    acknowledgedAt: "2026-11-08T10:00:00",
    createdAt: "2026-11-07T18:20:00",
    messages: [
      {
        id: "case-1-open",
        kind: "user",
        authorName: "Oisin Walsh",
        body: "The boiler loses pressure overnight and the heating drops by morning.",
        createdAt: "2026-11-07T18:20:00",
      },
      {
        id: "case-1-ack",
        kind: "acknowledgement",
        authorName: "Willian Kling",
        body: "Acknowledged. A contractor is booked for this week.",
        createdAt: "2026-11-08T10:00:00",
      },
    ],
  },
  {
    id: "case-2",
    ...place("agr-12"),
    category: "repair",
    urgency: "routine",
    status: "closed",
    openedByName: "Liam Carroll",
    openedByRole: "tenant",
    acknowledgedAt: "2026-11-08T09:15:00",
    createdAt: "2026-11-07T16:00:00",
    messages: [
      {
        id: "case-2-open",
        kind: "user",
        authorName: "Liam Carroll",
        body: "There is a leak under the kitchen sink. The cupboard is wet.",
        createdAt: "2026-11-07T16:00:00",
      },
      {
        id: "case-2-ack",
        kind: "acknowledgement",
        authorName: "Beulin Mew",
        body: "Acknowledged. A plumber is booked.",
        createdAt: "2026-11-08T09:15:00",
      },
      {
        id: "case-2-reply",
        kind: "user",
        authorName: "Beulin Mew",
        body: "The leak is repaired and the cupboard is dry.",
        createdAt: "2026-11-10T15:40:00",
      },
    ],
  },
  {
    id: "case-3",
    ...place("agr-5"),
    category: "neighbour",
    urgency: "routine",
    status: "open",
    openedByName: "Sean Reid",
    openedByRole: "tenant",
    acknowledgedAt: null,
    createdAt: "2026-11-11T21:05:00",
    messages: [
      {
        id: "case-3-open",
        kind: "user",
        authorName: "Sean Reid",
        body: "The flat above plays music late. It has happened the last three nights.",
        createdAt: "2026-11-11T21:05:00",
      },
    ],
  },
  {
    id: "case-4",
    ...place("agr-1"),
    category: "rent_query",
    urgency: "routine",
    status: "answered",
    openedByName: "Aoife Byrne",
    openedByRole: "tenant",
    acknowledgedAt: "2026-11-10T11:00:00",
    createdAt: "2026-11-10T09:30:00",
    messages: [
      {
        id: "case-4-open",
        kind: "user",
        authorName: "Aoife Byrne",
        body: "Is the first month's rent due on 1 December, the day the tenancy starts?",
        createdAt: "2026-11-10T09:30:00",
      },
      {
        id: "case-4-ack",
        kind: "acknowledgement",
        authorName: "Willian Kling",
        body: "Acknowledged.",
        createdAt: "2026-11-10T11:00:00",
      },
      {
        id: "case-4-reply",
        kind: "user",
        authorName: "Willian Kling",
        body: "Yes. The first month is due on 1 December, when the tenancy starts.",
        createdAt: "2026-11-10T11:20:00",
      },
    ],
  },
  {
    id: "case-5",
    ...place("agr-8"),
    category: "repair",
    urgency: "emergency",
    status: "open",
    openedByName: "Darragh Quinn",
    openedByRole: "tenant",
    acknowledgedAt: null,
    createdAt: "2026-11-12T07:40:00",
    messages: [
      {
        id: "case-5-open",
        kind: "user",
        authorName: "Darragh Quinn",
        body: "There is no heating and no hot water this morning.",
        createdAt: "2026-11-12T07:40:00",
      },
    ],
  },
  {
    id: "case-6",
    ...place("agr-13"),
    category: "complaint",
    urgency: "routine",
    status: "acknowledged",
    openedByName: "Ruth Barry",
    openedByRole: "tenant",
    acknowledgedAt: "2026-11-09T14:10:00",
    createdAt: "2026-11-09T12:00:00",
    messages: [
      {
        id: "case-6-open",
        kind: "user",
        authorName: "Ruth Barry",
        body: "The cleaner locked the bike store and the spare key does not work.",
        createdAt: "2026-11-09T12:00:00",
      },
      {
        id: "case-6-ack",
        kind: "acknowledgement",
        authorName: "Beulin Mew",
        body: "Acknowledged. I'll get a key cut.",
        createdAt: "2026-11-09T14:10:00",
      },
    ],
  },
];

function place(agreementId: string): Pick<CaseRecord, "agreementId" | "propertyId" | "title" | "address" | "agentId" | "privateNames"> {
  const home = fromBook(agreementId);
  return {
    agreementId: home.agreementId,
    propertyId: home.propertyId,
    title: home.title,
    address: home.address,
    agentId: home.agentId,
    privateNames: home.privateNames,
  };
}

function present(item: CaseRecord): CaseDetail {
  if (item.agentId === CURRENT_VIEWER_ID) {
    const { agentId: _agentId, privateNames: _privateNames, ...visible } = item;
    return visible;
  }

  const hide = (text: string) => {
    let next = text;
    for (const name of item.privateNames) {
      next = next.split(name).join("the tenant");
    }
    return next.charAt(0).toUpperCase() + next.slice(1);
  };
  const hiddenAuthor = (name: string | null) =>
    name && item.privateNames.includes(name) ? "The tenant" : name;

  const { agentId: _agentId, privateNames: _privateNames, ...visible } = item;
  return {
    ...visible,
    openedByName: item.openedByRole === "tenant" ? "The tenant" : item.openedByName,
    messages: item.messages.map((message) => ({
      ...message,
      authorName: hiddenAuthor(message.authorName),
      body: hide(message.body),
    })),
  };
}

const listeners = new Set<() => void>();

export function subscribeCases(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCases(): CaseRecord[] {
  return cases;
}

export function caseTenancies(): { agreementId: string; title: string; address: string }[] {
  return BOOK.map((item) => ({
    agreementId: item.agreementId,
    title: item.title,
    address: item.address,
  }));
}

/** The signed-in seat opens a case on a tenancy the agency already holds. */
export function openCase(input: {
  agreementId: string;
  category: CaseCategory;
  urgency: CaseUrgency;
  body: string;
}): string {
  const home = fromBook(input.agreementId);
  const at = new Date().toISOString().slice(0, 19);
  const id = `case-${Date.now()}`;
  const created: CaseRecord = {
    id,
    agreementId: home.agreementId,
    propertyId: home.propertyId,
    title: home.title,
    address: home.address,
    agentId: home.agentId,
    privateNames: home.privateNames,
    category: input.category,
    urgency: input.urgency,
    status: "open",
    openedByName: CURRENT_VIEWER_NAME,
    openedByRole: "operator",
    acknowledgedAt: null,
    createdAt: at,
    messages: [
      {
        id: `${id}-open`,
        kind: "user",
        authorName: CURRENT_VIEWER_NAME,
        body: input.body.trim(),
        createdAt: at,
      },
    ],
  };
  cases = [created, ...cases];
  listeners.forEach((listener) => listener());
  return id;
}

export function applyCaseAction(caseId: string, action: CaseAction): void {
  const at = new Date().toISOString().slice(0, 19);
  cases = cases.map((item) =>
    item.id === caseId ? { ...reduceCase(item, action, CURRENT_VIEWER_NAME, at), agentId: item.agentId, privateNames: item.privateNames } : item,
  );
  listeners.forEach((listener) => listener());
}

export function visibleCase(caseId: string): CaseDetail | undefined {
  const found = cases.find((item) => item.id === caseId);
  return found ? present(found) : undefined;
}

export function visibleCases(): CaseDetail[] {
  return cases.map(present);
}
