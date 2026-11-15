/** Weekly is seven days, monthly is twelve months, yearly is the previous five years. */
export type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

/** One bar on the rent chart. `value` is rent secured, in major currency units. */
export interface ChartPoint {
  label: string;
  value: number;
}

/** Period total shown above the chart. */
export interface LettingsOverviewData {
  total: number;
  changePercent: number;
  currency: string;
  axisMax: number;
  points: ChartPoint[];
  highlightIndex: number;
}

/** A seat on the agency. `id` is the user's id, which the detail request uses. */
export interface StaffMember {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
  role: "owner" | "agent";
}

/**
 * One row of the staff list.
 * `lettings` is agreements they signed as agent.
 * `rent` is the rent on those agreements, not a fee they earned.
 */
export interface StaffPerformanceItem {
  staffId: string;
  name: string;
  lettings: number;
  rent: number;
  changePercent: number;
}

/** Counts for the selected period. `changePercent` compares rent with the previous period. */
export interface StaffPerformanceSummary {
  lettings: number;
  rent: number;
  currency: string;
  changePercent: number;
  viewings: number;
  attended: number;
  noShows: number;
  offers: number;
  declines: number;
}

/** One bar of this person's chart. `rent` is what the bar draws. */
export interface StaffSeriesPoint {
  label: string;
  rent: number;
  lettings: number;
}

/**
 * One agreement this person signed as agent.
 * The letting page loads the tenants and history by `agreementId`.
 */
export interface StaffLetting {
  agreementId: string;
  address: string;
  status: "signed" | "active";
  signedAt: string;
  startDate: string;
  rentAmount: number;
  rentFrequency: "monthly" | "weekly";
  currency: string;
}

/**
 * What a staff detail request returns.
 * The real call is this person's user id plus the period; this is the body.
 */
export interface StaffPerformanceDetail {
  staff: StaffMember;
  period: AnalyticsPeriod;
  summary: StaffPerformanceSummary;
  series: StaffSeriesPoint[];
  lettings: StaffLetting[];
}
