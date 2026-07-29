import {
  generateNumCp003RetainedQuestion,
  verifyRetainedAnswer,
} from "../retained/runtime-reviewed";
import type { NumCp003RetainedQuestion } from "../retained/runtime-types";
import {
  NUM_CP003_PERMANENT_QL_IDS,
  getNumCp003PermanentAllocation,
} from "./allocation";
import type {
  NumCp003PermanentAllocationEntry,
  NumCp003PermanentQlId,
} from "./allocation";

export interface NumCp003PermanentRuntimeInput {
  questionLanguageId?: NumCp003PermanentQlId;
  seed?: string;
  language?: "en";
}

type ReplacedRetainedFields = "permanentQlId" | "reviewStatus";

export type NumCp003PermanentQuestion = Omit<
  NumCp003RetainedQuestion,
  ReplacedRetainedFields
> & {
  permanentQlId: NumCp003PermanentQlId;
  questionLanguageId: NumCp003PermanentQlId;
  questionId: string;
  language: "en";
  reviewStatus: "PERMANENT_IMPLEMENTATION_PROOF";
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  questionBankWritable: false;
  testEligible: false;
  traceability: {
    packageId: "NUM-001";
    canonicalProblemId: "NUM-CP-003";
    questionLanguageId: NumCp003PermanentQlId;
    qlTemplateId: NumCp003PermanentAllocationEntry["qlTemplateId"];
    temporaryTemplateLabel: NumCp003PermanentAllocationEntry["temporaryTemplateLabel"];
    solveModeId: NumCp003PermanentAllocationEntry["solveModeId"];
    authorityId: NumCp003PermanentAllocationEntry["authorityId"];
    answerSemantic: NumCp003PermanentAllocationEntry["answerSemantic"];
    taskDirection: NumCp003PermanentAllocationEntry["taskDirection"];
    representation: NumCp003PermanentAllocationEntry["representation"];
    language: "en";
  };
};

/**
 * Generates a permanently identified but inactive English implementation-proof
 * question. This function has no Question Studio, Question Bank, test or public
 * route and cannot make a package eligible for delivery.
 */
export function runNumCp003PermanentPipeline(
  input: NumCp003PermanentRuntimeInput = {},
): NumCp003PermanentQuestion {
  const questionLanguageId =
    input.questionLanguageId ?? NUM_CP003_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `NUM-CP-003 permanent runtime only supports English; received ${language}`,
    );
  }

  const allocation = getNumCp003PermanentAllocation(questionLanguageId);
  const seed = input.seed ?? `num-001:${questionLanguageId}:default`;
  const retained = generateNumCp003RetainedQuestion(
    allocation.temporaryTemplateLabel,
    seed,
  );

  if (!retained.validation.ok) {
    throw new Error(
      `${questionLanguageId}/${seed} failed retained validation: ${retained.validation.errors.join("; ")}`,
    );
  }
  if (retained.temporaryTemplateLabel !== allocation.temporaryTemplateLabel) {
    throw new Error(`${questionLanguageId}/${seed} retained-template mismatch`);
  }
  if (retained.answerSemantic !== allocation.answerSemantic) {
    throw new Error(`${questionLanguageId}/${seed} answer-semantic mismatch`);
  }
  if (verifyRetainedAnswer(retained.hiddenState) !== retained.answer) {
    throw new Error(`${questionLanguageId}/${seed} independent verifier mismatch`);
  }
  if (
    retained.permanentQlId !== null ||
    retained.questionBankStatus !== "NOT_STORED" ||
    retained.testEligibility !== "INELIGIBLE" ||
    retained.publiclyPublishable ||
    retained.questionStudioDiscoverable
  ) {
    throw new Error(`${questionLanguageId}/${seed} retained lifecycle boundary was violated`);
  }

  return {
    ...retained,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    language: "en",
    reviewStatus: "PERMANENT_IMPLEMENTATION_PROOF",
    maturity: "IMPLEMENTATION_PROOF",
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
    permanentIdentityFrozen: true,
    active: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    traceability: {
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-003",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      temporaryTemplateLabel: allocation.temporaryTemplateLabel,
      solveModeId: allocation.solveModeId,
      authorityId: allocation.authorityId,
      answerSemantic: allocation.answerSemantic,
      taskDirection: allocation.taskDirection,
      representation: allocation.representation,
      language: "en",
    },
  };
}
