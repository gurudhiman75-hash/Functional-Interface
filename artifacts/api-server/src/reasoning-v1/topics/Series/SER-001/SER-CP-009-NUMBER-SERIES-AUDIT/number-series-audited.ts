import {
  generateSerCp009NumberSeries as generateFinalPrototype,
  solveVisibleNumberSeries as solveFinalPrototype,
} from "./number-series-final";
import {
  SER_CP009_NUMBER_SERIES_QL_IDS as SOURCE_GAP_QL_IDS,
  SER_CP009_QL_AUTHORITIES as SOURCE_GAP_AUTHORITIES,
  type GeneratedSerCp009Question,
  type SerCp009Difficulty,
  type SerCp009Locale,
  type SerCp009Option,
  type SerCp009QlId,
} from "./number-series";

export type SerCp009AuditedQlId = Exclude<SerCp009QlId, "SER-QL-042">;

export const SER_CP009_REJECTED_SOURCE_GAP = Object.freeze({
  qlId: "SER-QL-042" as const,
  sourcePrototype: "INTERNAL_DIGIT_RELATION_OPTION_SERIES" as const,
  auditDecision: "REJECT_WRONG_CHAPTER_OWNERSHIP" as const,
  reason: "The displayed values do not form a cross-term progression; each option merely satisfies an internal digit relation. That is number-relation/classification logic, not Series.",
  permanentQlReserved: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export const SER_CP009_AUDITED_QL_IDS = Object.freeze(
  SOURCE_GAP_QL_IDS.filter((qlId): qlId is SerCp009AuditedQlId => qlId !== "SER-QL-042"),
);

export const SER_CP009_AUDITED_QL_AUTHORITIES = Object.freeze(
  SOURCE_GAP_AUTHORITIES.filter(([qlId]) => qlId !== "SER-QL-042"),
);

if (SER_CP009_AUDITED_QL_IDS.length !== 13) {
  throw new Error(`SER-CP-009 audited QL count drifted: ${SER_CP009_AUDITED_QL_IDS.length}`);
}
if (SER_CP009_AUDITED_QL_IDS.includes("SER-QL-042" as SerCp009AuditedQlId)) {
  throw new Error("SER-QL-042 must remain excluded from the audited Series candidate.");
}

function stableIndex(seed: number, salt: number, modulus: number): number {
  let value = (seed ^ Math.imul(salt, 0x9e3779b9)) >>> 0;
  value = (value ^ (value >>> 16)) >>> 0;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value = (value ^ (value >>> 15)) >>> 0;
  return value % modulus;
}

function local(locale: SerCp009Locale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

function structuralDifficulty(question: GeneratedSerCp009Question): SerCp009Difficulty {
  const features = question.structuralFeatures;
  const layers = Number(features.reasoningLayers ?? features.layers ?? 1);
  const channels = Number(features.channels ?? 1);

  // Count independently visible burdens once. Pattern-family markers such as
  // figurate differences, alternating operations and prime strides identify a
  // non-trivial inference family, but they must not add a second point on top
  // of reasoningLayers that already encodes the recognition burden.
  const baseScore = layers
    + Math.max(0, channels - 1)
    + (features.internalGap === true ? 1 : 0)
    + (features.diagnostic === true ? 1 : 0);
  const needsPatternRecognition =
    typeof features.figurateKind === "string"
    || typeof features.operationCycle === "string"
    || typeof features.primeStride === "number";
  const score = Math.max(baseScore, needsPatternRecognition ? 3 : 0);

  if (score >= 4) return "HARD";
  if (score >= 3) return "MEDIUM";
  return "EASY";
}

function optionize(
  correct: string,
  distractors: readonly { value: string; errorLabel: string }[],
  correctIndex: number,
): readonly SerCp009Option[] {
  const unique = distractors.filter((entry, index, all) =>
    entry.value !== correct && all.findIndex((candidate) => candidate.value === entry.value) === index,
  );
  if (unique.length < 3) throw new Error("SER-QL-039 audited option construction needs three unique distractors.");
  const options: SerCp009Option[] = unique.slice(0, 3).map((entry) => ({ ...entry }));
  options.splice(correctIndex, 0, { value: correct, errorLabel: null });
  return Object.freeze(options);
}

function auditedDigitRotation(
  source: GeneratedSerCp009Question,
  seed: number,
  locale: SerCp009Locale,
): GeneratedSerCp009Question {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const aIndex = stableIndex(seed, 31, pool.length);
  const a = pool[aIndex]!;
  pool.splice(aIndex, 1);
  const bIndex = stableIndex(seed, 32, pool.length);
  const b = pool[bIndex]!;
  pool.splice(bIndex, 1);
  const c = pool[stableIndex(seed, 33, pool.length)]!;
  const fixed = stableIndex(seed, 34, 10);

  const t0 = `${a}${b}${c}${fixed}`;
  const t1 = `${b}${c}${a}${fixed}`;
  const t2 = `${c}${a}${b}${fixed}`;
  const swap = `${a}${c}${b}${fixed}`;
  const correctIndex = (seed + 39) % 4;
  const options = optionize(t1, [
    { value: t2, errorLabel: "ROTATED_ONE_EXTRA_STEP" },
    { value: t0, errorLabel: "REPEATED_STARTING_BLOCK" },
    { value: swap, errorLabel: "SWAPPED_PREFIX_DIGITS" },
  ], correctIndex);

  const prompt = local(
    locale,
    "Which number will replace the question mark in the following series?",
    "निम्नलिखित श्रृंखला में प्रश्नवाचक चिन्ह के स्थान पर कौन-सी संख्या आएगी?",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?",
  );
  const explanation = Object.freeze([
    local(
      locale,
      "The last digit stays fixed. The first three digits rotate one place to the left.",
      "अंतिम अंक स्थिर रहता है। पहले तीन अंक एक स्थान बाएँ घूमते हैं।",
      "ਆਖਰੀ ਅੰਕ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ। ਪਹਿਲੇ ਤਿੰਨ ਅੰਕ ਇੱਕ ਥਾਂ ਖੱਬੇ ਘੁੰਮਦੇ ਹਨ।",
    ),
    `${t0} → ${t1} → ${t2} → ${t0} → ${t1}`,
    local(locale, `Therefore the next number is ${t1}.`, `अतः अगली संख्या ${t1} है।`, `ਇਸ ਲਈ ਅਗਲੀ ਸੰਖਿਆ ${t1} ਹੈ।`),
  ]);

  return Object.freeze({
    ...source,
    seed,
    taskKind: "NEXT_TERM",
    stem: `${prompt}\n${t0}, ${t1}, ${t2}, ${t0}, ?`,
    options,
    correctIndex,
    correctAnswer: t1,
    explanation,
    difficulty: "MEDIUM",
    structuralFeatures: Object.freeze({
      layers: 2,
      channels: 2,
      digitBlockLength: 3,
      fixedDigitCount: 1,
      leadingZeroForbidden: true,
      reasoningLayers: 2,
    }),
  });
}

export function assertSerCp009AuditedQlId(value: string): asserts value is SerCp009AuditedQlId {
  if (value === "SER-QL-042") {
    throw new Error("SER-QL-042 was rejected by the final audit because internal digit relation is not a Series progression.");
  }
  if (!(SER_CP009_AUDITED_QL_IDS as readonly string[]).includes(value)) {
    throw new Error(`Unsupported audited SER-CP-009 QL '${value}'.`);
  }
}

export function solveVisibleAuditedNumberSeries(
  qlId: SerCp009AuditedQlId,
  stem: string,
  options: readonly string[] = [],
): string {
  return solveFinalPrototype(qlId, stem, options);
}

export function generateSerCp009AuditedNumberSeries(
  qlId: SerCp009AuditedQlId,
  seed = 1,
  locale: SerCp009Locale = "en-IN",
): GeneratedSerCp009Question {
  const generated = generateFinalPrototype(qlId, seed, locale);
  const editorial = qlId === "SER-QL-039" ? auditedDigitRotation(generated, seed, locale) : generated;
  const difficulty = structuralDifficulty(editorial);
  if (difficulty === editorial.difficulty) return editorial;
  return Object.freeze({
    ...editorial,
    difficulty,
    structuralFeatures: Object.freeze({
      ...editorial.structuralFeatures,
      auditedDifficultyScoreModel: "STRUCTURAL_V3_NO_DOUBLE_COUNT",
    }),
  });
}
