import { useMemo, useSyncExternalStore } from "react";
import {
  getApplications,
  subscribeApplications,
  withIncomeGate,
} from "@/data/agency/applications";
import { ApplicationPhase, phaseOf } from "@/data/agency/applicationMachine";
import { ApplicationDetail } from "@/types/properties/ApplicationInterface";

function useAll(): ApplicationDetail[] {
  return useSyncExternalStore(subscribeApplications, getApplications, getApplications);
}

/** One property's applications, in the order they arrived. No ranking. */
export function useApplications(propertyId: string): ApplicationDetail[] {
  const all = useAll();
  return useMemo(
    () =>
      all
        .filter((application) => application.propertyId === propertyId)
        .sort((a, b) => a.appliedAt.localeCompare(b.appliedAt)),
    [all, propertyId],
  );
}

/** One phase of one property, still in the order people applied. */
export function usePhaseApplications(
  propertyId: string,
  phase: ApplicationPhase,
): ApplicationDetail[] {
  const applications = useApplications(propertyId);
  return useMemo(
    () => applications.filter((application) => phaseOf(application.state) === phase),
    [applications, phase],
  );
}

export function useApplication(applicationId: string): ApplicationDetail | undefined {
  const all = useAll();
  return useMemo(() => {
    const found = all.find((application) => application.id === applicationId);
    return found ? withIncomeGate(found) : undefined;
  }, [all, applicationId]);
}
