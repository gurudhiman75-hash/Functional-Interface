import {
  CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2,
  generateCubesDiceQuestionStudioBatchV2,
  generateCubesDiceQuestionStudioSeededV2,
  type CubesDiceQuestionStudioLanguageV2,
  type CubesDiceQuestionStudioQlIdV2,
  type CubesDiceQuestionStudioQuestionV2,
} from "./cubes-dice-question-studio-seeded-runtime-v2";
import {
  CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1,
  polishCubesDiceLocalizedStemV1,
  polishCubesDiceStudentSolutionLocalizationV1,
} from "./cubes-dice-student-solution-localization-freeze-v1";
import type { CubesDiceVoxelRuntimeTaskKindV2 } from "./cubes-dice-voxel-projection-runtime-v2";

export type CubesDiceRegisteredQuestionV1 = Readonly<
  Omit<CubesDiceQuestionStudioQuestionV2, "version" | "stem" | "solution" | "lifecycle"> & {
    version: "CND-001-QUESTION-STUDIO-REGISTERED-QUESTION-V1";
    stem: string;
    solution: CubesDiceQuestionStudioQuestionV2["solution"];
    registrationAuthority: "CND-001-QUESTION-STUDIO-REVIEW-ONLY-REGISTRATION-V1";
    lifecycle: Readonly<{
      reviewOnly: true;
      questionStudioDiscoverable: true;
      registrationStatus: "REGISTERED_REVIEW_ONLY";
      persistenceAllowed: false;
      questionBankStatus: "NOT_STORED";
      questionBankWritable: false;
      testEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

export const CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-REVIEW-ONLY-REGISTRATION-V1" as const,
  chapterCode: "CND-001" as const,
  sourceRuntimeAuthorityId: CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2.authorityId,
  localizationFreezeAuthorityId: CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlIds: Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const),
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioDiscoverable: true,
  previewGenerationAuthorized: true,
  operatorReviewAuthorized: true,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  activationBoundary: "DISCOVERABLE_AND_PREVIEWABLE_BUT_NOT_PERSISTED" as const,
  nextGate: "CND_001_QUESTION_STUDIO_PERSISTENCE_AND_QUESTION_BANK_ACTIVATION" as const,
});

if (!CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.frozen) {
  throw new Error("CND review-only registration requires frozen student-solution localization.");
}
if (!CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.questionStudioReviewOnlyRegistrationAuthorized) {
  throw new Error("CND review-only Question Studio registration is not authorized.");
}

function registerQuestion(source: CubesDiceQuestionStudioQuestionV2): CubesDiceRegisteredQuestionV1 {
  const registered = Object.freeze({
    ...source,
    version: "CND-001-QUESTION-STUDIO-REGISTERED-QUESTION-V1" as const,
    stem: polishCubesDiceLocalizedStemV1(source.language, source.stem),
    solution: polishCubesDiceStudentSolutionLocalizationV1(source.solution),
    registrationAuthority: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
  assertCubesDiceRegisteredQuestionV1(registered);
  return registered;
}

export function assertCubesDiceRegisteredQuestionV1(question: CubesDiceRegisteredQuestionV1): void {
  if (!question.lifecycle.questionStudioDiscoverable || question.lifecycle.registrationStatus !== "REGISTERED_REVIEW_ONLY") {
    throw new Error(`${question.seed}: CND question is not registered for review-only discovery.`);
  }
  if (question.lifecycle.persistenceAllowed || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable || question.lifecycle.automaticStudentPublication) {
    throw new Error(`${question.seed}: CND review-only registration crossed an activation boundary.`);
  }
  if (question.solution.language !== question.language) throw new Error(`${question.seed}: solution language mismatch.`);
  if (!question.solution.quality.questionSpecific || !question.solution.quality.exactCalculationOrDeductionShown || !question.solution.quality.finalAnswerExplicit) {
    throw new Error(`${question.seed}: registered CND question lost the V4 student-solution quality contract.`);
  }
  const surface = [
    question.stem,
    question.solution.logicRule,
    ...question.solution.steps,
    question.solution.note ?? "",
    question.solution.answerLine,
    ...question.solution.tables.flatMap((entry) => [entry.title, ...entry.headers, ...entry.rows.flat()]),
  ].join(" ").toLowerCase();
  for (const forbidden of ["solver-attested", "occupied-voxel", "height matrix", "renderer authority", "runtime proof"]) {
    if (surface.includes(forbidden)) throw new Error(`${question.seed}: registered CND surface leaked '${forbidden}'.`);
  }
  if (question.language === "pa" && surface.includes("ਹਰੀਜ਼ਾਂਟਲ")) throw new Error(`${question.seed}: Punjabi surface retained literal transliteration.`);
  if (question.language === "hi" && surface.includes("सीमाबद्ध घनाभ")) throw new Error(`${question.seed}: Hindi surface retained editorially rejected wording.`);
  if (question.language === "pa" && surface.includes("ਸੀਮਾਬੱਧ ਘਣਾਭ")) throw new Error(`${question.seed}: Punjabi surface retained editorially rejected wording.`);
}

export function generateCubesDiceQuestionStudioRegisteredV1(input: Readonly<{
  seed: string;
  qlId: CubesDiceQuestionStudioQlIdV2;
  language: CubesDiceQuestionStudioLanguageV2;
  voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2;
}>): CubesDiceRegisteredQuestionV1 {
  return registerQuestion(generateCubesDiceQuestionStudioSeededV2(input));
}

export function generateCubesDiceQuestionStudioRegisteredBatchV1(input: Readonly<{
  seed: string;
  language: CubesDiceQuestionStudioLanguageV2;
  count: number;
  qlId?: CubesDiceQuestionStudioQlIdV2;
}>): readonly CubesDiceRegisteredQuestionV1[] {
  return Object.freeze(generateCubesDiceQuestionStudioBatchV2(input).map(registerQuestion));
}
