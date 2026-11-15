import { formatDate } from "@/components/agency/analytics/format";
import { TenantHolding, TenantPropertyFile } from "@/types/tenants/PropertyFile";

export function holdingLabel(holding: TenantHolding): string {
  if (holding === "given") return "Your property";
  if (holding === "applied") return "Applied";
  return "Invited";
}

/** The one date worth showing under the rent. */
export function placeDate(file: TenantPropertyFile): string {
  if (file.holding === "given" && file.tenancyStart) {
    return `Tenancy from ${formatDate(file.tenancyStart)}`;
  }
  if (file.holding === "applied") {
    return file.invitedOn ? `Applied ${formatDate(file.invitedOn)}` : "Waiting on your application";
  }
  const upcoming = file.viewings.find((viewing) => viewing.status === "scheduled");
  if (upcoming) {
    const [datePart, timePart] = upcoming.scheduledFor.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const when = new Date(year, (month ?? 1) - 1, day ?? 1);
    const label = when.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    if (!timePart) return `Viewing ${label}`;
    const [hour, minute] = timePart.split(":");
    return `Viewing ${label}, ${hour}:${minute}`;
  }
  return "Invited";
}

export function reportSummary(file: TenantPropertyFile): string {
  const count = file.reports.length;
  if (count === 0) return "Nothing reported";
  const open = file.reports.filter((report) => report.status === "open").length;
  const noun = count === 1 ? "report" : "reports";
  if (open === 0) return `${count} ${noun}`;
  return `${count} ${noun} · ${open} still open`;
}

export function peopleSummary(file: TenantPropertyFile): string {
  const count = file.household.length;
  return count === 1 ? "1 person" : `${count} people`;
}

export function viewingSummary(file: TenantPropertyFile): string {
  const count = file.viewings.length;
  if (count === 0) return "None yet";
  const coming = file.viewings.filter((viewing) => viewing.status === "scheduled").length;
  if (coming > 0) return coming === 1 ? "1 coming up" : `${coming} coming up`;
  return count === 1 ? "1 viewing" : `${count} viewings`;
}
