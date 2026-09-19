import { COA_CP007_ENGLISH_EXPANSION } from "./cp007-integrated-reasoning-expansion.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-110-I": {
    text: "The bank should temporarily freeze withdrawals and transfers for every customer until the affected ATM batch is reconciled, so no further financial discrepancy can occur during the review.",
    explanation: "A temporary freeze sounds protective, but the discrepancy is confined to one ATM batch and unrelated deposits and transfers are working. Applying the restriction to every customer is still much broader than the evidence requires.",
    reasonCodes: ["EXCESSIVE_RESPONSE", "WRONG_TARGET"],
  },
  "COA-SC-112-I": {
    text: "The operator should suspend the route for the rest of the week and use that period to decide whether the route itself should be redesigned, rather than first checking whether the app simply loaded the old approved stop file.",
    explanation: "A temporary suspension is less extreme than permanent cancellation, but the facts point to an information-file problem rather than a route defect. Suspending service before checking the available approved file still targets the wrong scope and reverses the sensible order.",
    proportionality: "EXCESSIVE",
    evidenceFit: "UNSUPPORTED",
    sequenceFit: "WRONG_ORDER",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE", "UNSUPPORTED_ASSUMPTION", "EXCESSIVE_RESPONSE"],
  },
  "COA-SC-112-II": {
    text: "The operator should keep the current app display until the scheduled overnight update window, while asking drivers to verbally announce the correct stops if passengers appear confused.",
    explanation: "Driver announcements offer some help, but they leave a known incorrect route display active for the day even though the correct file is already available. The response is too weak and unnecessarily delayed for a live information error causing missed stops.",
    urgencyFit: "MISMATCHED",
    expectedUtility: "LOW",
    proportionality: "INSUFFICIENT",
    reasonCodes: ["WRONG_TIMING", "TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-116-I": {
    text: "The college should provisionally restore every complainant to the pre-update scholarship amount before checking individual records, and adjust the awards again later if the new rule is found to have been applied correctly.",
    explanation: "A provisional restoration appears fair, but the complaints do not establish that each reduction was wrong. Changing awards before checking the applicable rule still puts the financial decision before verification and may require avoidable reversals.",
    evidenceFit: "UNSUPPORTED",
    sequenceFit: "WRONG_ORDER",
    reasonCodes: ["UNSUPPORTED_ASSUMPTION", "CORRECT_ACTION_WRONG_SEQUENCE"],
  },
  "COA-SC-116-II": {
    text: "The college should hold all scholarship payments for this week's payment run until the complaints about the changed rule have been checked, so no student receives an amount that might later need correction.",
    explanation: "Holding one payment run sounds cautious, but the uncertainty concerns a limited set of complaints and many other awards are not shown to be affected. A blanket hold shifts the burden to unaffected students instead of isolating the uncertain cases.",
    proportionality: "EXCESSIVE",
    constraintFit: "VIOLATES",
    expectedUtility: "LOW",
    reasonCodes: ["EXCESSIVE_RESPONSE", "CONSTRAINT_VIOLATION"],
  },
  "COA-SC-118-I": {
    text: "The company should ask every retailer to remove the product from shelves temporarily while it checks the lot records, even though the alert currently points to one identifiable production batch.",
    explanation: "A temporary shelf removal is precautionary, but the available lot records can identify the suspect batch immediately. Removing every batch before using that evidence is broader than necessary and puts the blanket action before scope verification.",
    proportionality: "EXCESSIVE",
    sequenceFit: "WRONG_ORDER",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["EXCESSIVE_RESPONSE", "CORRECT_ACTION_WRONG_SEQUENCE", "UNSUPPORTED_ASSUMPTION"],
  },
  "COA-SC-120-I": {
    text: "The utility should calculate the affected bills from the new meter readings but mark them as provisional, then verify the firmware logs and issue adjustments later if the readings are found to be wrong.",
    explanation: "Calling the bills provisional does not solve the order problem. The readings are already flagged as abnormal and the logs are available before billing, so verification should come before using those readings to create customer charges.",
    evidenceFit: "UNSUPPORTED",
    sequenceFit: "WRONG_ORDER",
    reasonCodes: ["CORRECT_ACTION_WRONG_SEQUENCE", "UNSUPPORTED_ASSUMPTION"],
  },
  "COA-SC-120-II": {
    text: "The utility should postpone all smart-meter billing for the service area for one cycle and schedule replacement checks on every meter model, because the firmware issue may turn out to be wider than the small group currently showing abnormal readings.",
    explanation: "The wider risk is only a possibility, while most meters are currently normal and the affected group is identifiable. Area-wide billing delay and universal checks impose a broad operational cost before evidence shows that the problem extends beyond the flagged meters.",
    proportionality: "EXCESSIVE",
    evidenceFit: "UNSUPPORTED",
    constraintFit: "VIOLATES",
    expectedUtility: "LOW",
    reasonCodes: ["EXCESSIVE_RESPONSE", "UNSUPPORTED_ASSUMPTION", "CONSTRAINT_VIOLATION"],
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

export const COA_CP007_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP007_ENGLISH_EXPANSION.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP007_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));
