import {
  CLS_CP003_JUMBLE_WORDS,
  CLS_CP003_PROTOTYPE_BY_ID,
  CLS_CP003_PROTOTYPES,
  CLS_CP003_WORDS,
} from "./word-dataset.en";
import type {
  ClsCp003AmbiguityAudit,
  ClsCp003BoundaryClass,
  ClsCp003Difficulty,
  ClsCp003DifficultyFeatures,
  ClsCp003JumbleEntry,
  ClsCp003PrototypeDefinition,
  ClsCp003PrototypeId,
  ClsCp003RepeatedTopology,
  ClsCp003RuleId,
  ClsCp003RuleSupport,
  ClsCp003WordEntry,
  ClsCp003WordFeatures,
  GeneratedClsCp003Question,
} from "./types";

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const DIRECT_RULE_IDS: readonly ClsCp003RuleId[] = [
  "WORD_LENGTH",
  "VOWEL_COUNT",
  "REPEATED_LETTER_TOPOLOGY",
  "PALINDROME_STATUS",
  "BOUNDARY_LETTER_CLASS",
  "PRIMARY_AFFIX",
];
const MAX_GENERATION_ATTEMPTS = 600;

const LIFECYCLE = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

type DirectState = {
  readonly entries: readonly ClsCp003WordEntry[];
  readonly oddWord: string;
  readonly intendedValue: string;
};

type JumbleState = {
  readonly displayed: readonly string[];
  readonly canonicalWords: readonly string[];
  readonly semanticClasses: readonly string[];
  readonly oddIndex: number;
  readonly commonClass: string;
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, salt: string): Rng {
  let state = (hashText(`${salt}:${seed}`) ^ 0x9e3779b9) >>> 0;
  if (state === 0) state = 0x6d2b79f5;
  return {
    next(): number {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0x100000000;
    },
    int(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error(`Invalid random bound: ${maxExclusive}`);
      }
      return Math.floor(this.next() * maxExclusive);
    },
  };
}

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function sampleDistinct<T>(values: readonly T[], count: number, rng: Rng): T[] {
  if (count > values.length) throw new Error(`Cannot sample ${count} values from ${values.length}`);
  return shuffled(values, rng).slice(0, count);
}

function normalizeWord(value: string): string {
  return value.toLocaleLowerCase("en-IN").replace(/[^a-z]/g, "");
}

function repeatedTopology(normalized: string): ClsCp003RepeatedTopology {
  const counts = new Map<string, number>();
  for (const letter of normalized) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  const repeatedCounts = [...counts.values()].filter((count) => count > 1);
  if (repeatedCounts.some((count) => count >= 3)) return "TRIPLE_OR_MORE";
  if (repeatedCounts.length === 0) return "ALL_UNIQUE";
  if (repeatedCounts.length === 1) return "ONE_REPEATED_LETTER";
  return "MULTIPLE_REPEATED_LETTERS";
}

function boundaryClass(normalized: string): ClsCp003BoundaryClass {
  const firstVowel = VOWELS.has(normalized[0]!);
  const lastVowel = VOWELS.has(normalized.at(-1)!);
  if (firstVowel && lastVowel) return "VOWEL_VOWEL";
  if (firstVowel) return "VOWEL_CONSONANT";
  if (lastVowel) return "CONSONANT_VOWEL";
  return "CONSONANT_CONSONANT";
}

export function analyzeClsCp003Word(
  value: string,
  primaryAffix = "NONE",
): ClsCp003WordFeatures {
  const normalized = normalizeWord(value);
  if (!normalized) throw new Error(`Word must contain English letters: ${value}`);
  const vowelCount = [...normalized].filter((letter) => VOWELS.has(letter)).length;
  return {
    normalized,
    length: normalized.length,
    vowelCount,
    consonantCount: normalized.length - vowelCount,
    repeatedTopology: repeatedTopology(normalized),
    palindrome: normalized === [...normalized].reverse().join(""),
    boundaryClass: boundaryClass(normalized),
    primaryAffix,
  };
}

const WORD_BY_NORMALIZED = new Map(
  CLS_CP003_WORDS.map((entry) => [normalizeWord(entry.word), entry]),
);
const FEATURES_BY_WORD = new Map(
  CLS_CP003_WORDS.map((entry) => [entry.word, analyzeClsCp003Word(entry.word, entry.primaryAffix)]),
);

function featureForEntry(entry: ClsCp003WordEntry): ClsCp003WordFeatures {
  const feature = FEATURES_BY_WORD.get(entry.word);
  if (!feature) throw new Error(`Missing features for ${entry.word}`);
  return feature;
}

function ruleValue(features: ClsCp003WordFeatures, ruleId: ClsCp003RuleId): string {
  switch (ruleId) {
    case "WORD_LENGTH":
      return String(features.length);
    case "VOWEL_COUNT":
      return String(features.vowelCount);
    case "REPEATED_LETTER_TOPOLOGY":
      return features.repeatedTopology;
    case "PALINDROME_STATUS":
      return features.palindrome ? "PALINDROME" : "NOT_PALINDROME";
    case "BOUNDARY_LETTER_CLASS":
      return features.boundaryClass;
    case "PRIMARY_AFFIX":
      return features.primaryAffix;
  }
}

function featuresForDisplayedWord(value: string): ClsCp003WordFeatures {
  const normalized = normalizeWord(value);
  const governed = WORD_BY_NORMALIZED.get(normalized);
  return analyzeClsCp003Word(normalized, governed?.primaryAffix ?? "NONE");
}

function structuralSupports(options: readonly string[]): ClsCp003RuleSupport[] {
  const features = options.map(featuresForDisplayedWord);
  const supports: ClsCp003RuleSupport[] = [];
  for (const ruleId of DIRECT_RULE_IDS) {
    const groups = new Map<string, number[]>();
    features.forEach((feature, index) => {
      const value = ruleValue(feature, ruleId);
      const indexes = groups.get(value) ?? [];
      indexes.push(index);
      groups.set(value, indexes);
    });
    for (const [commonValue, matchingOptionIndexes] of groups) {
      if (matchingOptionIndexes.length !== options.length - 1) continue;
      if (ruleId === "PRIMARY_AFFIX" && commonValue === "NONE") continue;
      const matching = new Set(matchingOptionIndexes);
      const outlierIndex = options.findIndex((_, index) => !matching.has(index));
      supports.push({ ruleId, commonValue, matchingOptionIndexes, outlierIndex });
    }
  }
  return supports;
}

export function auditClsCp003DisplayedWords(
  options: readonly string[],
  intendedRuleId?: ClsCp003RuleId,
): ClsCp003AmbiguityAudit {
  if (![4, 5].includes(options.length)) {
    throw new Error(`CLS-CP-003 direct audit requires four or five words, received ${options.length}`);
  }
  const supports = structuralSupports(options);
  if (supports.length === 0) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "No admitted structural rule groups every word except one.",
    };
  }
  const outlierIndexes = new Set(supports.map((support) => support.outlierIndex));
  if (outlierIndexes.size !== 1) {
    return {
      result: "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: intendedRuleId ? supports.some((support) => support.ruleId === intendedRuleId) : false,
      candidateSupports: supports,
      reason: "Different admitted structural rules identify different outliers.",
    };
  }
  const outlierIndex = supports[0]!.outlierIndex;
  const intendedRuleSupported = intendedRuleId
    ? supports.some((support) => support.ruleId === intendedRuleId && support.outlierIndex === outlierIndex)
    : true;
  if (intendedRuleId && !intendedRuleSupported) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: supports,
      reason: "The displayed state is uniquely classifiable, but not by the intended structural rule.",
    };
  }
  return {
    result: "UNIQUE",
    outlierIndex,
    intendedRuleSupported,
    candidateSupports: supports,
    reason: supports.length > 1
      ? "Several admitted structural descriptions agree on the same outlier."
      : "Exactly one admitted structural rule identifies one outlier.",
  };
}

function balancedKey(entry: ClsCp003WordEntry, ruleId: ClsCp003RuleId): string {
  const feature = featureForEntry(entry);
  const value = ruleValue(feature, ruleId);
  switch (ruleId) {
    case "WORD_LENGTH":
      return value;
    case "VOWEL_COUNT":
      return `${value}|L${feature.length}`;
    case "REPEATED_LETTER_TOPOLOGY":
      return `${value}|L${feature.length}|V${feature.vowelCount}`;
    case "PALINDROME_STATUS":
      return `${value}|L${feature.length}`;
    case "BOUNDARY_LETTER_CLASS":
      return `${value}|L${feature.length}|V${feature.vowelCount}`;
    case "PRIMARY_AFFIX":
      return value;
  }
}

function preferredOddCandidates(
  common: ClsCp003WordEntry,
  intendedRuleId: ClsCp003RuleId,
): ClsCp003WordEntry[] {
  const commonFeatures = featureForEntry(common);
  const commonValue = ruleValue(commonFeatures, intendedRuleId);
  let candidates = CLS_CP003_WORDS.filter((entry) =>
    ruleValue(featureForEntry(entry), intendedRuleId) !== commonValue,
  );

  switch (intendedRuleId) {
    case "WORD_LENGTH": {
      const near = candidates.filter((entry) => Math.abs(featureForEntry(entry).length - commonFeatures.length) <= 2);
      if (near.length > 0) candidates = near;
      break;
    }
    case "VOWEL_COUNT":
      candidates = candidates.filter((entry) => featureForEntry(entry).length === commonFeatures.length);
      break;
    case "REPEATED_LETTER_TOPOLOGY":
      candidates = candidates.filter((entry) => {
        const feature = featureForEntry(entry);
        return feature.length === commonFeatures.length && feature.vowelCount === commonFeatures.vowelCount;
      });
      break;
    case "PALINDROME_STATUS":
      candidates = candidates.filter((entry) => featureForEntry(entry).length === commonFeatures.length);
      break;
    case "BOUNDARY_LETTER_CLASS":
      candidates = candidates.filter((entry) => {
        const feature = featureForEntry(entry);
        return feature.length === commonFeatures.length && feature.vowelCount === commonFeatures.vowelCount;
      });
      break;
    case "PRIMARY_AFFIX": {
      const governed = candidates.filter((entry) => entry.primaryAffix !== "NONE");
      if (governed.length > 0) candidates = governed;
      candidates = candidates.filter((entry) => Math.abs(featureForEntry(entry).length - commonFeatures.length) <= 3);
      break;
    }
  }
  return candidates;
}

function constructDirectState(
  intendedRuleId: ClsCp003RuleId,
  optionCount: 4 | 5,
  rng: Rng,
): DirectState {
  const groups = new Map<string, ClsCp003WordEntry[]>();
  for (const entry of CLS_CP003_WORDS) {
    const key = balancedKey(entry, intendedRuleId);
    if (intendedRuleId === "PRIMARY_AFFIX" && key === "NONE") continue;
    const values = groups.get(key) ?? [];
    values.push(entry);
    groups.set(key, values);
  }
  const viable = [...groups.values()].filter((entries) => entries.length >= optionCount - 1);
  if (viable.length === 0) throw new Error(`No viable word group for ${intendedRuleId}`);
  const commonGroup = viable[rng.int(viable.length)]!;
  const commonEntries = sampleDistinct(commonGroup, optionCount - 1, rng);
  const commonReference = commonEntries[0]!;
  const oddCandidates = preferredOddCandidates(commonReference, intendedRuleId)
    .filter((entry) => !commonEntries.some((common) => common.word === entry.word));
  if (oddCandidates.length === 0) throw new Error(`No balanced odd word for ${intendedRuleId}`);
  const oddEntry = oddCandidates[rng.int(oddCandidates.length)]!;
  return {
    entries: [...commonEntries, oddEntry],
    oddWord: oddEntry.word,
    intendedValue: ruleValue(featureForEntry(commonReference), intendedRuleId),
  };
}

function anagramSignature(value: string): string {
  return [...normalizeWord(value)].sort().join("");
}

const JUMBLE_BY_SIGNATURE = new Map<string, ClsCp003JumbleEntry[]>();
for (const entry of CLS_CP003_JUMBLE_WORDS) {
  const signature = anagramSignature(entry.canonicalWord);
  const entries = JUMBLE_BY_SIGNATURE.get(signature) ?? [];
  entries.push(entry);
  JUMBLE_BY_SIGNATURE.set(signature, entries);
}

function resolveJumble(displayed: string): readonly ClsCp003JumbleEntry[] {
  return JUMBLE_BY_SIGNATURE.get(anagramSignature(displayed)) ?? [];
}

function jumbleVariants(word: string): string[] {
  const normalized = normalizeWord(word);
  const variants = new Set<string>();
  for (let shift = 1; shift < normalized.length; shift += 1) {
    variants.add(`${normalized.slice(shift)}${normalized.slice(0, shift)}`);
  }
  variants.add([...normalized].reverse().join(""));
  variants.add([...normalized].filter((_, index) => index % 2 === 0).join("") + [...normalized].filter((_, index) => index % 2 === 1).join(""));
  variants.delete(normalized);
  return [...variants].filter((variant) => anagramSignature(variant) === anagramSignature(normalized));
}

function constructJumbleState(optionCount: 4 | 5, rng: Rng): JumbleState {
  const byClassAndLength = new Map<string, ClsCp003JumbleEntry[]>();
  for (const entry of CLS_CP003_JUMBLE_WORDS) {
    if (resolveJumble(entry.canonicalWord).length !== 1) continue;
    const key = `${entry.semanticClass}|${entry.canonicalWord.length}`;
    const entries = byClassAndLength.get(key) ?? [];
    entries.push(entry);
    byClassAndLength.set(key, entries);
  }
  const commonGroups = [...byClassAndLength.values()].filter((entries) => entries.length >= optionCount - 1);
  if (commonGroups.length === 0) throw new Error("No viable jumbled-word class group");
  const commonGroup = commonGroups[rng.int(commonGroups.length)]!;
  const common = sampleDistinct(commonGroup, optionCount - 1, rng);
  const commonClass = common[0]!.semanticClass;
  const wordLength = common[0]!.canonicalWord.length;
  const contrasts = CLS_CP003_JUMBLE_WORDS.filter((entry) =>
    entry.semanticClass !== commonClass
    && entry.canonicalWord.length === wordLength
    && resolveJumble(entry.canonicalWord).length === 1,
  );
  if (contrasts.length === 0) throw new Error(`No same-length contrast for ${commonClass}`);
  const odd = contrasts[rng.int(contrasts.length)]!;
  const canonicalEntries = shuffled([...common, odd], rng);
  const displayed: string[] = [];
  for (let index = 0; index < canonicalEntries.length; index += 1) {
    const entry = canonicalEntries[index]!;
    const variants = jumbleVariants(entry.canonicalWord);
    if (variants.length === 0) throw new Error(`No jumble variant for ${entry.canonicalWord}`);
    let selected = variants[(rng.int(variants.length) + index) % variants.length]!;
    for (let offset = 0; displayed.includes(selected) && offset < variants.length; offset += 1) {
      selected = variants[(offset + index) % variants.length]!;
    }
    if (displayed.includes(selected)) throw new Error("Duplicate displayed jumble");
    displayed.push(selected.toUpperCase());
  }
  const canonicalWords = canonicalEntries.map((entry) => entry.canonicalWord);
  const semanticClasses = canonicalEntries.map((entry) => entry.semanticClass);
  const oddIndex = canonicalEntries.findIndex((entry) => entry.canonicalWord === odd.canonicalWord);
  return { displayed, canonicalWords, semanticClasses, oddIndex, commonClass };
}

export function auditClsCp003DisplayedJumbles(options: readonly string[]): ClsCp003AmbiguityAudit {
  if (![4, 5].includes(options.length)) {
    throw new Error(`CLS-CP-003 jumble audit requires four or five options, received ${options.length}`);
  }
  const resolved = options.map(resolveJumble);
  if (resolved.some((entries) => entries.length !== 1)) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "At least one displayed jumble does not have exactly one admitted resolution.",
    };
  }
  const classes = resolved.map((entries) => entries[0]!.semanticClass);
  const groups = new Map<string, number[]>();
  classes.forEach((semanticClass, index) => {
    const indexes = groups.get(semanticClass) ?? [];
    indexes.push(index);
    groups.set(semanticClass, indexes);
  });
  const candidates = [...groups.entries()].filter(([, indexes]) => indexes.length === options.length - 1);
  if (candidates.length !== 1) {
    return {
      result: candidates.length === 0 ? "NO_VALID_RULE" : "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: candidates.length === 0
        ? "The resolved words do not form one class with one outlier."
        : "More than one resolved semantic class can define the outlier.",
    };
  }
  const matching = new Set(candidates[0]![1]);
  const outlierIndex = options.findIndex((_, index) => !matching.has(index));
  const surfaceAudit = auditClsCp003DisplayedWords(options);
  if (surfaceAudit.result === "AMBIGUOUS") {
    return {
      result: "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: surfaceAudit.candidateSupports,
      reason: "The displayed jumbles expose competing structural outliers before resolution.",
    };
  }
  if (surfaceAudit.result === "UNIQUE" && surfaceAudit.outlierIndex !== outlierIndex) {
    return {
      result: "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: surfaceAudit.candidateSupports,
      reason: "A visible structural rule identifies a different option from the resolved semantic class.",
    };
  }
  return {
    result: "UNIQUE",
    outlierIndex,
    intendedRuleSupported: true,
    candidateSupports: surfaceAudit.result === "UNIQUE" ? surfaceAudit.candidateSupports : [],
    reason: "Every jumble resolves uniquely and exactly one resolved word falls outside the common class.",
  };
}

function requirePrototype(prototypeId: ClsCp003PrototypeId): ClsCp003PrototypeDefinition {
  const prototype = CLS_CP003_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-003 prototype: ${prototypeId}`);
  return prototype;
}

function displayWord(word: string): string {
  return word.toUpperCase();
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function affixLabel(value: string): string {
  const labels: Readonly<Record<string, string>> = {
    PREFIX_UN: "the prefix un-",
    PREFIX_RE: "the prefix re-",
    PREFIX_DIS: "the prefix dis-",
    PREFIX_PRE: "the prefix pre-",
    PREFIX_MIS: "the prefix mis-",
    SUFFIX_FUL: "the suffix -ful",
    SUFFIX_LESS: "the suffix -less",
    SUFFIX_NESS: "the suffix -ness",
    SUFFIX_MENT: "the suffix -ment",
    SUFFIX_TION: "the suffix -tion",
    SUFFIX_ABLE: "the suffix -able",
  };
  return labels[value] ?? value;
}

function ruleDescription(ruleId: ClsCp003RuleId, value: string): string {
  switch (ruleId) {
    case "WORD_LENGTH":
      return `Each common word has ${value} letters.`;
    case "VOWEL_COUNT":
      return `Each common word has ${value} vowel${value === "1" ? "" : "s"}.`;
    case "REPEATED_LETTER_TOPOLOGY": {
      const labels: Readonly<Record<string, string>> = {
        ALL_UNIQUE: "all its letters different",
        ONE_REPEATED_LETTER: "exactly one letter that repeats",
        MULTIPLE_REPEATED_LETTERS: "more than one repeated letter",
        TRIPLE_OR_MORE: "a letter occurring at least three times",
      };
      return `Each common word has ${labels[value]}.`;
    }
    case "PALINDROME_STATUS":
      return value === "PALINDROME"
        ? "Each common word reads the same forwards and backwards."
        : "Each common word changes when read backwards.";
    case "BOUNDARY_LETTER_CLASS": {
      const labels: Readonly<Record<string, string>> = {
        VOWEL_VOWEL: "starts and ends with a vowel",
        VOWEL_CONSONANT: "starts with a vowel and ends with a consonant",
        CONSONANT_VOWEL: "starts with a consonant and ends with a vowel",
        CONSONANT_CONSONANT: "starts and ends with a consonant",
      };
      return `Each common word ${labels[value]}.`;
    }
    case "PRIMARY_AFFIX":
      return `Each common word contains ${affixLabel(value)}.`;
  }
}

function ruleValueForDisplayed(option: string, ruleId: ClsCp003RuleId): string {
  return ruleValue(featuresForDisplayedWord(option), ruleId);
}

function directEvidence(options: readonly string[], ruleId: ClsCp003RuleId, commonValue: string): string[] {
  return options.map((option) => ruleValueForDisplayed(option, ruleId) === commonValue
    ? `${option} follows the common rule: ${ruleDescription(ruleId, commonValue)}`
    : `${option} does not follow the common rule: ${ruleDescription(ruleId, commonValue)}`);
}

function directExplanation(
  options: readonly string[],
  correctIndex: number,
  ruleId: ClsCp003RuleId,
  commonValue: string,
): GeneratedClsCp003Question["explanation"] {
  const common = options.filter((_, index) => index !== correctIndex);
  const odd = options[correctIndex]!;
  return {
    coreConcept: [ruleDescription(ruleId, commonValue)],
    stepByStep: [
      `${naturalList(common)} follow the same word-structure rule.`,
      `${odd} has a different structural value under that rule.`,
      `Therefore, ${odd} is the odd word.`,
    ],
    examSpeedShortcut: [
      ruleId === "PRIMARY_AFFIX"
        ? "Mark the shared beginning or ending before checking the full word."
        : ruleId === "PALINDROME_STATUS"
          ? "Read each word once from both ends toward the centre."
          : "Write the relevant count or letter-pattern beside each option, then compare.",
    ],
    commonTrapWarning: [
      "Do not switch to a semantic category when the question asks for spelling or word structure.",
    ],
  };
}

function jumbleExplanation(
  options: readonly string[],
  canonicalWords: readonly string[],
  semanticClasses: readonly string[],
  correctIndex: number,
  commonClass: string,
): GeneratedClsCp003Question["explanation"] {
  const resolutions = options.map((option, index) => `${option} → ${canonicalWords[index]!.toUpperCase()}`);
  const oddWord = canonicalWords[correctIndex]!.toUpperCase();
  return {
    coreConcept: ["First rearrange each jumble into its only admitted word, then classify the resolved words."],
    stepByStep: [
      `${naturalList(resolutions)}.`,
      `All resolved words except ${oddWord} belong to the ${commonClass.toLocaleLowerCase("en-IN")} class; ${oddWord} belongs to ${semanticClasses[correctIndex]!.toLocaleLowerCase("en-IN")}.`,
      `Therefore, ${options[correctIndex]} is the odd jumble.`,
    ],
    examSpeedShortcut: ["Resolve the easiest jumble first, identify its class, and test the remaining options against that class."],
    commonTrapWarning: ["Do not classify the scrambled letter shapes; classify the meaningful words obtained after rearrangement."],
  };
}

function difficultyFeatures(
  prototype: ClsCp003PrototypeDefinition,
  optionCount: 4 | 5,
  audit: ClsCp003AmbiguityAudit,
  nearMissDistance: number,
): ClsCp003DifficultyFeatures {
  const structuralDemand: 1 | 2 | 3 = prototype.generationProfile === "EXACT_LENGTH_OUTLIER"
    || prototype.generationProfile === "VOWEL_COUNT_OUTLIER"
      ? 1
      : prototype.generationProfile === "JUMBLED_SEMANTIC_OUTLIER"
        || prototype.generationProfile === "AFFIX_FAMILY_OUTLIER"
        ? 3
        : 2;
  const requiresResolution = prototype.generationProfile === "JUMBLED_SEMANTIC_OUTLIER";
  const governedMorphology = prototype.generationProfile === "AFFIX_FAMILY_OUTLIER";
  const score =
    (optionCount === 5 ? 1 : 0)
    + (structuralDemand - 1)
    + Math.max(0, audit.candidateSupports.length - 1)
    + (nearMissDistance <= 1 ? 1 : 0)
    + (requiresResolution ? 2 : 0)
    + (governedMorphology ? 1 : 0);
  return {
    optionCount,
    structuralDemand,
    candidateRuleCount: audit.candidateSupports.length,
    nearMissDistance,
    requiresResolution,
    governedMorphology,
    score,
  };
}

function difficultyFromScore(score: number): ClsCp003Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}

function directNearMissDistance(
  ruleId: ClsCp003RuleId,
  commonValue: string,
  oddOption: string,
): number {
  const oddValue = ruleValueForDisplayed(oddOption, ruleId);
  if (ruleId === "WORD_LENGTH" || ruleId === "VOWEL_COUNT") {
    return Math.abs(Number(commonValue) - Number(oddValue));
  }
  return 1;
}

function directStem(seed: number): string {
  const stems = [
    "Choose the word that differs from the others in its spelling or letter structure.",
    "Which word does not follow the word-structure rule followed by the others?",
    "Select the odd word based on its letters, not its meaning.",
    "Three or four words share one structural property. Which word is different?",
  ];
  return stems[seed % stems.length]!;
}

function jumbleStem(seed: number): string {
  const stems = [
    "Rearrange each group of letters into a meaningful word, then choose the odd one by class.",
    "Each option can be unjumbled into one word. Which resolved word belongs to a different class?",
    "Form the meaningful words and select the differently classified jumble.",
    "After rearranging the letters, which option gives a word unlike the others?",
  ];
  return stems[seed % stems.length]!;
}

export function generateClsCp003Prototype(
  prototypeId: ClsCp003PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp003Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-003 supports four or five options, received ${optionCount}`);
  const prototype = requirePrototype(prototypeId);

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const rng = makeRng(seed * MAX_GENERATION_ATTEMPTS + attempt, prototypeId);

    if (prototype.generationProfile === "JUMBLED_SEMANTIC_OUTLIER") {
      let state: JumbleState;
      try {
        state = constructJumbleState(optionCount, rng);
      } catch {
        continue;
      }
      const audit = auditClsCp003DisplayedJumbles(state.displayed);
      if (audit.result !== "UNIQUE" || audit.outlierIndex !== state.oddIndex) continue;
      const features = difficultyFeatures(prototype, optionCount, audit, 1);
      const question: GeneratedClsCp003Question = {
        checkpointId: "CLS-CP-003",
        prototypeId,
        seed,
        task: prototype.task,
        generationProfile: prototype.generationProfile,
        stem: jumbleStem(seed + attempt),
        options: state.displayed,
        canonicalWords: state.canonicalWords,
        correctIndex: state.oddIndex,
        answer: state.displayed[state.oddIndex]!,
        intendedRuleId: "RESOLVED_SEMANTIC_CLASS",
        intendedRuleValue: state.commonClass,
        evidenceByOption: state.displayed.map((option, index) =>
          `${option} resolves to ${state.canonicalWords[index]!.toUpperCase()}, classified as ${state.semanticClasses[index]}.`,
        ),
        ambiguityAudit: audit,
        difficulty: difficultyFromScore(features.score),
        difficultyFeatures: features,
        explanation: jumbleExplanation(
          state.displayed,
          state.canonicalWords,
          state.semanticClasses,
          state.oddIndex,
          state.commonClass,
        ),
        metadata: {
          datasetVersion: "CLS-CP003-WORD-STRUCTURE-EN-v1",
          runtimeVersion: "cls-cp003-discovery-v1",
          locale: "en-IN",
          optionCount,
          sourceWordCount: CLS_CP003_WORDS.length + CLS_CP003_JUMBLE_WORDS.length,
          sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED",
        },
        lifecycle: LIFECYCLE,
      };
      const independent = independentlyVerifyClsCp003Question(question);
      if (independent.result === "UNIQUE" && independent.outlierIndex === question.correctIndex) return question;
      continue;
    }

    const intendedRuleId = prototype.intendedRuleId as ClsCp003RuleId;
    let state: DirectState;
    try {
      state = constructDirectState(intendedRuleId, optionCount, rng);
    } catch {
      continue;
    }
    const shuffledEntries = shuffled(state.entries, rng);
    const options = shuffledEntries.map((entry) => displayWord(entry.word));
    if (new Set(options).size !== optionCount) continue;
    const correctIndex = shuffledEntries.findIndex((entry) => entry.word === state.oddWord);
    const audit = auditClsCp003DisplayedWords(options, intendedRuleId);
    if (audit.result !== "UNIQUE" || audit.outlierIndex !== correctIndex || !audit.intendedRuleSupported) continue;
    const nearMissDistance = directNearMissDistance(intendedRuleId, state.intendedValue, options[correctIndex]!);
    const features = difficultyFeatures(prototype, optionCount, audit, nearMissDistance);
    const question: GeneratedClsCp003Question = {
      checkpointId: "CLS-CP-003",
      prototypeId,
      seed,
      task: prototype.task,
      generationProfile: prototype.generationProfile,
      stem: directStem(seed + attempt),
      options,
      canonicalWords: shuffledEntries.map((entry) => entry.word),
      correctIndex,
      answer: options[correctIndex]!,
      intendedRuleId,
      intendedRuleValue: state.intendedValue,
      evidenceByOption: directEvidence(options, intendedRuleId, state.intendedValue),
      ambiguityAudit: audit,
      difficulty: difficultyFromScore(features.score),
      difficultyFeatures: features,
      explanation: directExplanation(options, correctIndex, intendedRuleId, state.intendedValue),
      metadata: {
        datasetVersion: "CLS-CP003-WORD-STRUCTURE-EN-v1",
        runtimeVersion: "cls-cp003-discovery-v1",
        locale: "en-IN",
        optionCount,
        sourceWordCount: CLS_CP003_WORDS.length + CLS_CP003_JUMBLE_WORDS.length,
        sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED",
      },
      lifecycle: LIFECYCLE,
    };
    const independent = independentlyVerifyClsCp003Question(question);
    if (independent.result === "UNIQUE" && independent.outlierIndex === question.correctIndex) return question;
  }

  throw new Error(`${prototypeId}/${seed}/${optionCount} did not produce a unique state`);
}

export function independentlyVerifyClsCp003Question(
  question: GeneratedClsCp003Question,
): ClsCp003AmbiguityAudit {
  return question.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER"
    ? auditClsCp003DisplayedJumbles(question.options)
    : auditClsCp003DisplayedWords(question.options, question.intendedRuleId as ClsCp003RuleId);
}

export function getClsCp003PrototypeDefinitions(): readonly ClsCp003PrototypeDefinition[] {
  return CLS_CP003_PROTOTYPES;
}

export function getClsCp003DatasetSummary() {
  return {
    datasetVersion: "CLS-CP003-WORD-STRUCTURE-EN-v1" as const,
    wordCount: CLS_CP003_WORDS.length,
    jumbleWordCount: CLS_CP003_JUMBLE_WORDS.length,
    prototypeCount: CLS_CP003_PROTOTYPES.length,
    directRuleIds: DIRECT_RULE_IDS,
    locale: "en-IN" as const,
    permanentQlCount: 0 as const,
  };
}