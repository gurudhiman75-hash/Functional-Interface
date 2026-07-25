import { SeededRandom } from "../foundation/prng";
import { COD_CP005_RULES } from "./rule-definitions";
import { inverseRearrangementWord, transformRearrangementWord } from "./transform";
import type { CodCp005RuleContext, CodCp005RuleId, CodCp005TaskKind } from "./types";

function errorLabel(ruleId: CodCp005RuleId, context: CodCp005RuleContext): string {
  switch (ruleId) {
    case "REVERSE_SEQUENCE": return "REVERSE_ORDER_USED";
    case "CYCLIC_POSITION_ROTATION":
      return `ROTATE_${context.direction ?? "LEFT"}_${context.amount ?? 1}`;
    case "HALF_SWAP": return "HALVES_SWAPPED";
    case "ODD_THEN_EVEN_EXTRACTION": return "ODD_POSITIONS_FIRST";
    case "EVEN_THEN_ODD_EXTRACTION": return "EVEN_POSITIONS_FIRST";
    case "OUTER_INNER_INTERLEAVING":
      return context.startSide === "RIGHT" ? "OUTER_RIGHT_FIRST" : "OUTER_LEFT_FIRST";
  }
}

function allDiagnosedOrders(word: string, decode = false): { value: string; errorLabel: string }[] {
  const output: { value: string; errorLabel: string }[] = [
    { value: word, errorLabel: "ORDER_LEFT_UNCHANGED" },
  ];
  for (const rule of COD_CP005_RULES) {
    for (const context of rule.contextDomain) {
      try {
        const value = decode
          ? inverseRearrangementWord(rule.ruleId, context, word)
          : transformRearrangementWord(rule.ruleId, context, word);
        output.push({ value, errorLabel: decode ? `DECODE_${errorLabel(rule.ruleId, context)}` : errorLabel(rule.ruleId, context) });
      } catch {
        // Some rules, such as half-swap, are intentionally undefined for odd lengths.
      }
    }
  }
  return output;
}

export function buildCodCp005Distractors(input: {
  correct: string;
  fullTargetCode: string;
  targetWord: string;
  taskKind: CodCp005TaskKind;
  ruleId: CodCp005RuleId;
  context: CodCp005RuleContext;
  missingIndex?: number;
  seed: string;
}): { value: string; errorLabel: string }[] {
  const random = new SeededRandom(input.seed);
  let candidates: { value: string; errorLabel: string }[];
  if (input.taskKind === "DECODE_TARGET") {
    candidates = allDiagnosedOrders(input.fullTargetCode, true);
  } else if (input.taskKind === "RECOVER_MISSING_LETTER") {
    const index = input.missingIndex ?? 0;
    candidates = allDiagnosedOrders(input.targetWord)
      .map((item) => ({ value: item.value[index]!, errorLabel: item.errorLabel }));
    for (let sourceIndex = 0; sourceIndex < input.targetWord.length; sourceIndex += 1) {
      candidates.push({
        value: input.targetWord[sourceIndex]!,
        errorLabel: `WRONG_SOURCE_POSITION_${sourceIndex + 1}`,
      });
    }
  } else {
    candidates = allDiagnosedOrders(input.targetWord);
  }
  const unique = [...new Map(
    candidates
      .filter((item) => item.value && item.value !== input.correct)
      .map((item) => [item.value, item]),
  ).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique COD-CP-005 distractors");
  return random.shuffle(unique).slice(0, 3);
}
