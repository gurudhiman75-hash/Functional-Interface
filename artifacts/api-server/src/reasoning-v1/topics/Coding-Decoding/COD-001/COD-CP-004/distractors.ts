import { shiftLetter, transformWord } from "../COD-CP-003/alphabet";
import { SeededRandom } from "../foundation/prng";
import { shiftAtPosition, transformPositionWord } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, CodCp004TaskKind } from "./types";

function mutateDecodedWord(word: string): { value: string; errorLabel: string }[] {
  const letters = [...word];
  const output: { value: string; errorLabel: string }[] = [];
  if (letters.length > 1) {
    output.push({ value: [...letters].reverse().join(""), errorLabel: "REVERSED_DECODE" });
    const swapped = [...letters];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    output.push({ value: swapped.join(""), errorLabel: "POSITION_SWAP" });
  }
  const shifted = [...letters];
  shifted[0] = shiftLetter(shifted[0]!, 1);
  output.push({ value: shifted.join(""), errorLabel: "OFF_BY_ONE_INVERSE" });
  return output;
}

function diagnosedAlternatives(target: string, ruleId: CodCp004RuleId, context: CodCp004RuleContext): { value: string; errorLabel: string }[] {
  const firstShift = shiftAtPosition(ruleId, context, target[0]!, 0, target.length);
  const output: { value: string; errorLabel: string }[] = [
    { value: transformWord("UNIFORM_CYCLIC_SHIFT", { shift: firstShift }, target), errorLabel: "FIRST_SHIFT_APPLIED_TO_ALL" },
  ];
  switch (ruleId) {
    case "INCREMENTAL_FORWARD_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { baseShift: (context.baseShift ?? 1) + 1 }, target), errorLabel: "START_INDEX_ONE_TOO_HIGH" },
        { value: transformPositionWord("INCREMENTAL_BACKWARD_SHIFT", { baseShift: context.baseShift }, target), errorLabel: "WRONG_DIRECTION" },
      );
      break;
    case "INCREMENTAL_BACKWARD_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { baseShift: (context.baseShift ?? 1) + 1 }, target), errorLabel: "START_INDEX_ONE_TOO_HIGH" },
        { value: transformPositionWord("INCREMENTAL_FORWARD_SHIFT", { baseShift: context.baseShift }, target), errorLabel: "WRONG_DIRECTION" },
      );
      break;
    case "ALTERNATING_SIGNED_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { ...context, firstDirection: (context.firstDirection ?? 1) === 1 ? -1 : 1 }, target), errorLabel: "ALTERNATING_PHASE_REVERSED" },
        { value: transformPositionWord(ruleId, { ...context, magnitude: (context.magnitude ?? 1) + 1 }, target), errorLabel: "ALTERNATING_MAGNITUDE_OFF_BY_ONE" },
      );
      break;
    case "ODD_EVEN_POSITION_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { oddShift: context.evenShift, evenShift: context.oddShift }, target), errorLabel: "ODD_EVEN_SHIFTS_SWAPPED" },
        { value: transformPositionWord(ruleId, { oddShift: -(context.oddShift ?? 1), evenShift: -(context.evenShift ?? 2) }, target), errorLabel: "POSITION_DIRECTION_REVERSED" },
      );
      break;
    case "VOWEL_CONSONANT_CLASS_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { vowelShift: context.consonantShift, consonantShift: context.vowelShift }, target), errorLabel: "VOWEL_CONSONANT_SHIFTS_SWAPPED" },
        { value: transformPositionWord(ruleId, { vowelShift: -(context.vowelShift ?? 1), consonantShift: -(context.consonantShift ?? -1) }, target), errorLabel: "CLASS_DIRECTIONS_REVERSED" },
      );
      break;
    case "ENDPOINT_INTERIOR_SHIFT":
      output.push(
        { value: transformPositionWord(ruleId, { endpointShift: context.interiorShift, interiorShift: context.endpointShift }, target), errorLabel: "ENDPOINT_INTERIOR_SHIFTS_SWAPPED" },
        { value: transformPositionWord(ruleId, { endpointShift: -(context.endpointShift ?? 1), interiorShift: -(context.interiorShift ?? 2) }, target), errorLabel: "GROUP_DIRECTIONS_REVERSED" },
      );
      break;
  }
  const correct = transformPositionWord(ruleId, context, target);
  output.push({ value: `${correct.slice(0, -1)}${target.at(-1)}`, errorLabel: "FINAL_POSITION_SKIPPED" });
  return output;
}

export function buildCodCp004Distractors(input: {
  correct: string;
  fullTargetCode: string;
  targetWord: string;
  taskKind: CodCp004TaskKind;
  ruleId: CodCp004RuleId;
  context: CodCp004RuleContext;
  missingIndex?: number;
  seed: string;
}): { value: string; errorLabel: string }[] {
  const random = new SeededRandom(input.seed);
  let candidates: { value: string; errorLabel: string }[];
  if (input.taskKind === "DECODE_TARGET") {
    candidates = mutateDecodedWord(input.correct);
  } else if (input.taskKind === "RECOVER_MISSING_LETTER") {
    const index = input.missingIndex ?? 0;
    candidates = diagnosedAlternatives(input.targetWord, input.ruleId, input.context)
      .map((item) => ({ value: item.value[index]!, errorLabel: item.errorLabel }));
    const correctLetter = input.fullTargetCode[index]!;
    candidates.push(
      { value: shiftLetter(correctLetter, 1), errorLabel: "NEIGHBOUR_LETTER_PLUS" },
      { value: shiftLetter(correctLetter, -1), errorLabel: "NEIGHBOUR_LETTER_MINUS" },
    );
  } else {
    candidates = diagnosedAlternatives(input.targetWord, input.ruleId, input.context);
  }
  const unique = [...new Map(candidates.filter((item) => item.value && item.value !== input.correct).map((item) => [item.value, item])).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique COD-CP-004 distractors");
  return random.shuffle(unique).slice(0, 3);
}
