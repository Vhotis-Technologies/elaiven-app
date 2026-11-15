import { formatDate, formatFull } from "@/components/agency/analytics/format";
import { propertyDetail } from "@/data/agency/properties";
import { houseBoardLine } from "@/data/tenants/houseBoard";
import { TenantPropertyFile, TenantReport } from "@/types/tenants/PropertyFile";

export type HomeTarget =
  | { kind: "property"; fileId: string }
  | { kind: "report"; fileId: string; reportId: string }
  | { kind: "invite"; fileId: string; personId: string }
  | { kind: "viewing"; fileId: string; viewingId: string }
  | { kind: "board"; propertyId: string };

export interface HomePlace {
  title: string;
  detail: string;
  target: HomeTarget;
}

export interface HomeRow {
  id: string;
  text: string;
  target: HomeTarget;
}

export interface HomeRentCard {
  title: string;
  detail: string;
  amount: string;
  /** The pill on the rent card. */
  action: string;
  fileId: string;
}

export interface TenantHome {
  greeting: string;
  name: string;
  place: HomePlace | null;
  rent: string | null;
  rentCard: HomeRentCard | null;
  board: HomeRow | null;
  needs: HomeRow[];
}

const URGENCY_RANK = { emergency: 0, urgent: 1, routine: 2 } as const;
const RENT_WINDOW_DAYS = 9;

function addressOf(file: TenantPropertyFile): string {
  const property = propertyDetail(file.propertyId);
  return property?.addressLine1 || property?.title || "Your property";
}

function parseDay(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000);
}

/** Fri 20 Nov, 14:00. `iso` is local, YYYY-MM-DDTHH:mm. */
function formatWhen(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  const when = parseDay(datePart);
  const label = when.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  if (!timePart) return label;
  const [hour, minute] = timePart.split(":");
  return `${label}, ${hour}:${minute}`;
}

export function greetingFor(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Days until the next rent date, once the tenancy has started. */
function daysUntilRent(file: TenantPropertyFile, now: Date): number | null {
  if (file.holding !== "given" || !file.tenancyStart) return null;
  const property = propertyDetail(file.propertyId);
  if (!property) return null;

  const start = parseDay(file.tenancyStart);
  const today = startOfDay(now);
  if (start > today) return null;

  const due = new Date(start);
  const step = property.rentFrequency === "weekly" ? 7 : 0;
  if (step === 0) {
    const day = start.getDate();
    due.setFullYear(today.getFullYear(), today.getMonth(), day);
    if (due < today) due.setMonth(due.getMonth() + 1);
  } else {
    while (due < today) due.setDate(due.getDate() + step);
  }

  return daysBetween(today, due);
}

/** Rent appears only once the tenancy has started and the next due date is close. */
function rentLine(file: TenantPropertyFile, now: Date): string | null {
  const property = propertyDetail(file.propertyId);
  const days = daysUntilRent(file, now);
  if (!property || days === null || days > RENT_WINDOW_DAYS) return null;

  const amount = formatFull(property.rentAmount, property.currency);
  if (days === 0) return `${amount} due today`;
  if (days === 1) return `${amount} due tomorrow`;
  return `${amount} due in ${days} days`;
}

/** The rent card on Home. A future tenancy shows the start, not a payment that is not due. */
function rentCardFor(file: TenantPropertyFile, now: Date): HomeRentCard | null {
  if (file.holding !== "given") return null;
  const property = propertyDetail(file.propertyId);
  if (!property) return null;

  const amount = formatFull(property.rentAmount, property.currency);
  const today = startOfDay(now);
  if (file.tenancyStart) {
    const start = parseDay(file.tenancyStart);
    if (start > today) {
      const days = daysBetween(today, start);
      const detail =
        days === 1 ? "It starts tomorrow." : days === 0 ? "It starts today." : `It starts in ${days} days.`;
      return {
        title: "Your tenancy starts soon",
        detail,
        amount,
        action: "View property",
        fileId: file.id,
      };
    }
  }

  const days = daysUntilRent(file, now);
  if (days !== null && days <= RENT_WINDOW_DAYS) {
    const detail =
      days === 0
        ? "Your rent payment is due today."
        : days === 1
          ? "Your rent payment is due tomorrow."
          : `Your rent payment is due in ${days} days.`;
    return {
      title: "Your rent is due soon",
      detail,
      amount,
      action: "Pay Rent",
      fileId: file.id,
    };
  }

  return {
    title: "Your rent",
    detail: file.tenancyStart
      ? `Tenancy from ${formatDate(file.tenancyStart)}.`
      : "The agency has given you this property.",
    amount,
    action: "View property",
    fileId: file.id,
  };
}

/** A house board belongs to a place she holds with other people, or a room in a shared house. */
function sharesHouse(file: TenantPropertyFile): boolean {
  if (file.holding !== "given") return false;
  const property = propertyDetail(file.propertyId);
  if (property?.arrangement === "shared_room") return true;
  return file.household.length > 1;
}

function placeFor(files: TenantPropertyFile[]): HomePlace | null {
  const given = files.find((file) => file.holding === "given");
  if (given) {
    return {
      title: addressOf(given),
      detail: given.tenancyStart
        ? `Tenancy from ${formatDate(given.tenancyStart)}`
        : "The agency has given you this property.",
      target: { kind: "property", fileId: given.id },
    };
  }

  const upcoming = files
    .flatMap((file) =>
      file.viewings
        .filter((viewing) => viewing.status === "scheduled")
        .map((viewing) => ({ file, viewing })),
    )
    .sort((a, b) => a.viewing.scheduledFor.localeCompare(b.viewing.scheduledFor))[0];

  if (upcoming) {
    return {
      title: addressOf(upcoming.file),
      detail: `Viewing ${formatWhen(upcoming.viewing.scheduledFor)}`,
      target: { kind: "viewing", fileId: upcoming.file.id, viewingId: upcoming.viewing.id },
    };
  }

  const applied = files.find((file) => file.holding === "applied");
  if (applied) {
    return {
      title: addressOf(applied),
      detail: "Waiting on your application.",
      target: { kind: "property", fileId: applied.id },
    };
  }

  const invited = files.find((file) => file.holding === "invited");
  if (!invited) return null;
  return {
    title: addressOf(invited),
    detail: "The agency invited you here.",
    target: { kind: "property", fileId: invited.id },
  };
}

function reportText(report: TenantReport): string {
  const problem = report.problem || report.title;
  if (!report.location) return `${problem} is still open.`;
  return `${problem} in the ${report.location.toLowerCase()} is still open.`;
}

function inviteText(givenName: string, status: "sent" | "opened"): string {
  if (status === "opened") return `${givenName} opened the link and has not joined.`;
  return `${givenName} has not opened the link.`;
}

function buildNeeds(files: TenantPropertyFile[]): HomeRow[] {
  const viewings = files
    .flatMap((file) =>
      file.viewings
        .filter((viewing) => viewing.status === "scheduled")
        .map((viewing) => ({ file, viewing })),
    )
    .sort((a, b) => a.viewing.scheduledFor.localeCompare(b.viewing.scheduledFor));

  const reports = files
    .filter((file) => file.holding === "given")
    .flatMap((file) =>
      file.reports.filter((report) => report.status === "open").map((report) => ({ file, report })),
    )
    .sort(
      (a, b) =>
        URGENCY_RANK[a.report.urgency] - URGENCY_RANK[b.report.urgency] ||
        b.report.openedOn.localeCompare(a.report.openedOn),
    );

  const invites = files
    .filter((file) => file.holding === "given")
    .flatMap((file) =>
      file.household
        .filter((person) => !person.isLead && person.inviteStatus !== "joined")
        .map((person) => ({ file, person })),
    );

  const rows: HomeRow[] = [];
  const seen = new Set<string>();

  function push(row: HomeRow) {
    if (rows.length >= 3 || seen.has(row.id)) return;
    seen.add(row.id);
    rows.push(row);
  }

  const firstViewing = viewings[0];
  if (firstViewing) {
    push({
      id: firstViewing.viewing.id,
      text: `Viewing at ${addressOf(firstViewing.file)}, ${formatWhen(firstViewing.viewing.scheduledFor)}`,
      target: {
        kind: "viewing",
        fileId: firstViewing.file.id,
        viewingId: firstViewing.viewing.id,
      },
    });
  }

  const firstReport = reports[0];
  if (firstReport) {
    push({
      id: firstReport.report.id,
      text: reportText(firstReport.report),
      target: { kind: "report", fileId: firstReport.file.id, reportId: firstReport.report.id },
    });
  }

  const firstInvite = invites[0];
  if (firstInvite && firstInvite.person.inviteStatus !== "joined") {
    push({
      id: firstInvite.person.id,
      text: inviteText(firstInvite.person.givenName, firstInvite.person.inviteStatus),
      target: { kind: "invite", fileId: firstInvite.file.id, personId: firstInvite.person.id },
    });
  }

  for (const item of viewings.slice(1)) {
    push({
      id: item.viewing.id,
      text: `Viewing at ${addressOf(item.file)}, ${formatWhen(item.viewing.scheduledFor)}`,
      target: { kind: "viewing", fileId: item.file.id, viewingId: item.viewing.id },
    });
  }
  for (const item of reports.slice(1)) {
    push({
      id: item.report.id,
      text: reportText(item.report),
      target: { kind: "report", fileId: item.file.id, reportId: item.report.id },
    });
  }
  for (const item of invites.slice(1)) {
    if (item.person.inviteStatus === "joined") continue;
    push({
      id: item.person.id,
      text: inviteText(item.person.givenName, item.person.inviteStatus),
      target: { kind: "invite", fileId: item.file.id, personId: item.person.id },
    });
  }

  return rows;
}

export function tenantHome(files: TenantPropertyFile[], now = new Date()): TenantHome {
  const given = files.find((file) => file.holding === "given");
  const boardText = given && sharesHouse(given) ? houseBoardLine(given.propertyId) : null;

  return {
    greeting: greetingFor(now),
    name: files[0]?.tenantGivenName ?? "",
    place: placeFor(files),
    rent: given ? rentLine(given, now) : null,
    rentCard: given ? rentCardFor(given, now) : null,
    board:
      given && boardText
        ? {
            id: `board-${given.propertyId}`,
            text: boardText,
            target: { kind: "board", propertyId: given.propertyId },
          }
        : null,
    needs: buildNeeds(files),
  };
}
