import type { DmSituationalChoice, DmSituationalSpec } from "./types.ts";

export type DmSituationalDecision = Readonly<{
  choice: DmSituationalChoice;
  orderedAdmissibleChoices: readonly DmSituationalChoice[];
}>;

/** Independent solver: admissibility is applied before sequence and published policy order. */
export function solveDmSituation(spec: DmSituationalSpec): DmSituationalDecision {
  if (spec.choices.length !== 4) throw new Error("A DM situational authority must expose exactly four choices.");
  for (const locale of ["en", "hi", "pa"] as const) {
    if (new Set(spec.choices.map((choice) => choice.text[locale])).size !== 4) {
      throw new Error("Situational choices must be unique in " + locale + ".");
    }
  }
  const policyIndex = new Map(spec.policyOrder.map((principle, index) => [principle, index]));
  const ordered = spec.choices
    .filter((choice) => choice.admissible && choice.errors.length === 0)
    .sort((left, right) => left.stage - right.stage
      || (policyIndex.get(left.principle) ?? Number.MAX_SAFE_INTEGER) - (policyIndex.get(right.principle) ?? Number.MAX_SAFE_INTEGER)
      || left.choiceId.localeCompare(right.choiceId));
  const choice = ordered[0];
  if (!choice) throw new Error("Situational authority has no defensible admissible action.");
  if (ordered[1] && ordered[1].stage === choice.stage
    && (policyIndex.get(ordered[1].principle) ?? -1) === (policyIndex.get(choice.principle) ?? -1)) {
    throw new Error("Situational authority does not have a unique best action.");
  }
  return Object.freeze({ choice, orderedAdmissibleChoices: Object.freeze(ordered) });
}