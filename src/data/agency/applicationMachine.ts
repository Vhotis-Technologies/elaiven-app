import {
  ApplicationAction,
  ApplicationDetail,
  ApplicationReason,
  ApplicationState,
  ChecksSummary,
  DeclineReason,
} from "@/types/agency/properties/ApplicationInterface";

/** The happy path, in order. Used for the progress timeline. */
export const PATH: ApplicationState[] = [
  "applied",
  "eligible",
  "viewing_invited",
  "viewed",
  "shortlisted",
  "checks_running",
  "checks_complete",
  "accepted",
  "agreement_sent",
  "signed",
  "active",
];

export const STATE_LABEL: Record<ApplicationState, string> = {
  applied: "Applied",
  filtered_out: "Filtered out",
  eligible: "Eligible",
  viewing_invited: "Viewing invited",
  viewed: "Viewed",
  shortlisted: "Shortlisted",
  checks_running: "Checks running",
  checks_complete: "Checks complete",
  accepted: "Accepted",
  declined: "Not accepted",
  agreement_sent: "Agreement sent",
  signed: "Signed",
  active: "Active",
  terminated: "Terminated",
};

export const REASON_LABEL: Record<ApplicationReason, string> = {
  over_occupancy: "Household is over the occupancy limit",
  move_in_outside_window: "Move-in date is outside availability",
  incomplete_application: "Application is incomplete",
  not_a_good_fit: "Not a good fit for the property",
  chose_others_to_proceed: "Others were chosen to go ahead",
  not_suitable_after_viewing: "Not suitable after the viewing",
  no_show: "Did not attend the viewing",
  affordability: "Affordability",
  references: "Reference outcome",
  id_or_credit: "ID or credit result",
  applicant_withdrew: "The household withdrew",
};

/** Income source is released only from acceptance onward. */
export const INCOME_UNLOCKED: ApplicationState[] = ["accepted", "agreement_sent", "signed", "active"];

/**
 * The property page files people into three phases.
 * Phase 1 holds both households who applied and passed the filter, and households the operator entered.
 * Anyone turned down, or already in a tenancy, is left out.
 */
export type ApplicationPhase = "viewing" | "checks" | "agreement";

export const PHASES: { id: ApplicationPhase; title: string; detail: string; note: string }[] = [
  {
    id: "viewing",
    title: "Phase 1",
    detail: "Viewing",
    note: "People who applied and qualified, and households you entered yourself.",
  },
  {
    id: "checks",
    title: "Phase 2",
    detail: "Checks",
    note: "The viewing is done and their information is in. Open a name to read what Elaiven noted.",
  },
  {
    id: "agreement",
    title: "Phase 3",
    detail: "Agreement",
    note: "These people passed the checks. Open a name to send approval, or to send the agreement.",
  },
];

export function phaseOf(state: ApplicationState): ApplicationPhase | null {
  if (state === "eligible" || state === "viewing_invited") return "viewing";
  if (state === "checks_complete") return "checks";
  if (state === "accepted" || state === "agreement_sent") return "agreement";
  return null;
}

/** Proceed when every check that was run came back clear. */
export function recommendation(checks: ChecksSummary | null): "Proceed" | "Look again" {
  if (!checks) return "Look again";
  const clear =
    checks.affordability === "pass" &&
    checks.identity === "pass" &&
    checks.reference !== "fail" &&
    checks.credit !== "fail" &&
    checks.occupancyFit === "within";
  return clear ? "Proceed" : "Look again";
}

export type ActionKind = "primary" | "neutral" | "danger";

export interface ActionOption {
  type: ApplicationAction["type"];
  label: string;
  kind: ActionKind;
  /** The action needs a viewing slot first. */
  needsSlot?: boolean;
  /** The action needs one reason from this fixed list first. */
  reasons?: DeclineReason[];
  /** Done by the household or the system in real life. Here a button stands in. */
  standIn?: boolean;
  hint?: string;
}

const BEFORE_VIEWING: DeclineReason[] = [
  "not_a_good_fit",
  "chose_others_to_proceed",
  "applicant_withdrew",
];
const AFTER_VIEWING: DeclineReason[] = [
  "not_suitable_after_viewing",
  "no_show",
  "chose_others_to_proceed",
  "applicant_withdrew",
];
const AT_DECISION: DeclineReason[] = [
  "affordability",
  "references",
  "id_or_credit",
  "chose_others_to_proceed",
  "applicant_withdrew",
];

const DECLINE = (reasons: DeclineReason[]): ActionOption => ({
  type: "decline",
  label: "Not accepted",
  kind: "danger",
  reasons,
});

/** One request, sent to every adult named on the form. Hidden once it has been sent. */
function withReferences(app: ApplicationDetail, options: ActionOption[]): ActionOption[] {
  if (app.applicants.length < 2 || app.referencesRequestedAt) return options;
  const both = app.applicants.length === 2;
  const ask: ActionOption = {
    type: "request_references",
    label: both
      ? "Ask both applicants to submit references"
      : `Ask all ${app.applicants.length} applicants to submit references`,
    kind: "neutral",
    hint: "This goes to every applicant on the form, not only the lead.",
  };
  const declineAt = options.findIndex((option) => option.type === "decline");
  if (declineAt === -1) return [...options, ask];
  return [...options.slice(0, declineAt), ask, ...options.slice(declineAt)];
}

/** What the person on this seat can do now. Nothing moves on its own. */
export function availableActions(app: ApplicationDetail): ActionOption[] {
  switch (app.state) {
    case "eligible":
      return withReferences(app, [
        { type: "invite", label: "Invite to a viewing", kind: "primary", needsSlot: true },
        DECLINE(BEFORE_VIEWING),
      ]);
    case "viewing_invited":
      return withReferences(app, [
        {
          type: "attended",
          label: "Viewing done",
          kind: "primary",
          hint: "Elaiven then reads their information, and they move to Checks.",
        },
        DECLINE(AFTER_VIEWING),
      ]);
    case "checks_complete":
      return [
        {
          type: "operator_accept",
          label: "Pass to agreement",
          kind: "primary",
          hint: "They move to the agreement phase. The notes above do not decide this.",
        },
        DECLINE(AT_DECISION),
      ];
    case "accepted":
      if (!app.acceptance.household) {
        return [
          {
            type: "household_accept",
            label: "Send approval",
            kind: "primary",
            hint: "The agreement is not sent until this approval has gone out.",
          },
        ];
      }
      return [
        {
          type: "send_agreement",
          label: "Send the agreement",
          kind: "primary",
          hint: "Approval has been sent. The agreement goes out only when you press this.",
        },
      ];
    default:
      return [];
  }
}

function dummyChecks(): ChecksSummary {
  return {
    verifiedMonthlyIncome: 4800,
    currency: "£",
    affordability: "pass",
    reference: "pass",
    identity: "pass",
    credit: "pass",
    occupancyFit: "within",
    rightToRent: "pass",
  };
}

/** Apply one action. Returns the next application, with the transition logged. */
export function reduceApplication(
  app: ApplicationDetail,
  action: ApplicationAction,
  by: string,
  now: string,
): ApplicationDetail {
  const move = (
    to: ApplicationState,
    reason: ApplicationReason | null = null,
    actor = by,
  ): ApplicationDetail => ({
    ...app,
    state: to,
    reason,
    log: [...app.log, { at: now, from: app.state, to, by: actor, reason }],
  });

  switch (action.type) {
    case "invite":
      return {
        ...move("viewing_invited"),
        viewing: { scheduledFor: action.scheduledFor, status: "scheduled" },
      };
    case "request_references":
      return {
        ...app,
        referencesRequestedAt: now,
        log: [...app.log, { at: now, from: app.state, to: app.state, by, reason: null }],
      };
    case "attended": {
      const viewed = move("viewed");
      return {
        ...viewed,
        state: "checks_complete",
        viewing: app.viewing ? { ...app.viewing, status: "attended" } : app.viewing,
        checks: dummyChecks(),
        log: [
          ...viewed.log,
          { at: now, from: "viewed", to: "checks_complete", by: "Elaiven", reason: null },
        ],
      };
    }
    case "shortlist":
      return move("shortlisted");
    case "start_checks":
      return move("checks_running");
    case "finish_checks":
      return { ...move("checks_complete", null, "Elaiven"), checks: dummyChecks() };
    case "operator_accept":
      return {
        ...move("accepted"),
        acceptance: { ...app.acceptance, operator: true },
      };
    case "household_accept":
      // Not a state change, but still logged. `from` and `to` are the same.
      return {
        ...app,
        acceptance: { ...app.acceptance, household: true },
        log: [
          ...app.log,
          { at: now, from: app.state, to: app.state, by, reason: null },
        ],
      };
    case "send_agreement":
      return move("agreement_sent");
    case "mark_signed":
      return move("signed");
    case "start_tenancy":
      return move("active");
    case "decline": {
      const next = move("declined", action.reason);
      return {
        ...next,
        viewing:
          action.reason === "no_show" && app.viewing
            ? { ...app.viewing, status: "no_show" }
            : app.viewing,
      };
    }
  }
}
