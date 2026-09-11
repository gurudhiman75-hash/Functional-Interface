export type SourceGapRuleId =
  | "ALPHABETICAL_ASCENDING_SORT"
  | "INDEXED_SHIFT_THEN_REVERSE"
  | "REVERSE_THEN_UNIFORM_SHIFT"
  | "MIXED_CLASS_CODE";

export type SourceGapOwnerCheckpoint = "COD-CP-005" | "COD-CP-006" | "COD-CP-007";

export interface SourceGapContext {
  baseShift?: 1 | 2;
  direction?: 1 | -1;
  shift?: -2 | -1 | 1 | 2;
  mixedVariant?: "VOWEL_INDEX_CONSONANT_PREVIOUS" | "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE";
}

export interface SourceGapEvidence {
  source: string;
  code: string;
}

export interface SourceGapCandidate {
  ruleId: SourceGapRuleId;
  context: SourceGapContext;
}

export interface SourceGapExplanation {
  coreRule: string;
  stepByStep: readonly string[];
  visualAlignment: readonly string[];
  examShortcut: string;
  commonTrap: string;
}

export interface SourceGapPrototypeQuestion {
  prototypeId: string;
  permanentQlId: null;
  packageId: "COD-001";
  ownerCheckpoint: SourceGapOwnerCheckpoint;
  ruleId: SourceGapRuleId;
  context: SourceGapContext;
  seed: number;
  locale: "en-IN";
  difficulty: "MEDIUM" | "HARD";
  stem: string;
  evidence: readonly SourceGapEvidence[];
  targetWord: string;
  targetCode: string;
  options: readonly string[];
  correctIndex: number;
  explanation: SourceGapExplanation;
  metadata: {
    maturity: "SOURCE_GAP_PROTOTYPE";
    reviewOnly: true;
    publiclyPublishable: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    mockTestEligible: false;
    inferredCandidateCount: 1;
  };
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOWELS = "AEIOU";

const GENERAL_WORDS = [
  "COURSE", "BEHOLD", "INDEED", "MARKET", "PLANET", "STREAM", "BRIDGE", "SILVER",
  "GARDEN", "TABLE", "CLOUD", "BRIGHT", "MANGO", "WINTER", "NATURE", "FOREST",
  "RIVER", "SCHOOL", "PRAYER", "WRENCH", "PLIERS", "SHOVEL", "NAME", "NANO",
  "NAIL", "HONEY", "STATUE", "CATHODE", "RELATION", "FLOWER", "MAGIC", "STONE",
] as const;

const RULES: readonly SourceGapRuleId[] = [
  "ALPHABETICAL_ASCENDING_SORT",
  "INDEXED_SHIFT_THEN_REVERSE",
  "REVERSE_THEN_UNIFORM_SHIFT",
  "MIXED_CLASS_CODE",
];

function rank(letter: string): number {
  const value = ALPHABET.indexOf(letter);
  if (value < 0) throw new Error(`Unsupported letter '${letter}'`);
  return value;
}

export function shiftLetter(letter: string, shift: number): string {
  return ALPHABET[(rank(letter) + shift % 26 + 26) % 26]!;
}

export function oppositeLetter(letter: string): string {
  return ALPHABET[25 - rank(letter)]!;
}

function vowelIndex(letter: string): number | undefined {
  const index = VOWELS.indexOf(letter);
  return index < 0 ? undefined : index + 1;
}

function contextKey(context: SourceGapContext): string {
  return JSON.stringify(Object.fromEntries(Object.entries(context).sort(([a], [b]) => a.localeCompare(b))));
}

export function candidateKey(candidate: SourceGapCandidate): string {
  return `${candidate.ruleId}:${contextKey(candidate.context)}`;
}

export function transformSourceGapRule(ruleId: SourceGapRuleId, context: SourceGapContext, word: string): string {
  const source = word.toUpperCase();
  switch (ruleId) {
    case "ALPHABETICAL_ASCENDING_SORT":
      return [...source].sort().join("");

    case "INDEXED_SHIFT_THEN_REVERSE": {
      const baseShift = context.baseShift ?? 1;
      const direction = context.direction ?? -1;
      const intermediate = [...source]
        .map((letter, index) => shiftLetter(letter, direction * (baseShift + index)))
        .join("");
      return [...intermediate].reverse().join("");
    }

    case "REVERSE_THEN_UNIFORM_SHIFT": {
      const shift = context.shift ?? 1;
      return [...source].reverse().map((letter) => shiftLetter(letter, shift)).join("");
    }

    case "MIXED_CLASS_CODE": {
      const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
      if (variant === "VOWEL_INDEX_CONSONANT_PREVIOUS") {
        return [...source].map((letter) => {
          const index = vowelIndex(letter);
          return index === undefined ? shiftLetter(letter, -1) : String(index);
        }).join("");
      }
      return [...source].map((letter) => {
        const index = vowelIndex(letter);
        return index === undefined ? oppositeLetter(letter) : String(6 - index);
      }).join("");
    }
  }
}

export function allSourceGapCandidates(): readonly SourceGapCandidate[] {
  const candidates: SourceGapCandidate[] = [
    { ruleId: "ALPHABETICAL_ASCENDING_SORT", context: {} },
  ];
  for (const baseShift of [1, 2] as const) {
    for (const direction of [1, -1] as const) {
      candidates.push({ ruleId: "INDEXED_SHIFT_THEN_REVERSE", context: { baseShift, direction } });
    }
  }
  for (const shift of [-2, -1, 1, 2] as const) {
    candidates.push({ ruleId: "REVERSE_THEN_UNIFORM_SHIFT", context: { shift } });
  }
  for (const mixedVariant of [
    "VOWEL_INDEX_CONSONANT_PREVIOUS",
    "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE",
  ] as const) {
    candidates.push({ ruleId: "MIXED_CLASS_CODE", context: { mixedVariant } });
  }
  return candidates;
}

export function inferSourceGapCandidates(evidence: readonly SourceGapEvidence[]): readonly SourceGapCandidate[] {
  return allSourceGapCandidates().filter((candidate) =>
    evidence.every((row) => transformSourceGapRule(candidate.ruleId, candidate.context, row.source) === row.code),
  );
}

function ownerCheckpoint(ruleId: SourceGapRuleId): SourceGapOwnerCheckpoint {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") return "COD-CP-005";
  if (ruleId === "MIXED_CLASS_CODE") return "COD-CP-007";
  return "COD-CP-006";
}

function contextForSeed(ruleId: SourceGapRuleId, seed: number): SourceGapContext {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") return {};
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    return {
      baseShift: seed % 2 === 0 ? 1 : 2,
      direction: seed % 4 < 2 ? -1 : 1,
    };
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

function sourcePool(_ruleId: SourceGapRuleId): readonly string[] {
  return GENERAL_WORDS;
}

function selectThree(pool: readonly string[], seed: number, attempt: number): readonly [string, string, string] {
  const size = pool.length;
  const value = Math.abs(seed) + attempt * 131;
  const cycle = Math.floor(value / size);
  const residue = value % size;
  const first = (residue + cycle * 3 + 1) % size;
  let second = (residue * 5 + cycle * 7 + 4) % size;
  let third = (residue * 11 + cycle * 13 + 9) % size;
  if (second === first) second = (second + 1) % size;
  while (third === first || third === second) third = (third + 1) % size;
  return [pool[first]!, pool[second]!, pool[third]!];
}

function evidenceFor(ruleId: SourceGapRuleId, context: SourceGapContext, words: readonly [string, string, string]): readonly SourceGapEvidence[] {
  return words.slice(0, 2).map((source) => ({ source, code: transformSourceGapRule(ruleId, context, source) }));
}

function findUnambiguousWords(ruleId: SourceGapRuleId, context: SourceGapContext, seed: number): readonly [string, string, string] {
  const pool = sourcePool(ruleId);
  const intended = candidateKey({ ruleId, context });
  for (let attempt = 0; attempt < pool.length * 4; attempt += 1) {
    const words = selectThree(pool, seed, attempt);
    const evidence = evidenceFor(ruleId, context, words);
    const candidates = inferSourceGapCandidates(evidence);
    const targetChanges = transformSourceGapRule(ruleId, context, words[2]) !== words[2];
    if (targetChanges && candidates.length === 1 && candidateKey(candidates[0]!) === intended) return words;
  }
  throw new Error(`Could not construct unambiguous ${ruleId} source-gap prototype for seed ${seed}`);
}

function pairSwap(word: string): string {
  const chars = [...word];
  for (let index = 0; index + 1 < chars.length; index += 2) {
    [chars[index], chars[index + 1]] = [chars[index + 1]!, chars[index]!];
  }
  return chars.join("");
}

function indexedWithoutReverse(word: string, context: SourceGapContext): string {
  const baseShift = context.baseShift ?? 1;
  const direction = context.direction ?? -1;
  return [...word].map((letter, index) => shiftLetter(letter, direction * (baseShift + index))).join("");
}

function reverseThenIndexed(word: string, context: SourceGapContext): string {
  const baseShift = context.baseShift ?? 1;
  const direction = context.direction ?? -1;
  return [...word].reverse().map((letter, index) => shiftLetter(letter, direction * (baseShift + index))).join("");
}

function mixedPartial(word: string, context: SourceGapContext, keepVowels: boolean): string {
  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  return [...word].map((letter) => {
    const index = vowelIndex(letter);
    if (index !== undefined) {
      if (keepVowels) return letter;
      return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? String(index) : String(6 - index);
    }
    if (!keepVowels) return letter;
    return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? shiftLetter(letter, -1) : oppositeLetter(letter);
  }).join("");
}

function fallbackMutation(value: string, salt: number): string {
  const chars = [...value];
  if (chars.length === 0) return "X";
  const index = Math.abs(salt) % chars.length;
  const token = chars[index]!;
  chars[index] = /^\d$/u.test(token) ? String((Number(token) + 1) % 10) : shiftLetter(token, 1);
  return chars.join("");
}

function distractorCandidates(ruleId: SourceGapRuleId, context: SourceGapContext, target: string): string[] {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    const sorted = [...target].sort().join("");
    return [
      [...sorted].reverse().join(""),
      [...target].reverse().join(""),
      pairSwap(target),
      [...target].sort().slice(1).join("") + [...target].sort()[0]!,
    ];
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const wrongDirection: SourceGapContext = { ...context, direction: (context.direction ?? -1) === 1 ? -1 : 1 };
    const wrongBase: SourceGapContext = { ...context, baseShift: (context.baseShift ?? 1) === 1 ? 2 : 1 };
    return [
      reverseThenIndexed(target, context),
      transformSourceGapRule(ruleId, wrongDirection, target),
      transformSourceGapRule(ruleId, wrongBase, target),
      indexedWithoutReverse(target, context),
    ];
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    return [
      [...target].reverse().join(""),
      [...target].map((letter) => shiftLetter(letter, shift)).join(""),
      transformSourceGapRule(ruleId, { shift: (-shift) as -2 | -1 | 1 | 2 }, target),
      [...target].reverse().map((letter) => shiftLetter(letter, shift > 0 ? Math.max(1, shift - 1) : Math.min(-1, shift + 1))).join(""),
    ];
  }
  const otherVariant: SourceGapContext = {
    mixedVariant: context.mixedVariant === "VOWEL_INDEX_CONSONANT_PREVIOUS"
      ? "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE"
      : "VOWEL_INDEX_CONSONANT_PREVIOUS",
  };
  return [
    transformSourceGapRule("MIXED_CLASS_CODE", otherVariant, target),
    mixedPartial(target, context, true),
    mixedPartial(target, context, false),
    [...target].map((letter) => oppositeLetter(letter)).join(""),
  ];
}

function buildOptions(ruleId: SourceGapRuleId, context: SourceGapContext, target: string, correct: string, seed: number): readonly string[] {
  const unique: string[] = [];
  for (const candidate of distractorCandidates(ruleId, context, target)) {
    if (candidate !== correct && !unique.includes(candidate)) unique.push(candidate);
  }
  let salt = seed;
  while (unique.length < 3) {
    const candidate = fallbackMutation(correct, salt++);
    if (candidate !== correct && !unique.includes(candidate)) unique.push(candidate);
  }
  const options = [correct, ...unique.slice(0, 3)];
  const shift = Math.abs(seed * 17 + ruleId.length * 3) % 4;
  return options.map((_, index) => options[(index + shift) % 4]!);
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value).replace("-", "−");
}

function explanationFor(ruleId: SourceGapRuleId, context: SourceGapContext, evidence: readonly SourceGapEvidence[], target: string, answer: string): SourceGapExplanation {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    return {
      coreRule: "Arrange the letters of the word in English alphabetical order.",
      stepByStep: [
        `${evidence[0]!.source} → ${evidence[0]!.code}, so the letters are being sorted alphabetically.`,
        `${target} → ${answer}.`,
      ],
      visualAlignment: [`Original: ${[...target].join(" ")}`, `Sorted:   ${[...answer].join(" ")}`],
      examShortcut: "Do not calculate letter shifts; simply sort the letters from A to Z.",
      commonTrap: "Do not reverse the word. The order is decided by alphabet value, not original position.",
    };
  }

  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const base = context.baseShift ?? 1;
    const direction = context.direction ?? -1;
    const intermediate = indexedWithoutReverse(target, context);
    const moves = [...target].map((_, index) => signed(direction * (base + index))).join(", ");
    return {
      coreRule: `Move successive letters by ${moves}, then reverse the transformed sequence.`,
      stepByStep: [
        `${target} → ${intermediate} after the position-wise shifts.`,
        `Reverse ${intermediate} → ${answer}.`,
      ],
      visualAlignment: [`Original:     ${[...target].join(" ")}`, `After shifts: ${[...intermediate].join(" ")}`, `Final code:   ${[...answer].join(" ")}`],
      examShortcut: "Complete all position-wise shifts first. Reverse only after the last letter is transformed.",
      commonTrap: "Reversing first changes which letter receives each indexed shift and gives a different code.",
    };
  }

  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    const reversed = [...target].reverse().join("");
    return {
      coreRule: `Reverse the word, then move every letter by ${signed(shift)} in the alphabet.`,
      stepByStep: [`${target} → ${reversed} after reversal.`, `${reversed} → ${answer} after applying ${signed(shift)} to every letter.`],
      visualAlignment: [`Original: ${[...target].join(" ")}`, `Reversed: ${[...reversed].join(" ")}`, `Code:     ${[...answer].join(" ")}`],
      examShortcut: `Reverse once, then apply the same ${signed(shift)} movement to each letter.`,
      commonTrap: "Using only the reversal or only the alphabet shift completes only one part of the rule.",
    };
  }

  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  const tokenWorking = [...target].map((letter, index) => `${letter}→${[...answer][index] ?? "?"}`).join(", ");
  if (variant === "VOWEL_INDEX_CONSONANT_PREVIOUS") {
    return {
      coreRule: "Write vowels as A=1, E=2, I=3, O=4, U=5; replace every consonant by the previous alphabet letter.",
      stepByStep: [`Classify each letter of ${target} as a vowel or consonant.`, `${tokenWorking}.`, `Therefore, ${target} → ${answer}.`],
      visualAlignment: [`Source: ${[...target].join("  ")}`, `Code:   ${[...answer].join("  ")}`],
      examShortcut: "Handle vowels directly as 1–5. For every remaining letter, move back by one.",
      commonTrap: "Do not shift vowels as letters; vowels become digits in this code.",
    };
  }
  return {
    coreRule: "Write vowels as A=5, E=4, I=3, O=2, U=1; replace every consonant by its opposite alphabet letter.",
    stepByStep: [`Classify each letter of ${target} as a vowel or consonant.`, `${tokenWorking}.`, `Therefore, ${target} → ${answer}.`],
    visualAlignment: [`Source: ${[...target].join("  ")}`, `Code:   ${[...answer].join("  ")}`],
    examShortcut: "For vowels use the reverse 5-to-1 vowel numbering; for consonants use A↔Z, B↔Y, C↔X, and so on.",
    commonTrap: "Do not use ordinary A1Z26 values for vowels; only the five vowels have digit codes.",
  };
}

function stemFor(evidence: readonly SourceGapEvidence[], target: string, seed: number): string {
  const [first, second] = evidence;
  const lead = seed % 3 === 0 ? "In a certain code language" : seed % 3 === 1 ? "In a code language" : "In a certain coding system";
  const verb = seed % 2 === 0 ? "is written as" : "is coded as";
  return `${lead}, '${first!.source}' ${verb} '${first!.code}' and '${second!.source}' ${verb} '${second!.code}'. How will '${target}' be coded in the same language?`;
}

export function generateSourceGapPrototype(ruleId: SourceGapRuleId, seed = 0): SourceGapPrototypeQuestion {
  const context = contextForSeed(ruleId, seed);
  const words = findUnambiguousWords(ruleId, context, seed);
  const evidence = evidenceFor(ruleId, context, words);
  const targetWord = words[2];
  const targetCode = transformSourceGapRule(ruleId, context, targetWord);
  const options = buildOptions(ruleId, context, targetWord, targetCode, seed);
  const correctIndex = options.indexOf(targetCode);
  if (correctIndex < 0) throw new Error("Correct source-gap option was lost during deterministic shuffle");

  return {
    prototypeId: `COD-SG-${ruleId}-${String(seed).padStart(4, "0")}`,
    permanentQlId: null,
    packageId: "COD-001",
    ownerCheckpoint: ownerCheckpoint(ruleId),
    ruleId,
    context,
    seed,
    locale: "en-IN",
    difficulty: ruleId === "INDEXED_SHIFT_THEN_REVERSE" ? "HARD" : "MEDIUM",
    stem: stemFor(evidence, targetWord, seed),
    evidence,
    targetWord,
    targetCode,
    options,
    correctIndex,
    explanation: explanationFor(ruleId, context, evidence, targetWord, targetCode),
    metadata: {
      maturity: "SOURCE_GAP_PROTOTYPE",
      reviewOnly: true,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      inferredCandidateCount: 1,
    },
  };
}

export function generateSourceGapPrototypeMatrix(seedsPerRule = 120): readonly SourceGapPrototypeQuestion[] {
  return RULES.flatMap((ruleId) => Array.from({ length: seedsPerRule }, (_, seed) => generateSourceGapPrototype(ruleId, seed)));
}

export const COD_SOURCE_GAP_RULES = RULES;
