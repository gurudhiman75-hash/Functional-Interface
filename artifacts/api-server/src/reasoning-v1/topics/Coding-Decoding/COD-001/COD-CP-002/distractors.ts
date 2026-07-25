import type { CodCp002RuleContext, CodCp002RuleId, CodCp002TaskKind } from "./types";
import { COD_CP002_RULES } from "./rule-definitions";
import { evaluateNumericCode, parseNumericSequence, serializeNumericCode } from "./math";
import { SeededRandom } from "../foundation/prng";

function mutateWord(word: string): string[] {
  const letters = [...word];
  const variants: string[] = [];
  if (letters.length > 1) {
    variants.push([...letters].reverse().join(""));
    const swapped = [...letters];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    variants.push(swapped.join(""));
  }
  const shifted = [...letters];
  shifted[0] = String.fromCharCode(((shifted[0]!.charCodeAt(0) - 65 + 1) % 26) + 65);
  variants.push(shifted.join(""));
  return variants;
}

function sequenceMutations(correct: string): { value: string; errorLabel: string }[] {
  const values = parseNumericSequence(correct);
  const output: { value: string; errorLabel: string }[] = [];
  if (values.length > 1) {
    output.push({ value: [...values].reverse().join("-"), errorLabel: "REVERSED_TOKEN_ORDER" });
    const swapped = [...values];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    output.push({ value: swapped.join("-"), errorLabel: "POSITION_SWAP" });
  }
  output.push({ value: values.map((value) => value + 1).join("-"), errorLabel: "OFF_BY_ONE_RANK" });
  output.push({ value: values.map((value) => Math.max(1, value - 1)).join("-"), errorLabel: "WRONG_CONSTANT_DIRECTION" });
  return output;
}

export function buildCodCp002Distractors(input: {
  correct: string;
  fullTargetCode: string;
  targetWord: string;
  taskKind: CodCp002TaskKind;
  intendedRuleId: CodCp002RuleId;
  intendedContext: CodCp002RuleContext;
  missingIndex?: number;
  seed: string;
}): { value: string; errorLabel: string }[] {
  const random = new SeededRandom(input.seed);
  const candidates: { value: string; errorLabel: string }[] = [];
  if (input.taskKind === "DECODE_TARGET") {
    for (const value of mutateWord(input.correct)) candidates.push({ value, errorLabel: "INVERSE_RULE_ERROR" });
  } else if (input.taskKind === "RECOVER_MISSING_VALUE" && input.fullTargetCode.includes("-")) {
    const values = parseNumericSequence(input.fullTargetCode);
    const correctValue = values[input.missingIndex ?? 0]!;
    for (const value of [correctValue + 1, Math.max(1, correctValue - 1), values[(input.missingIndex ?? 0) === 0 ? 1 : 0] ?? correctValue + 2]) {
      candidates.push({ value: String(value), errorLabel: "MISSING_TOKEN_TRAP" });
    }
  } else {
    for (const rule of COD_CP002_RULES) {
      for (const context of rule.contextDomain) {
        if (rule.ruleId === input.intendedRuleId && JSON.stringify(context) === JSON.stringify(input.intendedContext)) continue;
        try {
          const value = serializeNumericCode(evaluateNumericCode(rule.ruleId, context, input.targetWord));
          if ((input.correct.includes("-") && value.includes("-")) || (!input.correct.includes("-") && !value.includes("-"))) {
            candidates.push({ value, errorLabel: `COMPETING_${rule.ruleId}` });
          }
        } catch {
          // Unsafe competing context is not a distractor candidate.
        }
      }
    }
    if (input.correct.includes("-")) candidates.push(...sequenceMutations(input.correct));
    else {
      const number = Number(input.correct);
      candidates.push(
        { value: String(number + 1), errorLabel: "ARITHMETIC_PLUS_ONE" },
        { value: String(Math.max(0, number - 1)), errorLabel: "ARITHMETIC_MINUS_ONE" },
        { value: String(number + input.targetWord.length), errorLabel: "WORD_LENGTH_ADDED_TWICE" },
      );
    }
  }
  const unique = [...new Map(candidates.filter((item) => item.value !== input.correct).map((item) => [item.value, item])).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique COD-CP-002 distractors");
  return random.shuffle(unique).slice(0, 3);
}
