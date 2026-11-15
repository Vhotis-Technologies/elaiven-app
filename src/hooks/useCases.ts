import { useMemo, useSyncExternalStore } from "react";
import { getCases, subscribeCases, visibleCase, visibleCases } from "@/data/agency/cases";
import { CaseDetail, CaseStatus } from "@/types/agency/CaseInterface";

const URGENCY_RANK = { emergency: 0, urgent: 1, routine: 2 };

function useAll() {
  return useSyncExternalStore(subscribeCases, getCases, getCases);
}

/** One status on the desk. Emergencies sit above routine cases, then the newest. */
export function useCases(status: CaseStatus): CaseDetail[] {
  const all = useAll();
  return useMemo(
    () =>
      visibleCases()
        .filter((item) => item.status === status)
        .sort(
          (left, right) =>
            URGENCY_RANK[left.urgency] - URGENCY_RANK[right.urgency] ||
            right.createdAt.localeCompare(left.createdAt),
        ),
    [all, status],
  );
}

export function useCase(caseId: string): CaseDetail | undefined {
  const all = useAll();
  return useMemo(() => visibleCase(caseId), [all, caseId]);
}
