import {
  generateNumCp004RetainedQuestion,
  verifyNumCp004RetainedAnswer,
} from "../completion/runtime";
import type {
  NumCp004DiscoveryLifecycle,
  NumCp004RetainedQuestion,
} from "../completion/types";
import {
  NUM_CP004_PERMANENT_QL_IDS,
  getNumCp004PermanentAllocation,
  type NumCp004PermanentAllocationEntry,
  type NumCp004PermanentQlId,
} from "./allocation";

export interface NumCp004PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp004PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

export interface NumCp004PermanentLifecycle
  extends Omit<NumCp004DiscoveryLifecycle, "permanentQlId" | "maturity" | "reviewStatus"> {
  readonly permanentQlId: NumCp004PermanentQlId;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
}

type ReplacedRetainedFields = "permanentQlId" | "lifecycle";

export type NumCp004PermanentQuestion = Omit<
  NumCp004RetainedQuestion,
  ReplacedRetainedFields
> & {
  readonly permanentQlId: NumCp004PermanentQlId;
  readonly questionLanguageId: NumCp004PermanentQlId;
  readonly questionId: string;
  readonly language: "en";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp004PermanentLifecycle;
  readonly traceability: {
    readonly packageId: "NUM-001";
    readonly canonicalProblemId: "NUM-CP-004";
    readonly questionLanguageId: NumCp004PermanentQlId;
    readonly qlTemplateId: NumCp004PermanentAllocationEntry["qlTemplateId"];
    readonly temporaryTemplateId: NumCp004PermanentAllocationEntry["temporaryTemplateId"];
    readonly solveModeId: NumCp004PermanentAllocationEntry["solveModeId"];
    readonly answerSemantic: NumCp004PermanentAllocationEntry["answerSemantic"];
    readonly taskDirection: NumCp004PermanentAllocationEntry["taskDirection"];
    readonly representation: NumCp004PermanentAllocationEntry["representation"];
    readonly language: "en";
  };
};

export function runNumCp004PermanentPipeline(
  input: NumCp004PermanentRuntimeInput = {},
): NumCp004PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP004_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-004 permanent runtime only supports English; received ${language}`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }

  const allocation = getNumCp004PermanentAllocation(questionLanguageId);
  const retained = generateNumCp004RetainedQuestion(allocation.temporaryTemplateId, seed);
  const verifier = verifyNumCp004RetainedAnswer(retained.temporaryTemplateId, retained.hiddenState);

  if (retained.temporaryTemplateId !== allocation.temporaryTemplateId) {
    throw new Error(`${questionLanguageId}/${seed}: retained-template mismatch`);
  }
  if (retained.answerSemantic !== allocation.answerSemantic) {
    throw new Error(`${questionLanguageId}/${seed}: answer-semantic mismatch`);
  }
  if (retained.canonicalAnswer !== verifier || retained.verifierAnswer !== verifier) {
    throw new Error(`${questionLanguageId}/${seed}: independent verifier mismatch`);
  }
  if (
    retained.permanentQlId !== null
    || retained.lifecycle.permanentQlId !== null
    || retained.lifecycle.active
    || retained.lifecycle.questionStudioDiscoverable
    || retained.lifecycle.questionBankWritable
    || retained.lifecycle.testEligible
    || retained.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${questionLanguageId}/${seed}: retained lifecycle boundary violated`);
  }

  const lifecycle: NumCp004PermanentLifecycle = {
    ...retained.lifecycle,
    permanentQlId: allocation.qlId,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
  };

  return {
    ...retained,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    language: "en",
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: {
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-004",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      temporaryTemplateId: allocation.temporaryTemplateId,
      solveModeId: allocation.solveModeId,
      answerSemantic: allocation.answerSemantic,
      taskDirection: allocation.taskDirection,
      representation: allocation.representation,
      language: "en",
    },
  };
}
