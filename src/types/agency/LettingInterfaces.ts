/** A person named on the agreement. The lead is the application's lead tenant. */
export interface LettingTenant {
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
  isLead: boolean;
  isSignatory: boolean;
  employmentStatus: "employed" | "self_employed" | "student" | "retired" | "not_working";
  jobTitle: string;
  employerName: string;
}

/** One thing that happened on the way from application to the current tenancy. */
export interface LettingEvent {
  id: string;
  kind:
    | "application"
    | "viewing"
    | "offer"
    | "signed"
    | "deposit"
    | "keys"
    | "condition"
    | "rent"
    | "case";
  occurredOn: string;
  title: string;
  detail: string;
  /** Set when this line is a case the reports desk can open. */
  caseId?: string;
}

/**
 * What a letting request returns.
 * The real call is the agreement id. Tenants are the agreement's tenant parties.
 */
export interface LettingDetail {
  agreementId: string;
  address: string;
  status: "signed" | "active";
  kind: "tenancy" | "licence";
  jurisdiction: "IE" | "EN" | "SC" | "WA" | "NI";
  startDate: string;
  endDate: string | null;
  signedAt: string;
  rentAmount: number;
  rentFrequency: "monthly" | "weekly";
  depositAmount: number;
  currency: string;
  registration: string;
  ownerName: string;
  /** User id of the agent who signed. Tenant contact is limited to this seat. */
  agentId: string;
  agentName: string;
  /** Tenants on the agreement. Empty when the viewer is not `agentId`. */
  tenants: LettingTenant[];
  /** Count of tenants, including when `tenants` is withheld. */
  tenantCount: number;
  history: LettingEvent[];
}
