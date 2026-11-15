import {
  AnalyticsPeriod,
  StaffLetting,
  StaffMember,
  StaffPerformanceDetail,
  StaffPerformanceItem,
  StaffPerformanceSummary,
  StaffSeriesPoint,
} from "@/types/agency/AnalyticsInterfaces";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEK_WEIGHTS = [18, 22, 41, 19, 27, 12, 8];
const MONTH_WEIGHTS = [42, 38, 55, 48, 62, 44, 51, 70, 46, 58, 40, 36];
const YEAR_WEIGHTS = [11, 14, 12, 18, 21];

/** The five years before this one. 2026 shows 2021–2025. */
function previousYears(): string[] {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => String(thisYear - 5 + index));
}

function seriesFor(
  labels: string[],
  weights: number[],
  rent: number,
  lettings: number,
): StaffSeriesPoint[] {
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  return labels.map((label, index) => ({
    label,
    rent: Math.round((rent * weights[index]) / weightTotal),
    lettings: Math.max(0, Math.round((lettings * weights[index]) / weightTotal)),
  }));
}

function periodSeries(
  period: AnalyticsPeriod,
  rent: number,
  lettings: number,
): StaffSeriesPoint[] {
  if (period === "weekly") return seriesFor(DAYS, WEEK_WEIGHTS, rent, lettings);
  if (period === "monthly") return seriesFor(MONTHS, MONTH_WEIGHTS, rent, lettings);
  return seriesFor(previousYears(), YEAR_WEIGHTS, rent, lettings);
}

type Person = {
  staff: StaffMember;
  periods: Record<
    AnalyticsPeriod,
    { summary: Omit<StaffPerformanceSummary, "currency">; lettings: StaffLetting[] }
  >;
};

const PEOPLE: Person[] = [
  {
    staff: {
      id: "1",
      givenName: "Willian",
      familyName: "Kling",
      email: "willian.kling@elaiven.test",
      role: "owner",
    },
    periods: {
      weekly: {
        summary: { lettings: 3, rent: 41_000, changePercent: 4.2, viewings: 8, attended: 6, noShows: 1, offers: 3, declines: 1 },
        lettings: [
          { agreementId: "agr-1", address: "14 Camden Street, Dublin", status: "active", signedAt: "2026-11-09", startDate: "2026-12-01", rentAmount: 1850, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-2", address: "8 Harbour View, Cork", status: "signed", signedAt: "2026-11-11", startDate: "2026-12-15", rentAmount: 1400, rentFrequency: "monthly", currency: "£" },
        ],
      },
      monthly: {
        summary: { lettings: 24, rent: 395_000, changePercent: 6.2, viewings: 40, attended: 31, noShows: 4, offers: 18, declines: 6 },
        lettings: [
          { agreementId: "agr-1", address: "14 Camden Street, Dublin", status: "active", signedAt: "2026-11-09", startDate: "2026-12-01", rentAmount: 1850, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-2", address: "8 Harbour View, Cork", status: "signed", signedAt: "2026-11-04", startDate: "2026-12-15", rentAmount: 1400, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-3", address: "22 King Street, Galway", status: "active", signedAt: "2026-10-21", startDate: "2026-11-01", rentAmount: 2100, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-4", address: "3 Quay Lane, Waterford", status: "signed", signedAt: "2026-10-12", startDate: "2026-11-20", rentAmount: 950, rentFrequency: "monthly", currency: "£" },
        ],
      },
      yearly: {
        summary: { lettings: 86, rent: 2_100_000, changePercent: 12.4, viewings: 310, attended: 240, noShows: 28, offers: 120, declines: 34 },
        lettings: [
          { agreementId: "agr-3", address: "22 King Street, Galway", status: "active", signedAt: "2026-10-21", startDate: "2026-11-01", rentAmount: 2100, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-5", address: "61 Rathmines Road, Dublin", status: "active", signedAt: "2026-06-02", startDate: "2026-07-01", rentAmount: 2400, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-6", address: "9 Strand Road, Bray", status: "active", signedAt: "2026-03-18", startDate: "2026-04-01", rentAmount: 1650, rentFrequency: "monthly", currency: "£" },
        ],
      },
    },
  },
  {
    staff: {
      id: "2",
      givenName: "Megam",
      familyName: "Lee",
      email: "megam.lee@elaiven.test",
      role: "agent",
    },
    periods: {
      weekly: {
        summary: { lettings: 2, rent: 27_000, changePercent: 1.4, viewings: 5, attended: 4, noShows: 0, offers: 2, declines: 1 },
        lettings: [
          { agreementId: "agr-7", address: "17 Pearse Street, Dublin", status: "signed", signedAt: "2026-11-10", startDate: "2026-12-01", rentAmount: 1600, rentFrequency: "monthly", currency: "£" },
        ],
      },
      monthly: {
        summary: { lettings: 22, rent: 246_000, changePercent: 3.6, viewings: 33, attended: 26, noShows: 3, offers: 14, declines: 5 },
        lettings: [
          { agreementId: "agr-7", address: "17 Pearse Street, Dublin", status: "signed", signedAt: "2026-11-10", startDate: "2026-12-01", rentAmount: 1600, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-8", address: "4 Chapel Lane, Limerick", status: "active", signedAt: "2026-10-28", startDate: "2026-11-15", rentAmount: 1200, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-9", address: "30 Main Street, Kilkenny", status: "active", signedAt: "2026-10-08", startDate: "2026-11-01", rentAmount: 1100, rentFrequency: "weekly", currency: "£" },
        ],
      },
      yearly: {
        summary: { lettings: 64, rent: 1_400_000, changePercent: 8.1, viewings: 220, attended: 170, noShows: 19, offers: 80, declines: 22 },
        lettings: [
          { agreementId: "agr-8", address: "4 Chapel Lane, Limerick", status: "active", signedAt: "2026-10-28", startDate: "2026-11-15", rentAmount: 1200, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-10", address: "12 Dock Road, Belfast", status: "active", signedAt: "2026-05-14", startDate: "2026-06-01", rentAmount: 980, rentFrequency: "monthly", currency: "£" },
        ],
      },
    },
  },
  {
    staff: {
      id: "3",
      givenName: "Beulin",
      familyName: "Mew",
      email: "beulin.mew@elaiven.test",
      role: "agent",
    },
    periods: {
      weekly: {
        summary: { lettings: 1, rent: 12_000, changePercent: -2.1, viewings: 4, attended: 2, noShows: 1, offers: 1, declines: 2 },
        lettings: [
          { agreementId: "agr-11", address: "5 Castle Street, Sligo", status: "signed", signedAt: "2026-11-08", startDate: "2026-12-01", rentAmount: 900, rentFrequency: "monthly", currency: "£" },
        ],
      },
      monthly: {
        summary: { lettings: 18, rent: 160_000, changePercent: 4.1, viewings: 27, attended: 19, noShows: 5, offers: 11, declines: 7 },
        lettings: [
          { agreementId: "agr-11", address: "5 Castle Street, Sligo", status: "signed", signedAt: "2026-11-08", startDate: "2026-12-01", rentAmount: 900, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-12", address: "41 High Street, Drogheda", status: "active", signedAt: "2026-10-16", startDate: "2026-11-01", rentAmount: 1350, rentFrequency: "monthly", currency: "£" },
        ],
      },
      yearly: {
        summary: { lettings: 41, rent: 980_000, changePercent: 5.4, viewings: 160, attended: 110, noShows: 22, offers: 52, declines: 19 },
        lettings: [
          { agreementId: "agr-12", address: "41 High Street, Drogheda", status: "active", signedAt: "2026-10-16", startDate: "2026-11-01", rentAmount: 1350, rentFrequency: "monthly", currency: "£" },
          { agreementId: "agr-13", address: "2 Market Square, Wexford", status: "active", signedAt: "2026-02-09", startDate: "2026-03-01", rentAmount: 1050, rentFrequency: "monthly", currency: "£" },
        ],
      },
    },
  },
];

function detailFor(person: Person, period: AnalyticsPeriod): StaffPerformanceDetail {
  const slice = person.periods[period];
  return {
    staff: person.staff,
    period,
    summary: { ...slice.summary, currency: "£" },
    series: periodSeries(period, slice.summary.rent, slice.summary.lettings),
    lettings: slice.lettings,
  };
}

/** Rows for the selected period, taken from the same records as the detail page. */
export function staffList(period: AnalyticsPeriod): StaffPerformanceItem[] {
  return PEOPLE.map((person) => {
    const summary = person.periods[period].summary;
    return {
      staffId: person.staff.id,
      name: `${person.staff.givenName} ${person.staff.familyName}`,
      lettings: summary.lettings,
      rent: summary.rent,
      changePercent: summary.changePercent,
    };
  });
}

/** Stand-in for the request that will take a user id and a period. */
export function staffDetail(
  staffId: string,
  period: AnalyticsPeriod,
): StaffPerformanceDetail | undefined {
  const person = PEOPLE.find((item) => item.staff.id === staffId);
  if (!person) return undefined;
  return detailFor(person, period);
}
