import { matchingSetRules, type NumberTriple } from "./independent-solver";
import type { NumberSetRuleDefinition, SetRuleContext } from "./rule-definitions";

export type SetDifficulty = "EASY" | "MEDIUM" | "HARD";

export function deriveSetDifficulty(
  rule: NumberSetRuleDefinition,
  context: SetRuleContext,
  presentationMode: "MISSING_MEMBER" | "EQUIVALENT_SET_SELECTION",
  source: NumberTriple,
  correct: number,
  wrongValues: readonly number[],
  missingPosition: 0 | 1 | 2 | null,
): SetDifficulty {
  let score = 0;

  // Structural rule complexity. Deliberately independent of raw number size.
  if (rule.priority >= 3) score += 1;
  if (rule.priority >= 5) score += 1;
  if (rule.priority >= 6) score += 1;
  if (context.k !== undefined || context.ratio !== undefined) score += 1;

  // A single source triple may support several tempting rules even though the
  // complete generated state is unique. That is genuine inference burden.
  const competingSourceRules = matchingSetRules([source]).length;
  if (competingSourceRules >= 4) score += 1;
  if (competingSourceRules >= 8) score += 1;

  if (presentationMode === "EQUIVALENT_SET_SELECTION") score += 1;
  if (missingPosition !== null && missingPosition !== 2) score += 1;

  if (wrongValues.length) {
    const nearest = Math.min(...wrongValues.map((value) => Math.abs(value - correct)));
    if (nearest <= 2) score += 1;
  }

  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}
