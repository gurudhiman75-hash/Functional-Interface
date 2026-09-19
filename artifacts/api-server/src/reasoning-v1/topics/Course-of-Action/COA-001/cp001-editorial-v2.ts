import { COA_CP001_ENGLISH_AUTHORITIES } from "./cp001-english-authorities.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-002-I": {
    text: "The branch should suspend deposit-counter service until all office equipment, not only the receipt printer, has been inspected.",
    explanation: "The identified fault is limited to the receipt printer. Stopping deposit service for a broad equipment inspection is more disruptive than the problem requires.",
    proportionality: "EXCESSIVE",
    expectedUtility: "HARMFUL",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-004-I": {
    text: "Until the faulty alarms are repaired, the depot should only instruct drivers to reverse more slowly and otherwise continue normal reversing operations.",
    explanation: "Slower reversing may reduce risk, but it leaves the known warning-alarm failure uncorrected and is too weak as the only response to repeated incidents.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-004-II": {
    text: "The depot should permanently prohibit all reversing movements, including by buses whose warning alarms are working correctly.",
    explanation: "The defect affects some warning alarms. A permanent ban on all reversing is an excessive response when faulty buses can be identified and repaired.",
    proportionality: "EXCESSIVE",
    expectedUtility: "HARMFUL",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-006-I": {
    text: "The school should replace practical laboratory sessions with teacher demonstrations for all students for the rest of the term.",
    explanation: "The problem is lack of safety understanding. Removing practical work for everyone for the rest of the term goes beyond the targeted correction required.",
    proportionality: "EXCESSIVE",
    expectedUtility: "LOW",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-009-II": {
    text: "The organisation should place every employee named in the incomplete access records under disciplinary suspension before checking the inventory and issue records further.",
    explanation: "The records are incomplete and do not establish responsibility. Disciplinary suspension before further verification is premature and disproportionate.",
    evidenceFit: "UNSUPPORTED",
    proportionality: "EXCESSIVE",
    reasonCodes: ["PREMATURE_PUNITIVE_ACTION"],
  },
  "COA-SC-010-I": {
    text: "The station manager should wait for a permanent staffing sanction from headquarters before making any temporary arrangement at the closed counter.",
    explanation: "A permanent staffing decision may be useful later, but waiting for it does not address the immediate evening queue when a temporary local arrangement is possible.",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    reasonCodes: ["LONG_TERM_ONLY_WHEN_IMMEDIATE_ACTION_REQUIRED"],
  },
  "COA-SC-012-I": {
    text: "The office should issue a general notice that departments have shifted, without showing the new floors or room numbers.",
    explanation: "A notice that omits the new locations does not give visitors the information needed to reach the correct departments.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-012-II": {
    text: "The office should leave the old directions unchanged and wait for regular visitors to learn the new locations over time.",
    explanation: "Waiting for visitors to learn through repeated visits leaves the current navigation problem unresolved and uses the wrong timing for an immediate information gap.",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TIMING"],
  },
  "COA-SC-018-I": {
    text: "The transport authority should remove the poorly marked stop from the route instead of changing or repositioning its sign.",
    explanation: "The complaint concerns visibility of the sign, not the need for the stop itself. Removing the stop is a disproportionate response to a narrow signage problem.",
    proportionality: "EXCESSIVE",
    expectedUtility: "HARMFUL",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-020-I": {
    text: "The service provider should send password-reset instructions to all users and ask them to try signing in again.",
    explanation: "The statement identifies an expired system certificate as the cause. Password resets target user credentials rather than the known service-side failure.",
    evidenceFit: "CONTRADICTED",
    expectedUtility: "LOW",
    reasonCodes: ["WRONG_TARGET"],
  },
  "COA-SC-020-II": {
    text: "The service provider should force every account to reset its password before checking or renewing the expired certificate.",
    explanation: "The known fault is the expired certificate. Forcing account changes before fixing that fault targets the wrong component and puts the steps in an unhelpful order.",
    evidenceFit: "CONTRADICTED",
    sequenceFit: "WRONG_ORDER",
    expectedUtility: "LOW",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE", "WRONG_TARGET"],
  },
  "COA-SC-024-I": {
    text: "The office should transfer all current counter staff to other sections and replace them before checking where the service delay is occurring.",
    explanation: "The cause of the delay is still unknown. Replacing the staff first assumes they are responsible without evidence and is an excessive irreversible response.",
    evidenceFit: "UNSUPPORTED",
    proportionality: "EXCESSIVE",
    reasonCodes: ["PREMATURE_PUNITIVE_ACTION"],
  },
  "COA-SC-024-II": {
    text: "The office should purchase new computer terminals for every counter on the assumption that old hardware is causing the delay.",
    explanation: "The statement does not establish that computer hardware is the cause. Buying new terminals first relies on an unsupported assumption rather than identifying the bottleneck.",
    evidenceFit: "UNSUPPORTED",
    expectedUtility: "LOW",
    reasonCodes: ["UNSUPPORTED_ASSUMPTION"],
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

export const COA_CP001_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP001_ENGLISH_AUTHORITIES.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP001_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));
