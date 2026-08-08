import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  generateSerCp007PermanentEnglishPackage,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";
import {
  generateSerCp007PermanentLocalizedPackage,
} from "../SER-CP-007-LOCALIZATION/ser-cp-007-localized-runtime-final";
import type {
  SerCp007Locale,
} from "../SER-CP-007-LOCALIZATION/ser-cp-007-localized-runtime";
import type {
  SerCp007PermanentQlId,
} from "../SER-PERMANENT-QL-REGISTRY";

export const SER_CP007_QUESTION_STUDIO_READINESS_AUTHORITY =
  "SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_AUDIT_V1" as const;

export const SER_CP007_QUESTION_STUDIO_READINESS_LOCALES = [
  "en-IN",
  "hi-IN",
  "pa-IN",
] as const;

export type SerCp007QuestionStudioReadinessLocale =
  (typeof SER_CP007_QUESTION_STUDIO_READINESS_LOCALES)[number];

export interface SerCp007QuestionStudioReadinessInput {
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly locale: SerCp007QuestionStudioReadinessLocale;
}

export interface SerCp007QuestionStudioReadinessProjection {
  readonly packageId: "SER-001";
  readonly canonicalProblemId: "SER-CP-007";
  readonly permanentQlId: SerCp007PermanentQlId;
  readonly questionLanguageId: SerCp007PermanentQlId;
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly language: "en" | "hi" | "pa";
  readonly locale: SerCp007QuestionStudioReadinessLocale;
  readonly authorityId: string;
  readonly subtypeId: string;
  readonly learnerRenderer: string;
  readonly taskKind: string;
  readonly stem: string;
  readonly text: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly canonicalAnswer: string;
  readonly difficulty: string;
  readonly explanation: string;
  readonly releasePoolId: string | null;
  readonly renderingContract: Readonly<Record<string, unknown>> | null;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly integrationStatus: "READINESS_PROVEN_INACTIVE";
  readonly runtimeMode: "INACTIVE_INTEGRATION_PROOF";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
  readonly generationContext: Readonly<{
    packageId: "SER-001";
    canonicalProblemId: "SER-CP-007";
    permanentQlId: SerCp007PermanentQlId;
    questionLanguageId: SerCp007PermanentQlId;
    temporaryTemplateId: string;
    seed: number;
    language: "en" | "hi" | "pa";
    locale: SerCp007QuestionStudioReadinessLocale;
    authorityId: string;
    subtypeId: string;
    learnerRenderer: string;
    taskKind: string;
    releasePoolId: string | null;
    renderingContract: Readonly<Record<string, unknown>> | null;
    integrationAuthority: typeof SER_CP007_QUESTION_STUDIO_READINESS_AUTHORITY;
    integrationStatus: "READINESS_PROVEN_INACTIVE";
    runtimeMode: "INACTIVE_INTEGRATION_PROOF";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
  readonly validation: Readonly<{
    ok: true;
    checks: readonly Readonly<{
      name: string;
      passed: true;
      message: string;
    }>[];
  }>;
}

type GeneratedPackage =
  | ReturnType<typeof generateSerCp007PermanentEnglishPackage>
  | ReturnType<typeof generateSerCp007PermanentLocalizedPackage>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.map((entry) => String(entry ?? "").trim()));
}

function languageForLocale(
  locale: SerCp007QuestionStudioReadinessLocale,
): "en" | "hi" | "pa" {
  if (locale === "hi-IN") return "hi";
  if (locale === "pa-IN") return "pa";
  return "en";
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function projectPackage(
  generatedPackage: GeneratedPackage,
  locale: SerCp007QuestionStudioReadinessLocale,
): SerCp007QuestionStudioReadinessProjection {
  const question = asRecord(generatedPackage.question);
  const review = asRecord(generatedPackage.review);
  const frozenAuthority = generatedPackage.frozenTemplateAuthority;
  const registryEntry = generatedPackage.registryEntry;
  const options = asStringArray(question.options);
  const correctIndex = Number(question.correctIndex);
  const correctAnswer = asText(question.correctAnswer);
  const stem = asText(question.stem);
  const explanation =
    asText(review.expandedReview)
    || asText(review.review)
    || asText(review.conciseReview);
  const releasePoolId = asText(question.releasePoolId) || null;
  const renderingContractRecord = asRecord(review.renderingContract);
  const renderingContract = Object.keys(renderingContractRecord).length > 0
    ? Object.freeze({ ...renderingContractRecord })
    : null;

  const checks = [
    {
      name: "permanent-identity",
      passed:
        generatedPackage.permanentQlId === registryEntry.permanentQlId
        && frozenAuthority.permanentQlId === registryEntry.permanentQlId,
      message: "The projected item preserves its frozen permanent QL identity.",
    },
    {
      name: "template-provenance",
      passed:
        generatedPackage.temporaryTemplateId
          === frozenAuthority.temporaryTemplateId,
      message: "The temporary template and frozen authority provenance agree.",
    },
    {
      name: "learner-payload",
      passed: stem.length > 0 && explanation.length > 0,
      message: "The learner-facing stem and reviewed explanation are present.",
    },
    {
      name: "option-integrity",
      passed:
        options.length === 4
        && new Set(options).size === 4
        && Number.isInteger(correctIndex)
        && correctIndex >= 0
        && correctIndex < options.length
        && options[correctIndex] === correctAnswer,
      message: "The item has four unique options and a correctly keyed answer.",
    },
    {
      name: "inactive-lifecycle-boundary",
      passed:
        !generatedPackage.lifecycle.active
        && !generatedPackage.lifecycle.questionStudioDiscoverable
        && !generatedPackage.lifecycle.questionBankWritable
        && !generatedPackage.lifecycle.testEligible
        && !generatedPackage.lifecycle.publiclyPublishable
        && !registryEntry.active
        && !registryEntry.questionStudioDiscoverable
        && !registryEntry.questionBankWritable
        && !registryEntry.testEligible
        && !registryEntry.publiclyPublishable,
      message: "Readiness proof does not activate discovery, storage, tests or publication.",
    },
  ] as const;

  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `${generatedPackage.temporaryTemplateId}:${generatedPackage.seed}:${locale} failed Series Question Studio readiness projection: ${failures
        .map((failure) => `${failure.name}: ${failure.message}`)
        .join("; ")}`,
    );
  }

  const language = languageForLocale(locale);
  const generationContext = Object.freeze({
    packageId: "SER-001" as const,
    canonicalProblemId: "SER-CP-007" as const,
    permanentQlId: registryEntry.permanentQlId,
    questionLanguageId: registryEntry.permanentQlId,
    temporaryTemplateId: generatedPackage.temporaryTemplateId,
    seed: generatedPackage.seed,
    language,
    locale,
    authorityId: frozenAuthority.candidateAuthorityId,
    subtypeId: frozenAuthority.subtypeId,
    learnerRenderer: frozenAuthority.learnerRenderer,
    taskKind: frozenAuthority.editorialTaskKind,
    releasePoolId,
    renderingContract,
    integrationAuthority: SER_CP007_QUESTION_STUDIO_READINESS_AUTHORITY,
    integrationStatus: "READINESS_PROVEN_INACTIVE" as const,
    runtimeMode: "INACTIVE_INTEGRATION_PROOF" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });

  return Object.freeze({
    packageId: "SER-001" as const,
    canonicalProblemId: "SER-CP-007" as const,
    permanentQlId: registryEntry.permanentQlId,
    questionLanguageId: registryEntry.permanentQlId,
    temporaryTemplateId: generatedPackage.temporaryTemplateId,
    seed: generatedPackage.seed,
    language,
    locale,
    authorityId: frozenAuthority.candidateAuthorityId,
    subtypeId: frozenAuthority.subtypeId,
    learnerRenderer: frozenAuthority.learnerRenderer,
    taskKind: frozenAuthority.editorialTaskKind,
    stem,
    text: stem,
    options,
    correctIndex,
    answer: correctAnswer,
    canonicalAnswer: correctAnswer,
    difficulty: asText(question.difficulty) || asText(review.difficultyBand) || "Medium",
    explanation,
    releasePoolId,
    renderingContract,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    integrationStatus: "READINESS_PROVEN_INACTIVE" as const,
    runtimeMode: "INACTIVE_INTEGRATION_PROOF" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    generationContext,
    validation: Object.freeze({
      ok: true as const,
      checks: Object.freeze(
        checks.map((check) => Object.freeze({
          name: check.name,
          passed: true as const,
          message: check.message,
        })),
      ),
    }),
  });
}

export function generateSerCp007QuestionStudioReadinessProjection(
  input: SerCp007QuestionStudioReadinessInput,
): SerCp007QuestionStudioReadinessProjection {
  assertPositiveInteger(input.seed, "SER-CP-007 readiness seed");
  const generatedPackage = input.locale === "en-IN"
    ? generateSerCp007PermanentEnglishPackage(
        input.temporaryTemplateId,
        input.seed,
      )
    : generateSerCp007PermanentLocalizedPackage(
        input.temporaryTemplateId,
        input.locale as SerCp007Locale,
        input.seed,
      );
  return projectPackage(generatedPackage, input.locale);
}

export function generateSerCp007QuestionStudioReadinessSweep(
  seed: number,
): readonly SerCp007QuestionStudioReadinessProjection[] {
  assertPositiveInteger(seed, "SER-CP-007 readiness sweep seed");
  const projected: SerCp007QuestionStudioReadinessProjection[] = [];
  for (const authority of SER_CP007_FROZEN_TEMPLATE_AUTHORITIES) {
    for (const locale of SER_CP007_QUESTION_STUDIO_READINESS_LOCALES) {
      projected.push(
        generateSerCp007QuestionStudioReadinessProjection({
          temporaryTemplateId: authority.temporaryTemplateId,
          seed,
          locale,
        }),
      );
    }
  }
  return Object.freeze(projected);
}

export const SER_CP007_QUESTION_STUDIO_READINESS_STATE = Object.freeze({
  authority: SER_CP007_QUESTION_STUDIO_READINESS_AUTHORITY,
  frozenTemplateCount: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  permanentQlCount: 13,
  localeCount: SER_CP007_QUESTION_STUDIO_READINESS_LOCALES.length,
  expectedProjectionCountPerSeed:
    SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length
    * SER_CP007_QUESTION_STUDIO_READINESS_LOCALES.length,
  integrationStatus: "READINESS_PROVEN_INACTIVE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});