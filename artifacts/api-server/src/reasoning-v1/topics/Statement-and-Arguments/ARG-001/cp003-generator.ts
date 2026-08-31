import { renderArgCp003Template, reverseArgAnswerClass } from "./cp003-saturation-helpers.ts";
import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import type { ArgAnswerClass, ArgQlId } from "./types.ts";

export const ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL = 2048 as const;
export const ARG_CP003_TEMPLATE_COUNT_PER_QL = 8 as const;
export const ARG_CP003_VARIANTS_PER_TEMPLATE = 256 as const;

export const ARG_CP003_OPTIONS = Object.freeze([
  "Only argument I is strong",
  "Only argument II is strong",
  "Both arguments I and II are strong",
  "Neither argument I nor II is strong",
] as const);

const QL_MULTIPLIER: Readonly<Record<ArgQlId, number>> = Object.freeze({
  "ARG-QL-001": 1093,
  "ARG-QL-002": 1531,
  "ARG-QL-003": 1877,
  "ARG-QL-004": 1261,
  "ARG-QL-005": 1709,
  "ARG-QL-006": 1001,
});

const QL_OFFSET: Readonly<Record<ArgQlId, number>> = Object.freeze({
  "ARG-QL-001": 137,
  "ARG-QL-002": 911,
  "ARG-QL-003": 421,
  "ARG-QL-004": 1607,
  "ARG-QL-005": 733,
  "ARG-QL-006": 1201,
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

function indexForAnswer(answerClass: ArgAnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

export function scheduleArgCp003Surface(input: { readonly qlId: ArgQlId; readonly seed: number }) {
  const normalizedSeed = Math.trunc(Number.isFinite(input.seed) ? input.seed : 0);
  const semanticSlot = positiveModulo(
    Math.imul(normalizedSeed, QL_MULTIPLIER[input.qlId]) + QL_OFFSET[input.qlId],
    ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  );
  const templateIndex = templateIndexFromCode(semanticSlot);
  const variantIndex = compressedVariantIndex(semanticSlot);
  const presentationBlock = Math.floor(normalizedSeed / ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL);
  const reverseArguments = Boolean(((semanticSlot >>> 10) ^ (semanticSlot >>> 5) ^ presentationBlock ^ templateIndex) & 1);
  return Object.freeze({ semanticSlot, templateIndex, variantIndex, presentationBlock, reverseArguments });
}

export function generateArgCp003Question(input: { readonly qlId: ArgQlId; readonly seed: number }) {
  const templates = ARG_CP003_TEMPLATES_BY_QL[input.qlId];
  if (templates.length !== ARG_CP003_TEMPLATE_COUNT_PER_QL) {
    throw new Error(`${input.qlId}: CP003 requires exactly ${ARG_CP003_TEMPLATE_COUNT_PER_QL} templates; found ${templates.length}`);
  }

  const schedule = scheduleArgCp003Surface(input);
  const rendered = renderArgCp003Template(templates[schedule.templateIndex]!, schedule.variantIndex);
  const orderedArguments = schedule.reverseArguments
    ? [rendered.arguments[1], rendered.arguments[0]] as const
    : rendered.arguments;
  const answerClass = schedule.reverseArguments ? reverseArgAnswerClass(rendered.answerClass) : rendered.answerClass;

  const explanation = orderedArguments.map((argument, index) => {
    const label = index === 0 ? "I" : "II";
    return `Argument ${label} is ${argument.strength.toLowerCase()}: ${argument.explanation}`;
  }).join(" ");

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: "ARG-CP-003" as const,
    version: "CP003" as const,
    qlId: input.qlId,
    scenarioId: `${rendered.templateId}-V${rendered.variantIndex.toString(16).padStart(2, "0")}`,
    templateId: rendered.templateId,
    variantIndex: rendered.variantIndex,
    variantKey: rendered.variantKey,
    locale: "en-IN" as const,
    seed: input.seed,
    difficulty: rendered.difficulty,
    archetype: rendered.archetype,
    statement: rendered.statement,
    arguments: [orderedArguments[0].text, orderedArguments[1].text] as const,
    argumentStrengths: [orderedArguments[0].strength, orderedArguments[1].strength] as const,
    options: ARG_CP003_OPTIONS,
    correctIndex: indexForAnswer(answerClass),
    answerClass,
    explanation,
    metadata: Object.freeze({
      authority: "ARGUMENT_STRENGTH_VARIABLEIZED_V1" as const,
      templateId: rendered.templateId,
      variantIndex: rendered.variantIndex,
      variantKey: rendered.variantKey,
      semanticSlot: schedule.semanticSlot,
      presentationBlock: schedule.presentationBlock,
      argumentsReversed: schedule.reverseArguments,
      archetype: rendered.archetype,
      antiGamingScheduler: "ARG_CP003_BIJECTIVE_2048_SURFACE" as const,
      semanticSurfaceCapacityPerQl: ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
      saturationReady: true as const,
      localizationStatus: "ENGLISH_ONLY_PENDING_CP004" as const,
      reviewOnly: true as const,
      questionStudioRegistered: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
