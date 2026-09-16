import { COA_CP004_ENGLISH_EXPANSION } from "./cp004-constraint-proportionality-expansion.ts";
import type { CoaActionAuthority, CoaScenarioAuthority } from "./types.ts";

type ActionPatch = Partial<Omit<CoaActionAuthority, "id" | "expectedVerdict">>;

const ACTION_PATCHES: Readonly<Record<string, ActionPatch>> = Object.freeze({
  "COA-SC-076-I": {
    text: "The depot should use the emergency spare bus on the crowded local route during every evening peak and rely on rearranging other buses if a breakdown occurs on the long route.",
    explanation: "The idea could reduce local crowding, but it deliberately consumes the only bus that the statement requires to remain available for emergency replacement on the long route.",
    constraintFit: "VIOLATES",
    feasibility: "CONSTRAINED",
    reasonCodes: ["CONSTRAINT_VIOLATION"],
  },
  "COA-SC-076-II": {
    text: "The depot should extend the operating hours of the local-route buses by postponing their scheduled inspections until the crowding period has passed.",
    explanation: "Extra operating time may increase capacity, but postponing scheduled inspections sacrifices a required safety control to solve a temporary crowding problem.",
    constraintFit: "VIOLATES",
    expectedUtility: "LOW",
    reasonCodes: ["CONSTRAINT_VIOLATION"],
  },
  "COA-SC-080-I": {
    text: "The portal team should take the application service offline for several hours during the working day so technicians can repair the primary database without switching users to the standby system.",
    explanation: "A long outage would violate the stated requirement that applications remain available, and the standby database exists specifically to avoid that unnecessary interruption.",
    constraintFit: "VIOLATES",
    proportionality: "EXCESSIVE",
    reasonCodes: ["CONSTRAINT_VIOLATION"],
  },
  "COA-SC-080-II": {
    text: "The portal team should defer the repair until a future maintenance weekend and continue using the faulty database meanwhile because any planned daytime switch could inconvenience users.",
    explanation: "Deferring a known database fault despite an available standby path is too weak: it protects convenience at the cost of leaving the identified problem unresolved.",
    proportionality: "INSUFFICIENT",
    expectedUtility: "LOW",
    reasonCodes: ["TOO_WEAK_TO_ADDRESS_PROBLEM"],
  },
  "COA-SC-088-I": {
    text: "The company should pause all warranty claim processing until corrected leaflets have reached every dealer, so no customer can rely on the wrong contact numbers during the changeover.",
    explanation: "Correcting the contact details is necessary, but suspending all warranty processing interrupts a working service that is not itself defective and is broader than the leaflet error requires.",
    proportionality: "EXCESSIVE",
    expectedUtility: "LOW",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-088-II": {
    text: "The company should temporarily remove the entire product line from sale until every package carries a newly printed leaflet, even though the product and warranty terms are unchanged.",
    explanation: "The contact details need correction, but withdrawing a sound product line is a much wider commercial response than a limited information error justifies.",
    proportionality: "EXCESSIVE",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-092-I": {
    text: "The hostel should close all common rooms every evening for the rest of the term because repeated noise complaints have come from three study rooms.",
    explanation: "A broad evening closure affects unrelated common spaces for months even though the stated problem is confined to three rooms and late-evening noise.",
    proportionality: "EXCESSIVE",
    expectedUtility: "LOW",
    reasonCodes: ["EXCESSIVE_RESPONSE"],
  },
  "COA-SC-092-II": {
    text: "The hostel should suspend access for every resident registered to the three rooms for a month without first identifying which users caused the repeated disturbance.",
    explanation: "The response is relevant to the noisy rooms but imposes the same severe penalty on all registered users despite incomplete evidence about who caused the disturbance.",
    proportionality: "EXCESSIVE",
    evidenceFit: "UNSUPPORTED",
    reasonCodes: ["PREMATURE_PUNITIVE_ACTION"],
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

export const COA_CP004_ENGLISH_REVIEW_V2: readonly CoaScenarioAuthority[] = Object.freeze(
  COA_CP004_ENGLISH_EXPANSION.map((scenario) => {
    const [first, second] = scenario.actions;
    return Object.freeze({
      ...scenario,
      actions: Object.freeze([applyPatch(first), applyPatch(second)] as const),
    });
  }),
);

export const COA_CP004_EDITORIAL_V2_PATCHED_ACTION_IDS = Object.freeze(Object.keys(ACTION_PATCHES));
