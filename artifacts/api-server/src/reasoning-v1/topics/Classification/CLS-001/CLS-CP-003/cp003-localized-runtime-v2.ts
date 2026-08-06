import {
  getClsCp003LocalizedContract,
  type ClsCp003LocalizedLocale,
  type ClsCp003LocalizedQlId,
} from "./cp003-localized-contracts";
import {
  analyzeClsCp003LocalizedWord,
  auditClsCp003LocalizedWords,
  generateClsCp003LocalizedQuestion as generateV1,
  independentlyVerifyClsCp003LocalizedQuestion as verifyV1,
  type ClsCp003LocalizedBoundaryPattern,
  type ClsCp003LocalizedRepeatPattern,
  type ClsCp003LocalizedRuleId,
  type ClsCp003LocalizedWordFeatures,
} from "./cp003-localized-runtime";
import { CLS_CP003_LOCALIZED_WORDS, type ClsCp003LocalizedWordEntry } from "./word-dataset.localized";
import type { ClsCp003PrototypeId } from "./types";

type DirectRuleId = Exclude<ClsCp003LocalizedRuleId, "RESOLVED_SEMANTIC_CLASS">;

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

const PROTOTYPE_RULE: Readonly<Record<ClsCp003PrototypeId, ClsCp003LocalizedRuleId>> = {
  "CLS-CP003-PROT-001": "LETTER_UNIT_COUNT",
  "CLS-CP003-PROT-002": "VOWEL_MARK_COUNT",
  "CLS-CP003-PROT-003": "REPEATED_UNIT_TOPOLOGY",
  "CLS-CP003-PROT-004": "PALINDROME_STATUS",
  "CLS-CP003-PROT-005": "BOUNDARY_MARK_PATTERN",
  "CLS-CP003-PROT-006": "NATIVE_AFFIX_FAMILY",
  "CLS-CP003-PROT-007": "RESOLVED_SEMANTIC_CLASS",
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

function ruleValue(features: ClsCp003LocalizedWordFeatures, ruleId: DirectRuleId): string {
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

function balancedKey(features: ClsCp003LocalizedWordFeatures, ruleId: DirectRuleId): string {
  const intended = ruleValue(features, ruleId);
  switch (ruleId) {
    case "LETTER_UNIT_COUNT":
      return intended;
    case "VOWEL_MARK_COUNT":
      return `${intended}|U${features.unitCount}`;
    case "REPEATED_UNIT_TOPOLOGY":
      return `${intended}|U${features.unitCount}|M${features.vowelMarkCount}`;
    case "PALINDROME_STATUS":
      return `${intended}|U${features.unitCount}`;
    case "BOUNDARY_MARK_PATTERN":
      return `${intended}|U${features.unitCount}|M${features.vowelMarkCount}`;
    case "NATIVE_AFFIX_FAMILY":
      return intended;
  }
}

function eligibleForRule(features: ClsCp003LocalizedWordFeatures, ruleId: DirectRuleId): boolean {
  if (ruleId === "PALINDROME_STATUS") return features.unitCount >= 3;
  return true;
}

function nuisanceMatches(
  common: ClsCp003LocalizedWordFeatures,
  candidate: ClsCp003LocalizedWordFeatures,
  ruleId: DirectRuleId,
): boolean {
  switch (ruleId) {
    case "LETTER_UNIT_COUNT":
      return Math.abs(candidate.unitCount - common.unitCount) <= 2;
    case "VOWEL_MARK_COUNT":
      return candidate.unitCount === common.unitCount;
    case "REPEATED_UNIT_TOPOLOGY":
      return candidate.unitCount === common.unitCount
        && candidate.vowelMarkCount === common.vowelMarkCount;
    case "PALINDROME_STATUS":
      return candidate.unitCount === common.unitCount && candidate.unitCount >= 3;
    case "BOUNDARY_MARK_PATTERN":
      return candidate.unitCount === common.unitCount
        && candidate.vowelMarkCount === common.vowelMarkCount;
    case "NATIVE_AFFIX_FAMILY":
      return true;
  }
}

function arrangeWithTarget<T>(common: readonly T[], odd: T, targetIndex: number): T[] {
  const result = [...common];
  result.splice(targetIndex, 0, odd);
  return result;
}

function constructBalancedDirectState(
  locale: ClsCp003LocalizedLocale,
  ruleId: DirectRuleId,
  optionCount: 4 | 5,
  targetIndex: number,
  seed: number,
) {
  const words = CLS_CP003_LOCALIZED_WORDS[locale];
  const featuresByWord = new Map(
    words.map((entry) => [
      entry.word,
      analyzeClsCp003LocalizedWord(entry.word, locale, entry.primaryAffix),
    ]),
  );

  for (let attempt = 0; attempt < 2400; attempt += 1) {
    const rng = makeRng(seed + attempt * 104729, `${locale}:${ruleId}:balanced-v2`);
    const groups = new Map<string, ClsCp003LocalizedWordEntry[]>();
    for (const entry of words) {
      const features = featuresByWord.get(entry.word)!;
      if (!eligibleForRule(features, ruleId)) continue;
      if (ruleId === "NATIVE_AFFIX_FAMILY" && features.primaryAffix === "NONE") continue;
      const key = balancedKey(features, ruleId);
      const group = groups.get(key) ?? [];
      group.push(entry);
      groups.set(key, group);
    }
    const viable = [...groups.values()].filter((group) => group.length >= optionCount - 1);
    if (viable.length === 0) throw new Error(`No balanced native group for ${locale}/${ruleId}`);
    const commonPool = viable[rng.int(viable.length)]!;
    const commonEntries = sampleDistinct(commonPool, optionCount - 1, rng);
    const commonFeatures = featuresByWord.get(commonEntries[0]!.word)!;
    const commonValue = ruleValue(commonFeatures, ruleId);
    let oddPool = words.filter((entry) => {
      if (commonEntries.some((common) => common.word === entry.word)) return false;
      const features = featuresByWord.get(entry.word)!;
      return eligibleForRule(features, ruleId)
        && ruleValue(features, ruleId) !== commonValue
        && nuisanceMatches(commonFeatures, features, ruleId);
    });
    if (ruleId === "LETTER_UNIT_COUNT") {
      const close = oddPool.filter((entry) =>
        Math.abs(featuresByWord.get(entry.word)!.unitCount - commonFeatures.unitCount) === 1,
      );
      if (close.length > 0) oddPool = close;
    }
    if (oddPool.length === 0) continue;
    const oddEntry = oddPool[rng.int(oddPool.length)]!;
    const options = arrangeWithTarget(commonEntries.map((entry) => entry.word), oddEntry.word, targetIndex);
    const audit = auditClsCp003LocalizedWords(options, locale, ruleId);
    if (audit.result !== "UNIQUE" || audit.outlierIndex !== targetIndex) continue;
    return {
      options,
      correctIndex: targetIndex,
      intendedValue: commonValue,
      ambiguityAudit: audit,
    } as const;
  }
  throw new Error(`Unable to construct balanced native state for ${locale}/${ruleId}/${seed}`);
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

function countSentence(
  word: string,
  value: number,
  kind: "LETTER" | "MARK",
  locale: ClsCp003LocalizedLocale,
): string {
  const number = localizedNumber(value, locale);
  if (locale === "hi-IN") {
    if (kind === "LETTER") return `'${word}' में ${number} ${value === 1 ? "अक्षर है" : "अक्षर हैं"}।`;
    return `'${word}' में ${number} ${value === 1 ? "मात्रा-चिह्न है" : "मात्रा-चिह्न हैं"}।`;
  }
  if (kind === "LETTER") return `'${word}' ਵਿੱਚ ${number} ${value === 1 ? "ਅੱਖਰ ਹੈ" : "ਅੱਖਰ ਹਨ"}।`;
  return `'${word}' ਵਿੱਚ ${number} ${value === 1 ? "ਲਗ ਹੈ" : "ਲਗਾਂ ਹਨ"}।`;
}

function optionEvidence(
  word: string,
  features: ClsCp003LocalizedWordFeatures,
  ruleId: DirectRuleId,
  locale: ClsCp003LocalizedLocale,
): string {
  if (ruleId === "LETTER_UNIT_COUNT") return countSentence(word, features.unitCount, "LETTER", locale);
  if (ruleId === "VOWEL_MARK_COUNT") return countSentence(word, features.vowelMarkCount, "MARK", locale);
  if (locale === "hi-IN") {
    switch (ruleId) {
      case "REPEATED_UNIT_TOPOLOGY":
        return `'${word}': ${repeatDescription(features.repeatPattern, locale)}।`;
      case "PALINDROME_STATUS": {
        const reversed = [...features.units].reverse().join("");
        return features.palindrome
          ? `'${word}' का अक्षर-क्रम उलटने पर भी '${word}' ही बनता है।`
          : `'${word}' का अक्षर-क्रम उलटने पर '${reversed}' बनता है; मूल शब्द नहीं रहता।`;
      }
      case "BOUNDARY_MARK_PATTERN":
        return `'${word}': ${boundaryDescription(features.boundaryPattern, locale)}।`;
      case "NATIVE_AFFIX_FAMILY":
        return `शब्द '${word}' में पहचाना गया साझा हिस्सा ${AFFIX_LABELS[locale][features.primaryAffix] ?? features.primaryAffix} है।`;
      default:
        throw new Error(`Unsupported Hindi evidence rule: ${ruleId}`);
    }
  }
  switch (ruleId) {
    case "REPEATED_UNIT_TOPOLOGY":
      return `'${word}': ${repeatDescription(features.repeatPattern, locale)}।`;
    case "PALINDROME_STATUS": {
      const reversed = [...features.units].reverse().join("");
      return features.palindrome
        ? `'${word}' ਦਾ ਅੱਖਰ-ਕ੍ਰਮ ਉਲਟਣ ਤੇ ਵੀ '${word}' ਹੀ ਬਣਦਾ ਹੈ।`
        : `'${word}' ਦਾ ਅੱਖਰ-ਕ੍ਰਮ ਉਲਟਣ ਤੇ '${reversed}' ਬਣਦਾ ਹੈ; ਮੂਲ ਸ਼ਬਦ ਨਹੀਂ ਰਹਿੰਦਾ।`;
    }
    case "BOUNDARY_MARK_PATTERN":
      return `'${word}': ${boundaryDescription(features.boundaryPattern, locale)}।`;
    case "NATIVE_AFFIX_FAMILY":
      return `ਸ਼ਬਦ '${word}' ਵਿੱਚ ਪਛਾਣਿਆ ਸਾਂਝਾ ਹਿੱਸਾ ${AFFIX_LABELS[locale][features.primaryAffix] ?? features.primaryAffix} ਹੈ।`;
    default:
      throw new Error(`Unsupported Punjabi evidence rule: ${ruleId}`);
  }
}

function directConclusion(answer: string, locale: ClsCp003LocalizedLocale): string {
  return locale === "hi-IN"
    ? `बाकी विकल्प एक ही लिखित पैटर्न रखते हैं; '${answer}' वाला विकल्प अलग है, इसलिए वही उत्तर है।`
    : `ਬਾਕੀ ਵਿਕਲਪ ਇੱਕੋ ਲਿਖਤੀ ਢੰਗ ਰੱਖਦੇ ਹਨ; '${answer}' ਵਾਲਾ ਵਿਕਲਪ ਵੱਖਰਾ ਹੈ, ਇਸ ਲਈ ਉਹੀ ਜਵਾਬ ਹੈ।`;
}

export function generateClsCp003LocalizedQuestionV2(
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
  const base = generateV1(qlId, locale, seed, requestedOptionCount);
  if (base.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
    return {
      ...base,
      metadata: {
        ...base.metadata,
        localizationVersion: "cls-cp003-hi-pa-localization-v2" as const,
        runtimeVersion: "cls-cp003-localized-runtime-v2" as const,
      },
    };
  }

  const ruleId = PROTOTYPE_RULE[base.prototypeId];
  if (ruleId === "RESOLVED_SEMANTIC_CLASS") throw new Error("Direct QL selected jumble prototype");
  const state = constructBalancedDirectState(
    locale,
    ruleId,
    base.options.length as 4 | 5,
    base.correctIndex,
    seed,
  );
  const features = state.options.map((word) => analyzeClsCp003LocalizedWord(word, locale));
  const evidenceByOption = state.options.map((word, index) =>
    optionEvidence(word, features[index]!, ruleId, locale),
  );
  const answer = state.options[state.correctIndex]!;
  return {
    ...base,
    options: state.options,
    canonicalWords: state.options,
    correctIndex: state.correctIndex,
    answer,
    intendedRuleId: ruleId,
    intendedRuleValue: state.intendedValue,
    evidenceByOption,
    ambiguityAudit: state.ambiguityAudit,
    explanation: {
      ...base.explanation,
      stepByStep: [...evidenceByOption, directConclusion(answer, locale)],
    },
    metadata: {
      ...base.metadata,
      localizationVersion: "cls-cp003-hi-pa-localization-v2" as const,
      runtimeVersion: "cls-cp003-localized-runtime-v2" as const,
    },
  };
}

export type GeneratedClsCp003LocalizedQuestionV2 = ReturnType<
  typeof generateClsCp003LocalizedQuestionV2
>;

export function independentlyVerifyClsCp003LocalizedQuestionV2(
  question: GeneratedClsCp003LocalizedQuestionV2,
) {
  if (question.task === "FIND_WORD_STRUCTURE_OUTLIER") {
    return auditClsCp003LocalizedWords(
      question.options,
      question.metadata.locale,
      question.intendedRuleId as DirectRuleId,
    );
  }
  return verifyV1(question as unknown as Parameters<typeof verifyV1>[0]);
}
