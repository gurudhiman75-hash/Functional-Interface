import { generateArgCp003Question } from "./cp003-generator.ts";
import { getArgCp004LocalizedTemplate } from "./cp004-localized-templates.ts";
import { renderArgCp004LocalizedTemplate } from "./cp004-localization-helpers.ts";
import { ARG_CP004_OPTIONS } from "./cp004-review-options.ts";
import type { ArgLocale, ArgQlId, ArgStrength } from "./types.ts";

function strengthWord(locale: ArgLocale, strength: ArgStrength): string {
  if (locale === "hi-IN") return strength === "STRONG" ? "मजबूत" : "कमजोर";
  if (locale === "pa-IN") return strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ";
  return strength.toLowerCase();
}

function explanationPrefix(locale: ArgLocale, index: number, strength: ArgStrength): string {
  const label = index === 0 ? "I" : "II";
  if (locale === "hi-IN") return `तर्क ${label} ${strengthWord(locale, strength)} है:`;
  if (locale === "pa-IN") return `ਦਲੀਲ ${label} ${strengthWord(locale, strength)} ਹੈ:`;
  return `Argument ${label} is ${strengthWord(locale, strength)}:`;
}

export function generateArgCp004Question(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale;
  readonly seed: number;
}) {
  const base = generateArgCp003Question({ qlId: input.qlId, seed: input.seed });

  if (input.locale === "en-IN") {
    return Object.freeze({
      ...base,
      checkpointId: "ARG-CP-004" as const,
      version: "CP004" as const,
      locale: "en-IN" as const,
      options: ARG_CP004_OPTIONS["en-IN"],
      metadata: Object.freeze({
        ...base.metadata,
        localizationStatus: "TRILINGUAL_TEMPLATE_PARITY_CP004" as const,
      }),
    });
  }

  const localizedTemplate = getArgCp004LocalizedTemplate({
    locale: input.locale,
    qlId: input.qlId,
    templateId: base.templateId,
  });
  const rendered = renderArgCp004LocalizedTemplate(localizedTemplate, base.variantIndex);
  const orderedArguments = base.metadata.argumentsReversed
    ? [rendered.arguments[1], rendered.arguments[0]] as const
    : rendered.arguments;

  const explanation = orderedArguments.map((argument, index) =>
    `${explanationPrefix(input.locale, index, base.argumentStrengths[index]!)} ${argument.explanation}`,
  ).join(" ");

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: "ARG-CP-004" as const,
    version: "CP004" as const,
    qlId: input.qlId,
    scenarioId: base.scenarioId,
    templateId: base.templateId,
    variantIndex: base.variantIndex,
    variantKey: base.variantKey,
    locale: input.locale,
    seed: input.seed,
    difficulty: base.difficulty,
    archetype: base.archetype,
    statement: rendered.statement,
    arguments: [orderedArguments[0].text, orderedArguments[1].text] as const,
    argumentStrengths: base.argumentStrengths,
    options: ARG_CP004_OPTIONS[input.locale],
    correctIndex: base.correctIndex,
    answerClass: base.answerClass,
    explanation,
    metadata: Object.freeze({
      authority: "ARGUMENT_STRENGTH_VARIABLEIZED_V1" as const,
      templateId: base.templateId,
      variantIndex: base.variantIndex,
      variantKey: base.variantKey,
      semanticSlot: base.metadata.semanticSlot,
      presentationBlock: base.metadata.presentationBlock,
      argumentsReversed: base.metadata.argumentsReversed,
      archetype: base.archetype,
      antiGamingScheduler: "ARG_CP003_BIJECTIVE_2048_SURFACE" as const,
      semanticSurfaceCapacityPerQl: 2048 as const,
      saturationReady: true as const,
      localizationStatus: "TRILINGUAL_TEMPLATE_PARITY_CP004" as const,
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
