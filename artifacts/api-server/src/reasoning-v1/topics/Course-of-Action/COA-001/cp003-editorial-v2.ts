import { COA_CP003_ENGLISH_EXPANSION } from "./cp003-verification-administrative-expansion.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-064-I": {
    text: "The station should make one corrected platform announcement but leave the display boards on the conflicting information feed for the rest of the delay.",
    explanation: "One announcement may briefly help, but leaving the boards on a conflicting feed keeps two official sources giving different information and does not resolve the administrative fault.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-064-II": {
    text: "The station should update only the display boards while allowing the announcement system to continue using its separate, conflicting platform estimate.",
    explanation: "Updating only one channel leaves the second official channel giving contradictory information, so passengers can still be directed to different platforms.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-068-I": {
    text: "The organisation should require employees to copy a common leave mailbox but continue allowing separate supervisors to approve the same request without a shared status record.",
    explanation: "A common mailbox improves visibility, but without one shared approval status the same request can still be acted on twice and other requests can still lack a clear owner.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-068-II": {
    text: "The organisation should reconcile supervisors' leave emails only at the end of each month, after payroll and staffing decisions for that month have already been made.",
    explanation: "A month-end reconciliation comes too late to prevent missed or duplicate approvals from affecting current staffing and payroll decisions.",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TIMING"],
  },
  "COA-SC-072-I": {
    text: "The utility should keep the separate spreadsheets and tell agents to choose whichever sheet has the most recent visible timestamp before answering customers.",
    explanation: "Agents can still see different unsynchronised estimates, and a recent timestamp does not establish that the underlying restoration information is the current approved estimate.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-072-II": {
    text: "The utility should issue one consolidated outage spreadsheet at the start of each day but make no provision to update it when restoration estimates change during the day.",
    explanation: "A once-daily sheet can become outdated as restoration work changes. It does not provide a reliable current source for agents throughout the day.",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TIMING"],
  },
});

function applyPatch(action: CoaActionAuthority): CoaActionAuthority {
  const patch = ACTION_PATCHES[action.id];
  if (!patch) return action;
  return Object.freeze({
    ...action,
    ...patch,
    reasonCodes: patch.reasonCodes ? Object.freeze([...patch.reasonCodes]) : action.reasonCodes,
  });
}

export const COA_CP003_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP003_ENGLISH_EXPANSION.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP003_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));
