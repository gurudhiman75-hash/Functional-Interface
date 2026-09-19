import { COA_CP002_ENGLISH_EXPANSION } from "./cp002-direct-preventive-expansion.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-025-II": {
    text: "The maintenance team should replace every streetlight bulb on the affected lane before testing the faulty distribution box.",
    explanation: "The distribution-box fault is already identified. Replacing all bulbs first targets components that are not shown to be the cause and delays the direct repair.",
    evidenceFit: "CONTRADICTED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TARGET"],
  },
  "COA-SC-029-II": {
    text: "The clinic should extend the appointment desk's working hours while continuing to use only the failed published telephone line.",
    explanation: "Longer desk hours do not help patients reach the desk if the only published contact line still does not work.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-032-I": {
    text: "The company should send an apology message after every damaged delivery without changing the conveyor process.",
    explanation: "An apology acknowledges the complaint, but by itself it leaves the damaged guide rail unchanged and does not stop the same parcel damage from recurring.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["SYMBOLIC_BUT_INEFFECTIVE"],
  },
  "COA-SC-033-II": {
    text: "The terminal should add staff to explain ticket-print failures to passengers while continuing to use the faulty machine without repair.",
    explanation: "Extra staff may explain the problem after it occurs, but they do not correct the paper-feed fault or stop further failed ticket prints.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-038-I": {
    text: "After each overflow, the local body should deploy a pump to remove water but make no change to the repeatedly blocked inlet grates.",
    explanation: "Pumping may remove water after an overflow, but leaving the known inlet blockage unchanged does not prevent the same problem during the next heavy rain.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED"],
  },
  "COA-SC-041-II": {
    text: "The operator should reduce route speed limits but continue allowing buses into service even when the required tyre checks have been missed.",
    explanation: "Lower speed may reduce some consequences, but it does not prevent tyre failures caused by vehicles entering service without the required checks.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-042-I": {
    text: "The centre should open an additional collection desk but continue the same manual labelling process without a second patient-identity check.",
    explanation: "An extra desk may reduce crowding, but the stated error comes from confusing similar names during labelling. The identification weakness remains unchanged.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
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

export const COA_CP002_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP002_ENGLISH_EXPANSION.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP002_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));