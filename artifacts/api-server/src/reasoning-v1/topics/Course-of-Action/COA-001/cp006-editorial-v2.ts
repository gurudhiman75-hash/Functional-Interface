import { COA_CP006_ENGLISH_EXPANSION } from "./cp006-multistep-ordered-expansion.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-100-I": {
    text: "The utility should first credit every account that received two confirmation messages, then compare the payment records and recover any credit where the logs show that only one payment was taken.",
    explanation: "A temporary credit sounds customer-friendly, but the messages do not establish that money was charged twice. The payment records should be checked before account balances are altered and later corrected again.",
    sequenceFit: "WRONG_ORDER",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE"],
  },
  "COA-SC-100-II": {
    text: "The utility should first roll back the software update even if that overwrites the current deployment state, and then investigate the duplicate confirmations from customer reports and the records that remain.",
    explanation: "Rollback may ultimately be needed, but changing the deployment before preserving the state and logs can remove evidence needed to identify the fault and confirm that the rollback addresses it.",
    sequenceFit: "WRONG_ORDER",
    expectedUtility: "LOW",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE"],
  },
  "COA-SC-101-II": {
    text: "The bank should first reverse the flagged transfer as fraudulent, then contact the customer and restore the transfer later if the customer proves that it was authorised.",
    explanation: "Stopping a genuinely fraudulent transfer would be correct, but the available customer verification should come before treating the unconfirmed alert as established fraud and reversing the transaction on that basis.",
    sequenceFit: "WRONG_ORDER",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE"],
  },
  "COA-SC-104-II": {
    text: "The college should keep the normal result-processing schedule unchanged and examine the suspected import error in the next weekly records audit, even though the admission form deadline falls before that audit.",
    explanation: "A weekly audit is a normal control, but here its timing would place verification after a known deadline at which the incorrect marks may already affect students' applications.",
    sequenceFit: "NOT_APPLICABLE",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TIMING"],
  },
  "COA-SC-108-I": {
    text: "The centre should first require replacement of all chargers of the model as a precaution, then inspect returned samples to decide whether the overheating fault was actually limited to one production batch.",
    explanation: "A broad precaution can appear safe, but the available investigation should establish the scope before a model-wide replacement is imposed when the defect may be batch-specific.",
    sequenceFit: "WRONG_ORDER",
    proportionality: "EXCESSIVE",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE"],
  },
  "COA-SC-108-II": {
    text: "The centre should record the complaints and wait for the next scheduled quality-test slot before isolating suspect chargers or issuing any temporary caution, even though the reported fault involves overheating during normal use.",
    explanation: "Using the scheduled test process is reasonable in itself, but waiting to take any temporary safety step until that later slot leaves a credible overheating risk unmanaged in the meantime.",
    sequenceFit: "NOT_APPLICABLE",
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

export const COA_CP006_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP006_ENGLISH_EXPANSION.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      difficulty: scenario.id === "COA-SC-102" ? "EASY" as const : scenario.difficulty,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP006_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));
