import {
  MAL_CP001_PERMANENT_ALLOCATION,
  type MalCp001PermanentAllocationEntry,
  type MalCp001PermanentQlId,
} from "./cp001-permanent-allocation";
import {
  MAL_CP001_PERMANENT_REVIEW_SEEDS,
} from "./cp001-permanent-review-model";
import {
  MAL_CP001_ENGLISH_RELEASE,
  MAL_CP001_ENGLISH_REVIEW_APPROVAL,
  runMalCp001EnglishReleasePipeline,
} from "./cp001-release";

export type MalCp001ReleaseReviewStatus = "APPROVED_FOR_ENGLISH_RELEASE";

export interface MalCp001ReleaseReviewRow {
  reviewKey: string;
  qlId: MalCp001PermanentQlId;
  qlTemplateId: MalCp001PermanentAllocationEntry["qlTemplateId"];
  solveModeId: MalCp001PermanentAllocationEntry["solveModeId"];
  selectedPrototypeId: MalCp001PermanentAllocationEntry["prototypeIds"][number];
  reviewStatus: MalCp001ReleaseReviewStatus;
  reviewMethod: typeof MAL_CP001_ENGLISH_RELEASE.reviewMethod;
  question: ReturnType<typeof runMalCp001EnglishReleasePipeline>;
}

export interface MalCp001ReleaseReviewGroup {
  allocation: MalCp001PermanentAllocationEntry;
  reviewStatus: MalCp001ReleaseReviewStatus;
  questions: readonly MalCp001ReleaseReviewRow[];
}

export interface MalCp001ReleaseReviewModel {
  status: "MAL_CP001_ENGLISH_RELEASE_REVIEW_APPROVED";
  releaseId: typeof MAL_CP001_ENGLISH_RELEASE.releaseId;
  permanentQlRange: string;
  permanentQlCount: number;
  reviewQuestionCount: number;
  reviewStatus: MalCp001ReleaseReviewStatus;
  reviewMethod: typeof MAL_CP001_ENGLISH_RELEASE.reviewMethod;
  reviewNote: typeof MAL_CP001_ENGLISH_REVIEW_APPROVAL.note;
  publiclyPublishable: true;
  questionStudioDiscoverable: true;
  questionBankWritable: true;
  testEligible: true;
  groups: readonly MalCp001ReleaseReviewGroup[];
}

export function buildMalCp001ReleaseReviewModel(): MalCp001ReleaseReviewModel {
  const groups = MAL_CP001_PERMANENT_ALLOCATION.map((allocation) => {
    const questions = MAL_CP001_PERMANENT_REVIEW_SEEDS.map((seed) => {
      const reviewKey = `${allocation.qlId}:${seed}`;
      const question = runMalCp001EnglishReleasePipeline({
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
        reviewStatus: "APPROVED_FOR_ENGLISH_RELEASE" as const,
        reviewMethod: MAL_CP001_ENGLISH_RELEASE.reviewMethod,
        question,
      };
    });
    return {
      allocation,
      reviewStatus: "APPROVED_FOR_ENGLISH_RELEASE" as const,
      questions,
    };
  });

  return {
    status: "MAL_CP001_ENGLISH_RELEASE_REVIEW_APPROVED",
    releaseId: MAL_CP001_ENGLISH_RELEASE.releaseId,
    permanentQlRange: `${MAL_CP001_PERMANENT_ALLOCATION[0]!.qlId}..${MAL_CP001_PERMANENT_ALLOCATION.at(-1)!.qlId}`,
    permanentQlCount: MAL_CP001_PERMANENT_ALLOCATION.length,
    reviewQuestionCount: groups.reduce(
      (sum, group) => sum + group.questions.length,
      0,
    ),
    reviewStatus: "APPROVED_FOR_ENGLISH_RELEASE",
    reviewMethod: MAL_CP001_ENGLISH_RELEASE.reviewMethod,
    reviewNote: MAL_CP001_ENGLISH_REVIEW_APPROVAL.note,
    publiclyPublishable: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    groups,
  };
}
