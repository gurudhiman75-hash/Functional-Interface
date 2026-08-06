import {
  getClsCp003LocalizedContract,
  type ClsCp003LocalizedLocale,
  type ClsCp003LocalizedQlId,
} from "./cp003-localized-contracts";
import {
  CLS_CP003_LOCALIZED_JUMBLE_WORDS,
  CLS_CP003_LOCALIZED_WORDS,
  getClsCp003LocalizedDatasetSummary,
  type ClsCp003LocalizedJumbleEntry,
  type ClsCp003LocalizedWordEntry,
} from "./word-dataset.localized";
import type { ClsCp003Difficulty, ClsCp003PrototypeId, ClsCp003Task } from "./types";

export type ClsCp003LocalizedRuleId =
  | "LETTER_UNIT_COUNT"
  | "VOWEL_MARK_COUNT"
  | "REPEATED_UNIT_TOPOLOGY"
  | "PALINDROME_STATUS"
  | "BOUNDARY_MARK_PATTERN"
  | "NATIVE_AFFIX_FAMILY"
  | "RESOLVED_SEMANTIC_CLASS";

export type ClsCp003LocalizedRepeatPattern =
  | "ALL_UNIQUE"
  | "ONE_REPEATED_UNIT"
  | "MULTIPLE_REPEATED_UNITS"
  | "TRIPLE_OR_MORE";

export type ClsCp003LocalizedBoundaryPattern =
  | "PLAIN_PLAIN"
  | "MARKED_PLAIN"
  | "PLAIN_MARKED"
  | "MARKED_MARKED";

export type ClsCp003LocalizedWordFeatures = {
  readonly normalized: string;
  readonly units: readonly string[];
  readonly unitCount: number;
  readonly vowelMarkCount: number;
  readonly repeatPattern: ClsCp003LocalizedRepeatPattern;
  readonly palindrome: boolean;
  readonly boundaryPattern: ClsCp003LocalizedBoundaryPattern;
  readonly primaryAffix: string;
};

export type ClsCp003LocalizedRuleSupport = {
  readonly ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">;
  readonly commonValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly outlierIndex: number;
};

export type ClsCp003LocalizedAudit = {
  readonly result: "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
  readonly outlierIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp003LocalizedRuleSupport[];
  readonly reason: string;
};

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

type DirectState = {
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly intendedValue: string;
  readonly audit: ClsCp003LocalizedAudit;
};

type JumbleState = {
  readonly options: readonly string[];
  readonly canonicalWords: readonly string[];
  readonly semanticClasses: readonly string[];
  readonly correctIndex: number;
  readonly commonClass: string;
};

const DIRECT_RULES: readonly Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">[] = [
  "LETTER_UNIT_COUNT",
  "VOWEL_MARK_COUNT",
  "REPEATED_UNIT_TOPOLOGY",
  "PALINDROME_STATUS",
  "BOUNDARY_MARK_PATTERN",
  "NATIVE_AFFIX_FAMILY",
];

const PROTOTYPE_RULE: Readonly<Record<ClsCp003PrototypeId, ClsCp003LocalizedRuleId>> = {
  "CLS-CP003-PROT-001": "LETTER_UNIT_COUNT",
  "CLS-CP003-PROT-002": "VOWEL_MARK_COUNT",
  "CLS-CP003-PROT-003": "REPEATED_UNIT_TOPOLOGY",
  "CLS-CP003-PROT-004": "PALINDROME_STATUS",
  "CLS-CP003-PROT-005": "BOUNDARY_MARK_PATTERN",
  "CLS-CP003-PROT-006": "NATIVE_AFFIX_FAMILY",
  "CLS-CP003-PROT-007": "RESOLVED_SEMANTIC_CLASS",
};

const HINDI_VOWEL_MARKS = new Set(["ा", "ि", "ी", "ु", "ू", "ृ", "ॄ", "े", "ै", "ो", "ौ", "ॅ", "ॉ", "ॆ", "ॊ"]);
const PUNJABI_VOWEL_MARKS = new Set(["ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ"]);

const CLASS_LABELS: Readonly<Record<ClsCp003LocalizedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    FRUIT: "फल",
    VEGETABLE: "सब्जी",
    ANIMAL: "जानवर",
    BIRD: "पक्षी",
    COLOUR: "रंग",
    TOOL: "औजार",
    PROFESSION: "पेशा",
  },
  "pa-IN": {
    FRUIT: "ਫਲ",
    VEGETABLE: "ਸਬਜ਼ੀ",
    ANIMAL: "ਜਾਨਵਰ",
    BIRD: "ਪੰਛੀ",
    COLOUR: "ਰੰਗ",
    TOOL: "ਔਜ਼ਾਰ",
    PROFESSION: "ਪੇਸ਼ਾ",
  },
};

const AFFIX_LABELS: Readonly<Record<ClsCp003LocalizedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    NONE: "कोई साझा उपसर्ग या प्रत्यय नहीं",
    PREFIX_BE: "बे-",
    PREFIX_AN: "अन-",
    PREFIX_SU: "सु-",
    SUFFIX_WALA: "-वाला",
    SUFFIX_PAN: "-पन",
    SUFFIX_DAR: "-दार",
  },
  "pa-IN": {
    NONE: "ਕੋਈ ਸਾਂਝਾ ਅਗਲਾ ਜਾਂ ਪਿਛਲਾ ਹਿੱਸਾ ਨਹੀਂ",
    PREFIX_BE: "ਬੇ-",
    PREFIX_AN: "ਅਣ-",
    SUFFIX_WALA: "-ਵਾਲਾ",
    SUFFIX_PAN: "-ਪਨ",
    SUFFIX_DAR: "-ਦਾਰ",
  },
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
  if (values.length < count) throw new Error(`Cannot sample ${count} from ${values.length}`);
  return shuffled(values, rng).slice(0, count);
}

function normalizeNative(value: string): string {
  return value.normalize("NFC").replace(/[\s\p{P}\p{S}]/gu, "");
}

function segmentNative(value: string, locale: ClsCp003LocalizedLocale): string[] {
  const normalized = normalizeNative(value);
  const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
  return [...segmenter.segment(normalized)].map((part) => part.segment).filter(Boolean);
}

function markSet(locale: ClsCp003LocalizedLocale): ReadonlySet<string> {
  return locale === "hi-IN" ? HINDI_VOWEL_MARKS : PUNJABI_VOWEL_MARKS;
}

function containsVowelMark(unit: string, locale: ClsCp003LocalizedLocale): boolean {
  const marks = markSet(locale);
  return [...unit].some((character) => marks.has(character));
}

function vowelMarkCount(value: string, locale: ClsCp003LocalizedLocale): number {
  const marks = markSet(locale);
  return [...value.normalize("NFC")].filter((character) => marks.has(character)).length;
}

function repeatedPattern(units: readonly string[]): ClsCp003LocalizedRepeatPattern {
  const counts = new Map<string, number>();
  for (const unit of units) counts.set(unit, (counts.get(unit) ?? 0) + 1);
  const repeatedCounts = [...counts.values()].filter((count) => count > 1);
  if (repeatedCounts.some((count) => count >= 3)) return "TRIPLE_OR_MORE";
  if (repeatedCounts.length === 0) return "ALL_UNIQUE";
  if (repeatedCounts.length === 1) return "ONE_REPEATED_UNIT";
  return "MULTIPLE_REPEATED_UNITS";
}

function boundaryPattern(
  units: readonly string[],
  locale: ClsCp003LocalizedLocale,
): ClsCp003LocalizedBoundaryPattern {
  const firstMarked = containsVowelMark(units[0] ?? "", locale);
  const lastMarked = containsVowelMark(units.at(-1) ?? "", locale);
  if (firstMarked && lastMarked) return "MARKED_MARKED";
  if (firstMarked) return "MARKED_PLAIN";
  if (lastMarked) return "PLAIN_MARKED";
  return "PLAIN_PLAIN";
}

const WORD_MAPS: Readonly<Record<ClsCp003LocalizedLocale, ReadonlyMap<string, ClsCp003LocalizedWordEntry>>> = {
  "hi-IN": new Map(CLS_CP003_LOCALIZED_WORDS["hi-IN"].map((entry) => [normalizeNative(entry.word), entry])),
  "pa-IN": new Map(CLS_CP003_LOCALIZED_WORDS["pa-IN"].map((entry) => [normalizeNative(entry.word), entry])),
};

export function analyzeClsCp003LocalizedWord(
  value: string,
  locale: ClsCp003LocalizedLocale,
  primaryAffix?: string,
): ClsCp003LocalizedWordFeatures {
  const normalized = normalizeNative(value);
  const units = segmentNative(normalized, locale);
  if (units.length === 0) throw new Error(`Native word is empty after normalization: ${value}`);
  const governed = WORD_MAPS[locale].get(normalized);
  return {
    normalized,
    units,
    unitCount: units.length,
    vowelMarkCount: vowelMarkCount(normalized, locale),
    repeatPattern: repeatedPattern(units),
    palindrome: units.join("|") === [...units].reverse().join("|"),
    boundaryPattern: boundaryPattern(units, locale),
    primaryAffix: primaryAffix ?? governed?.primaryAffix ?? "NONE",
  };
}

function ruleValue(
  features: ClsCp003LocalizedWordFeatures,
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
): string {
  switch (ruleId) {
    case "LETTER_UNIT_COUNT":
      return String(features.unitCount);
    case "VOWEL_MARK_COUNT":
      return String(features.vowelMarkCount);
    case "REPEATED_UNIT_TOPOLOGY":
      return features.repeatPattern;
    case "PALINDROME_STATUS":
      return features.palindrome ? "PALINDROME" : "NOT_PALINDROME";
    case "BOUNDARY_MARK_PATTERN":
      return features.boundaryPattern;
    case "NATIVE_AFFIX_FAMILY":
      return features.primaryAffix;
  }
}

function supportsForOptions(
  options: readonly string[],
  locale: ClsCp003LocalizedLocale,
): ClsCp003LocalizedRuleSupport[] {
  const features = options.map((option) => analyzeClsCp003LocalizedWord(option, locale));
  const supports: ClsCp003LocalizedRuleSupport[] = [];
  for (const ruleId of DIRECT_RULES) {
    const groups = new Map<string, number[]>();
    features.forEach((feature, index) => {
      const value = ruleValue(feature, ruleId);
      const indexes = groups.get(value) ?? [];
      indexes.push(index);
      groups.set(value, indexes);
    });
    for (const [commonValue, indexes] of groups) {
      if (indexes.length !== options.length - 1) continue;
      if (ruleId === "NATIVE_AFFIX_FAMILY" && commonValue === "NONE") continue;
      const matching = new Set(indexes);
      const outlierIndex = options.findIndex((_, index) => !matching.has(index));
      supports.push({ ruleId, commonValue, matchingOptionIndexes: indexes, outlierIndex });
    }
  }
  return supports;
}

export function auditClsCp003LocalizedWords(
  options: readonly string[],
  locale: ClsCp003LocalizedLocale,
  intendedRuleId?: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
): ClsCp003LocalizedAudit {
  if (![4, 5].includes(options.length)) {
    throw new Error(`Localized direct audit requires four or five options, received ${options.length}`);
  }
  const supports = supportsForOptions(options, locale);
  if (supports.length === 0) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "No governed native structural rule identifies one outlier.",
    };
  }
  const outliers = new Set(supports.map((support) => support.outlierIndex));
  if (outliers.size !== 1) {
    return {
      result: "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: intendedRuleId
        ? supports.some((support) => support.ruleId === intendedRuleId)
        : false,
      candidateSupports: supports,
      reason: "Different governed native structural rules identify different answers.",
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
      reason: "The state is classifiable, but not by the requested native rule.",
    };
  }
  return {
    result: "UNIQUE",
    outlierIndex,
    intendedRuleSupported,
    candidateSupports: supports,
    reason: supports.length > 1
      ? "Several governed descriptions agree on the same outlier."
      : "One governed native structural rule identifies one outlier.",
  };
}

function optionCountForSeed(qlId: ClsCp003LocalizedQlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function answerIndexForSeed(qlId: ClsCp003LocalizedQlId, seed: number, optionCount: 4 | 5): number {
  return hashText(`${qlId}:answer-index:${seed}`) % optionCount;
}

function prototypeForSeed(
  qlId: ClsCp003LocalizedQlId,
  seed: number,
): ClsCp003PrototypeId {
  const contract = getClsCp003LocalizedContract(qlId);
  return contract.allowedPrototypeIds[
    hashText(`${qlId}:prototype:${seed}`) % contract.allowedPrototypeIds.length
  ]!;
}

function arrangeWithTarget<T>(common: readonly T[], odd: T, targetIndex: number): T[] {
  const result = [...common];
  result.splice(targetIndex, 0, odd);
  return result;
}

function constructDirectState(
  locale: ClsCp003LocalizedLocale,
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  optionCount: 4 | 5,
  targetIndex: number,
  seed: number,
): DirectState {
  const words = CLS_CP003_LOCALIZED_WORDS[locale];
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const rng = makeRng(seed + attempt * 104729, `${locale}:${ruleId}:direct`);
    const groups = new Map<string, ClsCp003LocalizedWordEntry[]>();
    for (const entry of words) {
      const features = analyzeClsCp003LocalizedWord(entry.word, locale, entry.primaryAffix);
      const value = ruleValue(features, ruleId);
      if (ruleId === "NATIVE_AFFIX_FAMILY" && value === "NONE") continue;
      const group = groups.get(value) ?? [];
      group.push(entry);
      groups.set(value, group);
    }
    const viable = [...groups.entries()].filter(([, entries]) => entries.length >= optionCount - 1);
    if (viable.length === 0) throw new Error(`No native group for ${locale}/${ruleId}`);
    const [commonValue, commonPool] = viable[rng.int(viable.length)]!;
    const commonEntries = sampleDistinct(commonPool, optionCount - 1, rng);
    const oddPool = words.filter((entry) => {
      if (commonEntries.some((common) => common.word === entry.word)) return false;
      const value = ruleValue(analyzeClsCp003LocalizedWord(entry.word, locale, entry.primaryAffix), ruleId);
      return value !== commonValue;
    });
    if (oddPool.length === 0) continue;
    const odd = oddPool[rng.int(oddPool.length)]!;
    const options = arrangeWithTarget(commonEntries.map((entry) => entry.word), odd.word, targetIndex);
    const audit = auditClsCp003LocalizedWords(options, locale, ruleId);
    if (audit.result !== "UNIQUE" || audit.outlierIndex !== targetIndex) continue;
    return { options, correctIndex: targetIndex, intendedValue: commonValue, audit };
  }
  throw new Error(`Unable to construct ambiguity-safe native state for ${locale}/${ruleId}/${seed}`);
}

function signature(value: string, locale: ClsCp003LocalizedLocale): string {
  return segmentNative(value, locale).sort((left, right) => left.localeCompare(right, locale)).join("|");
}

function jumbleVariants(value: string, locale: ClsCp003LocalizedLocale): string[] {
  const units = segmentNative(value, locale);
  const variants = new Set<string>();
  for (let shift = 1; shift < units.length; shift += 1) {
    variants.add([...units.slice(shift), ...units.slice(0, shift)].join(""));
  }
  variants.add([...units].reverse().join(""));
  variants.add([
    ...units.filter((_, index) => index % 2 === 0),
    ...units.filter((_, index) => index % 2 === 1),
  ].join(""));
  variants.delete(value.normalize("NFC"));
  return [...variants].filter((candidate) => signature(candidate, locale) === signature(value, locale));
}

function jumbleResolutionMap(locale: ClsCp003LocalizedLocale) {
  const map = new Map<string, ClsCp003LocalizedJumbleEntry[]>();
  for (const entry of CLS_CP003_LOCALIZED_JUMBLE_WORDS[locale]) {
    const key = signature(entry.canonicalWord, locale);
    const entries = map.get(key) ?? [];
    entries.push(entry);
    map.set(key, entries);
  }
  return map;
}

function constructJumbleState(
  locale: ClsCp003LocalizedLocale,
  optionCount: 4 | 5,
  targetIndex: number,
  seed: number,
): JumbleState {
  const entries = CLS_CP003_LOCALIZED_JUMBLE_WORDS[locale];
  const resolutionMap = jumbleResolutionMap(locale);
  const byClass = new Map<string, ClsCp003LocalizedJumbleEntry[]>();
  for (const entry of entries) {
    if ((resolutionMap.get(signature(entry.canonicalWord, locale)) ?? []).length !== 1) continue;
    if (jumbleVariants(entry.canonicalWord, locale).length === 0) continue;
    const group = byClass.get(entry.semanticClass) ?? [];
    group.push(entry);
    byClass.set(entry.semanticClass, group);
  }

  for (let attempt = 0; attempt < 1600; attempt += 1) {
    const rng = makeRng(seed + attempt * 130363, `${locale}:jumbled-semantic`);
    const viable = [...byClass.entries()].filter(([, group]) => group.length >= optionCount - 1);
    const [commonClass, commonPool] = viable[rng.int(viable.length)]!;
    const common = sampleDistinct(commonPool, optionCount - 1, rng);
    const oddPool = entries.filter((entry) =>
      entry.semanticClass !== commonClass
      && (resolutionMap.get(signature(entry.canonicalWord, locale)) ?? []).length === 1
      && jumbleVariants(entry.canonicalWord, locale).length > 0,
    );
    if (oddPool.length === 0) continue;
    const odd = oddPool[rng.int(oddPool.length)]!;
    const canonical = arrangeWithTarget(common.map((entry) => entry.canonicalWord), odd.canonicalWord, targetIndex);
    const semanticClasses = arrangeWithTarget(common.map((entry) => entry.semanticClass), odd.semanticClass, targetIndex);
    const displayed = canonical.map((word, index) => {
      const variants = jumbleVariants(word, locale);
      return variants[hashText(`${locale}:${seed}:${attempt}:${index}:${word}`) % variants.length]!;
    });
    if (new Set(displayed).size !== displayed.length) continue;
    if (auditClsCp003LocalizedWords(displayed, locale).result !== "NO_VALID_RULE") continue;
    return {
      options: displayed,
      canonicalWords: canonical,
      semanticClasses,
      correctIndex: targetIndex,
      commonClass,
    };
  }
  throw new Error(`Unable to construct native jumbled semantic state for ${locale}/${seed}`);
}

function choose<T>(values: readonly T[], seed: number, salt: string): T {
  return values[hashText(`${salt}:${seed}`) % values.length]!;
}

function stemFor(
  locale: ClsCp003LocalizedLocale,
  ruleId: ClsCp003LocalizedRuleId,
  seed: number,
): string {
  if (locale === "hi-IN") {
    const stems: Record<ClsCp003LocalizedRuleId, readonly string[]> = {
      LETTER_UNIT_COUNT: [
        "किस शब्द में अक्षरों की संख्या अलग है?",
        "अलग अक्षर-संख्या वाला शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों जितने अक्षरों का नहीं है?",
        "अक्षर गिनकर अलग शब्द पहचानिए।",
      ],
      VOWEL_MARK_COUNT: [
        "किस शब्द में मात्रा-चिह्नों की संख्या अलग है?",
        "मात्राएँ गिनकर अलग शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों के समान मात्रा-संख्या नहीं रखता?",
        "अलग मात्रा-पैटर्न वाला शब्द पहचानिए।",
      ],
      REPEATED_UNIT_TOPOLOGY: [
        "किस शब्द में अक्षरों का दोहराव अलग है?",
        "अलग दोहराव-पैटर्न वाला शब्द चुनिए।",
        "कौन-से शब्द में अक्षर बाकी शब्दों से अलग तरह दोहरते हैं?",
        "अक्षर-दोहराव देखकर अलग शब्द पहचानिए।",
      ],
      PALINDROME_STATUS: [
        "उलटे क्रम में पढ़ने पर कौन-सा शब्द अलग व्यवहार करता है?",
        "शब्दों को आगे और पीछे से पढ़िए। अलग शब्द चुनिए।",
        "कौन-सा शब्द बाकी शब्दों जैसा उलटा-पठन पैटर्न नहीं रखता?",
        "आगे-पीछे पढ़कर अलग शब्द पहचानिए।",
      ],
      BOUNDARY_MARK_PATTERN: [
        "पहले और अंतिम अक्षर पर लगी मात्राओं को देखकर अलग शब्द चुनिए।",
        "किस शब्द के दोनों सिरों का मात्रा-पैटर्न अलग है?",
        "शुरू और अंत के अक्षर जाँचिए। कौन-सा शब्द अलग है?",
        "पहले-अंतिम अक्षर के मात्रा-चिह्नों से अलग शब्द पहचानिए।",
      ],
      NATIVE_AFFIX_FAMILY: [
        "किस शब्द का शुरू या अंत बाकी शब्दों से अलग है?",
        "साझा उपसर्ग या प्रत्यय न रखने वाला शब्द चुनिए।",
        "कौन-सा शब्द समान आरंभ या अंत वाले समूह में नहीं आता?",
        "शब्दों के जुड़े हुए आरंभ या अंत को देखकर अलग शब्द पहचानिए।",
      ],
      RESOLVED_SEMANTIC_CLASS: [
        "हर विकल्प के अक्षर सही क्रम में लगाइए। अलग समूह का शब्द चुनिए।",
        "उलझे अक्षरों से शब्द बनाइए और अलग वर्ग वाला शब्द पहचानिए।",
        "हर अक्षर-समूह को सुलझाइए। कौन-सा बना हुआ शब्द अलग है?",
        "शब्दों को सही बनाकर वह शब्द चुनिए जो बाकी समूह में नहीं आता।",
      ],
    };
    return choose(stems[ruleId], seed, `${locale}:${ruleId}:stem`);
  }

  const stems: Record<ClsCp003LocalizedRuleId, readonly string[]> = {
    LETTER_UNIT_COUNT: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੀ ਹੈ?",
      "ਵੱਖਰੀ ਅੱਖਰ-ਗਿਣਤੀ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਸ਼ਬਦਾਂ ਜਿੰਨੇ ਅੱਖਰਾਂ ਦਾ ਨਹੀਂ ਹੈ?",
      "ਅੱਖਰ ਗਿਣ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    VOWEL_MARK_COUNT: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਲਗਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੀ ਹੈ?",
      "ਲਗਾਂ ਗਿਣ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦੀ ਲਗ-ਗਿਣਤੀ ਬਾਕੀ ਸ਼ਬਦਾਂ ਵਰਗੀ ਨਹੀਂ ਹੈ?",
      "ਵੱਖਰੇ ਲਗ-ਢੰਗ ਵਾਲਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    REPEATED_UNIT_TOPOLOGY: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦਾ ਦੁਹਰਾਅ ਵੱਖਰਾ ਹੈ?",
      "ਵੱਖਰੇ ਦੁਹਰਾਅ-ਢੰਗ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦੇ ਅੱਖਰ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰੇ ਢੰਗ ਨਾਲ ਦੁਹਰਾਉਂਦੇ ਹਨ?",
      "ਅੱਖਰਾਂ ਦਾ ਦੁਹਰਾਅ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    PALINDROME_STATUS: [
      "ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਨ ਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਵੱਖਰਾ ਵਰਤਾਅ ਕਰਦਾ ਹੈ?",
      "ਸ਼ਬਦਾਂ ਨੂੰ ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਤੋਂ ਪੜ੍ਹੋ। ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀਆਂ ਵਰਗਾ ਉਲਟ-ਪੜ੍ਹਨ ਢੰਗ ਨਹੀਂ ਰੱਖਦਾ?",
      "ਅੱਗੇ-ਪਿੱਛੇ ਪੜ੍ਹ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    BOUNDARY_MARK_PATTERN: [
      "ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਦੀਆਂ ਲਗਾਂ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਦਾ ਲਗ-ਢੰਗ ਵੱਖਰਾ ਹੈ?",
      "ਸ਼ੁਰੂ ਅਤੇ ਅੰਤ ਦੇ ਅੱਖਰ ਜਾਂਚੋ। ਕਿਹੜਾ ਸ਼ਬਦ ਵੱਖਰਾ ਹੈ?",
      "ਪਹਿਲੇ-ਆਖ਼ਰੀ ਅੱਖਰ ਦੀਆਂ ਲਗਾਂ ਨਾਲ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    NATIVE_AFFIX_FAMILY: [
      "ਕਿਹੜੇ ਸ਼ਬਦ ਦਾ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ?",
      "ਸਾਂਝਾ ਅਗਲਾ ਜਾਂ ਪਿਛਲਾ ਹਿੱਸਾ ਨਾ ਰੱਖਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਕਿਹੜਾ ਸ਼ਬਦ ਇੱਕੋ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
      "ਸ਼ਬਦਾਂ ਦੇ ਜੁੜੇ ਹੋਏ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਨੂੰ ਵੇਖ ਕੇ ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    ],
    RESOLVED_SEMANTIC_CLASS: [
      "ਹਰ ਵਿਕਲਪ ਦੇ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ। ਵੱਖਰੇ ਸਮੂਹ ਦਾ ਸ਼ਬਦ ਚੁਣੋ।",
      "ਉਲਝੇ ਅੱਖਰਾਂ ਤੋਂ ਸ਼ਬਦ ਬਣਾਓ ਅਤੇ ਵੱਖਰੇ ਵਰਗ ਵਾਲਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
      "ਹਰ ਅੱਖਰ-ਸਮੂਹ ਨੂੰ ਸੁਲਝਾਓ। ਬਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵੱਖਰਾ ਹੈ?",
      "ਸ਼ਬਦ ਠੀਕ ਬਣਾ ਕੇ ਉਹ ਸ਼ਬਦ ਚੁਣੋ ਜੋ ਬਾਕੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।",
    ],
  };
  return choose(stems[ruleId], seed, `${locale}:${ruleId}:stem`);
}

function localizedNumber(value: number, locale: ClsCp003LocalizedLocale): string {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(value);
}

function repeatDescription(
  pattern: ClsCp003LocalizedRepeatPattern,
  locale: ClsCp003LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    if (pattern === "ALL_UNIQUE") return "कोई अक्षर दोहरता नहीं है";
    if (pattern === "ONE_REPEATED_UNIT") return "एक अक्षर दोहरता है";
    if (pattern === "MULTIPLE_REPEATED_UNITS") return "एक से अधिक अक्षर दोहरते हैं";
    return "एक अक्षर तीन या अधिक बार आता है";
  }
  if (pattern === "ALL_UNIQUE") return "ਕੋਈ ਅੱਖਰ ਦੁਹਰਾਉਂਦਾ ਨਹੀਂ";
  if (pattern === "ONE_REPEATED_UNIT") return "ਇੱਕ ਅੱਖਰ ਦੁਹਰਾਉਂਦਾ ਹੈ";
  if (pattern === "MULTIPLE_REPEATED_UNITS") return "ਇੱਕ ਤੋਂ ਵੱਧ ਅੱਖਰ ਦੁਹਰਾਉਂਦੇ ਹਨ";
  return "ਇੱਕ ਅੱਖਰ ਤਿੰਨ ਜਾਂ ਵੱਧ ਵਾਰ ਆਉਂਦਾ ਹੈ";
}

function boundaryDescription(
  pattern: ClsCp003LocalizedBoundaryPattern,
  locale: ClsCp003LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    if (pattern === "PLAIN_PLAIN") return "पहले और अंतिम, दोनों अक्षरों पर मात्रा नहीं है";
    if (pattern === "MARKED_PLAIN") return "पहले अक्षर पर मात्रा है, अंतिम पर नहीं";
    if (pattern === "PLAIN_MARKED") return "पहले अक्षर पर मात्रा नहीं, अंतिम पर है";
    return "पहले और अंतिम, दोनों अक्षरों पर मात्रा है";
  }
  if (pattern === "PLAIN_PLAIN") return "ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਦੋਵੇਂ ਅੱਖਰਾਂ ਨਾਲ ਲਗ ਨਹੀਂ";
  if (pattern === "MARKED_PLAIN") return "ਪਹਿਲੇ ਅੱਖਰ ਨਾਲ ਲਗ ਹੈ, ਆਖ਼ਰੀ ਨਾਲ ਨਹੀਂ";
  if (pattern === "PLAIN_MARKED") return "ਪਹਿਲੇ ਅੱਖਰ ਨਾਲ ਲਗ ਨਹੀਂ, ਆਖ਼ਰੀ ਨਾਲ ਹੈ";
  return "ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਦੋਵੇਂ ਅੱਖਰਾਂ ਨਾਲ ਲਗ ਹੈ";
}

function optionEvidence(
  word: string,
  features: ClsCp003LocalizedWordFeatures,
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  locale: ClsCp003LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    switch (ruleId) {
      case "LETTER_UNIT_COUNT":
        return `${word} में ${localizedNumber(features.unitCount, locale)} अक्षर हैं।`;
      case "VOWEL_MARK_COUNT":
        return `${word} में ${localizedNumber(features.vowelMarkCount, locale)} मात्रा-चिह्न हैं।`;
      case "REPEATED_UNIT_TOPOLOGY":
        return `${word}: ${repeatDescription(features.repeatPattern, locale)}।`;
      case "PALINDROME_STATUS": {
        const reversed = [...features.units].reverse().join("");
        return features.palindrome
          ? `${word} को उलटे क्रम में पढ़ने पर भी ${word} ही बनता है।`
          : `${word} को उलटे क्रम में पढ़ने पर ${reversed} बनता है, इसलिए यह वैसा नहीं रहता।`;
      }
      case "BOUNDARY_MARK_PATTERN":
        return `${word}: ${boundaryDescription(features.boundaryPattern, locale)}।`;
      case "NATIVE_AFFIX_FAMILY":
        return `${word} का पहचाना गया साझा हिस्सा ${AFFIX_LABELS[locale][features.primaryAffix] ?? features.primaryAffix} है।`;
    }
  }

  switch (ruleId) {
    case "LETTER_UNIT_COUNT":
      return `${word} ਵਿੱਚ ${localizedNumber(features.unitCount, locale)} ਅੱਖਰ ਹਨ।`;
    case "VOWEL_MARK_COUNT":
      return `${word} ਵਿੱਚ ${localizedNumber(features.vowelMarkCount, locale)} ਲਗਾਂ ਹਨ।`;
    case "REPEATED_UNIT_TOPOLOGY":
      return `${word}: ${repeatDescription(features.repeatPattern, locale)}।`;
    case "PALINDROME_STATUS": {
      const reversed = [...features.units].reverse().join("");
      return features.palindrome
        ? `${word} ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਨ ਤੇ ਵੀ ${word} ਹੀ ਬਣਦਾ ਹੈ।`
        : `${word} ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਨ ਤੇ ${reversed} ਬਣਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਉਹੋ ਜਿਹਾ ਨਹੀਂ ਰਹਿੰਦਾ।`;
    }
    case "BOUNDARY_MARK_PATTERN":
      return `${word}: ${boundaryDescription(features.boundaryPattern, locale)}।`;
    case "NATIVE_AFFIX_FAMILY":
      return `${word} ਦਾ ਪਛਾਣਿਆ ਸਾਂਝਾ ਹਿੱਸਾ ${AFFIX_LABELS[locale][features.primaryAffix] ?? features.primaryAffix} ਹੈ।`;
  }
}

function directConcept(
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  locale: ClsCp003LocalizedLocale,
): string {
  const hi: Record<typeof ruleId, string> = {
    LETTER_UNIT_COUNT: "हर शब्द के लिखित अक्षर गिनिए। अधिकतर शब्दों की गिनती समान होगी।",
    VOWEL_MARK_COUNT: "हर शब्द में दिखाई देने वाले मात्रा-चिह्न गिनिए। अंतर्निहित स्वर को अलग मात्रा न मानें।",
    REPEATED_UNIT_TOPOLOGY: "देखिए कि कोई अक्षर दोहरता है या नहीं और दोहराव कितने अक्षरों में है।",
    PALINDROME_STATUS: "अक्षर-इकाइयों का क्रम उलटकर जाँचिए कि शब्द वही रहता है या बदल जाता है।",
    BOUNDARY_MARK_PATTERN: "केवल पहले और अंतिम अक्षर पर ध्यान दें और जाँचें कि उन पर मात्रा लगी है या नहीं।",
    NATIVE_AFFIX_FAMILY: "शब्दों के आरंभ या अंत में जुड़ा समान हिस्सा खोजिए।",
  };
  const pa: Record<typeof ruleId, string> = {
    LETTER_UNIT_COUNT: "ਹਰ ਸ਼ਬਦ ਦੇ ਲਿਖੇ ਅੱਖਰ ਗਿਣੋ। ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦਾਂ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਹੋਵੇਗੀ।",
    VOWEL_MARK_COUNT: "ਹਰ ਸ਼ਬਦ ਵਿੱਚ ਦਿਖ ਰਹੀਆਂ ਲਗਾਂ ਗਿਣੋ। ਅੰਦਰਲੀ ਧੁਨੀ ਨੂੰ ਵੱਖਰੀ ਲਗ ਨਾ ਮੰਨੋ।",
    REPEATED_UNIT_TOPOLOGY: "ਵੇਖੋ ਕਿ ਕੋਈ ਅੱਖਰ ਦੁਹਰਾਉਂਦਾ ਹੈ ਜਾਂ ਨਹੀਂ ਅਤੇ ਦੁਹਰਾਅ ਕਿੰਨੇ ਅੱਖਰਾਂ ਵਿੱਚ ਹੈ।",
    PALINDROME_STATUS: "ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਕੇ ਜਾਂਚੋ ਕਿ ਸ਼ਬਦ ਉਹੀ ਰਹਿੰਦਾ ਹੈ ਜਾਂ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
    BOUNDARY_MARK_PATTERN: "ਕੇਵਲ ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਨੂੰ ਵੇਖੋ ਅਤੇ ਜਾਂਚੋ ਕਿ ਉਨ੍ਹਾਂ ਨਾਲ ਲਗ ਹੈ ਜਾਂ ਨਹੀਂ।",
    NATIVE_AFFIX_FAMILY: "ਸ਼ਬਦਾਂ ਦੇ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਨਾਲ ਜੁੜਿਆ ਸਾਂਝਾ ਹਿੱਸਾ ਲੱਭੋ।",
  };
  return locale === "hi-IN" ? hi[ruleId] : pa[ruleId];
}

function directShortcut(
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  locale: ClsCp003LocalizedLocale,
): string {
  const hi: Record<typeof ruleId, string> = {
    LETTER_UNIT_COUNT: "पहले सबसे छोटे और सबसे लंबे दिखने वाले शब्द गिनिए; अक्सर उत्तर जल्दी मिल जाता है।",
    VOWEL_MARK_COUNT: "हर मात्रा पर हल्का निशान लगाते चलें और कुल संख्या लिख दें।",
    REPEATED_UNIT_TOPOLOGY: "दोहरते अक्षर को घेरें; बाकी शब्दों का पैटर्न तुरंत साफ हो जाएगा।",
    PALINDROME_STATUS: "शब्द के दोनों सिरों से एक साथ अक्षर मिलाइए; पहला असमान जोड़ा निर्णय दे देता है।",
    BOUNDARY_MARK_PATTERN: "बीच के अक्षर छोड़कर केवल दोनों सिरों को देखें।",
    NATIVE_AFFIX_FAMILY: "समान आरंभ या अंत को रेखांकित करें; बिना उस हिस्से वाला शब्द उत्तर है।",
  };
  const pa: Record<typeof ruleId, string> = {
    LETTER_UNIT_COUNT: "ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਛੋਟਾ ਅਤੇ ਸਭ ਤੋਂ ਲੰਮਾ ਦਿੱਸਦਾ ਸ਼ਬਦ ਗਿਣੋ; ਜਵਾਬ ਜਲਦੀ ਮਿਲ ਜਾਂਦਾ ਹੈ।",
    VOWEL_MARK_COUNT: "ਹਰ ਲਗ ਉੱਤੇ ਹੌਲਾ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਜਾਓ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਲਿਖੋ।",
    REPEATED_UNIT_TOPOLOGY: "ਦੁਹਰਾਉਂਦੇ ਅੱਖਰ ਨੂੰ ਘੇਰੋ; ਬਾਕੀ ਸ਼ਬਦਾਂ ਦਾ ਢੰਗ ਤੁਰੰਤ ਸਾਫ਼ ਹੋ ਜਾਵੇਗਾ।",
    PALINDROME_STATUS: "ਸ਼ਬਦ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਵੇਲੇ ਅੱਖਰ ਮਿਲਾਓ; ਪਹਿਲਾ ਨਾ ਮਿਲਦਾ ਜੋੜ ਫ਼ੈਸਲਾ ਕਰ ਦੇਵੇਗਾ।",
    BOUNDARY_MARK_PATTERN: "ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਛੱਡ ਕੇ ਕੇਵਲ ਦੋਵੇਂ ਸਿਰੇ ਵੇਖੋ।",
    NATIVE_AFFIX_FAMILY: "ਸਾਂਝੇ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਨੂੰ ਰੇਖਾ ਲਗਾਓ; ਉਸ ਹਿੱਸੇ ਤੋਂ ਬਿਨਾਂ ਸ਼ਬਦ ਜਵਾਬ ਹੈ।",
  };
  return locale === "hi-IN" ? hi[ruleId] : pa[ruleId];
}

function directTrap(
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  locale: ClsCp003LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    if (ruleId === "VOWEL_MARK_COUNT") return "ध्वनि के आधार पर स्वर न गिनें; केवल लिखे हुए मात्रा-चिह्न गिनें।";
    if (ruleId === "PALINDROME_STATUS") return "पूरे शब्द की जगह केवल पहले और अंतिम अक्षर देखकर निर्णय न लें।";
    if (ruleId === "NATIVE_AFFIX_FAMILY") return "सिर्फ अर्थ की समानता न देखें; यहाँ शब्द का जुड़ा आरंभ या अंत महत्त्वपूर्ण है।";
    return "अर्थ के आधार पर अलग शब्द चुनने से पहले पूछे गए लिखित पैटर्न की जाँच करें।";
  }
  if (ruleId === "VOWEL_MARK_COUNT") return "ਧੁਨੀ ਦੇ ਆਧਾਰ ਤੇ ਸਵਰ ਨਾ ਗਿਣੋ; ਕੇਵਲ ਲਿਖੀਆਂ ਲਗਾਂ ਗਿਣੋ।";
  if (ruleId === "PALINDROME_STATUS") return "ਪੂਰੇ ਸ਼ਬਦ ਦੀ ਥਾਂ ਕੇਵਲ ਪਹਿਲਾ ਅਤੇ ਆਖ਼ਰੀ ਅੱਖਰ ਵੇਖ ਕੇ ਫ਼ੈਸਲਾ ਨਾ ਕਰੋ।";
  if (ruleId === "NATIVE_AFFIX_FAMILY") return "ਕੇਵਲ ਅਰਥ ਦੀ ਸਾਂਝ ਨਾ ਵੇਖੋ; ਇੱਥੇ ਸ਼ਬਦ ਦਾ ਜੁੜਿਆ ਸ਼ੁਰੂ ਜਾਂ ਅੰਤ ਮਹੱਤਵਪੂਰਨ ਹੈ।";
  return "ਅਰਥ ਦੇ ਆਧਾਰ ਤੇ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਪੁੱਛਿਆ ਲਿਖਤੀ ਢੰਗ ਜਾਂਚੋ।";
}

function directDifficulty(
  ruleId: Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
  optionCount: 4 | 5,
): ClsCp003Difficulty {
  if (ruleId === "LETTER_UNIT_COUNT" && optionCount === 4) return "EASY";
  if (ruleId === "VOWEL_MARK_COUNT" && optionCount === 4) return "EASY";
  if (ruleId === "PALINDROME_STATUS" || optionCount === 5) return "HARD";
  return "MEDIUM";
}

function buildDirectQuestion(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed: number,
  prototypeId: ClsCp003PrototypeId,
  optionCount: 4 | 5,
  targetIndex: number,
) {
  const ruleId = PROTOTYPE_RULE[prototypeId];
  if (ruleId === "RESOLVED_SEMANTIC_CLASS") throw new Error("Direct builder received jumble prototype");
  const state = constructDirectState(locale, ruleId, optionCount, targetIndex, seed);
  const features = state.options.map((word) => analyzeClsCp003LocalizedWord(word, locale));
  const evidenceByOption = state.options.map((word, index) =>
    optionEvidence(word, features[index]!, ruleId, locale),
  );
  const answer = state.options[state.correctIndex]!;
  const conclusion = locale === "hi-IN"
    ? `${answer} का पैटर्न बाकी विकल्पों से अलग है, इसलिए यही उत्तर है।`
    : `${answer} ਦਾ ਢੰਗ ਬਾਕੀ ਵਿਕਲਪਾਂ ਤੋਂ ਵੱਖਰਾ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਜਵਾਬ ਹੈ।`;
  return {
    qlId,
    permanentQlId: qlId,
    checkpointId: "CLS-CP-003" as const,
    prototypeId,
    seed,
    task: "FIND_WORD_STRUCTURE_OUTLIER" as const,
    stem: stemFor(locale, ruleId, seed),
    options: state.options,
    canonicalWords: state.options,
    correctIndex: state.correctIndex,
    answer,
    intendedRuleId: ruleId,
    intendedRuleValue: state.intendedValue,
    evidenceByOption,
    ambiguityAudit: state.audit,
    difficulty: directDifficulty(ruleId, optionCount),
    explanation: {
      coreConcept: [directConcept(ruleId, locale)],
      stepByStep: [...evidenceByOption, conclusion],
      examSpeedShortcut: [directShortcut(ruleId, locale)],
      commonTrapWarning: [directTrap(ruleId, locale)],
    },
  };
}

function buildJumbleQuestion(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed: number,
  prototypeId: ClsCp003PrototypeId,
  optionCount: 4 | 5,
  targetIndex: number,
) {
  const state = constructJumbleState(locale, optionCount, targetIndex, seed);
  const classLabels = CLASS_LABELS[locale];
  const evidenceByOption = state.options.map((displayed, index) => {
    const canonical = state.canonicalWords[index]!;
    const classLabel = classLabels[state.semanticClasses[index]!] ?? state.semanticClasses[index]!;
    return locale === "hi-IN"
      ? `${displayed} के अक्षर सही क्रम में लगाने पर ${canonical} बनता है, जो ${classLabel} है।`
      : `${displayed} ਦੇ ਅੱਖਰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੇ ${canonical} ਬਣਦਾ ਹੈ, ਜੋ ${classLabel} ਹੈ।`;
  });
  const answer = state.options[state.correctIndex]!;
  const answerWord = state.canonicalWords[state.correctIndex]!;
  const commonLabel = classLabels[state.commonClass] ?? state.commonClass;
  const oddLabel = classLabels[state.semanticClasses[state.correctIndex]!] ?? state.semanticClasses[state.correctIndex]!;
  const conclusion = locale === "hi-IN"
    ? `अधिकतर बने हुए शब्द ${commonLabel} हैं, लेकिन ${answerWord} ${oddLabel} है। इसलिए ${answer} सही विकल्प है।`
    : `ਜ਼ਿਆਦਾਤਰ ਬਣੇ ਸ਼ਬਦ ${commonLabel} ਹਨ, ਪਰ ${answerWord} ${oddLabel} ਹੈ। ਇਸ ਲਈ ${answer} ਸਹੀ ਵਿਕਲਪ ਹੈ।`;
  const audit: ClsCp003LocalizedAudit = {
    result: "UNIQUE",
    outlierIndex: state.correctIndex,
    intendedRuleSupported: true,
    candidateSupports: [],
    reason: "Every jumble has one governed resolution and one resolved semantic outlier.",
  };
  return {
    qlId,
    permanentQlId: qlId,
    checkpointId: "CLS-CP-003" as const,
    prototypeId,
    seed,
    task: "RESOLVE_JUMBLES_AND_FIND_OUTLIER" as const,
    stem: stemFor(locale, "RESOLVED_SEMANTIC_CLASS", seed),
    options: state.options,
    canonicalWords: state.canonicalWords,
    correctIndex: state.correctIndex,
    answer,
    intendedRuleId: "RESOLVED_SEMANTIC_CLASS" as const,
    intendedRuleValue: state.commonClass,
    evidenceByOption,
    ambiguityAudit: audit,
    difficulty: optionCount === 5 ? "HARD" as const : "MEDIUM" as const,
    explanation: {
      coreConcept: [locale === "hi-IN"
        ? "हर उलझे विकल्प के अक्षर बदले बिना सही शब्द बनाइए, फिर बने शब्दों का साझा वर्ग पहचानिए।"
        : "ਹਰ ਉਲਝੇ ਵਿਕਲਪ ਦੇ ਅੱਖਰ ਬਦਲੇ ਬਿਨਾਂ ਸਹੀ ਸ਼ਬਦ ਬਣਾਓ, ਫਿਰ ਬਣੇ ਸ਼ਬਦਾਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ਪਛਾਣੋ।"],
      stepByStep: [...evidenceByOption, conclusion],
      examSpeedShortcut: [locale === "hi-IN"
        ? "सबसे आसान उलझा शब्द पहले बनाइए और उसका वर्ग तय करें। फिर बाकी विकल्प उसी वर्ग से मिलाएँ।"
        : "ਸਭ ਤੋਂ ਆਸਾਨ ਉਲਝਿਆ ਸ਼ਬਦ ਪਹਿਲਾਂ ਬਣਾਓ ਅਤੇ ਉਸ ਦਾ ਵਰਗ ਤੈਅ ਕਰੋ। ਫਿਰ ਬਾਕੀ ਵਿਕਲਪ ਉਸੇ ਵਰਗ ਨਾਲ ਮਿਲਾਓ।"],
      commonTrapWarning: [locale === "hi-IN"
        ? "दिखते हुए उलझे अक्षरों की लंबाई से उत्तर न चुनें; पहले हर सही शब्द बनाना जरूरी है।"
        : "ਦਿੱਸ ਰਹੇ ਉਲਝੇ ਅੱਖਰਾਂ ਦੀ ਲੰਬਾਈ ਨਾਲ ਜਵਾਬ ਨਾ ਚੁਣੋ; ਪਹਿਲਾਂ ਹਰ ਸਹੀ ਸ਼ਬਦ ਬਣਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।"],
    },
  };
}

export function generateClsCp003LocalizedQuestion(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const contract = getClsCp003LocalizedContract(qlId);
  if (!contract.locales.includes(locale)) throw new Error(`Unsupported CLS-CP-003 locale: ${locale}`);
  const prototypeId = prototypeForSeed(qlId, seed);
  const optionCount = requestedOptionCount ?? optionCountForSeed(qlId, seed);
  const targetIndex = answerIndexForSeed(qlId, seed, optionCount);
  const core = contract.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER"
    ? buildJumbleQuestion(qlId, locale, seed, prototypeId, optionCount, targetIndex)
    : buildDirectQuestion(qlId, locale, seed, prototypeId, optionCount, targetIndex);
  const dataset = getClsCp003LocalizedDatasetSummary(locale);
  return {
    ...core,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      locale,
      localizationVersion: "cls-cp003-hi-pa-localization-v1" as const,
      runtimeVersion: "cls-cp003-localized-runtime-v1" as const,
      datasetVersion: locale === "hi-IN"
        ? "CLS-CP003-WORD-STRUCTURE-HI-v1" as const
        : "CLS-CP003-WORD-STRUCTURE-PA-v1" as const,
      sourcePrototypeId: prototypeId,
      adaptedRuleId: PROTOTYPE_RULE[prototypeId],
      solveContractId: contract.solveContractId,
      optionCount,
      sourceWordCount: dataset.wordCount,
      sourceJumbleWordCount: dataset.jumbleWordCount,
      sourceSaturationStatus: "NATIVE_DATASET_GOVERNED_REVIEW_REQUIRED" as const,
      parity: {
        qlIdentityPreserved: true as const,
        solveContractPreserved: true as const,
        prototypeSelectionKey: `${qlId}:prototype:${seed}`,
        optionCountKey: `${qlId}:option-count:${seed}`,
        answerIndexKey: `${qlId}:answer-index:${seed}`,
      },
    },
    lifecycle: {
      permanentQlId: qlId,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      questionStudioDiscoverable: false as const,
    },
  };
}

export type GeneratedClsCp003LocalizedQuestion = ReturnType<typeof generateClsCp003LocalizedQuestion>;

export function independentlyVerifyClsCp003LocalizedQuestion(
  question: GeneratedClsCp003LocalizedQuestion,
): ClsCp003LocalizedAudit {
  const locale = question.metadata.locale;
  if (question.task === "FIND_WORD_STRUCTURE_OUTLIER") {
    return auditClsCp003LocalizedWords(
      question.options,
      locale,
      question.intendedRuleId as Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">,
    );
  }

  const resolutionMap = jumbleResolutionMap(locale);
  const resolved = question.options.map((option) => resolutionMap.get(signature(option, locale)) ?? []);
  if (resolved.some((entries) => entries.length !== 1)) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "At least one native jumble does not have exactly one governed resolution.",
    };
  }
  const classes = resolved.map((entries) => entries[0]!.semanticClass);
  const groups = new Map<string, number[]>();
  classes.forEach((semanticClass, index) => {
    const indexes = groups.get(semanticClass) ?? [];
    indexes.push(index);
    groups.set(semanticClass, indexes);
  });
  const common = [...groups.entries()].find(([, indexes]) => indexes.length === classes.length - 1);
  if (!common) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "Resolved native words do not form one common semantic class plus one outlier.",
    };
  }
  const matching = new Set(common[1]);
  const outlierIndex = classes.findIndex((_, index) => !matching.has(index));
  return {
    result: "UNIQUE",
    outlierIndex,
    intendedRuleSupported: true,
    candidateSupports: [],
    reason: "Every native jumble resolves uniquely and the resolved words have one semantic outlier.",
  };
}
