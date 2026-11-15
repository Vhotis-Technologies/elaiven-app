import { recommendation } from "@/data/agency/applicationMachine";
import { ApplicationDetail, ApplicationSummary } from "@/types/properties/ApplicationInterface";

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** 2 adults · 1 child · pets */
export function householdLine(application: ApplicationSummary): string {
  const parts = [plural(application.adults, "adult", "adults")];
  if (application.children > 0) parts.push(plural(application.children, "child", "children"));
  if (application.pets) parts.push("pets");
  return parts.join(" · ");
}

/** The one line under a name, in every phase list. */
export function rowStatus(application: ApplicationDetail): string {
  switch (application.state) {
    case "eligible":
      return "Applied · ready to invite";
    case "viewing_invited": {
      const when = application.viewing
        ? `Viewing ${formatViewing(application.viewing.scheduledFor)}`
        : "Viewing invited";
      return application.origin === "operator" ? `You invited them · ${when}` : when;
    }
    case "checks_complete":
      return recommendation(application.checks);
    case "accepted":
      return application.acceptance.household ? "Approval sent" : "Send approval";
    case "agreement_sent":
      return "Agreement sent";
    default:
      return "";
  }
}

/** Fri 13 Nov, 14:00. `iso` is local date and time, 2026-11-13T14:00:00. */
export function formatViewing(iso: string): string {
  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return iso;
  const day = when.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const hours = String(when.getHours()).padStart(2, "0");
  const minutes = String(when.getMinutes()).padStart(2, "0");
  return `${day}, ${hours}:${minutes}`;
}
