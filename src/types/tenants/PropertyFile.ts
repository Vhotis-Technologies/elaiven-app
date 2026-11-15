import { CaseCategory, CaseStatus, CaseUrgency } from "@/types/agency/CaseInterface";

/**
 * How this tenant holds the property.
 * `invited` — the agency sent them here. They do not hold it yet.
 * `applied` — they applied on Elaiven. The agency has not given it to them.
 * `given` — the agency has given them the property.
 */
export type TenantHolding = "invited" | "applied" | "given";

/** Whether a person on the household has used their link. */
export type HouseholdInviteStatus = "sent" | "opened" | "joined";

/** Matches tenancies.Viewing.status. */
export type TenantViewingStatus = "scheduled" | "attended" | "no_show" | "cancelled";

export interface TenantHouseholdPerson {
  id: string;
  token: string;
  givenName: string;
  familyName: string;
  isLead: boolean;
  invitedBy: "agency" | "tenant";
  inviteStatus: HouseholdInviteStatus;
}

/** What the tenant can record once a viewing day arrives. */
export type TenantViewingOutcome = Exclude<TenantViewingStatus, "scheduled">;

export interface TenantViewing {
  id: string;
  scheduledFor: string;
  status: TenantViewingStatus;
  withName: string;
}

/** A report on the property. A tenant who has been given the property can raise one. */
export interface TenantReport {
  id: string;
  title: string;
  problem: string;
  photos: string[];
  location: string;
  category: CaseCategory;
  urgency: CaseUrgency;
  status: CaseStatus;
  openedOn: string;
}

/**
 * The tenant's property file.
 * Property facts (address, rent, photo) stay on the shared property record.
 */
export interface TenantPropertyFile {
  id: string;
  tenantId: string;
  propertyId: string;
  holding: TenantHolding;
  tenantGivenName: string;
  tenantFamilyName: string;
  agencyName: string;
  invitedByName: string;
  invitedOn: string | null;
  agreementId: string | null;
  tenancyStart: string | null;
  household: TenantHouseholdPerson[];
  viewings: TenantViewing[];
  reports: TenantReport[];
}
