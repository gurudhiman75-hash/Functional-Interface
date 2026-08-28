import {
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "./geometry-permanent-english-runtime-v1";
import {
  generateGeometryPermanentEnglishFrozenV1,
  type GeometryPermanentEnglishFrozenItemV1,
} from "./geometry-permanent-english-freeze-v1";
import { GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1 } from "./geometry-permanent-english-freeze-proof-v1";
import {
  GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2,
  GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2,
  GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2,
  type GeometryEditorialTemplateV2,
  type GeometryPrototypeEditorialVariantsV2,
  type GeometryReviewLocaleV2,
} from "./geometry-localization-editorial-v2";

if (!GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.lifecycle.localizationAllowed) {
  throw new Error("Geometry localisation V2 requires the proven English freeze.");
}

const NUMBER_TOKEN = /-?\d+(?:\.\d+)?/g;
const PLACEHOLDER = /\{\{(\d+)\}\}/g;
const ALLOWED_ASCII_WORDS = new Set(["cm", "x", "n"]);

function maskDynamicNumbers(value: string): Readonly<{ masked: string; values: readonly string[] }> {
  const values: string[] = [];
  const masked = value.replace(NUMBER_TOKEN, (match) => {
    const index = values.length;
    values.push(match);
    return `{{${index}}}`;
  });
  return Object.freeze({ masked, values: Object.freeze(values) });
}

function renderEditorialCandidates(
  source: string,
  candidates: readonly GeometryEditorialTemplateV2[],
  locale: GeometryReviewLocaleV2,
  context: string,
): string {
  const masked = maskDynamicNumbers(source);
  const template = candidates.find((candidate) => candidate.sourceMasked === masked.masked);
  if (!template) {
    throw new Error(
      `${context}: frozen English source drifted outside the complete V2 human-editorial authority.\nActual: ${masked.masked}\nKnown patterns:\n${candidates.map((candidate) => `- ${candidate.sourceMasked}`).join("\n")}`,
    );
  }
  const localized = locale === "hi-IN" ? template.hi : template.pa;
  const rendered = localized.replace(PLACEHOLDER, (_match, rawIndex: string) => {
    const index = Number(rawIndex);
    const value = masked.values[index];
    if (value === undefined) throw new Error(`${context}: missing numeric placeholder ${index}`);
    return value;
  });
  if (/\{\{\d+\}\}/.test(rendered)) throw new Error(`${context}: unresolved V2 numeric placeholder`);
  return rendered;
}

function translateOption(option: string, locale: GeometryReviewLocaleV2, context: string): string {
  const translation = GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2[option];
  if (translation) return locale === "hi-IN" ? translation.hi : translation.pa;
  const leaks = findGeometryLocalizationEnglishLeaksV2(option);
  if (leaks.length) throw new Error(`${context}: learner-facing option has no V2 translation: ${option}`);
  return option;
}

export function findGeometryLocalizationEnglishLeaksV2(value: string): readonly string[] {
  const words = value.match(/[A-Za-z]+/g) ?? [];
  return Object.freeze(words.filter((word) => {
    if (ALLOWED_ASCII_WORDS.has(word)) return false;
    if (/^[A-Z]{1,5}$/.test(word)) return false;
    return true;
  }));
}

export function getGeometryLocalizationAuthoredPatternsV2(prototypeId: string): Readonly<{
  questionPatterns: readonly string[];
  explanationPatternsByLine: readonly (readonly string[])[];
}> {
  const canonical = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2[prototypeId as keyof typeof GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2];
  if (!canonical) throw new Error(`${prototypeId}: missing canonical V2 human-editorial template`);
  const variants = (GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2 as Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>)[prototypeId];
  return Object.freeze({
    questionPatterns: Object.freeze([
      canonical.question.sourceMasked,
      ...(variants?.questions ?? []).map((candidate) => candidate.sourceMasked),
    ]),
    explanationPatternsByLine: Object.freeze(canonical.explanations.map((candidate, lineIndex) => Object.freeze([
      candidate.sourceMasked,
      ...(variants?.explanationsByLine?.[lineIndex] ?? []).map((variant) => variant.sourceMasked),
    ]))),
  });
}

function getGeometryLocalizationTemplateCandidatesV2(prototypeId: string): Readonly<{
  questionCandidates: readonly GeometryEditorialTemplateV2[];
  explanationCandidatesByLine: readonly (readonly GeometryEditorialTemplateV2[])[];
}> {
  const canonical = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2[prototypeId as keyof typeof GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2];
  if (!canonical) throw new Error(`${prototypeId}: missing canonical V2 human-editorial template`);
  const variants = (GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2 as Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>)[prototypeId];
  return Object.freeze({
    questionCandidates: Object.freeze([canonical.question, ...(variants?.questions ?? [])]),
    explanationCandidatesByLine: Object.freeze(canonical.explanations.map((candidate, lineIndex) => Object.freeze([
      candidate,
      ...(variants?.explanationsByLine?.[lineIndex] ?? []),
    ]))),
  });
}

export interface GeometryPermanentMultilingualReviewItemV2 extends Omit<
  GeometryPermanentEnglishFrozenItemV1,
  "language" | "question" | "options" | "canonicalAnswer" | "explanation" | "explanationLines" | "maturity" | "reviewStatus"
> {
  readonly localizationReviewAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V2";
  readonly sourceEnglishFreezeProofAuthorityId: "GEO-PERMANENT-ENGLISH-FREEZE-PROOF-V1";
  readonly locale: GeometryReviewLocaleV2;
  readonly language: "hi" | "pa";
  readonly englishQuestion: string;
  readonly englishOptions: readonly string[];
  readonly englishAnswer: string;
  readonly englishExplanation: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly canonicalAnswer: string;
  readonly explanation: string;
  readonly explanationLines: readonly string[];
  readonly maturity: "PERMANENT_MULTILINGUAL_HUMAN_EDITORIAL_REVIEW_CANDIDATE_V2";
  readonly reviewStatus: "EXACT_V2_ARTIFACT_HUMAN_APPROVAL_REQUIRED";
  readonly multilingualImplementationFrozen: false;
}

export function generateGeometryPermanentMultilingualReviewV2(
  qlId: string,
  seed: string,
  locale: GeometryReviewLocaleV2,
  requestedVariantIndex?: number,
): GeometryPermanentMultilingualReviewItemV2 {
  const english = generateGeometryPermanentEnglishFrozenV1(qlId, seed, requestedVariantIndex);
  const templates = getGeometryLocalizationTemplateCandidatesV2(english.prototypeId);
  if (templates.explanationCandidatesByLine.length !== english.explanationLines.length) {
    throw new Error(`${qlId}/${english.prototypeId}: V2 explanation-line contract drifted`);
  }

  const question = renderEditorialCandidates(
    english.question,
    templates.questionCandidates,
    locale,
    `${qlId}/${english.prototypeId}/question`,
  );
  const options = Object.freeze(english.options.map((option, index) =>
    translateOption(option, locale, `${qlId}/${english.prototypeId}/option-${index}`),
  ));
  const explanationLines = Object.freeze(english.explanationLines.map((line, index) =>
    renderEditorialCandidates(
      line,
      templates.explanationCandidatesByLine[index]!,
      locale,
      `${qlId}/${english.prototypeId}/explanation-${index}`,
    ),
  ));
  const canonicalAnswer = options[english.correctIndex]!;
  const visible = `${question}\n${options.join("\n")}\n${explanationLines.join("\n")}`;
  const leaks = findGeometryLocalizationEnglishLeaksV2(visible);
  if (leaks.length) throw new Error(`${qlId}/${english.prototypeId}/${locale}: unapproved English prose leakage: ${[...new Set(leaks)].join(", ")}`);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error(`${qlId}/${locale}: V2 must preserve four unique options`);
  if (canonicalAnswer !== options[english.correctIndex]) throw new Error(`${qlId}/${locale}: V2 answer index drifted`);

  return Object.freeze({
    ...english,
    localizationReviewAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V2",
    sourceEnglishFreezeProofAuthorityId: "GEO-PERMANENT-ENGLISH-FREEZE-PROOF-V1",
    locale,
    language: locale === "hi-IN" ? "hi" : "pa",
    englishQuestion: english.question,
    englishOptions: english.options,
    englishAnswer: english.canonicalAnswer,
    englishExplanation: english.explanation,
    question,
    options,
    canonicalAnswer,
    explanation: explanationLines.join("\n"),
    explanationLines,
    maturity: "PERMANENT_MULTILINGUAL_HUMAN_EDITORIAL_REVIEW_CANDIDATE_V2",
    reviewStatus: "EXACT_V2_ARTIFACT_HUMAN_APPROVAL_REQUIRED",
    multilingualImplementationFrozen: false,
  } satisfies GeometryPermanentMultilingualReviewItemV2);
}

const VARIANT_AUTHORITY_COUNT = Object.values(GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2 as Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>).reduce(
  (sum, variants) => sum
    + (variants.questions?.length ?? 0)
    + (variants.explanationsByLine?.reduce((lineSum, candidates) => lineSum + candidates.length, 0) ?? 0),
  0,
);

export const GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2 = Object.freeze({
  authorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V2",
  authorityRevision: 3,
  sourceEnglishFreezeProofAuthorityId: GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.authorityId,
  rejectedPriorReviewArtifactId: 9681238482,
  rejectedPriorReviewArtifactDigest: "sha256:7fc99143e4059393b14e7f57fc9dbec34e7c9d46725e6ef8c54c149b170622ef",
  status: "HINDI_PUNJABI_HUMAN_EDITORIAL_REVIEW_V2_SOURCE_VARIANTS_COMPLETE__CI_PROOF_PENDING",
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.reduce((sum, definition) => sum + definition.prototypeIds.length, 0),
  canonicalPrototypeTemplateCount: Object.keys(GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2).length,
  additionalSourceVariantTemplateCount: VARIANT_AUTHORITY_COUNT,
  lifecycle: Object.freeze({
    englishFreezeProven: true,
    localizationAllowed: true,
    localizationV1EditoriallyRejected: true,
    localizationV2Implemented: true,
    localizationV2SourceVariantCoverageImplemented: true,
    localizationV2Proven: false,
    multilingualImplementationFrozen: false,
    multilingualFreezeAllowed: false,
    questionStudioActivationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWriteAllowed: false,
    questionBankWritable: false,
    testEligibilityAllowed: false,
    testEligible: false,
    publicPublicationAllowed: false,
    publiclyPublishable: false,
    prMergeAuthorized: false,
  }),
  postProofNextGate: "EXPLICIT_HINDI_PUNJABI_V2_REVIEW_ARTIFACT_APPROVAL",
} as const);
