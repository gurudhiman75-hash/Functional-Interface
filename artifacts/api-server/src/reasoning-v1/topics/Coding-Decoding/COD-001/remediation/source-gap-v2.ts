import {
  candidateKey,
  inferSourceGapCandidates,
  oppositeLetter,
  shiftLetter,
  transformSourceGapRule,
  type SourceGapContext,
  type SourceGapEvidence,
  type SourceGapOwnerCheckpoint,
  type SourceGapRuleId,
} from "./source-gap-prototype";
import { COD_SOURCE_GAP_WORD_POOL } from "./source-gap-word-pool.en";

export type SourceGapDifficulty = "EASY" | "MEDIUM" | "HARD";

export type SourceGapDistractorProvenance =
  | "DESCENDING_SORT"
  | "REVERSE_SOURCE"
  | "ROTATE_SORTED"
  | "REVERSE_THEN_INDEXED"
  | "WRONG_INDEX_DIRECTION"
  | "WRONG_INDEX_BASE"
  | "INDEXED_WITHOUT_REVERSE"
  | "REVERSE_ONLY"
  | "UNIFORM_SHIFT_ONLY"
  | "OPPOSITE_SHIFT_DIRECTION"
  | "WRONG_SHIFT_MAGNITUDE"
  | "OTHER_MIXED_CLASS_VARIANT"
  | "VOWELS_UNCHANGED"
  | "CONSONANTS_UNCHANGED"
  | "OPPOSITE_ALL_LETTERS";

export interface SourceGapV2Explanation {
  readonly rule: string;
  readonly steps: readonly string[];
  readonly working: readonly string[];
  readonly caution?: string;
}

export interface SourceGapV2Distractor {
  readonly value: string;
  readonly provenance: SourceGapDistractorProvenance;
}

export interface SourceGapV2Question {
  readonly prototypeId: string;
  readonly permanentQlId: null;
  readonly packageId: "COD-001";
  readonly ownerCheckpoint: SourceGapOwnerCheckpoint;
  readonly ruleId: SourceGapRuleId;
  readonly context: SourceGapContext;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: SourceGapDifficulty;
  readonly difficultyScore: number;
  readonly difficultyFeatures: readonly string[];
  readonly stem: string;
  readonly evidence: readonly SourceGapEvidence[];
  readonly targetWord: string;
  readonly targetCode: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly distractors: readonly SourceGapV2Distractor[];
  readonly explanation: SourceGapV2Explanation;
  readonly metadata: {
    readonly maturity: "SOURCE_GAP_V2_CANDIDATE";
    readonly reviewOnly: true;
    readonly publiclyPublishable: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly mockTestEligible: false;
    readonly inferredCandidateCount: 1;
    readonly arbitraryFallbackUsed: false;
  };
}

const RULES: readonly SourceGapRuleId[] = [
  "ALPHABETICAL_ASCENDING_SORT",
  "INDEXED_SHIFT_THEN_REVERSE",
  "REVERSE_THEN_UNIFORM_SHIFT",
  "MIXED_CLASS_CODE",
];
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function ownerCheckpoint(ruleId: SourceGapRuleId): SourceGapOwnerCheckpoint {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") return "COD-CP-005";
  if (ruleId === "MIXED_CLASS_CODE") return "COD-CP-007";
  return "COD-CP-006";
}

function contextForSeed(ruleId: SourceGapRuleId, seed: number): SourceGapContext {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") return {};
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    return { baseShift: seed % 2 === 0 ? 1 : 2, direction: seed % 4 < 2 ? -1 : 1 };
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shifts = [-2, -1, 1, 2] as const;
    return { shift: shifts[Math.abs(seed) % shifts.length] };
  }
  return {
    mixedVariant: seed % 2 === 0
      ? "VOWEL_INDEX_CONSONANT_PREVIOUS"
      : "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE",
  };
}

function hash(value: number): number {
  let x = (value + 0x9e3779b9) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x21f0aaad) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x735a2d97) >>> 0;
  x ^= x >>> 15;
  return x >>> 0;
}

function selectThree(seed: number, attempt: number): readonly [string, string, string] {
  const size = COD_SOURCE_GAP_WORD_POOL.length;
  const indexes: number[] = [];
  for (let slot = 0; slot < 3; slot += 1) {
    let index = hash(seed * 1009 + attempt * 9176 + slot * 7919) % size;
    while (indexes.includes(index)) index = (index + 1) % size;
    indexes.push(index);
  }
  return [
    COD_SOURCE_GAP_WORD_POOL[indexes[0]!]!,
    COD_SOURCE_GAP_WORD_POOL[indexes[1]!]!,
    COD_SOURCE_GAP_WORD_POOL[indexes[2]!]!,
  ];
}

function evidenceFor(ruleId: SourceGapRuleId, context: SourceGapContext, words: readonly [string, string, string]): readonly SourceGapEvidence[] {
  return words.slice(0, 2).map((source) => ({ source, code: transformSourceGapRule(ruleId, context, source) }));
}

function mixedExercisesBothClasses(word: string): boolean {
  const hasVowel = [...word].some((letter) => VOWELS.has(letter));
  const hasConsonant = [...word].some((letter) => !VOWELS.has(letter));
  return hasVowel && hasConsonant;
}

function allWordsEligible(ruleId: SourceGapRuleId, words: readonly [string, string, string]): boolean {
  if (ruleId !== "MIXED_CLASS_CODE") return true;
  return words.every(mixedExercisesBothClasses);
}

function findUnambiguousWords(ruleId: SourceGapRuleId, context: SourceGapContext, seed: number): readonly [string, string, string] {
  const intended = candidateKey({ ruleId, context });
  for (let attempt = 0; attempt < COD_SOURCE_GAP_WORD_POOL.length * 3; attempt += 1) {
    const words = selectThree(seed, attempt);
    if (!allWordsEligible(ruleId, words)) continue;
    const evidence = evidenceFor(ruleId, context, words);
    const candidates = inferSourceGapCandidates(evidence);
    if (candidates.length !== 1 || candidateKey(candidates[0]!) !== intended) continue;
    if (transformSourceGapRule(ruleId, context, words[2]) === words[2]) continue;
    if (misconceptionDistractors(ruleId, context, words[2], transformSourceGapRule(ruleId, context, words[2])).length < 3) continue;
    return words;
  }
  throw new Error(`Unable to build unambiguous source-gap V2 instance for ${ruleId}/${seed}`);
}

function pairwiseTransitions(word: string): number {
  let transitions = 0;
  for (let index = 1; index < word.length; index += 1) {
    if (VOWELS.has(word[index - 1]!) !== VOWELS.has(word[index]!)) transitions += 1;
  }
  return transitions;
}

function repeatedLetterBurden(word: string): number {
  return word.length - new Set(word).size;
}

function wraparoundCount(ruleId: SourceGapRuleId, context: SourceGapContext, word: string): number {
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const direction = context.direction ?? -1;
    const base = context.baseShift ?? 1;
    return [...word].filter((letter, index) => {
      const rank = letter.charCodeAt(0) - 65;
      const shifted = rank + direction * (base + index);
      return shifted < 0 || shifted > 25;
    }).length;
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    return [...word].filter((letter) => {
      const rank = letter.charCodeAt(0) - 65;
      return rank + shift < 0 || rank + shift > 25;
    }).length;
  }
  return 0;
}

export function scoreSourceGapDifficulty(ruleId: SourceGapRuleId, context: SourceGapContext, evidence: readonly SourceGapEvidence[], target: string): {
  score: number;
  difficulty: SourceGapDifficulty;
  features: readonly string[];
} {
  let score = Math.max(0, target.length - 4);
  const features: string[] = [`target-length:${target.length}`];
  const repeats = repeatedLetterBurden(target);
  if (repeats > 0) {
    score += Math.min(2, repeats);
    features.push(`repeated-letter-burden:${repeats}`);
  }
  const evidenceBurden = evidence.reduce((sum, row) => sum + Math.max(0, row.source.length - 5), 0);
  if (evidenceBurden > 0) {
    score += Math.min(2, Math.floor(evidenceBurden / 3) + 1);
    features.push(`evidence-length-burden:${evidenceBurden}`);
  }
  const wraps = wraparoundCount(ruleId, context, target);
  if (wraps > 0) {
    score += Math.min(2, wraps);
    features.push(`wraparound:${wraps}`);
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    score += 2;
    features.push("two-stage-indexed-composition");
    if ((context.baseShift ?? 1) === 2) {
      score += 1;
      features.push("indexed-base-2");
    }
  } else if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    score += 1;
    features.push("two-stage-uniform-composition");
    if (Math.abs(context.shift ?? 1) === 2) {
      score += 1;
      features.push("uniform-shift-magnitude-2");
    }
  } else if (ruleId === "MIXED_CLASS_CODE") {
    const transitions = pairwiseTransitions(target);
    score += Math.min(3, Math.floor(transitions / 2));
    features.push(`class-switches:${transitions}`);
  } else if (target.length >= 7) {
    score += 1;
    features.push("long-sort");
  }
  const difficulty: SourceGapDifficulty = score <= 2 ? "EASY" : score <= 6 ? "MEDIUM" : "HARD";
  return { score, difficulty, features };
}

function reverseThenIndexed(word: string, context: SourceGapContext): string {
  const base = context.baseShift ?? 1;
  const direction = context.direction ?? -1;
  return [...word].reverse().map((letter, index) => shiftLetter(letter, direction * (base + index))).join("");
}

function indexedWithoutReverse(word: string, context: SourceGapContext): string {
  const base = context.baseShift ?? 1;
  const direction = context.direction ?? -1;
  return [...word].map((letter, index) => shiftLetter(letter, direction * (base + index))).join("");
}

function mixedPartial(word: string, context: SourceGapContext, leaveVowels: boolean): string {
  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  const vowelOrder = "AEIOU";
  return [...word].map((letter) => {
    const index = vowelOrder.indexOf(letter);
    if (index >= 0) {
      if (leaveVowels) return letter;
      return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? String(index + 1) : String(5 - index);
    }
    if (!leaveVowels) return letter;
    return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? shiftLetter(letter, -1) : oppositeLetter(letter);
  }).join("");
}

function addDistractor(list: SourceGapV2Distractor[], value: string, provenance: SourceGapDistractorProvenance, correct: string): void {
  if (value !== correct && !list.some((item) => item.value === value)) list.push({ value, provenance });
}

export function misconceptionDistractors(ruleId: SourceGapRuleId, context: SourceGapContext, target: string, correct: string): readonly SourceGapV2Distractor[] {
  const result: SourceGapV2Distractor[] = [];
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    const sorted = [...target].sort().join("");
    addDistractor(result, [...sorted].reverse().join(""), "DESCENDING_SORT", correct);
    addDistractor(result, [...target].reverse().join(""), "REVERSE_SOURCE", correct);
    addDistractor(result, sorted.slice(1) + sorted[0]!, "ROTATE_SORTED", correct);
    return result;
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const wrongDirection: SourceGapContext = { ...context, direction: (context.direction ?? -1) === 1 ? -1 : 1 };
    const wrongBase: SourceGapContext = { ...context, baseShift: (context.baseShift ?? 1) === 1 ? 2 : 1 };
    addDistractor(result, reverseThenIndexed(target, context), "REVERSE_THEN_INDEXED", correct);
    addDistractor(result, transformSourceGapRule(ruleId, wrongDirection, target), "WRONG_INDEX_DIRECTION", correct);
    addDistractor(result, transformSourceGapRule(ruleId, wrongBase, target), "WRONG_INDEX_BASE", correct);
    addDistractor(result, indexedWithoutReverse(target, context), "INDEXED_WITHOUT_REVERSE", correct);
    return result;
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    addDistractor(result, [...target].reverse().join(""), "REVERSE_ONLY", correct);
    addDistractor(result, [...target].map((letter) => shiftLetter(letter, shift)).join(""), "UNIFORM_SHIFT_ONLY", correct);
    addDistractor(result, transformSourceGapRule(ruleId, { shift: (-shift) as -2 | -1 | 1 | 2 }, target), "OPPOSITE_SHIFT_DIRECTION", correct);
    const wrongMagnitude = shift > 0 ? (shift === 1 ? 2 : 1) : (shift === -1 ? -2 : -1);
    addDistractor(result, transformSourceGapRule(ruleId, { shift: wrongMagnitude as -2 | -1 | 1 | 2 }, target), "WRONG_SHIFT_MAGNITUDE", correct);
    return result;
  }
  const otherContext: SourceGapContext = {
    mixedVariant: context.mixedVariant === "VOWEL_INDEX_CONSONANT_PREVIOUS"
      ? "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE"
      : "VOWEL_INDEX_CONSONANT_PREVIOUS",
  };
  addDistractor(result, transformSourceGapRule("MIXED_CLASS_CODE", otherContext, target), "OTHER_MIXED_CLASS_VARIANT", correct);
  addDistractor(result, mixedPartial(target, context, true), "VOWELS_UNCHANGED", correct);
  addDistractor(result, mixedPartial(target, context, false), "CONSONANTS_UNCHANGED", correct);
  addDistractor(result, [...target].map(oppositeLetter).join(""), "OPPOSITE_ALL_LETTERS", correct);
  return result;
}

function buildOptions(correct: string, distractors: readonly SourceGapV2Distractor[], seed: number): readonly string[] {
  if (distractors.length < 3) throw new Error("Source-gap V2 requires three misconception-grounded distractors");
  const values = [correct, ...distractors.slice(0, 3).map((item) => item.value)];
  const offset = hash(seed * 37 + correct.length * 11) % 4;
  return values.map((_, index) => values[(index + offset) % 4]!);
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value).replace("-", "−");
}

function explanationFor(ruleId: SourceGapRuleId, context: SourceGapContext, evidence: readonly SourceGapEvidence[], target: string, answer: string, distractors: readonly SourceGapV2Distractor[]): SourceGapV2Explanation {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    return {
      rule: "Arrange the letters in alphabetical order.",
      steps: [`From ${evidence[0]!.source} → ${evidence[0]!.code}, the letters are arranged from A to Z.`, `Applying the same rule: ${target} → ${answer}.`],
      working: [`Original: ${[...target].join(" ")}`, `A to Z:  ${[...answer].join(" ")}`],
    };
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const base = context.baseShift ?? 1;
    const direction = context.direction ?? -1;
    const intermediate = indexedWithoutReverse(target, context);
    const moves = [...target].map((_, index) => signed(direction * (base + index))).join(", ");
    return {
      rule: `Move successive letters by ${moves}, then reverse the result.`,
      steps: [`First apply the position-wise shifts: ${target} → ${intermediate}.`, `Then reverse the shifted sequence: ${intermediate} → ${answer}.`],
      working: [`Original:     ${[...target].join(" ")}`, `After shifts: ${[...intermediate].join(" ")}`, `Final code:   ${[...answer].join(" ")}`],
      caution: distractors.some((item) => item.provenance === "REVERSE_THEN_INDEXED") ? "The reversal is done after the indexed shifts, not before them." : undefined,
    };
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    const reversed = [...target].reverse().join("");
    return {
      rule: `Reverse the word, then move every letter by ${signed(shift)}.`,
      steps: [`Reverse the word: ${target} → ${reversed}.`, `Apply ${signed(shift)} to every reversed letter: ${reversed} → ${answer}.`],
      working: [`Original: ${[...target].join(" ")}`, `Reversed: ${[...reversed].join(" ")}`, `Code:     ${[...answer].join(" ")}`],
    };
  }
  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  const mapping = variant === "VOWEL_INDEX_CONSONANT_PREVIOUS"
    ? "Vowels use A=1, E=2, I=3, O=4, U=5; each consonant moves one letter backward."
    : "Vowels use A=5, E=4, I=3, O=2, U=1; each consonant is replaced by its opposite alphabet letter.";
  const tokenWorking = [...target].map((letter, index) => `${letter}→${[...answer][index]!}`).join(", ");
  return {
    rule: mapping,
    steps: [`Separate vowels and consonants in ${target}.`, `Apply the correct mapping to each letter: ${tokenWorking}.`, `Therefore, ${target} → ${answer}.`],
    working: [`Source: ${[...target].join("  ")}`, `Code:   ${[...answer].join("  ")}`],
  };
}

function stemFor(evidence: readonly SourceGapEvidence[], target: string, seed: number): string {
  const [first, second] = evidence;
  const leads = ["In a certain code language", "In a code language", "In a certain coding system"] as const;
  const verbs = ["is coded as", "is written as"] as const;
  const lead = leads[Math.abs(seed) % leads.length]!;
  const verb = verbs[Math.abs(seed >> 1) % verbs.length]!;
  return `${lead}, '${first!.source}' ${verb} '${first!.code}' and '${second!.source}' ${verb} '${second!.code}'. How will '${target}' be coded in the same language?`;
}

export function generateSourceGapV2(ruleId: SourceGapRuleId, seed = 0): SourceGapV2Question {
  const context = contextForSeed(ruleId, seed);
  const words = findUnambiguousWords(ruleId, context, seed);
  const evidence = evidenceFor(ruleId, context, words);
  const targetWord = words[2];
  const targetCode = transformSourceGapRule(ruleId, context, targetWord);
  const allDistractors = misconceptionDistractors(ruleId, context, targetWord, targetCode);
  if (allDistractors.length < 3) throw new Error(`Insufficient misconception distractors for ${ruleId}/${seed}`);
  const selectedDistractors = allDistractors.slice(0, 3);
  const options = buildOptions(targetCode, selectedDistractors, seed);
  const correctIndex = options.indexOf(targetCode);
  const difficulty = scoreSourceGapDifficulty(ruleId, context, evidence, targetWord);
  return {
    prototypeId: `COD-SG-V2-${ruleId}-${String(seed).padStart(5, "0")}`,
    permanentQlId: null,
    packageId: "COD-001",
    ownerCheckpoint: ownerCheckpoint(ruleId),
    ruleId,
    context,
    seed,
    locale: "en-IN",
    difficulty: difficulty.difficulty,
    difficultyScore: difficulty.score,
    difficultyFeatures: difficulty.features,
    stem: stemFor(evidence, targetWord, seed),
    evidence,
    targetWord,
    targetCode,
    options,
    correctIndex,
    distractors: selectedDistractors,
    explanation: explanationFor(ruleId, context, evidence, targetWord, targetCode, selectedDistractors),
    metadata: {
      maturity: "SOURCE_GAP_V2_CANDIDATE",
      reviewOnly: true,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      inferredCandidateCount: 1,
      arbitraryFallbackUsed: false,
    },
  };
}

export function generateSourceGapV2Matrix(seedsPerRule = 240): readonly SourceGapV2Question[] {
  return RULES.flatMap((ruleId) => Array.from({ length: seedsPerRule }, (_, seed) => generateSourceGapV2(ruleId, seed)));
}

export const COD_SOURCE_GAP_V2_RULES = RULES;
