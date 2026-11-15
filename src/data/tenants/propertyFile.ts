import { CURRENT_TENANT_ID } from "@/data/tenants/currentTenant";
import { CaseCategory, CaseUrgency } from "@/types/agency/CaseInterface";
import {
  TenantHouseholdPerson,
  TenantPropertyFile,
  TenantReport,
  TenantViewingOutcome,
} from "@/types/tenants/PropertyFile";

/**
 * Sample property files. Both seats already have a property from the agency:
 * one was invited, one was given the tenancy.
 * A live call replaces this with the signed-in tenant's file.
 */
const FILES: TenantPropertyFile[] = [
  {
    id: "file-given",
    tenantId: "tenant-aoife",
    propertyId: "prop-1",
    holding: "given",
    tenantGivenName: "Aoife",
    tenantFamilyName: "Byrne",
    agencyName: "Elaiven",
    invitedByName: "Willian Kling",
    invitedOn: "2026-10-20",
    agreementId: "agr-1",
    tenancyStart: "2026-12-01",
    household: [
      {
        id: "person-aoife",
        token: "aoife-byrne",
        givenName: "Aoife",
        familyName: "Byrne",
        isLead: true,
        invitedBy: "agency",
        inviteStatus: "joined",
      },
      {
        id: "person-rory",
        token: "rory-byrne",
        givenName: "Rory",
        familyName: "Byrne",
        isLead: false,
        invitedBy: "tenant",
        inviteStatus: "sent",
      },
    ],
    viewings: [
      {
        id: "view-1",
        scheduledFor: "2026-10-30T18:00",
        status: "attended",
        withName: "Willian Kling",
      },
    ],
    reports: [
      {
        id: "report-1",
        title: "Water coming from under the bathroom sink",
        problem: "Water leakage",
        photos: [],
        location: "Bathroom",
        category: "repair",
        urgency: "urgent",
        status: "open",
        openedOn: "2026-11-12",
      },
      {
        id: "report-2",
        title: "Heating is slow to come on in the morning",
        problem: "Heating",
        photos: [],
        location: "Living room",
        category: "repair",
        urgency: "routine",
        status: "acknowledged",
        openedOn: "2026-11-02",
      },
    ],
  },
  {
    id: "file-harbour",
    tenantId: "tenant-aoife",
    propertyId: "prop-2",
    holding: "invited",
    tenantGivenName: "Aoife",
    tenantFamilyName: "Byrne",
    agencyName: "Elaiven",
    invitedByName: "Willian Kling",
    invitedOn: "2026-11-08",
    agreementId: null,
    tenancyStart: null,
    household: [
      {
        id: "person-aoife-harbour",
        token: "aoife-harbour",
        givenName: "Aoife",
        familyName: "Byrne",
        isLead: true,
        invitedBy: "agency",
        inviteStatus: "joined",
      },
    ],
    viewings: [
      {
        id: "view-harbour",
        scheduledFor: "2026-11-20T14:00",
        status: "scheduled",
        withName: "Willian Kling",
      },
    ],
    reports: [],
  },
  {
    id: "file-applied",
    tenantId: "tenant-aoife",
    propertyId: "prop-3",
    holding: "applied",
    tenantGivenName: "Aoife",
    tenantFamilyName: "Byrne",
    agencyName: "Elaiven",
    invitedByName: "",
    invitedOn: "2026-11-05",
    agreementId: null,
    tenancyStart: null,
    household: [
      {
        id: "person-aoife-king",
        token: "aoife-king",
        givenName: "Aoife",
        familyName: "Byrne",
        isLead: true,
        invitedBy: "tenant",
        inviteStatus: "joined",
      },
    ],
    viewings: [],
    reports: [],
  },
  {
    id: "file-invited",
    tenantId: "tenant-nessa",
    propertyId: "prop-4",
    holding: "invited",
    tenantGivenName: "Nessa",
    tenantFamilyName: "Gallagher",
    agencyName: "Elaiven",
    invitedByName: "Willian Kling",
    invitedOn: "2026-11-10",
    agreementId: null,
    tenancyStart: null,
    household: [
      {
        id: "person-nessa",
        token: "nessa-gallagher",
        givenName: "Nessa",
        familyName: "Gallagher",
        isLead: true,
        invitedBy: "agency",
        inviteStatus: "joined",
      },
      {
        id: "person-tom",
        token: "tom-gallagher",
        givenName: "Tom",
        familyName: "Gallagher",
        isLead: false,
        invitedBy: "agency",
        inviteStatus: "opened",
      },
    ],
    viewings: [
      {
        id: "view-2",
        scheduledFor: "2026-11-18T18:00",
        status: "scheduled",
        withName: "Willian Kling",
      },
    ],
    reports: [],
  },
];

let files = FILES;
let listed = files.filter((file) => file.tenantId === CURRENT_TENANT_ID);
const listeners = new Set<() => void>();

function emit(): void {
  listed = files.filter((file) => file.tenantId === CURRENT_TENANT_ID);
  listeners.forEach((listener) => listener());
}

function today(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function subscribeTenantProperty(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Every property this tenant was given, invited to, or applied for. */
export function getTenantProperties(): TenantPropertyFile[] {
  return listed;
}

export function tenantPropertyFile(id: string): TenantPropertyFile | undefined {
  return files.find((file) => file.id === id);
}

export function tenantReport(reportId: string, fileId: string): TenantReport | undefined {
  return tenantPropertyFile(fileId)?.reports.find((report) => report.id === reportId);
}

/** A tenant who has been given the property adds a report to that file. */
export function openTenantReport(input: {
  fileId: string;
  title: string;
  problem: string;
  photos: string[];
  location: string;
  category: CaseCategory;
  urgency: CaseUrgency;
}): string | null {
  const file = files.find((item) => item.id === input.fileId);
  if (!file || file.holding !== "given") return null;

  const id = `report-${Date.now()}`;
  const report: TenantReport = {
    id,
    title: input.title.trim(),
    problem: input.problem,
    photos: input.photos,
    location: input.location,
    category: input.category,
    urgency: input.urgency,
    status: "open",
    openedOn: today(),
  };
  files = files.map((item) =>
    item.id === file.id ? { ...item, reports: [report, ...item.reports] } : item,
  );
  emit();
  return id;
}

export function tenantPerson(personId: string, fileId: string): TenantHouseholdPerson | undefined {
  return tenantPropertyFile(fileId)?.household.find((person) => person.id === personId);
}

export function tenantViewing(viewingId: string, fileId: string) {
  return tenantPropertyFile(fileId)?.viewings.find((viewing) => viewing.id === viewingId);
}

function leadHasJoined(file: TenantPropertyFile): boolean {
  return file.household.some((person) => person.isLead && person.inviteStatus === "joined");
}

/** The lead sends a join link to someone else on this property. */
export function sendHouseholdInvite(input: {
  givenName: string;
  familyName: string;
  fileId: string;
}): string | null {
  const givenName = input.givenName.trim();
  const familyName = input.familyName.trim();
  if (!givenName || !familyName) return null;

  const file = files.find((item) => item.id === input.fileId);
  if (!file || !leadHasJoined(file)) return null;

  const id = `person-${Date.now()}`;
  const person: TenantHouseholdPerson = {
    id,
    token: id,
    givenName,
    familyName,
    isLead: false,
    invitedBy: "tenant",
    inviteStatus: "sent",
  };
  files = files.map((item) =>
    item.id === file.id ? { ...item, household: [...item.household, person] } : item,
  );
  emit();
  return id;
}

/** Record the day of a viewing that is still scheduled. */
export function recordTenantViewing(
  viewingId: string,
  outcome: TenantViewingOutcome,
  fileId: string,
): boolean {
  const file = files.find((item) => item.id === fileId);
  const viewing = file?.viewings.find((item) => item.id === viewingId);
  if (!file || !viewing || viewing.status !== "scheduled") return false;

  files = files.map((item) =>
    item.id === file.id
      ? {
          ...item,
          viewings: item.viewings.map((entry) =>
            entry.id === viewingId ? { ...entry, status: outcome } : entry,
          ),
        }
      : item,
  );
  emit();
  return true;
}
