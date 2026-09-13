import { scheduleArgCp003Surface } from "./cp003-generator.ts";
import { renderArgCp004LocalizedTemplate } from "./cp004-localization-helpers.ts";
import type { ArgCp004LocalizedLocale } from "./cp004-localization-types.ts";
import { ARG_CP004_OPTIONS } from "./cp004-review-options.ts";
import { generateArgCp009EnglishQuestion } from "./cp009-english-generator.ts";
import { ARG_CP009_CHECKPOINT_ID } from "./cp009-english-remediated-templates.ts";
import {
  ARG_CP009_LOCALIZATION_AUTHORITY,
  getArgCp009LocalizedTemplate,
} from "./cp009-localized-remediated-templates.ts";
import type { ArgQlId, ArgStrength } from "./types.ts";

function strengthWord(locale: ArgCp004LocalizedLocale, strength: ArgStrength): string {
  if (locale === "hi-IN") return strength === "STRONG" ? "मजबूत" : "कमजोर";
  return strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ";
}

function explanationPrefix(locale: ArgCp004LocalizedLocale, index: number, strength: ArgStrength): string {
  const label = index === 0 ? "I" : "II";
  if (locale === "hi-IN") return `तर्क ${label} ${strengthWord(locale, strength)} है:`;
  return `ਦਲੀਲ ${label} ${strengthWord(locale, strength)} ਹੈ:`;
}

export function generateArgCp009LocalizedQuestion(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgCp004LocalizedLocale;
  readonly seed: number;
}) {
  const base = generateArgCp009EnglishQuestion({ qlId: input.qlId, seed: input.seed });
  const schedule = scheduleArgCp003Surface({ qlId: input.qlId, seed: input.seed });
  const template = getArgCp009LocalizedTemplate({
    locale: input.locale,
    qlId: input.qlId,
    templateId: base.templateId,
  });
  const rendered = renderArgCp004LocalizedTemplate(template, base.variantIndex);
  const orderedArguments = schedule.reverseArguments
    ? [rendered.arguments[1], rendered.arguments[0]] as const
    : rendered.arguments;
  const explanation = orderedArguments.map((argument, index) =>
    `${explanationPrefix(input.locale, index, base.argumentStrengths[index]!)} ${argument.explanation}`,
  ).join(" ");

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: ARG_CP009_CHECKPOINT_ID,
    version: "CP009-I18N-V1" as const,
    authority: ARG_CP009_LOCALIZATION_AUTHORITY,
    sourceEnglishAuthority: base.authority,
    qlId: base.qlId,
    scenarioId: `${base.templateId}-CP009-${input.locale}-${base.variantKey}`,
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
      authority: ARG_CP009_LOCALIZATION_AUTHORITY,
      englishAuthority: base.authority,
      historicalCoreAuthority: "ARG_CP006_IMMUTABLE_FREEZE_V1" as const,
      historicalRealPaperAuthority: "ARG_CP008_REAL_PAPER_CLOSURE_V1" as const,
      sourceScheduler: "ARG_CP003_BIJECTIVE_2048_SURFACE" as const,
      semanticSurfaceCapacityPerQl: 2048 as const,
      editorialRemediation: true as const,
      trilingualSemanticParity: true as const,
      localizationStatus: "CP009_HI_PA_REMEDIATED" as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}
