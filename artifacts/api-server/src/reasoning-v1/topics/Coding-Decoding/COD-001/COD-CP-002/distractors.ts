import type { CodCp002RuleContext, CodCp002RuleId, CodCp002TaskKind } from "./types";
import { COD_CP002_RULES } from "./rule-definitions";
import { evaluateNumericCode, forwardRank, parseNumericSequence, serializeNumericCode } from "./math";
import { SeededRandom } from "../foundation/prng";

interface DistractorCandidate {
  value: string;
  errorLabel: string;
}

function mutateWord(word: string): DistractorCandidate[] {
  const letters = [...word];
  const variants: DistractorCandidate[] = [];
  if (letters.length > 1) {
    variants.push({ value: [...letters].reverse().join(""), errorLabel: "REVERSED_DECODE" });
    const swapped = [...letters];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    variants.push({ value: swapped.join(""), errorLabel: "POSITION_SWAP" });
  }
  const shifted = [...letters];
  shifted[0] = String.fromCharCode(((shifted[0]!.charCodeAt(0) - 65 + 1) % 26) + 65);
  variants.push({ value: shifted.join(""), errorLabel: "OFF_BY_ONE_INVERSE" });
  return variants;
}

function sequenceMutations(correct: string): DistractorCandidate[] {
  const values = parseNumericSequence(correct);
  const output: DistractorCandidate[] = [];
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

function scalarMistakes(word: string, ruleId: CodCp002RuleId, correct: number): DistractorCandidate[] {
  const ranks = [...word].map(forwardRank);
  const sum = ranks.reduce((total, rank) => total + rank, 0);
  const length = word.length;
  const nearby = [
    { value: String(correct + 1), errorLabel: "ARITHMETIC_PLUS_ONE" },
    { value: String(Math.max(0, correct - 1)), errorLabel: "ARITHMETIC_MINUS_ONE" },
  ];

  switch (ruleId) {
    case "SUM_OF_FORWARD_RANKS":
      return [
        { value: String(sum + length), errorLabel: "WORD_LENGTH_ADDED" },
        { value: String(Math.max(0, sum - length)), errorLabel: "WORD_LENGTH_SUBTRACTED" },
        ...nearby,
      ];
    case "SUM_PLUS_WORD_LENGTH":
      return [
        { value: String(sum), errorLabel: "WORD_LENGTH_OMITTED" },
        { value: String(Math.max(0, sum - length)), errorLabel: "WORD_LENGTH_SIGN_REVERSED" },
        { value: String(sum + 2 * length), errorLabel: "WORD_LENGTH_ADDED_TWICE" },
        ...nearby,
      ];
    case "SUM_MINUS_WORD_LENGTH":
      return [
        { value: String(sum), errorLabel: "WORD_LENGTH_OMITTED" },
        { value: String(sum + length), errorLabel: "WORD_LENGTH_SIGN_REVERSED" },
        { value: String(Math.max(0, sum - 2 * length)), errorLabel: "WORD_LENGTH_SUBTRACTED_TWICE" },
        ...nearby,
      ];
    case "POSITION_WEIGHTED_SUM": {
      const zeroBased = ranks.reduce((total, rank, index) => total + rank * index, 0);
      const reverseWeighted = ranks.reduce((total, rank, index) => total + rank * (length - index), 0);
      return [
        { value: String(sum), errorLabel: "POSITION_WEIGHTS_OMITTED" },
        { value: String(zeroBased), errorLabel: "ZERO_BASED_POSITION_WEIGHTS" },
        { value: String(reverseWeighted), errorLabel: "POSITION_WEIGHTS_REVERSED" },
        ...nearby,
      ];
    }
    case "ODD_EVEN_POSITION_DIFFERENCE": {
      const odd = ranks.filter((_, index) => index % 2 === 0).reduce((total, rank) => total + rank, 0);
      const even = ranks.filter((_, index) => index % 2 === 1).reduce((total, rank) => total + rank, 0);
      const withoutLast = ranks.slice(0, -1);
      const shortOdd = withoutLast.filter((_, index) => index % 2 === 0).reduce((total, rank) => total + rank, 0);
      const shortEven = withoutLast.filter((_, index) => index % 2 === 1).reduce((total, rank) => total + rank, 0);
      return [
        { value: String(odd + even), errorLabel: "ODD_EVEN_TOTAL_USED" },
        { value: String(Math.abs(shortOdd - shortEven)), errorLabel: "FINAL_LETTER_OMITTED" },
        { value: String(Math.abs(odd - even) + 2), errorLabel: "ODD_EVEN_DIFFERENCE_SLIP" },
        ...nearby,
      ];
    }
    default:
      return nearby;
  }
}

function competingRuleCandidates(input: {
  correct: string;
  targetWord: string;
  intendedRuleId: CodCp002RuleId;
  intendedContext: CodCp002RuleContext;
}): DistractorCandidate[] {
  const candidates: DistractorCandidate[] = [];
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
  return candidates;
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
}): DistractorCandidate[] {
  const random = new SeededRandom(input.seed);
  let candidates: DistractorCandidate[] = [];

  if (input.taskKind === "DECODE_TARGET") {
    candidates = mutateWord(input.correct);
  } else if (input.taskKind === "RECOVER_MISSING_VALUE" && input.fullTargetCode.includes("-")) {
    const values = parseNumericSequence(input.fullTargetCode);
    const correctValue = values[input.missingIndex ?? 0]!;
    for (const value of [correctValue + 1, Math.max(1, correctValue - 1), values[(input.missingIndex ?? 0) === 0 ? 1 : 0] ?? correctValue + 2]) {
      candidates.push({ value: String(value), errorLabel: "MISSING_TOKEN_TRAP" });
    }
  } else if (!input.correct.includes("-")) {
    const preferred = scalarMistakes(input.targetWord, input.intendedRuleId, Number(input.correct));
    const uniquePreferred = [...new Map(preferred.filter((item) => item.value !== input.correct).map((item) => [item.value, item])).values()];
    candidates = uniquePreferred.length >= 3
      ? random.shuffle(uniquePreferred).slice(0, 3)
      : [...uniquePreferred, ...competingRuleCandidates(input)];
  } else {
    candidates = [...sequenceMutations(input.correct), ...competingRuleCandidates(input)];
  }

  const unique = [...new Map(candidates.filter((item) => item.value !== input.correct).map((item) => [item.value, item])).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique COD-CP-002 distractors");
  return unique.length === 3 ? unique : random.shuffle(unique).slice(0, 3);
}
