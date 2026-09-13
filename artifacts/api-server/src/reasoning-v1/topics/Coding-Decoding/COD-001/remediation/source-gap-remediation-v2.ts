import {
  COD_SOURCE_GAP_RULES,
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

export type SourceGapDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SourceGapV2Explanation {
  coreRule: string;
  stepByStep: readonly string[];
  visualAlignment: readonly string[];
  caution?: string;
}

export interface SourceGapV2Question {
  prototypeId: string;
  permanentQlId: null;
  packageId: "COD-001";
  ownerCheckpoint: SourceGapOwnerCheckpoint;
  ruleId: SourceGapRuleId;
  context: SourceGapContext;
  seed: number;
  locale: "en-IN";
  difficulty: SourceGapDifficulty;
  stem: string;
  evidence: readonly SourceGapEvidence[];
  targetWord: string;
  targetCode: string;
  options: readonly string[];
  optionProvenance: readonly string[];
  correctIndex: number;
  explanation: SourceGapV2Explanation;
  metadata: {
    maturity: "SOURCE_GAP_REMEDIATION_V2";
    reviewOnly: true;
    publiclyPublishable: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    mockTestEligible: false;
    inferredCandidateCount: 1;
    difficultyScore: number;
    sourcePoolSize: number;
    misconceptionDistractorCount: 3;
    fallbackDistractorUsed: false;
  };
}

interface DistractorCandidate {
  value: string;
  provenance: string;
}

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const COD_SOURCE_GAP_GOVERNED_WORDS = Object.freeze([
  "ABLE", "ACORN", "ACTOR", "ADMIT", "ADULT", "AFTER", "AGENT", "AGILE", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE", "AMBER", "AMONG", "ANGEL", "ANGLE", "APPLE", "APRON", "ARGUE", "ARISE", "ARMOR", "ARROW", "ASIDE", "AUDIO", "AVOID", "AWAKE", "AWARD", "AWARE",
  "BASIC", "BEACH", "BEARD", "BEGIN", "BELOW", "BENCH", "BERRY", "BLACK", "BLADE", "BLAME", "BLEND", "BLIND", "BLOCK", "BLOOM", "BOARD", "BRAIN", "BRAND", "BRAVE", "BREAD", "BREAK", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BRUSH", "BUILD",
  "CABIN", "CABLE", "CAMEL", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHARM", "CHART", "CHASE", "CHEAP", "CHEER", "CHEST", "CHILD", "CLEAN", "CLEAR", "CLERK", "CLIMB", "CLOCK", "CLOSE", "CLOTH", "CLOUD", "COACH", "COAST", "COLOR", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRANE", "CRASH", "CREAM", "CROWN", "CURVE",
  "DAILY", "DANCE", "DEALT", "DELAY", "DEPTH", "DIARY", "DIGIT", "DOUBT", "DOZEN", "DRAFT", "DREAM", "DRESS", "DRINK", "DRIVE",
  "EAGER", "EARTH", "EIGHT", "ELBOW", "ELDER", "ELECT", "EMPTY", "ENJOY", "ENTRY", "EQUAL", "EVENT", "EVERY", "EXACT", "EXTRA",
  "FAITH", "FALSE", "FANCY", "FARMER", "FAVOR", "FIELD", "FINAL", "FIRST", "FLAME", "FLOOR", "FLOUR", "FOCUS", "FORCE", "FRAME", "FRESH", "FRONT", "FRUIT",
  "GIANT", "GIVEN", "GLASS", "GLOBE", "GLORY", "GRACE", "GRADE", "GRAND", "GRAPE", "GRAPH", "GRASS", "GREEN", "GROUP", "GUARD", "GUESS", "GUIDE",
  "HABIT", "HAPPY", "HEART", "HEAVY", "HONEY", "HORSE", "HOUSE", "HUMAN",
  "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "IVORY",
  "JELLY", "JOINT", "JUDGE", "JUICE",
  "KNEEL", "KNIFE", "KNOCK", "KNOWN",
  "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEAST", "LIGHT", "LIMIT", "LOCAL", "LODGE", "LOGIC", "LOVER", "LOWER", "LUCKY", "LUNCH",
  "MAGIC", "MAJOR", "MAKER", "MANGO", "MAPLE", "MARCH", "MATCH", "MAYOR", "METAL", "METER", "MIGHT", "MINOR", "MODEL", "MONEY", "MONTH", "MOTOR", "MOUSE", "MOUTH", "MOVIE", "MUSIC",
  "NAIVE", "NERVE", "NIGHT", "NOISE", "NORTH", "NOVEL", "NURSE",
  "OCEAN", "OFFER", "OFTEN", "OLIVE", "OPERA", "ORDER", "OTHER", "OUNCE", "OUTER", "OWNER",
  "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PEARL", "PHASE", "PHONE", "PIANO", "PIECE", "PILOT", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POWER", "PRESS", "PRICE", "PRIME", "PRINT", "PROUD",
  "QUEEN", "QUICK", "QUIET",
  "RADIO", "RAISE", "RANGE", "RAPID", "REACH", "READY", "RIVER", "ROUGH", "ROUND", "ROUTE", "ROYAL",
  "SCALE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHADE", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHORT", "SIGHT", "SINCE", "SKILL", "SLEEP", "SMALL", "SMART", "SMILE", "SOLAR", "SOLID", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPELL", "SPEND", "SPICE", "SPIRE", "SPOON", "SPORT", "STAGE", "STAIR", "STAKE", "STAND", "START", "STEAM", "STEEL", "STILL", "STONE", "STORE", "STORM", "STORY", "STRIP", "STUDY", "STYLE", "SUGAR", "SWEET",
  "TABLE", "TASTE", "TEACH", "THANK", "THEIR", "THEME", "THERE", "THICK", "THING", "THINK", "THREE", "TIGER", "TITLE", "TOAST", "TODAY", "TOKEN", "TOTAL", "TOUCH", "TOWER", "TRACE", "TRACK", "TRADE", "TRAIN", "TREAT", "TREND", "TRIAL", "TRUCK", "TRULY",
  "UNION", "UNITY", "UPPER", "URBAN", "USAGE",
  "VALID", "VALUE", "VIDEO", "VISIT", "VITAL", "VOICE",
  "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHITE", "WHOLE", "WOMAN", "WORLD", "WORTH", "WRITE", "WRONG",
  "YEARN", "YOUNG", "YOUTH", "ZEBRA",
  "BEHOLD", "INDEED", "COURSE", "PLIERS", "SHOVEL", "WRENCH", "NAME", "NANO", "NAIL", "STATUE", "CATHODE", "RELATION",
] as const);

const RULES = COD_SOURCE_GAP_RULES;

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
    mixedVariant: seed % 2 === 0 ? "VOWEL_INDEX_CONSONANT_PREVIOUS" : "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE",
  };
}

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function hasVowel(word: string): boolean {
  return [...word].some((letter) => VOWELS.has(letter));
}

function hasConsonant(word: string): boolean {
  return [...word].some((letter) => !VOWELS.has(letter));
}

function eligibleWord(ruleId: SourceGapRuleId, word: string): boolean {
  if (!/^[A-Z]{4,8}$/u.test(word)) return false;
  if (ruleId === "MIXED_CLASS_CODE" && !(hasVowel(word) && hasConsonant(word))) return false;
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT" && [...word].sort().join("") === word) return false;
  return true;
}

export function governedSourcePool(ruleId: SourceGapRuleId): readonly string[] {
  return COD_SOURCE_GAP_GOVERNED_WORDS.filter((word) => eligibleWord(ruleId, word));
}

function selectThree(pool: readonly string[], seed: number, attempt: number): readonly [string, string, string] {
  const size = pool.length;
  const indexes = [
    mix32(seed * 1009 + attempt * 9176 + 11) % size,
    mix32(seed * 2027 + attempt * 6151 + 29) % size,
    mix32(seed * 4051 + attempt * 3253 + 47) % size,
  ];
  while (indexes[1] === indexes[0]) indexes[1] = (indexes[1] + 1) % size;
  while (indexes[2] === indexes[0] || indexes[2] === indexes[1]) indexes[2] = (indexes[2] + 1) % size;
  return [pool[indexes[0]!]!, pool[indexes[1]!]!, pool[indexes[2]!]!];
}

function evidenceFor(ruleId: SourceGapRuleId, context: SourceGapContext, words: readonly [string, string, string]): readonly SourceGapEvidence[] {
  return words.slice(0, 2).map((source) => ({ source, code: transformSourceGapRule(ruleId, context, source) }));
}

function pairSwap(word: string): string {
  const chars = [...word];
  for (let index = 0; index + 1 < chars.length; index += 2) {
    [chars[index], chars[index + 1]] = [chars[index + 1]!, chars[index]!];
  }
  return chars.join("");
}

function rotateLeft(word: string): string {
  return word.length < 2 ? word : `${word.slice(1)}${word[0]}`;
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

function mixedPartial(word: string, context: SourceGapContext, encodeVowels: boolean, encodeConsonants: boolean): string {
  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  return [...word].map((letter) => {
    if (VOWELS.has(letter)) {
      if (!encodeVowels) return letter;
      const index = "AEIOU".indexOf(letter) + 1;
      return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? String(index) : String(6 - index);
    }
    if (!encodeConsonants) return letter;
    return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? shiftLetter(letter, -1) : oppositeLetter(letter);
  }).join("");
}

function misconceptionCandidates(ruleId: SourceGapRuleId, context: SourceGapContext, target: string): readonly DistractorCandidate[] {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    const sorted = [...target].sort().join("");
    return [
      { value: [...sorted].reverse().join(""), provenance: "MISCONCEPTION:DESCENDING_SORT" },
      { value: [...target].reverse().join(""), provenance: "MISCONCEPTION:REVERSE_SOURCE" },
      { value: pairSwap(target), provenance: "MISCONCEPTION:PAIR_SWAP_SOURCE" },
      { value: rotateLeft(sorted), provenance: "MISCONCEPTION:ROTATE_SORTED_RESULT" },
      { value: target, provenance: "MISCONCEPTION:LEAVE_SOURCE_UNCHANGED" },
    ];
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const wrongDirection: SourceGapContext = { ...context, direction: (context.direction ?? -1) === 1 ? -1 : 1 };
    const wrongBase: SourceGapContext = { ...context, baseShift: (context.baseShift ?? 1) === 1 ? 2 : 1 };
    return [
      { value: reverseThenIndexed(target, context), provenance: "MISCONCEPTION:REVERSE_BEFORE_INDEXED_SHIFT" },
      { value: transformSourceGapRule(ruleId, wrongDirection, target), provenance: "MISCONCEPTION:WRONG_SHIFT_DIRECTION" },
      { value: transformSourceGapRule(ruleId, wrongBase, target), provenance: "MISCONCEPTION:WRONG_STARTING_SHIFT" },
      { value: indexedWithoutReverse(target, context), provenance: "MISCONCEPTION:OMIT_FINAL_REVERSE" },
      { value: [...target].reverse().join(""), provenance: "MISCONCEPTION:REVERSE_ONLY" },
    ];
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    const wrongMagnitude = shift > 0 ? (shift === 1 ? 2 : 1) : (shift === -1 ? -2 : -1);
    return [
      { value: [...target].reverse().join(""), provenance: "MISCONCEPTION:REVERSE_ONLY" },
      { value: [...target].map((letter) => shiftLetter(letter, shift)).join(""), provenance: "MISCONCEPTION:SHIFT_WITHOUT_REVERSE" },
      { value: transformSourceGapRule(ruleId, { shift: (-shift) as -2 | -1 | 1 | 2 }, target), provenance: "MISCONCEPTION:WRONG_SHIFT_DIRECTION" },
      { value: transformSourceGapRule(ruleId, { shift: wrongMagnitude as -2 | -1 | 1 | 2 }, target), provenance: "MISCONCEPTION:WRONG_SHIFT_MAGNITUDE" },
      { value: target, provenance: "MISCONCEPTION:LEAVE_SOURCE_UNCHANGED" },
    ];
  }
  const otherVariant: SourceGapContext = {
    mixedVariant: context.mixedVariant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" : "VOWEL_INDEX_CONSONANT_PREVIOUS",
  };
  return [
    { value: transformSourceGapRule("MIXED_CLASS_CODE", otherVariant, target), provenance: "MISCONCEPTION:USE_OTHER_CLASS_MAPPING" },
    { value: mixedPartial(target, context, false, true), provenance: "MISCONCEPTION:LEAVE_VOWELS_UNCHANGED" },
    { value: mixedPartial(target, context, true, false), provenance: "MISCONCEPTION:LEAVE_CONSONANTS_UNCHANGED" },
    { value: [...target].map((letter) => oppositeLetter(letter)).join(""), provenance: "MISCONCEPTION:OPPOSITE_ALL_LETTERS" },
    { value: [...target].map((letter) => shiftLetter(letter, -1)).join(""), provenance: "MISCONCEPTION:PREVIOUS_ALL_LETTERS" },
  ];
}

function distinctDistractors(ruleId: SourceGapRuleId, context: SourceGapContext, target: string, correct: string): readonly DistractorCandidate[] {
  const seen = new Set([correct]);
  const output: DistractorCandidate[] = [];
  for (const candidate of misconceptionCandidates(ruleId, context, target)) {
    if (!seen.has(candidate.value)) {
      seen.add(candidate.value);
      output.push(candidate);
    }
  }
  return output;
}

function constructionFor(ruleId: SourceGapRuleId, context: SourceGapContext, seed: number): {
  words: readonly [string, string, string]; evidence: readonly SourceGapEvidence[]; distractors: readonly DistractorCandidate[];
} {
  const pool = governedSourcePool(ruleId);
  const intended = candidateKey({ ruleId, context });
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const words = selectThree(pool, seed, attempt);
    const evidence = evidenceFor(ruleId, context, words);
    const candidates = inferSourceGapCandidates(evidence);
    const target = words[2];
    const correct = transformSourceGapRule(ruleId, context, target);
    if (correct === target) continue;
    if (candidates.length !== 1 || candidateKey(candidates[0]!) !== intended) continue;
    const distractors = distinctDistractors(ruleId, context, target, correct);
    if (distractors.length < 3) continue;
    return { words, evidence, distractors };
  }
  throw new Error(`Could not build misconception-complete ${ruleId} question for seed ${seed}`);
}

function alphabetRank(letter: string): number { return ALPHABET.indexOf(letter); }

function wraparoundCount(ruleId: SourceGapRuleId, context: SourceGapContext, target: string): number {
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const baseShift = context.baseShift ?? 1;
    const direction = context.direction ?? -1;
    return [...target].filter((letter, index) => {
      const raw = alphabetRank(letter) + direction * (baseShift + index);
      return raw < 0 || raw >= 26;
    }).length;
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    return [...target].filter((letter) => {
      const raw = alphabetRank(letter) + shift;
      return raw < 0 || raw >= 26;
    }).length;
  }
  return 0;
}

function classSwitchCount(target: string): number {
  const classes = [...target].map((letter) => VOWELS.has(letter) ? "V" : "C");
  let switches = 0;
  for (let index = 1; index < classes.length; index += 1) if (classes[index] !== classes[index - 1]) switches += 1;
  return switches;
}

export function scoreSourceGapDifficulty(ruleId: SourceGapRuleId, context: SourceGapContext, target: string, evidence: readonly SourceGapEvidence[]): { score: number; difficulty: SourceGapDifficulty } {
  let score = 0;
  if (target.length === 6) score += 1;
  else if (target.length >= 7) score += 2;
  const repeats = target.length - new Set(target).size;
  if (repeats >= 1) score += 1;
  if (repeats >= 2) score += 1;
  if (evidence.filter((row) => row.source.length >= 7).length === 2) score += 1;

  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    const sorted = [...target].sort();
    const displacement = [...target].filter((letter, index) => letter !== sorted[index]).length;
    if (displacement >= Math.ceil(target.length * 0.7)) score += 1;
  } else if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    if ((context.baseShift ?? 1) === 2) score += 1;
    const wraps = wraparoundCount(ruleId, context, target);
    if (wraps >= 1) score += 1;
    if (wraps >= 2) score += 1;
  } else if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    if (Math.abs(context.shift ?? 1) === 2) score += 1;
    if (wraparoundCount(ruleId, context, target) >= 1) score += 1;
  } else {
    const switches = classSwitchCount(target);
    const vowels = [...target].filter((letter) => VOWELS.has(letter)).length;
    if (switches >= 2) score += 1;
    if (switches >= 4) score += 1;
    if (vowels >= 3) score += 1;
    if (context.mixedVariant === "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE") score += 1;
  }
  return { score, difficulty: score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD" };
}

function signed(value: number): string { return value > 0 ? `+${value}` : String(value).replace("-", "−"); }

function explanationFor(ruleId: SourceGapRuleId, context: SourceGapContext, evidence: readonly SourceGapEvidence[], target: string, answer: string, chosenDistractors: readonly DistractorCandidate[]): SourceGapV2Explanation {
  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    return {
      coreRule: "Arrange the letters of each word in English alphabetical order.",
      stepByStep: [`${evidence[0]!.source} becomes ${evidence[0]!.code}; the letters are in A-to-Z order.`, `Arrange the letters of ${target} in the same way: ${answer}.`],
      visualAlignment: [`Word:   ${[...target].join(" ")}`, `Code:   ${[...answer].join(" ")}`],
    };
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const base = context.baseShift ?? 1;
    const direction = context.direction ?? -1;
    const intermediate = indexedWithoutReverse(target, context);
    const moves = [...target].map((_, index) => signed(direction * (base + index))).join(", ");
    return {
      coreRule: `Move the letters successively by ${moves}, then reverse the result.`,
      stepByStep: [`Apply the position-wise shifts to ${target}: ${intermediate}.`, `Reverse ${intermediate}: ${answer}.`],
      visualAlignment: [`Start:   ${[...target].join(" ")}`, `Shifted: ${[...intermediate].join(" ")}`, `Code:    ${[...answer].join(" ")}`],
      caution: chosenDistractors.some((item) => item.provenance === "MISCONCEPTION:REVERSE_BEFORE_INDEXED_SHIFT") ? "The shift is applied before reversal; changing the order of these two steps gives a different code." : undefined,
    };
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = context.shift ?? 1;
    const reversed = [...target].reverse().join("");
    return {
      coreRule: `Reverse the word, then move every letter by ${signed(shift)} in the alphabet.`,
      stepByStep: [`Reverse ${target}: ${reversed}.`, `Move every letter of ${reversed} by ${signed(shift)}: ${answer}.`],
      visualAlignment: [`Start:    ${[...target].join(" ")}`, `Reversed: ${[...reversed].join(" ")}`, `Code:     ${[...answer].join(" ")}`],
    };
  }
  const variant = context.mixedVariant ?? "VOWEL_INDEX_CONSONANT_PREVIOUS";
  const tokenWorking = [...target].map((letter, index) => `${letter}→${[...answer][index] ?? "?"}`).join(", ");
  const rule = variant === "VOWEL_INDEX_CONSONANT_PREVIOUS" ? "Use A=1, E=2, I=3, O=4, U=5 for vowels; replace each consonant by the previous alphabet letter." : "Use A=5, E=4, I=3, O=2, U=1 for vowels; replace each consonant by its opposite alphabet letter.";
  return {
    coreRule: rule,
    stepByStep: [`Classify the letters of ${target} as vowels or consonants.`, `${tokenWorking}.`, `Therefore, ${target} is coded as ${answer}.`],
    visualAlignment: [`Word: ${[...target].join("  ")}`, `Code: ${[...answer].join("  ")}`],
    caution: chosenDistractors.some((item) => item.provenance === "MISCONCEPTION:USE_OTHER_CLASS_MAPPING") ? "Use the mapping shown by the examples; do not mix it with the other vowel/consonant coding pattern." : undefined,
  };
}

function stemFor(evidence: readonly SourceGapEvidence[], target: string, seed: number): string {
  const [first, second] = evidence;
  const leads = ["In a certain code language", "In a code language", "In a certain coding system"] as const;
  const verbs = ["is written as", "is coded as"] as const;
  const lead = leads[Math.abs(seed) % leads.length]!;
  const verb = verbs[Math.abs(seed) % verbs.length]!;
  return `${lead}, '${first!.source}' ${verb} '${first!.code}' and '${second!.source}' ${verb} '${second!.code}'. How will '${target}' be coded in the same language?`;
}

function buildOptions(ruleId: SourceGapRuleId, seed: number, correct: string, distractors: readonly DistractorCandidate[]): { options: readonly string[]; provenance: readonly string[]; correctIndex: number; chosen: readonly DistractorCandidate[] } {
  const chosen = distractors.slice(0, 3);
  if (chosen.length !== 3) throw new Error(`Insufficient misconception distractors for ${ruleId} seed ${seed}`);
  const entries = [{ value: correct, provenance: "CORRECT" }, ...chosen];
  const rotation = mix32(seed * 8191 + ruleId.length * 131) % 4;
  const rotated = entries.map((_, index) => entries[(index + rotation) % entries.length]!);
  return { options: rotated.map((entry) => entry.value), provenance: rotated.map((entry) => entry.provenance), correctIndex: rotated.findIndex((entry) => entry.provenance === "CORRECT"), chosen };
}

export function generateSourceGapV2Question(ruleId: SourceGapRuleId, seed = 0): SourceGapV2Question {
  const context = contextForSeed(ruleId, seed);
  const construction = constructionFor(ruleId, context, seed);
  const targetWord = construction.words[2];
  const targetCode = transformSourceGapRule(ruleId, context, targetWord);
  const builtOptions = buildOptions(ruleId, seed, targetCode, construction.distractors);
  const difficulty = scoreSourceGapDifficulty(ruleId, context, targetWord, construction.evidence);
  const pool = governedSourcePool(ruleId);
  return {
    prototypeId: `COD-SG-V2-${ruleId}-${String(seed).padStart(4, "0")}`,
    permanentQlId: null,
    packageId: "COD-001",
    ownerCheckpoint: ownerCheckpoint(ruleId),
    ruleId,
    context,
    seed,
    locale: "en-IN",
    difficulty: difficulty.difficulty,
    stem: stemFor(construction.evidence, targetWord, seed),
    evidence: construction.evidence,
    targetWord,
    targetCode,
    options: builtOptions.options,
    optionProvenance: builtOptions.provenance,
    correctIndex: builtOptions.correctIndex,
    explanation: explanationFor(ruleId, context, construction.evidence, targetWord, targetCode, builtOptions.chosen),
    metadata: {
      maturity: "SOURCE_GAP_REMEDIATION_V2",
      reviewOnly: true,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      inferredCandidateCount: 1,
      difficultyScore: difficulty.score,
      sourcePoolSize: pool.length,
      misconceptionDistractorCount: 3,
      fallbackDistractorUsed: false,
    },
  };
}

export function generateSourceGapV2Matrix(seedsPerRule = 240): readonly SourceGapV2Question[] {
  return RULES.flatMap((ruleId) => Array.from({ length: seedsPerRule }, (_, seed) => generateSourceGapV2Question(ruleId, seed)));
}

export const COD_SOURCE_GAP_V2_RULES = RULES;
