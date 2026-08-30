import {
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "./geometry-permanent-english-runtime-v1";
import {
  generateGeometryPermanentEnglishFrozenV1,
  type GeometryPermanentEnglishFrozenItemV1,
} from "./geometry-permanent-english-freeze-v1";
import { GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1 } from "./geometry-permanent-english-freeze-proof-v1";
import {
  localizeGeometryLearnerTextV1,
  type GeometryReviewLocaleV1,
} from "./geometry-localization-rules-v1";

if (!GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.lifecycle.localizationAllowed) {
  throw new Error("Geometry Hindi/Punjabi localization is not authorized before proven English freeze.");
}

export interface GeometryPermanentMultilingualReviewItemV1 extends Omit<
  GeometryPermanentEnglishFrozenItemV1,
  "language" | "question" | "options" | "canonicalAnswer" | "explanation" | "explanationLines" | "maturity" | "reviewStatus"
> {
  readonly localizationReviewAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V1";
  readonly sourceEnglishFreezeProofAuthorityId: "GEO-PERMANENT-ENGLISH-FREEZE-PROOF-V1";
  readonly locale: GeometryReviewLocaleV1;
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
  readonly maturity: "PERMANENT_MULTILINGUAL_REVIEW_CANDIDATE_V1";
  readonly reviewStatus: "HUMAN_LOCALIZATION_REVIEW_REQUIRED";
  readonly multilingualImplementationFrozen: false;
}

export function generateGeometryPermanentMultilingualReviewV1(
  qlId: string,
  seed: string,
  locale: GeometryReviewLocaleV1,
  requestedVariantIndex?: number,
): GeometryPermanentMultilingualReviewItemV1 {
  const english = generateGeometryPermanentEnglishFrozenV1(qlId, seed, requestedVariantIndex);
  const question = localizeGeometryLearnerTextV1(english.question, locale, "question");
  const options = Object.freeze(english.options.map((option) => localizeGeometryLearnerTextV1(option, locale, "option")));
  const explanationLines = Object.freeze(
    english.explanationLines.map((line) => localizeGeometryLearnerTextV1(line, locale, "explanation")),
  );
  const canonicalAnswer = options[english.correctIndex]!;

  if (!question.trim()) throw new Error(`${qlId}/${locale}: localized question is empty`);
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`${qlId}/${locale}: localization must preserve four unique options`);
  }
  if (!explanationLines.length || explanationLines.some((line) => !line.trim())) {
    throw new Error(`${qlId}/${locale}: localized explanation is empty`);
  }
  if (canonicalAnswer !== options[english.correctIndex]) {
    throw new Error(`${qlId}/${locale}: localized answer/options drifted`);
  }

  return Object.freeze({
    ...english,
    localizationReviewAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V1",
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
    maturity: "PERMANENT_MULTILINGUAL_REVIEW_CANDIDATE_V1",
    reviewStatus: "HUMAN_LOCALIZATION_REVIEW_REQUIRED",
    multilingualImplementationFrozen: false,
  } satisfies GeometryPermanentMultilingualReviewItemV1);
}

export const GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-V1",
  authorityRevision: 3,
  sourceEnglishFreezeProofAuthorityId: GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.authorityId,
  status: "HINDI_PUNJABI_LOCALIZATION_REVIEW_IMPLEMENTED__CI_PROOF_PENDING",
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.reduce((sum, definition) => sum + definition.prototypeIds.length, 0),
  lifecycle: Object.freeze({
    englishFreezeProven: true,
    localizationAllowed: true,
    localizationReviewImplemented: true,
    localizationReviewProven: false,
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
  postProofNextGate: "EXPLICIT_HINDI_PUNJABI_REVIEW_ARTIFACT_APPROVAL",
} as const);
