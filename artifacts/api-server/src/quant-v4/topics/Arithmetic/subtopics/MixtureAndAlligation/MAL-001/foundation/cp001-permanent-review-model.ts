import {
  MAL_CP001_PERMANENT_ALLOCATION,
} from "./cp001-permanent-allocation";
import type {
  MalCp001PermanentAllocationEntry,
  MalCp001PermanentQlId,
} from "./cp001-permanent-allocation";
import { runMalCp001PermanentPipeline } from "./cp001-permanent-runtime";

export const MAL_CP001_PERMANENT_REVIEW_SEEDS = [
  "allocation-review-a",
  "allocation-review-b",
  "allocation-review-c",
  "allocation-review-d",
] as const;

export type MalCp001PermanentReviewStatus = "PENDING_PRODUCT_REVIEW";

export interface MalCp001PermanentReviewRow {
  reviewKey: string;
  qlId: MalCp001PermanentQlId;
  qlTemplateId: MalCp001PermanentAllocationEntry["qlTemplateId"];
  solveModeId: MalCp001PermanentAllocationEntry["solveModeId"];
  selectedPrototypeId: MalCp001PermanentAllocationEntry["prototypeIds"][number];
  reviewStatus: MalCp001PermanentReviewStatus;
  question: ReturnType<typeof runMalCp001PermanentPipeline>;
}

export interface MalCp001PermanentReviewGroup {
  allocation: MalCp001PermanentAllocationEntry;
  reviewStatus: MalCp001PermanentReviewStatus;
  questions: readonly MalCp001PermanentReviewRow[];
}

export interface MalCp001PermanentReviewModel {
  status: "PERMANENT_ALLOCATION_IMPLEMENTATION_PROOF_REVIEW_PENDING";
  permanentQlRange: string;
  permanentQlCount: number;
  reviewQuestionCount: number;
  reviewStatus: MalCp001PermanentReviewStatus;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  groups: readonly MalCp001PermanentReviewGroup[];
}

export function buildMalCp001PermanentReviewModel(): MalCp001PermanentReviewModel {
  const groups = MAL_CP001_PERMANENT_ALLOCATION.map((allocation) => {
    const questions = MAL_CP001_PERMANENT_REVIEW_SEEDS.map((seed) => {
      const reviewKey = `${allocation.qlId}:${seed}`;
      const question = runMalCp001PermanentPipeline({
        questionLanguageId: allocation.qlId,
        seed: reviewKey,
        language: "en",
      });
      return {
        reviewKey,
        qlId: allocation.qlId,
        qlTemplateId: allocation.qlTemplateId,
        solveModeId: allocation.solveModeId,
        selectedPrototypeId: question.prototypeId,
        reviewStatus: "PENDING_PRODUCT_REVIEW" as const,
        question,
      };
    });
    return {
      allocation,
      reviewStatus: "PENDING_PRODUCT_REVIEW" as const,
      questions,
    };
  });

  return {
    status: "PERMANENT_ALLOCATION_IMPLEMENTATION_PROOF_REVIEW_PENDING",
    permanentQlRange: `${MAL_CP001_PERMANENT_ALLOCATION[0]!.qlId}..${MAL_CP001_PERMANENT_ALLOCATION.at(-1)!.qlId}`,
    permanentQlCount: MAL_CP001_PERMANENT_ALLOCATION.length,
    reviewQuestionCount: groups.reduce((sum, group) => sum + group.questions.length, 0),
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    groups,
  };
}
