import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import { buildNumCp003QuestionSpecificConcept } from "./editorial-v2-concept";
import { buildNumCp003PairConcept } from "./editorial-v2-pair-concept";

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  if (state.requestedPolarity === "DIVISIBLE") {
    return "This question tests divisor selection: find the option that gives remainder 0 using its correct divisibility rule; a composite divisor must satisfy every required factor rule.";
  }
  return "This question tests non-divisor selection: find the option that gives a non-zero remainder using its correct divisibility rule; test composite divisors completely.";
}

export function buildNumCp003FinalQuestionSpecificConcept(state: NumCp003RetainedHiddenState): string {
  if (state.kind === "DIRECT_DIVISIBILITY") return directConcept(state);
  if (state.kind === "ORDERED_PAIR_CANDIDATE_SET") return buildNumCp003PairConcept(state);
  return buildNumCp003QuestionSpecificConcept(state);
}
