/**
 * One household moves through these states. A person records every change.
 * A household arrives in one of two ways: they apply on Elaiven and pass the filter,
 * or the operator types them in and sends a link, already invited to a viewing.
 */
export type ApplicationState =
  | "applied"
  | "filtered_out"
  | "eligible"
  | "viewing_invited"
  | "viewed"
  | "shortlisted"
  | "checks_running"
  | "checks_complete"
  | "accepted"
  | "declined"
  | "agreement_sent"
  | "signed"
  | "active"
  | "terminated";

/** Why the filter stopped an application. Property facts only. */
export type FilterReason =
  | "over_occupancy"
  | "move_in_outside_window"
  | "incomplete_application";

/** Why a person turned an application down. A fixed list, never free text. */
export type DeclineReason =
  | "not_a_good_fit"
  | "chose_others_to_proceed"
  | "not_suitable_after_viewing"
  | "no_show"
  | "affordability"
  | "references"
  | "id_or_credit"
  | "applicant_withdrew";

export type ApplicationReason = FilterReason | DeclineReason;

export type CheckResult = "pass" | "fail";

/**
 * What the decision screen may show. No income source and no payment source.
 * The full report stays on the server for the audit trail.
 */
export interface ChecksSummary {
  verifiedMonthlyIncome: number;
  currency: string;
  affordability: CheckResult;
  reference: CheckResult | "not_required";
  identity: CheckResult;
  credit: CheckResult | "unavailable";
  occupancyFit: "within" | "over";
  rightToRent: CheckResult;
}

/** Shown only once an application is accepted. For paperwork and the payment split. */
export interface IncomeSource {
  label: string;
  amountMonthly: number;
}

export type HousingSituation =
  | "renting"
  | "homeless"
  | "with_friends"
  | "family"
  | "owner"
  | "notice_given";

export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "student"
  | "retired"
  | "not_working"
  | "unemployed";

/**
 * One adult the operator named. Blank fields are filled in by that person after they open the link.
 * Children are counted on the application, not listed here.
 */
export interface HouseholdApplicant {
  givenName: string;
  familyName: string;
  isLead: boolean;
  dateOfBirth: string;
  email: string;
  phone: string;
  currentAddress: string;
  housingSituation: HousingSituation | null;
  employmentStatus: EmploymentStatus | null;
  jobTitle: string;
  employerName: string;
  onboardedAt: string | null;
}

/** The body a live `POST` will accept when an operator invites a household. */
export interface HouseholdInvite {
  propertyId: string;
  lead: HouseholdApplicant;
  secondAdult: HouseholdApplicant | null;
  children: number;
  petsNote: string;
  desiredMoveIn: string;
  intendedMonths: number | null;
  viewingAt: string;
}

/** How the household arrived. The live API sets this. */
export type ApplicationOrigin = "applicant" | "operator";

/** The link sent to the household. The live API issues the token. */
export interface InviteLink {
  token: string;
  url: string;
  sentAt: string;
  /** When the first person on this link got an account. */
  onboardedAt: string | null;
}

export interface ApplicationViewing {
  scheduledFor: string;
  status: "scheduled" | "attended" | "no_show";
}

/** Every transition, whoever made it. */
export interface ApplicationLogEntry {
  /** ISO date and time */
  at: string;
  from: ApplicationState | null;
  to: ApplicationState;
  by: string;
  reason: ApplicationReason | null;
}

/** One row on the property page. */
export interface ApplicationSummary {
  id: string;
  propertyId: string;
  leadName: string;
  adults: number;
  children: number;
  pets: boolean;
  desiredMoveIn: string;
  appliedAt: string;
  state: ApplicationState;
  reason: ApplicationReason | null;
}

export interface ApplicationDetail extends ApplicationSummary {
  email: string;
  phone: string;
  intendedMonths: number | null;
  petsNote: string;
  applicants: HouseholdApplicant[];
  referencesRequestedAt: string | null;
  origin: ApplicationOrigin;
  /** Set when the operator sent a link. An applicant who applied on Elaiven has none. */
  inviteLink: InviteLink | null;
  viewing: ApplicationViewing | null;
  checks: ChecksSummary | null;
  acceptance: { operator: boolean; household: boolean };
  incomeSources: IncomeSource[] | null;
  log: ApplicationLogEntry[];
}

/** What a person can do next. The state decides which of these show. */
export type ApplicationAction =
  | { type: "invite"; scheduledFor: string }
  | { type: "request_references" }
  | { type: "decline"; reason: DeclineReason }
  | { type: "attended" }
  | { type: "shortlist" }
  | { type: "start_checks" }
  | { type: "finish_checks" }
  | { type: "operator_accept" }
  | { type: "household_accept" }
  | { type: "send_agreement" }
  | { type: "mark_signed" }
  | { type: "start_tenancy" };
