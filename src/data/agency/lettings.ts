import { CURRENT_VIEWER_ID } from "@/data/agency/currentViewer";
import {
  LettingDetail,
  LettingEvent,
  LettingTenant,
} from "@/types/agency/LettingInterfaces";

type Seed = {
  agreementId: string;
  address: string;
  status: LettingDetail["status"];
  jurisdiction: LettingDetail["jurisdiction"];
  signedAt: string;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  rentFrequency: LettingDetail["rentFrequency"];
  depositAmount: number;
  currency: string;
  registration: string;
  ownerName: string;
  agentId: string;
  agentName: string;
  tenants: LettingTenant[];
  repair?: string;
  caseId?: string;
};

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const monthText = String(date.getMonth() + 1).padStart(2, "0");
  const dayText = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${monthText}-${dayText}`;
}

function today(): string {
  const date = new Date();
  const monthText = String(date.getMonth() + 1).padStart(2, "0");
  const dayText = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${monthText}-${dayText}`;
}

function historyFor(seed: Seed): LettingEvent[] {
  const lead = seed.tenants.find((tenant) => tenant.isLead) ?? seed.tenants[0];
  const leadName = `${lead.givenName} ${lead.familyName}`;
  const events: LettingEvent[] = [
    {
      id: `${seed.agreementId}-application`,
      kind: "application",
      occurredOn: addDays(seed.signedAt, -18),
      title: "Application submitted",
      detail: `${leadName} applied as the lead tenant.`,
    },
    {
      id: `${seed.agreementId}-viewing`,
      kind: "viewing",
      occurredOn: addDays(seed.signedAt, -10),
      title: "Viewing attended",
      detail: `${leadName} viewed the property with ${seed.agentName}.`,
    },
    {
      id: `${seed.agreementId}-offer`,
      kind: "offer",
      occurredOn: addDays(seed.signedAt, -2),
      title: "Offer accepted",
      detail: `${leadName} accepted the offer to let ${seed.address}.`,
    },
    {
      id: `${seed.agreementId}-signed`,
      kind: "signed",
      occurredOn: seed.signedAt,
      title: "Agreement signed",
      detail: `${seed.agentName} signed for the agency. ${leadName} signed as tenant.`,
    },
    {
      id: `${seed.agreementId}-deposit`,
      kind: "deposit",
      occurredOn: addDays(seed.signedAt, 3),
      title: "Deposit protected",
      detail: `${seed.currency}${seed.depositAmount.toLocaleString("en-GB")} registered${seed.registration ? `, reference ${seed.registration}` : ""}.`,
    },
  ];

  if (seed.startDate <= today()) {
    events.push(
      {
        id: `${seed.agreementId}-keys`,
        kind: "keys",
        occurredOn: seed.startDate,
        title: "Keys handed over",
        detail: `Two keys handed to ${leadName}. The tenancy started.`,
      },
      {
        id: `${seed.agreementId}-condition`,
        kind: "condition",
        occurredOn: seed.startDate,
        title: "Move-in condition report",
        detail: "Recorded at handover. Rooms marked good, with no noted damage.",
      },
      {
        id: `${seed.agreementId}-rent`,
        kind: "rent",
        occurredOn: seed.startDate,
        title: "Rent paid",
        detail: `${seed.currency}${seed.rentAmount.toLocaleString("en-GB")} received for the first ${seed.rentFrequency === "weekly" ? "week" : "month"}.`,
      },
    );
  }

  if (seed.repair) {
    events.push({
      id: `${seed.agreementId}-case`,
      kind: "case",
      occurredOn: addDays(seed.startDate, 6),
      title: "Repair case opened",
      detail: seed.repair,
      caseId: seed.caseId,
    });
  }

  return events
    .filter((event) => event.occurredOn <= today())
    .sort((left, right) => right.occurredOn.localeCompare(left.occurredOn));
}

function letting(seed: Seed): LettingDetail {
  return {
    agreementId: seed.agreementId,
    address: seed.address,
    status: seed.status,
    kind: "tenancy",
    jurisdiction: seed.jurisdiction,
    startDate: seed.startDate,
    endDate: seed.endDate,
    signedAt: seed.signedAt,
    rentAmount: seed.rentAmount,
    rentFrequency: seed.rentFrequency,
    depositAmount: seed.depositAmount,
    currency: seed.currency,
    registration: seed.registration,
    ownerName: seed.ownerName,
    agentId: seed.agentId,
    agentName: seed.agentName,
    tenants: seed.tenants,
    tenantCount: seed.tenants.length,
    history: historyFor(seed),
  };
}

/** Swap tenant names for a role, so a colleague does not see who they are. */
function redactDetail(detail: string, tenants: LettingTenant[]): string {
  let text = detail;
  const lead = tenants.find((tenant) => tenant.isLead) ?? tenants[0];
  for (const tenant of tenants) {
    if (tenant === lead) continue;
    text = text.split(`${tenant.givenName} ${tenant.familyName}`).join("a tenant");
  }
  if (lead) {
    text = text.split(`${lead.givenName} ${lead.familyName}`).join("the lead tenant");
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const tenant = (
  givenName: string,
  familyName: string,
  employment: Pick<LettingTenant, "employmentStatus" | "jobTitle" | "employerName">,
  isLead = true,
): LettingTenant => ({
  givenName,
  familyName,
  email: `${givenName}.${familyName}`.toLowerCase().replace(" ", "") + "@email.test",
  phone: "085 000 0000",
  isLead,
  isSignatory: true,
  ...employment,
});

const LETTINGS: Record<string, LettingDetail> = {
  "agr-1": letting({
    agreementId: "agr-1",
    address: "14 Camden Street, Dublin",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-11-09",
    startDate: "2026-12-01",
    endDate: "2027-11-30",
    rentAmount: 1850,
    rentFrequency: "monthly",
    depositAmount: 1850,
    currency: "£",
    registration: "RTB-104418",
    ownerName: "Niamh Doyle",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [tenant("Aoife", "Byrne", { employmentStatus: "employed", jobTitle: "Teacher", employerName: "Synge Street CBS" })],
  }),
  "agr-2": letting({
    agreementId: "agr-2",
    address: "8 Harbour View, Cork",
    status: "signed",
    jurisdiction: "IE",
    signedAt: "2026-11-11",
    startDate: "2026-12-15",
    endDate: "2027-12-14",
    rentAmount: 1400,
    rentFrequency: "monthly",
    depositAmount: 1400,
    currency: "£",
    registration: "",
    ownerName: "Patrick Hayes",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [
      tenant("Cian", "Murphy", { employmentStatus: "employed", jobTitle: "Nurse", employerName: "Cork University Hospital" }),
      tenant("Lara", "Murphy", { employmentStatus: "student", jobTitle: "", employerName: "University College Cork" }, false),
    ],
  }),
  "agr-3": letting({
    agreementId: "agr-3",
    address: "22 King Street, Galway",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-10-21",
    startDate: "2026-11-01",
    endDate: "2027-10-31",
    rentAmount: 2100,
    rentFrequency: "monthly",
    depositAmount: 2100,
    currency: "£",
    registration: "RTB-993120",
    ownerName: "Siobhan Keane",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [tenant("Oisin", "Walsh", { employmentStatus: "self_employed", jobTitle: "Architect", employerName: "" })],
    repair: "Boiler losing pressure. Acknowledged and a contractor is booked.",
    caseId: "case-1",
  }),
  "agr-4": letting({
    agreementId: "agr-4",
    address: "3 Quay Lane, Waterford",
    status: "signed",
    jurisdiction: "IE",
    signedAt: "2026-10-12",
    startDate: "2026-11-20",
    endDate: "2027-11-19",
    rentAmount: 950,
    rentFrequency: "monthly",
    depositAmount: 950,
    currency: "£",
    registration: "RTB-771204",
    ownerName: "Declan Power",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [tenant("Maeve", "Foley", { employmentStatus: "employed", jobTitle: "Retail assistant", employerName: "Penneys" })],
  }),
  "agr-5": letting({
    agreementId: "agr-5",
    address: "61 Rathmines Road, Dublin",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-06-02",
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    rentAmount: 2400,
    rentFrequency: "monthly",
    depositAmount: 2400,
    currency: "£",
    registration: "RTB-551902",
    ownerName: "Niamh Doyle",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [tenant("Sean", "Reid", { employmentStatus: "employed", jobTitle: "Software engineer", employerName: "Stripe" })],
  }),
  "agr-6": letting({
    agreementId: "agr-6",
    address: "9 Strand Road, Bray",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-03-18",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    rentAmount: 1650,
    rentFrequency: "monthly",
    depositAmount: 1650,
    currency: "£",
    registration: "RTB-440118",
    ownerName: "Ellen Byrne",
    agentName: "Willian Kling",
    agentId: "1",
    tenants: [tenant("Grainne", "Nolan", { employmentStatus: "employed", jobTitle: "Accountant", employerName: "KPMG" })],
  }),
  "agr-7": letting({
    agreementId: "agr-7",
    address: "17 Pearse Street, Dublin",
    status: "signed",
    jurisdiction: "IE",
    signedAt: "2026-11-10",
    startDate: "2026-12-01",
    endDate: "2027-11-30",
    rentAmount: 1600,
    rentFrequency: "monthly",
    depositAmount: 1600,
    currency: "£",
    registration: "",
    ownerName: "Colm Farrell",
    agentName: "Megam Lee",
    agentId: "2",
    tenants: [tenant("Hannah", "Clarke", { employmentStatus: "employed", jobTitle: "Designer", employerName: "Pinterest" })],
  }),
  "agr-8": letting({
    agreementId: "agr-8",
    address: "4 Chapel Lane, Limerick",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-10-28",
    startDate: "2026-11-15",
    endDate: "2027-11-14",
    rentAmount: 1200,
    rentFrequency: "monthly",
    depositAmount: 1200,
    currency: "£",
    registration: "RTB-220441",
    ownerName: "Mary O'Brien",
    agentName: "Megam Lee",
    agentId: "2",
    tenants: [tenant("Darragh", "Quinn", { employmentStatus: "student", jobTitle: "", employerName: "University of Limerick" })],
  }),
  "agr-9": letting({
    agreementId: "agr-9",
    address: "30 Main Street, Kilkenny",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-10-08",
    startDate: "2026-11-01",
    endDate: null,
    rentAmount: 1100,
    rentFrequency: "weekly",
    depositAmount: 1100,
    currency: "£",
    registration: "RTB-318800",
    ownerName: "Tomás Ryan",
    agentName: "Megam Lee",
    agentId: "2",
    tenants: [tenant("Eva", "Kelly", { employmentStatus: "employed", jobTitle: "Chef", employerName: "Campagne" })],
  }),
  "agr-10": letting({
    agreementId: "agr-10",
    address: "12 Dock Road, Belfast",
    status: "active",
    jurisdiction: "NI",
    signedAt: "2026-05-14",
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    rentAmount: 980,
    rentFrequency: "monthly",
    depositAmount: 980,
    currency: "£",
    registration: "LR-NI-19022",
    ownerName: "Paul Hughes",
    agentName: "Megam Lee",
    agentId: "2",
    tenants: [tenant("Jack", "Moore", { employmentStatus: "employed", jobTitle: "Electrician", employerName: "Hughes & Co" })],
  }),
  "agr-11": letting({
    agreementId: "agr-11",
    address: "5 Castle Street, Sligo",
    status: "signed",
    jurisdiction: "IE",
    signedAt: "2026-11-08",
    startDate: "2026-12-01",
    endDate: "2027-11-30",
    rentAmount: 900,
    rentFrequency: "monthly",
    depositAmount: 900,
    currency: "£",
    registration: "",
    ownerName: "Bridget Flynn",
    agentName: "Beulin Mew",
    agentId: "3",
    tenants: [tenant("Nora", "Gallagher", { employmentStatus: "retired", jobTitle: "", employerName: "" })],
  }),
  "agr-12": letting({
    agreementId: "agr-12",
    address: "41 High Street, Drogheda",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-10-16",
    startDate: "2026-11-01",
    endDate: "2027-10-31",
    rentAmount: 1350,
    rentFrequency: "monthly",
    depositAmount: 1350,
    currency: "£",
    registration: "RTB-660219",
    ownerName: "Kevin Dunne",
    agentName: "Beulin Mew",
    agentId: "3",
    tenants: [tenant("Liam", "Carroll", { employmentStatus: "employed", jobTitle: "Driver", employerName: "Bus Éireann" })],
    repair: "Leak under the kitchen sink. Closed after the repair on 10 Nov.",
    caseId: "case-2",
  }),
  "agr-13": letting({
    agreementId: "agr-13",
    address: "2 Market Square, Wexford",
    status: "active",
    jurisdiction: "IE",
    signedAt: "2026-02-09",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    rentAmount: 1050,
    rentFrequency: "monthly",
    depositAmount: 1050,
    currency: "£",
    registration: "RTB-102883",
    ownerName: "Anne Roche",
    agentName: "Beulin Mew",
    agentId: "3",
    tenants: [tenant("Ruth", "Barry", { employmentStatus: "employed", jobTitle: "Pharmacist", employerName: "Boots" })],
  }),
};

/**
 * Stand-in for the agreement request.
 * Tenant contact is included only when the viewer is the signing agent.
 * The live API should make that decision and omit the fields.
 */
export function lettingDetail(agreementId: string): LettingDetail | undefined {
  const letting = LETTINGS[agreementId];
  if (!letting) return undefined;
  if (letting.agentId === CURRENT_VIEWER_ID) return letting;
  return {
    ...letting,
    tenants: [],
    history: letting.history.map((event) => ({
      ...event,
      detail: redactDetail(event.detail, letting.tenants),
    })),
  };
}
