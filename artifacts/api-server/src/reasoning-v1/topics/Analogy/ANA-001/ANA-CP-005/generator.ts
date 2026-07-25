import { letterFromPosition, letterPosition, oppositeLetter, shiftLetter } from "../foundation/alphabet";
import { checkAlphabetAmbiguity } from "./ambiguity-checker";
import {
  allEligibleLetters,
  matchingAlphabetRules,
  verifyAlphabetTransfer,
  type AlphabetPair,
} from "./independent-solver";
import { validateAlphabetOptions, type AlphabetOption } from "./option-validator";
import { ANA_CP005_QLS, type AlphabetPresentationMode } from "./question-language.en";
import { alphabetRuleById, type AlphabetRuleContext } from "./rule-definitions";

export type AlphabetDifficulty = "EASY" | "MEDIUM" | "HARD";
export type AlphabetLayout = "INLINE" | "ARROW" | "TWO_ROW_TABLE" | "BOXED_PAIRS";

export interface GeneratedAlphabetAnalogy {
  qlId: string;
  ruleId: string;
  presentationMode: AlphabetPresentationMode;
  difficulty: AlphabetDifficulty;
  layout: AlphabetLayout;
  context: AlphabetRuleContext;
  source: AlphabetPair;
  target: AlphabetPair;
  stem: string;
  options: readonly AlphabetOption[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
}

function rng(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = rng(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function qlById(qlId: string) {
  const ql = ANA_CP005_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-005 QL: ${qlId}`);
  return ql;
}

function difficultyForSeed(seed: number): AlphabetDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[Math.abs(seed) % 3];
}

function difficultyFits(difficulty: AlphabetDifficulty, source: AlphabetPair, target: AlphabetPair): boolean {
  const positions = [source.left, source.right, target.left, target.right].map(letterPosition);
  const edgeCount = positions.filter((position) => position <= 4 || position >= 23).length;
  const spread = Math.max(...positions) - Math.min(...positions);
  if (difficulty === "EASY") return edgeCount === 0 && spread <= 15;
  if (difficulty === "MEDIUM") return spread >= 8;
  return edgeCount > 0 || spread >= 18;
}

function evidenceShapeFits(ruleId: string, sourceLeft: string, targetLeft: string): boolean {
  if (ruleId !== "ALPHA_EQUAL_DISTANCE") return true;
  return (letterPosition(sourceLeft) <= 13) !== (letterPosition(targetLeft) <= 13);
}

function chooseInstance(
  ruleId: string,
  seed: number,
  difficulty: AlphabetDifficulty,
): { context: AlphabetRuleContext; source: AlphabetPair; target: AlphabetPair } {
  const rule = alphabetRuleById(ruleId);
  let fallback: { context: AlphabetRuleContext; source: AlphabetPair; target: AlphabetPair } | null = null;

  for (const context of shuffle(rule.contexts, seed * 11 + 3)) {
    const inputs = shuffle(allEligibleLetters(ruleId), seed * 13 + 5);
    for (let sourceIndex = 0; sourceIndex < inputs.length; sourceIndex += 1) {
      const sourceLeft = inputs[sourceIndex];
      const sourceRight = rule.apply(sourceLeft, context);
      if (!sourceRight) continue;
      const source = { left: sourceLeft, right: sourceRight };
      for (let targetIndex = sourceIndex + 1; targetIndex < inputs.length; targetIndex += 1) {
        const targetLeft = inputs[targetIndex];
        const targetRight = rule.apply(targetLeft, context);
        if (!targetRight || targetRight === sourceRight || targetLeft === sourceLeft) continue;
        if (!evidenceShapeFits(ruleId, sourceLeft, targetLeft)) continue;
        const target = { left: targetLeft, right: targetRight };
        if (!checkAlphabetAmbiguity(ruleId, context, [source, target]).accepted) continue;
        const candidate = { context, source, target };
        fallback ??= candidate;
        if (difficultyFits(difficulty, source, target)) return candidate;
      }
    }
  }

  if (fallback) return fallback;
  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function plausibleWrongLetters(target: AlphabetPair, seed: number): string[] {
  const correct = target.right;
  const input = target.left;
  const candidates = [
    shiftLetter(input, 1),
    shiftLetter(input, -1),
    shiftLetter(input, 2),
    shiftLetter(input, -2),
    oppositeLetter(input),
    shiftLetter(correct, 1),
    shiftLetter(correct, -1),
    letterFromPosition(Math.max(1, Math.min(26, letterPosition(input) * 2))),
    letterFromPosition(Math.ceil(letterPosition(input) / 2)),
  ];
  return shuffle(candidates, seed).filter(
    (letter, index, all) => letter !== correct && letter !== input && all.indexOf(letter) === index,
  );
}

function directCompletionOptions(source: AlphabetPair, target: AlphabetPair, seed: number): AlphabetOption[] {
  const fallbackLetters = shuffle(
    Array.from({ length: 26 }, (_, index) => letterFromPosition(index + 1)),
    seed * 37 + 19,
  );
  const candidates = [...plausibleWrongLetters(target, seed * 17 + 7), ...fallbackLetters];
  const distractors: AlphabetOption[] = [];

  for (const value of candidates) {
    if (value === target.right || value === target.left) continue;
    if (distractors.some((option) => option.value === value)) continue;
    const evidence = [source, { left: target.left, right: value }] as const;
    if (matchingAlphabetRules(evidence).length > 0) continue;
    distractors.push({ value, errorLabel: "WRONG_DIRECTION_OFF_BY_ONE_OR_NO_WRAP" });
    if (distractors.length === 3) break;
  }

  if (distractors.length !== 3) throw new Error("Unable to produce three globally unambiguous alphabet distractors.");
  return shuffle<AlphabetOption>([
    { value: target.right, errorLabel: null },
    ...distractors,
  ], seed * 19 + 11);
}

function pairSelectionOptions(
  ruleId: string,
  context: AlphabetRuleContext,
  source: AlphabetPair,
  target: AlphabetPair,
  seed: number,
): AlphabetOption[] {
  const rule = alphabetRuleById(ruleId);
  const distractors: AlphabetOption[] = [];
  for (const left of shuffle(allEligibleLetters(ruleId), seed * 23 + 13)) {
    const correctRight = rule.apply(left, context);
    if (!correctRight) continue;
    if (left === target.left && correctRight === target.right) continue;
    const fallbackRights = shuffle(
      Array.from({ length: 26 }, (_, index) => letterFromPosition(index + 1)),
      seed + letterPosition(left) * 47,
    );
    const candidates = [
      ...plausibleWrongLetters({ left, right: correctRight }, seed + letterPosition(left) * 31),
      ...fallbackRights,
    ];
    for (const right of candidates) {
      if (right === correctRight) continue;
      const value = [left, right] as const;
      const key = `${left}:${right}`;
      if (distractors.some((option) => Array.isArray(option.value) && `${option.value[0]}:${option.value[1]}` === key)) continue;
      if (matchingAlphabetRules([source, { left, right }]).length > 0) continue;
      distractors.push({ value, errorLabel: "WRONG_DIRECTION_OFF_BY_ONE_OR_NO_WRAP" });
      if (distractors.length === 3) break;
    }
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${ruleId} cannot produce three globally unambiguous pair distractors.`);
  return shuffle<AlphabetOption>([
    { value: [target.left, target.right] as const, errorLabel: null },
    ...distractors,
  ], seed * 29 + 17);
}

function placeCorrectOption(options: readonly AlphabetOption[], desiredIndex: number): AlphabetOption[] {
  const result = [...options];
  const currentIndex = result.findIndex((option) => option.errorLabel === null);
  if (currentIndex < 0) throw new Error("ANA-CP-005 options do not contain a marked correct answer.");
  const [correct] = result.splice(currentIndex, 1);
  result.splice(desiredIndex, 0, correct);
  return result;
}

const LAYOUTS: readonly AlphabetLayout[] = ["INLINE", "ARROW", "TWO_ROW_TABLE", "BOXED_PAIRS"];

function renderCompletionStem(source: AlphabetPair, target: AlphabetPair, layout: AlphabetLayout): string {
  if (layout === "ARROW") return `${source.left} → ${source.right}  ::  ${target.left} → ?`;
  if (layout === "TWO_ROW_TABLE") {
    return `Complete the second row using the same alphabet relationship.\n\n| Pair | First letter | Second letter |\n|---|---|---|\n| A | ${source.left} | ${source.right} |\n| B | ${target.left} | ? |`;
  }
  if (layout === "BOXED_PAIRS") return `[ ${source.left} : ${source.right} ]  ::  [ ${target.left} : ? ]`;
  return `${source.left} : ${source.right} :: ${target.left} : ?`;
}

function renderSelectionStem(source: AlphabetPair, layout: AlphabetLayout): string {
  if (layout === "ARROW") return `Select the letter pair that follows the same rule as ${source.left} → ${source.right}.`;
  if (layout === "TWO_ROW_TABLE") return `Select the row that follows the same alphabet relationship as | ${source.left} | ${source.right} |.`;
  if (layout === "BOXED_PAIRS") return `Select the box that follows the same rule as [ ${source.left} : ${source.right} ].`;
  return `Select the letter pair that follows the same relationship as ${source.left} : ${source.right}.`;
}

function trapRejection(ruleId: string): string {
  if (ruleId.startsWith("ALPHA_CYCLIC_SHIFT")) {
    return "The other options either move in the wrong direction, differ by one place, or stop at the alphabet boundary instead of wrapping.";
  }
  if (ruleId === "ALPHA_CLASS_CORRESPONDENCE") {
    return "The other options ignore the vowel/consonant order, reverse the class direction, or use a simple nearby shift.";
  }
  if (ruleId === "ALPHA_EQUAL_DISTANCE") {
    return "The other options keep one direction throughout or change the distance instead of moving equally toward the alphabet centre.";
  }
  return "The other options use the wrong direction, an off-by-one movement, or a simpler competing alphabet rule.";
}

export function generateAlphabetAnalogy(qlId: string, seed = 0): GeneratedAlphabetAnalogy {
  const ql = qlById(qlId);
  const rule = alphabetRuleById(ql.ruleId);
  const difficulty = difficultyForSeed(seed);
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length];
  const { context, source, target } = chooseInstance(ql.ruleId, seed, difficulty);

  if (!verifyAlphabetTransfer(ql.ruleId, context, source, target)) {
    throw new Error("Independent solver rejected ANA-CP-005 instance.");
  }

  const rawOptions = ql.presentationMode === "DIRECT_COMPLETION"
    ? directCompletionOptions(source, target, seed)
    : pairSelectionOptions(ql.ruleId, context, source, target, seed);
  const qlNumber = Number.parseInt(qlId.slice(-3), 10);
  const desiredCorrectIndex = ((Math.abs(seed) % 4) + (qlNumber % 4)) % 4;
  const options = placeCorrectOption(rawOptions, desiredCorrectIndex);
  const correctIndex = validateAlphabetOptions(
    ql.ruleId,
    context,
    ql.presentationMode,
    source,
    target,
    options,
  );

  return {
    qlId,
    ruleId: ql.ruleId,
    presentationMode: ql.presentationMode,
    difficulty,
    layout,
    context,
    source,
    target,
    stem: ql.presentationMode === "DIRECT_COMPLETION"
      ? renderCompletionStem(source, target, layout)
      : renderSelectionStem(source, layout),
    options,
    correctIndex,
    explanation: {
      ruleStatement: `The relationship is: ${rule.label}.`,
      sourceDemonstration: rule.explain(source.left, source.right, context),
      targetApplication: rule.explain(target.left, target.right, context),
      conclusion: ql.presentationMode === "DIRECT_COMPLETION"
        ? `Therefore, ${target.right} is the missing letter.`
        : `Therefore, ${target.left} : ${target.right} follows the same rule.`,
      closestTrapRejection: trapRejection(ql.ruleId),
    },
  };
}
