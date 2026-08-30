import { renderStcV22Template } from "./editorial-v2-2-saturation-helpers.ts";
import { STC_V22_TEMPLATES_BY_QL } from "./editorial-v2-2-templates.ts";
import { reverseStcV2AnswerClass } from "./editorial-v2-scheduler.ts";
import type { StcLocale, StcQlId } from "./types.ts";
import type { StcV2AnswerClass } from "./editorial-v2-types.ts";

export const STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL = 2048 as const;
export const STC_V22_TEMPLATE_COUNT_PER_QL = 8 as const;
export const STC_V22_VARIANTS_PER_TEMPLATE = 256 as const;

const OPTIONS: Record<StcLocale, readonly [string, string, string, string]> = {
  "en-IN": ["Only conclusion I follows", "Only conclusion II follows", "Both conclusions I and II follow", "Neither conclusion I nor II follows"],
  "hi-IN": ["केवल निष्कर्ष I अनुसरण करता है", "केवल निष्कर्ष II अनुसरण करता है", "निष्कर्ष I और II दोनों अनुसरण करते हैं", "न तो निष्कर्ष I और न ही II अनुसरण करता है"],
  "pa-IN": ["ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ", "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ"],
};

const QL_MULTIPLIER: Readonly<Record<StcQlId, number>> = Object.freeze({
  "STC-QL-001": 1093,
  "STC-QL-002": 1531,
  "STC-QL-003": 1877,
  "STC-QL-004": 1261,
  "STC-QL-005": 1709,
  "STC-QL-006": 1981,
});

const QL_OFFSET: Readonly<Record<StcQlId, number>> = Object.freeze({
  "STC-QL-001": 137,
  "STC-QL-002": 911,
  "STC-QL-003": 421,
  "STC-QL-004": 1607,
  "STC-QL-005": 733,
  "STC-QL-006": 1201,
});

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function compressedVariantIndex(code: number): number {
  const sourceBits = [1, 2, 3, 5, 6, 7, 9, 10] as const;
  let result = 0;
  for (let outputBit = 0; outputBit < sourceBits.length; outputBit += 1) {
    result |= ((code >>> sourceBits[outputBit]!) & 1) << outputBit;
  }
  return result;
}

function templateIndexFromCode(code: number): number {
  return (code & 1) | (((code >>> 4) & 1) << 1) | (((code >>> 8) & 1) << 2);
}

function indexForAnswer(answerClass: StcV2AnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

function followsFlags(answerClass: StcV2AnswerClass): readonly [boolean, boolean] {
  switch (answerClass) {
    case "ONLY_I": return [true, false];
    case "ONLY_II": return [false, true];
    case "BOTH": return [true, true];
    case "NEITHER": return [false, false];
  }
}

function explanationLine(locale: StcLocale, label: "I" | "II", follows: boolean, reason: string): string {
  if (locale === "en-IN") return `${label} ${follows ? "follows" : "does not follow"}: ${reason}`;
  if (locale === "hi-IN") return `निष्कर्ष ${label} ${follows ? "अनुसरण करता है" : "अनुसरण नहीं करता है"}: ${reason}`;
  return `ਨਤੀਜਾ ${label} ${follows ? "ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ" : "ਅਨੁਸਰਣ ਨਹੀਂ ਕਰਦਾ"}: ${reason}`;
}

function checkpointFor(qlId: StcQlId): "STC-CP-001" | "STC-CP-002" | "STC-CP-003" {
  if (qlId === "STC-QL-001" || qlId === "STC-QL-002") return "STC-CP-001";
  if (qlId === "STC-QL-003" || qlId === "STC-QL-004") return "STC-CP-002";
  return "STC-CP-003";
}

export function scheduleStcV22Surface(input: { readonly qlId: StcQlId; readonly seed: number }) {
  const semanticSlot = positiveModulo(
    Math.imul(Math.trunc(Number.isFinite(input.seed) ? input.seed : 0), QL_MULTIPLIER[input.qlId]) + QL_OFFSET[input.qlId],
    STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  );
  const templateIndex = templateIndexFromCode(semanticSlot);
  const variantIndex = compressedVariantIndex(semanticSlot);
  const presentationBlock = Math.floor(Math.trunc(Number.isFinite(input.seed) ? input.seed : 0) / STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL);
  const reverseConclusions = Boolean(((semanticSlot >>> 10) ^ (semanticSlot >>> 5) ^ presentationBlock ^ templateIndex) & 1);
  return Object.freeze({ semanticSlot, templateIndex, variantIndex, presentationBlock, reverseConclusions });
}

export function generateStcV22Question(input: {
  readonly qlId: StcQlId;
  readonly locale: StcLocale;
  readonly seed: number;
}) {
  const templates = STC_V22_TEMPLATES_BY_QL[input.qlId];
  if (templates.length !== STC_V22_TEMPLATE_COUNT_PER_QL) {
    throw new Error(`${input.qlId}: STC V2.2 requires exactly ${STC_V22_TEMPLATE_COUNT_PER_QL} templates; found ${templates.length}.`);
  }

  const schedule = scheduleStcV22Surface(input);
  const template = templates[schedule.templateIndex]!;
  const rendered = renderStcV22Template(template, input.locale, schedule.variantIndex);
  const answerClass = schedule.reverseConclusions ? reverseStcV2AnswerClass(rendered.answerClass) : rendered.answerClass;
  const conclusions = schedule.reverseConclusions
    ? [rendered.conclusions[1], rendered.conclusions[0]] as const
    : rendered.conclusions;
  const reasons = schedule.reverseConclusions
    ? [rendered.explanation[1], rendered.explanation[0]] as const
    : rendered.explanation;
  const [firstFollows, secondFollows] = followsFlags(answerClass);

  return Object.freeze({
    chapterId: "STC-001" as const,
    version: "V2.2" as const,
    checkpointId: checkpointFor(input.qlId),
    qlId: input.qlId,
    scenarioId: `${rendered.templateId}-V${rendered.variantIndex.toString(16).padStart(2, "0")}`,
    templateId: rendered.templateId,
    variantIndex: rendered.variantIndex,
    variantKey: rendered.variantKey,
    locale: input.locale,
    seed: input.seed,
    difficulty: rendered.difficulty,
    surfaceArchetype: rendered.surfaceArchetype,
    stem: rendered.statement,
    conclusions,
    options: OPTIONS[input.locale],
    correctIndex: indexForAnswer(answerClass),
    answerClass,
    explanation: [
      explanationLine(input.locale, "I", firstFollows, reasons[0]),
      explanationLine(input.locale, "II", secondFollows, reasons[1]),
    ].join(" "),
    metadata: Object.freeze({
      authority: "VARIABLEIZED_EDITORIAL_ENTAILMENT_V2_2" as const,
      templateId: rendered.templateId,
      variantIndex: rendered.variantIndex,
      variantKey: rendered.variantKey,
      semanticSlot: schedule.semanticSlot,
      presentationBlock: schedule.presentationBlock,
      conclusionsReversed: schedule.reverseConclusions,
      surfaceArchetype: rendered.surfaceArchetype,
      repeatedInstructionEmbeddedInStem: false as const,
      trilingualTemplateParity: true as const,
      antiGamingScheduler: "STC_V2_2_BIJECTIVE_2048_SURFACE" as const,
      semanticSurfaceCapacityPerQl: STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
      saturationReady: true as const,
      reviewOnly: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticPublication: false as const,
    }),
  });
}
