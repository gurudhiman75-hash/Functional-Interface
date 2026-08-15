import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import { buildNumCp003QuestionSpecificConcept } from "./editorial-v2-concept";

function ruleFamily(divisor: number): string {
  if ([6, 12, 15, 18, 24, 36, 45, 72, 99].includes(divisor)) return "combined-factor";
  if ([2, 5, 10].includes(divisor)) return "last-digit";
  if ([3, 9].includes(divisor)) return "digit-sum";
  if ([4, 25].includes(divisor)) return "last-two-digit";
  if (divisor === 8) return "last-three-digit";
  if (divisor === 11) return "alternating-sum";
  return "exact-remainder";
}

function directConcept(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): string {
  const target = state.requestedPolarity === "DIVISIBLE" ? "divisor" : "non-divisor";
  const families = [...new Set(state.divisorOptions.map((value) => ruleFamily(Number(value))))].join(", ");
  return `This question tests ${target} selection. Match each option to its divisibility rule; this question needs ${families} checks.`;
}

export function buildNumCp003FinalQuestionSpecificConcept(state: NumCp003RetainedHiddenState): string {
  return state.kind === "DIRECT_DIVISIBILITY"
    ? directConcept(state)
    : buildNumCp003QuestionSpecificConcept(state);
}
