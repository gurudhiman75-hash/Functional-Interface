import { oppositeLetter, shiftLetter } from "../COD-CP-003/alphabet";
import { isVowel } from "../COD-CP-004/transform";
import { transformRearrangementWord } from "../COD-CP-005/transform";
import { SeededRandom } from "../foundation/prng";
import {
  codeTokenAt,
  compositeStageResult,
  halfSwap,
  pairSwap,
  rankSequence,
  transformCompositeWord,
} from "./transform";
import type { CodCp006RuleContext, CodCp006RuleId, CodCp006TaskKind } from "./types";

export interface DiagnosedDistractor {
  value: string;
  errorLabel: string;
}

function mutateDecodedWord(word: string): DiagnosedDistractor[] {
  const output: DiagnosedDistractor[] = [];
  if (word.length > 1) {
    output.push({ value: [...word].reverse().join(""), errorLabel: "DECODE_STAGE_ORDER_WRONG" });
    const swapped = [...word];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    output.push({ value: swapped.join(""), errorLabel: "DECODE_POSITION_SWAP" });
  }
  const shifted = [...word];
  shifted[0] = shiftLetter(shifted[0]!, 1);
  output.push({ value: shifted.join(""), errorLabel: "DECODE_OFF_BY_ONE" });
  const shiftedLast = [...word];
  shiftedLast[shiftedLast.length - 1] = shiftLetter(shiftedLast.at(-1)!, -1);
  output.push({ value: shiftedLast.join(""), errorLabel: "DECODE_FINAL_OFF_BY_ONE" });
  return output;
}

function stageTwoOnOriginal(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string): string {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT": {
      const direction = context.direction ?? 1;
      const baseShift = context.baseShift ?? 1;
      return [...word].map((letter, index) => shiftLetter(letter, direction * (baseShift + index))).join("");
    }
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": {
      const magnitude = context.magnitude ?? 1;
      const firstDirection = context.firstDirection ?? 1;
      return [...word].map((letter, index) => shiftLetter(letter, firstDirection * (index % 2 === 0 ? 1 : -1) * magnitude)).join("");
    }
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
      return [...word].map((letter, index) => shiftLetter(letter, index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2))).join("");
    case "ROTATE_THEN_CLASS_SHIFT":
      return [...word].map((letter) => shiftLetter(letter, isVowel(letter) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1))).join("");
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION":
      return transformRearrangementWord(context.permutationRuleId!, context.permutationContext ?? {}, word);
    case "TRANSFORM_THEN_RANK_SEQUENCE":
      return rankSequence(word, context.separator ?? "-");
  }
}

function diagnosedAlternatives(
  target: string,
  ruleId: CodCp006RuleId,
  context: CodCp006RuleContext,
): DiagnosedDistractor[] {
  const stages = compositeStageResult(ruleId, context, target);
  const output: DiagnosedDistractor[] = [];

  if (ruleId !== "TRANSFORM_THEN_RANK_SEQUENCE") {
    output.push({ value: stages.stage1, errorLabel: "STAGE_TWO_SKIPPED" });
    output.push({ value: stageTwoOnOriginal(ruleId, context, target), errorLabel: "STAGE_ONE_SKIPPED" });
  }

  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT":
      output.push(
        {
          value: transformCompositeWord(ruleId, { ...context, direction: (context.direction ?? 1) === 1 ? -1 : 1 }, target),
          errorLabel: "INDEXED_DIRECTION_REVERSED",
        },
        {
          value: transformCompositeWord(ruleId, { ...context, baseShift: (context.baseShift ?? 1) === 1 ? 2 : 1 }, target),
          errorLabel: "INDEX_START_OFF_BY_ONE",
        },
      );
      break;
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT":
      output.push(
        {
          value: transformCompositeWord(ruleId, { ...context, firstDirection: (context.firstDirection ?? 1) === 1 ? -1 : 1 }, target),
          errorLabel: "ALTERNATING_PHASE_REVERSED",
        },
        {
          value: transformCompositeWord(ruleId, { ...context, magnitude: ((context.magnitude ?? 1) % 3 + 1) as 1 | 2 | 3 }, target),
          errorLabel: "ALTERNATING_MAGNITUDE_WRONG",
        },
      );
      break;
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
      output.push(
        {
          value: transformCompositeWord(ruleId, { ...context, oddShift: context.evenShift, evenShift: context.oddShift }, target),
          errorLabel: "ODD_EVEN_SHIFTS_SWAPPED",
        },
        {
          value: transformCompositeWord(ruleId, { ...context, oddShift: -(context.oddShift ?? 1), evenShift: -(context.evenShift ?? 2) }, target),
          errorLabel: "ODD_EVEN_DIRECTIONS_REVERSED",
        },
      );
      break;
    case "ROTATE_THEN_CLASS_SHIFT":
      output.push(
        {
          value: transformCompositeWord(ruleId, { ...context, rotationDirection: context.rotationDirection === "RIGHT" ? "LEFT" : "RIGHT" }, target),
          errorLabel: "ROTATION_DIRECTION_REVERSED",
        },
        {
          value: transformCompositeWord(ruleId, { ...context, vowelShift: context.consonantShift, consonantShift: context.vowelShift }, target),
          errorLabel: "CLASS_SHIFTS_SWAPPED",
        },
      );
      break;
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION": {
      const wrongRule = context.permutationRuleId === "REVERSE_SEQUENCE"
        ? "ODD_THEN_EVEN_EXTRACTION"
        : "REVERSE_SEQUENCE";
      output.push(
        {
          value: [...target].map(oppositeLetter).join(""),
          errorLabel: "PERMUTATION_SKIPPED",
        },
        {
          value: transformRearrangementWord(context.permutationRuleId!, context.permutationContext ?? {}, target),
          errorLabel: "OPPOSITE_MAP_SKIPPED",
        },
        {
          value: transformRearrangementWord(wrongRule, {}, [...target].map(oppositeLetter).join("")),
          errorLabel: "WRONG_POSITION_PERMUTATION",
        },
      );
      break;
    }
    case "TRANSFORM_THEN_RANK_SEQUENCE": {
      const zeroBased = [...stages.stage1].map((letter) => String(letter.charCodeAt(0) - 65)).join(context.separator ?? "-");
      const reversedRanks = rankSequence([...stages.stage1].reverse().join(""), context.separator ?? "-");
      output.push(
        { value: rankSequence(target, context.separator ?? "-"), errorLabel: "TRANSFORM_SKIPPED" },
        { value: zeroBased, errorLabel: "ZERO_BASED_RANKS" },
        { value: reversedRanks, errorLabel: "RANK_ORDER_REVERSED" },
      );
      break;
    }
  }

  return output;
}

export function buildCodCp006Distractors(input: {
  correct: string;
  fullTargetCode: string;
  targetWord: string;
  taskKind: CodCp006TaskKind;
  ruleId: CodCp006RuleId;
  context: CodCp006RuleContext;
  missingIndex?: number;
  separator: string;
  seed: string;
}): DiagnosedDistractor[] {
  const random = new SeededRandom(input.seed);
  let candidates: DiagnosedDistractor[];

  if (input.taskKind === "DECODE_TARGET") {
    candidates = mutateDecodedWord(input.correct);
  } else if (input.taskKind === "RECOVER_MISSING_TOKEN") {
    const index = input.missingIndex ?? 0;
    candidates = diagnosedAlternatives(input.targetWord, input.ruleId, input.context)
      .map((item) => {
        try {
          return { value: codeTokenAt(item.value, index, input.separator), errorLabel: item.errorLabel };
        } catch {
          return undefined;
        }
      })
      .filter((item): item is DiagnosedDistractor => Boolean(item));

    if (input.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
      const value = Number(input.correct);
      candidates.push(
        { value: String(value === 26 ? 25 : value + 1), errorLabel: "NEIGHBOUR_RANK_PLUS" },
        { value: String(value === 1 ? 2 : value - 1), errorLabel: "NEIGHBOUR_RANK_MINUS" },
      );
    } else {
      candidates.push(
        { value: shiftLetter(input.correct, 1), errorLabel: "NEIGHBOUR_LETTER_PLUS" },
        { value: shiftLetter(input.correct, -1), errorLabel: "NEIGHBOUR_LETTER_MINUS" },
      );
    }
  } else {
    candidates = diagnosedAlternatives(input.targetWord, input.ruleId, input.context);
  }

  const unique = [...new Map(
    candidates
      .filter((item) => item.value && item.value !== input.correct)
      .map((item) => [item.value, item]),
  ).values()];

  if (unique.length < 3) throw new Error(`Unable to construct three unique COD-CP-006 distractors for ${input.ruleId}`);
  return random.shuffle(unique).slice(0, 3);
}
