import {
  ApplicationAction,
  ApplicationDetail,
  ApplicationLogEntry,
  ApplicationReason,
  ApplicationState,
  ApplicationViewing,
  ChecksSummary,
  EmploymentStatus,
  ApplicationOrigin,
  HouseholdApplicant,
  HouseholdInvite,
  HousingSituation,
  IncomeSource,
  InviteLink,
} from "@/types/agency/properties/ApplicationInterface";
import { inviteUrl } from "@/data/agency/inviteLink";
import { CURRENT_VIEWER_NAME } from "./currentViewer";
import { INCOME_UNLOCKED, PATH, reduceApplication } from "./applicationMachine";

/**
 * DUMMY DATA. The live API will own every application and every transition.
 * Until then this module is the store, so the list and the detail page agree.
 */

const TODAY = "2026-11-11T09:00:00";

interface Seed {
  id: string;
  propertyId: string;
  leadName: string;
  adults: number;
  children?: number;
  pets?: boolean;
  /** "One cat". Used when pets is true. */
  petsNote?: string;
  intendedMonths?: number;
  desiredMoveIn: string;
  appliedAt: string;
  state: ApplicationState;
  /** Why it stopped. Needed for filtered_out and declined. */
  reason?: ApplicationReason;
  /** The last state reached before it was declined. */
  stoppedAt?: ApplicationState;
  stepDays?: number;
  householdAccepted?: boolean;
  viewingAt?: string;
  /** Defaults to someone who applied on Elaiven. */
  origin?: ApplicationOrigin;
  checks?: Partial<ChecksSummary>;
  income?: IncomeSource[];
}

const SEEDS: Seed[] = [
  // 14 Camden Street. Signed, tenancy starts 1 Dec.
  { id: "app-1", propertyId: "prop-1", leadName: "Aoife Brennan", adults: 2, desiredMoveIn: "2026-12-01", appliedAt: "2026-10-01", state: "signed", householdAccepted: true, checks: { verifiedMonthlyIncome: 5400 }, income: [{ label: "Salary", amountMonthly: 2800 }, { label: "Salary (partner)", amountMonthly: 2600 }] },
  { id: "app-2", propertyId: "prop-1", leadName: "Cian Walsh", adults: 1, desiredMoveIn: "2026-12-01", appliedAt: "2026-10-02", state: "declined", stoppedAt: "eligible", reason: "chose_others_to_proceed" },
  { id: "app-3", propertyId: "prop-1", leadName: "Maeve Collins", adults: 1, children: 1, desiredMoveIn: "2026-12-01", appliedAt: "2026-10-04", state: "declined", stoppedAt: "checks_complete", reason: "affordability", checks: { verifiedMonthlyIncome: 2900, affordability: "fail" } },
  { id: "app-4", propertyId: "prop-1", leadName: "Tomas Novak", adults: 4, children: 1, desiredMoveIn: "2026-12-01", appliedAt: "2026-10-03", state: "filtered_out", reason: "over_occupancy" },
  { id: "app-5", propertyId: "prop-1", leadName: "Ruth Gallagher", adults: 2, pets: true, desiredMoveIn: "2026-12-01", appliedAt: "2026-10-05", state: "declined", stoppedAt: "viewed", reason: "not_suitable_after_viewing" },

  // 8 Harbour View. Open, with households at every stage.
  { id: "app-6", propertyId: "prop-2", leadName: "Liam Murphy", adults: 2, children: 1, pets: true, petsNote: "One cat", intendedMonths: 18, desiredMoveIn: "2026-12-15", appliedAt: "2026-11-06", state: "eligible", origin: "applicant" },
  { id: "app-7", propertyId: "prop-2", leadName: "Sinead Ryan", adults: 1, desiredMoveIn: "2026-12-20", appliedAt: "2026-11-07", state: "viewing_invited", viewingAt: "2026-11-18T14:00:00", origin: "operator" },
  { id: "app-8", propertyId: "prop-2", leadName: "Oisin Kelly", adults: 2, desiredMoveIn: "2026-12-15", appliedAt: "2026-11-03", state: "viewing_invited", viewingAt: "2026-11-13T14:00:00" },
  { id: "app-9", propertyId: "prop-2", leadName: "Fiona Daly", adults: 2, pets: true, desiredMoveIn: "2026-12-15", appliedAt: "2026-10-30", state: "checks_complete", checks: { verifiedMonthlyIncome: 3600, reference: "fail" } },
  { id: "app-10", propertyId: "prop-2", leadName: "Brian Hogan", adults: 3, desiredMoveIn: "2026-12-15", appliedAt: "2026-10-24", state: "accepted", checks: { verifiedMonthlyIncome: 5100 }, income: [{ label: "Salary", amountMonthly: 3900 }, { label: "Rent Supplement", amountMonthly: 1200 }] },
  { id: "app-11", propertyId: "prop-2", leadName: "Emer Walsh", adults: 1, desiredMoveIn: "2026-12-15", appliedAt: "2026-10-28", state: "checks_complete", checks: { verifiedMonthlyIncome: 3100 } },
  { id: "app-12", propertyId: "prop-2", leadName: "Karl Meyer", adults: 2, desiredMoveIn: "2026-12-15", appliedAt: "2026-11-08", state: "filtered_out", reason: "incomplete_application" },
  { id: "app-13", propertyId: "prop-2", leadName: "Nora Fitzgerald", adults: 1, desiredMoveIn: "2026-09-01", appliedAt: "2026-11-02", state: "filtered_out", reason: "move_in_outside_window" },

  // 22 King Street. Let and active.
  { id: "app-14", propertyId: "prop-3", leadName: "Grace Lynch", adults: 2, desiredMoveIn: "2026-11-01", appliedAt: "2026-09-22", stepDays: 4, state: "active", householdAccepted: true, checks: { verifiedMonthlyIncome: 6200 }, income: [{ label: "Salary", amountMonthly: 3500 }, { label: "Salary (partner)", amountMonthly: 2700 }] },
  { id: "app-15", propertyId: "prop-3", leadName: "Seamus Burke", adults: 1, desiredMoveIn: "2026-11-01", appliedAt: "2026-09-24", stepDays: 4, state: "declined", stoppedAt: "shortlisted", reason: "chose_others_to_proceed" },
  { id: "app-16", propertyId: "prop-3", leadName: "Yuki Tanaka", adults: 1, desiredMoveIn: "2026-11-01", appliedAt: "2026-09-25", state: "filtered_out", reason: "incomplete_application" },

  // Room at 3 Quay Lane. A decision waiting, and an agreement ready to send.
  { id: "app-17", propertyId: "prop-4", leadName: "Paul Dunne", adults: 1, desiredMoveIn: "2026-11-20", appliedAt: "2026-10-27", state: "checks_complete", checks: { verifiedMonthlyIncome: 2900 }, income: [{ label: "Salary", amountMonthly: 2900 }] },
  { id: "app-18", propertyId: "prop-4", leadName: "Hannah Reilly", adults: 1, desiredMoveIn: "2026-11-20", appliedAt: "2026-10-20", state: "accepted", householdAccepted: true, checks: { verifiedMonthlyIncome: 2450 }, income: [{ label: "Salary", amountMonthly: 1800 }, { label: "Housing Assistance Payment (HAP)", amountMonthly: 650 }] },
  { id: "app-19", propertyId: "prop-4", leadName: "Kate Moran", adults: 1, desiredMoveIn: "2026-11-25", appliedAt: "2026-11-05", state: "viewing_invited", viewingAt: "2026-11-19T11:00:00", origin: "operator" },
  { id: "app-20", propertyId: "prop-4", leadName: "Ivan Petrov", adults: 1, desiredMoveIn: "2026-11-20", appliedAt: "2026-10-22", state: "declined", stoppedAt: "viewing_invited", reason: "no_show" },

  // 61 Rathmines Road. Let and active.
  { id: "app-21", propertyId: "prop-5", leadName: "Elena Rossi", adults: 2, children: 1, desiredMoveIn: "2026-07-01", appliedAt: "2026-05-20", stepDays: 4, state: "active", householdAccepted: true, checks: { verifiedMonthlyIncome: 7400 }, income: [{ label: "Salary", amountMonthly: 4400 }, { label: "Self-employment", amountMonthly: 3000 }] },
  { id: "app-22", propertyId: "prop-5", leadName: "Jack Doran", adults: 2, desiredMoveIn: "2026-07-01", appliedAt: "2026-05-22", stepDays: 4, state: "declined", stoppedAt: "checks_complete", reason: "references", checks: { reference: "fail" } },
  { id: "app-23", propertyId: "prop-5", leadName: "Orla Healy", adults: 1, desiredMoveIn: "2026-07-01", appliedAt: "2026-05-25", stepDays: 4, state: "declined", stoppedAt: "viewed", reason: "not_suitable_after_viewing" },
];

/** Where each household's income source lives. Released only once accepted. */
const INCOME_BY_APPLICATION: Record<string, IncomeSource[]> = Object.fromEntries(
  SEEDS.filter((seed) => seed.income).map((seed) => [seed.id, seed.income as IncomeSource[]]),
);

function stamp(date: string, dayOffset: number, hour = 10): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + dayOffset, hour)).toISOString().slice(0, 19);
  return value > TODAY ? TODAY : value;
}

function indexOfState(state: ApplicationState): number {
  return PATH.indexOf(state);
}

function buildLog(seed: Seed): ApplicationLogEntry[] {
  const log: ApplicationLogEntry[] = [
    { at: stamp(seed.appliedAt, 0), from: null, to: "applied", by: seed.leadName, reason: null },
  ];

  if (seed.state === "filtered_out") {
    log.push({ at: stamp(seed.appliedAt, 0), from: "applied", to: "filtered_out", by: "Elaiven", reason: seed.reason ?? null });
    return log;
  }

  const reached = seed.state === "declined" ? seed.stoppedAt ?? "eligible" : seed.state;
  const last = indexOfState(reached);
  const step = seed.stepDays ?? 1;

  for (let i = 1; i <= last; i += 1) {
    const to = PATH[i];
    const system = to === "eligible" || to === "checks_complete";
    log.push({
      at: stamp(seed.appliedAt, system && i === 1 ? 0 : i * step),
      from: PATH[i - 1],
      to,
      by: system ? "Elaiven" : to === "signed" ? "All parties" : CURRENT_VIEWER_NAME,
      reason: null,
    });
    if (to === "accepted" && (seed.householdAccepted || indexOfState(seed.state) > indexOfState("accepted"))) {
      log.push({ at: stamp(seed.appliedAt, i * step, 15), from: "accepted", to: "accepted", by: seed.leadName, reason: null });
    }
  }

  if (seed.state === "declined") {
    log.push({ at: stamp(seed.appliedAt, (last + 1) * step), from: reached, to: "declined", by: CURRENT_VIEWER_NAME, reason: seed.reason ?? null });
  }
  return log;
}

function buildViewing(seed: Seed): ApplicationViewing | null {
  const reached = seed.state === "declined" ? seed.stoppedAt ?? "eligible" : seed.state;
  const idx = indexOfState(reached);
  if (seed.state === "filtered_out" || idx < indexOfState("viewing_invited")) return null;

  const scheduledFor = seed.viewingAt ?? stamp(seed.appliedAt, (seed.stepDays ?? 1) * 2 + 1, 14);
  if (seed.reason === "no_show") return { scheduledFor, status: "no_show" };
  if (idx >= indexOfState("viewed")) return { scheduledFor, status: "attended" };
  return { scheduledFor, status: "scheduled" };
}

function buildChecks(seed: Seed): ChecksSummary | null {
  const reached = seed.state === "declined" ? seed.stoppedAt ?? "eligible" : seed.state;
  if (seed.state === "filtered_out" || indexOfState(reached) < indexOfState("checks_complete")) return null;
  return {
    verifiedMonthlyIncome: 4800,
    currency: "£",
    affordability: "pass",
    reference: "pass",
    identity: "pass",
    credit: "pass",
    occupancyFit: "within",
    rightToRent: "pass",
    ...seed.checks,
  };
}

function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".")}@example.com`;
}

const CIRCUMSTANCES: {
  housingSituation: HousingSituation;
  employmentStatus: EmploymentStatus;
  jobTitle: string;
  employerName: string;
  currentAddress: string;
}[] = [
  { housingSituation: "notice_given", employmentStatus: "employed", jobTitle: "Nurse", employerName: "Mercy University Hospital", currentAddress: "12 Sunday's Well, Cork" },
  { housingSituation: "renting", employmentStatus: "employed", jobTitle: "Teacher", employerName: "Cork Educate Together", currentAddress: "4 South Mall, Cork" },
  { housingSituation: "family", employmentStatus: "student", jobTitle: "Student", employerName: "University College Cork", currentAddress: "Family home, Bishopstown, Cork" },
  { housingSituation: "owner", employmentStatus: "self_employed", jobTitle: "Electrician", employerName: "", currentAddress: "8 Western Road, Cork" },
  { housingSituation: "renting", employmentStatus: "retired", jobTitle: "", employerName: "", currentAddress: "2 The Glen, Cork" },
  { housingSituation: "renting", employmentStatus: "not_working", jobTitle: "", employerName: "", currentAddress: "15 Barrack Street, Cork" },
];

const PARTNER_NAMES = ["Aoife", "Cillian", "Niamh", "Patrick", "Saoirse", "Darragh"];

function applicantsFor(seed: Seed, index: number): HouseholdApplicant[] {
  const [givenName, ...rest] = seed.leadName.split(" ");
  const familyName = rest.join(" ") || givenName;
  const people: HouseholdApplicant[] = [];

  for (let person = 0; person < seed.adults; person += 1) {
    const circumstance = CIRCUMSTANCES[(index + person) % CIRCUMSTANCES.length];
    const isLead = person === 0;
    const partnerName = PARTNER_NAMES[(index + person) % PARTNER_NAMES.length];
    const name = isLead
      ? { givenName, familyName }
      : { givenName: partnerName === givenName ? "Robin" : partnerName, familyName };
    const fullName = `${name.givenName} ${name.familyName}`;
    people.push({
      ...name,
      isLead,
      dateOfBirth: `${1984 + ((index + person) % 16)}-${String((person % 12) + 1).padStart(2, "0")}-14`,
      email: emailFor(fullName),
      phone: `087 555 ${String(1000 + index * 37 + person).slice(-4)}`,
      ...circumstance,
      onboardedAt: null,
    });
  }
  return people;
}

function buildInvite(seed: Seed): InviteLink | null {
  if ((seed.origin ?? "applicant") !== "operator") return null;
  const token = seed.id.replace("app-", "inv-");
  return { token, url: inviteUrl(token), sentAt: `${seed.appliedAt}T09:00:00`, onboardedAt: null };
}

function build(seed: Seed, index: number): ApplicationDetail {
  const pastAccepted = indexOfState(seed.state) >= indexOfState("accepted");
  const agreementOut = indexOfState(seed.state) >= indexOfState("agreement_sent");
  const applicants = applicantsFor(seed, index);
  const lead = applicants[0];
  return {
    id: seed.id,
    propertyId: seed.propertyId,
    leadName: seed.leadName,
    adults: seed.adults,
    children: seed.children ?? 0,
    pets: seed.pets ?? false,
    petsNote: seed.petsNote ?? (seed.pets ? "Yes" : "No pets"),
    intendedMonths: seed.intendedMonths ?? 12,
    applicants,
    referencesRequestedAt: null,
    origin: seed.origin ?? "applicant",
    inviteLink: buildInvite(seed),
    desiredMoveIn: seed.desiredMoveIn,
    appliedAt: seed.appliedAt,
    state: seed.state,
    reason: seed.reason ?? null,
    email: lead?.email ?? emailFor(seed.leadName),
    phone: lead?.phone ?? `087 555 ${String(1000 + index * 37).slice(-4)}`,
    viewing: buildViewing(seed),
    checks: buildChecks(seed),
    acceptance: {
      operator: pastAccepted,
      household: agreementOut || Boolean(seed.householdAccepted),
    },
    // Filled in by `withIncomeGate`, and only from acceptance onward.
    incomeSources: null,
    log: buildLog(seed),
  };
}

let applications: ApplicationDetail[] = SEEDS.map(build);
const listeners = new Set<() => void>();

export function subscribeApplications(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getApplications(): ApplicationDetail[] {
  return applications;
}

/**
 * Stand-in for creating an invite.
 * A live call posts `HouseholdInvite` and stores the application and link it returns.
 */
export function inviteHousehold(invite: HouseholdInvite): string {
  const now = new Date().toISOString().slice(0, 19);
  const id = `app-${Date.now()}`;
  const token = `inv-${Date.now()}`;
  const applicants = [{ ...invite.lead, isLead: true }];
  if (invite.secondAdult) applicants.push({ ...invite.secondAdult, isLead: false });
  const lead = applicants[0];

  const created: ApplicationDetail = {
    id,
    propertyId: invite.propertyId,
    leadName: `${lead.givenName} ${lead.familyName}`.trim(),
    adults: applicants.length,
    children: invite.children,
    pets: invite.petsNote !== "" && invite.petsNote !== "No pets",
    petsNote: invite.petsNote || "No pets",
    desiredMoveIn: invite.desiredMoveIn,
    appliedAt: now.slice(0, 10),
    state: "viewing_invited",
    reason: null,
    email: lead.email,
    phone: lead.phone,
    intendedMonths: invite.intendedMonths,
    applicants,
    referencesRequestedAt: null,
    origin: "operator",
    inviteLink: { token, url: inviteUrl(token), sentAt: now, onboardedAt: null },
    viewing: { scheduledFor: invite.viewingAt, status: "scheduled" },
    checks: null,
    acceptance: { operator: false, household: false },
    incomeSources: null,
    log: [{ at: now, from: null, to: "viewing_invited", by: CURRENT_VIEWER_NAME, reason: null }],
  };

  applications = [created, ...applications];
  listeners.forEach((listener) => listener());
  return id;
}

/** Record one action by the signed-in seat. Every call adds a log entry. */
export function applyApplicationAction(applicationId: string, action: ApplicationAction): void {
  applications = applications.map((application) => {
    if (application.id !== applicationId) return application;
    const lastAt = application.log[application.log.length - 1]?.at ?? "";
    const nowAt = new Date().toISOString().slice(0, 19);
    return reduceApplication(application, action, CURRENT_VIEWER_NAME, nowAt > lastAt ? nowAt : lastAt);
  });
  listeners.forEach((listener) => listener());
}

/**
 * Income source stays off every screen until the application is accepted.
 * The live API must enforce this in the serializer, by role and stage.
 */
export function withIncomeGate(application: ApplicationDetail): ApplicationDetail {
  if (!INCOME_UNLOCKED.includes(application.state)) return application;
  const stored = INCOME_BY_APPLICATION[application.id];
  const fallback = application.checks
    ? [{ label: "Salary", amountMonthly: application.checks.verifiedMonthlyIncome }]
    : null;
  return { ...application, incomeSources: stored ?? fallback };
}
