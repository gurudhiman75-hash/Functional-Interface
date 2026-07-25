import { oppositeLetter, shiftLetter, transformWord } from "./alphabet";
import { SeededRandom } from "../foundation/prng";
import type { CodCp003RuleContext, CodCp003RuleId, CodCp003TaskKind } from "./types";

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

function alternativeCodes(target: string, ruleId: CodCp003RuleId, context: CodCp003RuleContext): { value: string; errorLabel: string }[] {
  const output: { value: string; errorLabel: string }[] = [];
  if (ruleId === "UNIFORM_CYCLIC_SHIFT") {
    const shift = context.shift ?? 0;
    output.push(
      { value: transformWord(ruleId, { shift: -shift }, target), errorLabel: "WRONG_DIRECTION" },
      { value: transformWord(ruleId, { shift: shift + (shift > 0 ? 1 : -1) }, target), errorLabel: "OFF_BY_ONE_SHIFT" },
      { value: [...target].map(oppositeLetter).join(""), errorLabel: "OPPOSITE_ALPHABET_TRAP" },
    );
  } else {
    output.push(
      { value: transformWord("UNIFORM_CYCLIC_SHIFT", { shift: 1 }, target), errorLabel: "FORWARD_SHIFT_TRAP" },
      { value: transformWord("UNIFORM_CYCLIC_SHIFT", { shift: -1 }, target), errorLabel: "BACKWARD_SHIFT_TRAP" },
      { value: [...target].reverse().map(oppositeLetter).join(""), errorLabel: "REVERSED_OPPOSITE_TRAP" },
    );
  }
  if (target.length > 1) {
    const correct = transformWord(ruleId, context, target);
    const swapped = [...correct];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    output.push({ value: swapped.join(""), errorLabel: "WRONG_TARGET_POSITION" });
  }
  return output;
}

export function buildCodCp003Distractors(input: {
  correct: string;
  fullTargetCode: string;
  targetWord: string;
  taskKind: CodCp003TaskKind;
  ruleId: CodCp003RuleId;
  context: CodCp003RuleContext;
  missingIndex?: number;
  seed: string;
}): { value: string; errorLabel: string }[] {
  const random = new SeededRandom(input.seed);
  let candidates: { value: string; errorLabel: string }[];
  if (input.taskKind === "DECODE_TARGET") {
    candidates = mutateDecodedWord(input.correct);
  } else if (input.taskKind === "RECOVER_MISSING_LETTER") {
    const index = input.missingIndex ?? 0;
    candidates = alternativeCodes(input.targetWord, input.ruleId, input.context)
      .map((item) => ({ value: item.value[index]!, errorLabel: item.errorLabel }));
    const correctLetter = input.fullTargetCode[index]!;
    candidates.push(
      { value: shiftLetter(correctLetter, 1), errorLabel: "NEIGHBOUR_LETTER_PLUS" },
      { value: shiftLetter(correctLetter, -1), errorLabel: "NEIGHBOUR_LETTER_MINUS" },
    );
  } else {
    candidates = alternativeCodes(input.targetWord, input.ruleId, input.context);
  }
  const unique = [...new Map(candidates.filter((item) => item.value && item.value !== input.correct).map((item) => [item.value, item])).values()];
  if (unique.length < 3) throw new Error("Unable to construct three unique COD-CP-003 distractors");
  return random.shuffle(unique).slice(0, 3);
}
