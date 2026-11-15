import { useSyncExternalStore } from "react";
import {
  getTenantProperties,
  subscribeTenantProperty,
  tenantPerson,
  tenantPropertyFile,
  tenantReport,
  tenantViewing,
} from "@/data/tenants/propertyFile";
import {
  TenantHouseholdPerson,
  TenantPropertyFile,
  TenantReport,
  TenantViewing,
} from "@/types/tenants/PropertyFile";

/** Every property the signed-in tenant was given, invited to, or applied for. */
export function useTenantProperties(): TenantPropertyFile[] {
  return useSyncExternalStore(subscribeTenantProperty, getTenantProperties, getTenantProperties);
}

export function useTenantProperty(fileId: string): TenantPropertyFile | undefined {
  return useSyncExternalStore(
    subscribeTenantProperty,
    () => tenantPropertyFile(fileId),
    () => tenantPropertyFile(fileId),
  );
}

export function useTenantReport(fileId: string, reportId: string): TenantReport | undefined {
  const file = useTenantProperty(fileId);
  return file ? tenantReport(reportId, file.id) : undefined;
}

export function useTenantPerson(fileId: string, personId: string): TenantHouseholdPerson | undefined {
  const file = useTenantProperty(fileId);
  return file ? tenantPerson(personId, file.id) : undefined;
}

export function useTenantViewing(fileId: string, viewingId: string): TenantViewing | undefined {
  const file = useTenantProperty(fileId);
  return file ? tenantViewing(viewingId, file.id) : undefined;
}
