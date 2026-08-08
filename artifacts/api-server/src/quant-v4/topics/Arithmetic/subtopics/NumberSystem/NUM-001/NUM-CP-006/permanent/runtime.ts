import {
  NUM_CP006_PERMANENT_QL_IDS,
  getNumCp006PermanentAllocation,
  type NumCp006PermanentQlId,
} from "./allocation";
import { generateNumCp006Content } from "./generators";
import type {
  NumCp006PermanentLifecycle,
  NumCp006PermanentQuestion,
} from "./types";
import { verifyNumCp006Answer } from "./verifier";

export interface NumCp006PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp006PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

function assertQuestionContract(question: NumCp006PermanentQuestion): void {
  if (question.options.length !== 4) throw new Error(`${question.questionId}: option count`);
  if (new Set(question.options.map((option) => option.value)).size !== 4) {
    throw new Error(`${question.questionId}: duplicate option value`);
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${question.questionId}: correct option count`);
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    throw new Error(`${question.questionId}: correct index`);
  }
  if (question.options[question.correctIndex]?.value !== question.canonicalAnswer) {
    throw new Error(`${question.questionId}: answer/index mismatch`);
  }
  if (question.canonicalAnswer !== question.verifierAnswer) {
    throw new Error(`${question.questionId}: independent verifier mismatch`);
  }
  if (question.options.some((option) => !option.misconceptionId || !option.analysis.trim())) {
    throw new Error(`${question.questionId}: incomplete option diagnostics`);
  }
  if (question.explanation.commonTraps.length !== 3) {
    throw new Error(`${question.questionId}: trap count`);
  }
}

export function runNumCp006PermanentPipeline(
  input: NumCp006PermanentRuntimeInput = {},
): NumCp006PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP006_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-006 permanent runtime only supports English; received ${language}`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }

  const allocation = getNumCp006PermanentAllocation(questionLanguageId);
  const variantIndex = (seed - 1) % allocation.prototypeIds.length;
  const sourceSeed = Math.floor((seed - 1) / allocation.prototypeIds.length) + 1;
  const runtimePrototypeId = allocation.prototypeIds[variantIndex]!;
  const generated = generateNumCp006Content(questionLanguageId, sourceSeed, runtimePrototypeId);
  const verifierAnswer = verifyNumCp006Answer(questionLanguageId, generated.hiddenState);

  const lifecycle: NumCp006PermanentLifecycle = Object.freeze({
    permanentQlId: allocation.qlId,
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  });

  const question: NumCp006PermanentQuestion = Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-006",
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    authorityId: allocation.authorityId,
    temporaryPrototypeId: runtimePrototypeId,
    authorityPrototypeIds: allocation.prototypeIds,
    seed,
    sourceSeed,
    locale: "en-IN",
    language: "en",
    difficulty: generated.difficulty,
    answerSemantic: generated.answerSemantic,
    representation: generated.representation,
    stem: generated.stem,
    options: generated.options,
    correctIndex: generated.correctIndex,
    canonicalAnswer: generated.canonicalAnswer,
    verifierAnswer,
    hiddenState: generated.hiddenState,
    mathematicalFingerprint: generated.mathematicalFingerprint,
    explanation: generated.explanation,
    sourceAncestry: generated.sourceAncestry,
    prototypeAncestry: generated.prototypeAncestry,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: Object.freeze({
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-006",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      authorityId: allocation.authorityId,
      authorityPrototypeIds: allocation.prototypeIds,
      runtimePrototypeId,
      language: "en",
    }),
  });

  assertQuestionContract(question);
  return question;
}
