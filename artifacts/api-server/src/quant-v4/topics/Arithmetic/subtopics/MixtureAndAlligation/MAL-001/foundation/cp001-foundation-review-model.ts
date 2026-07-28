import { generateMalCp001FoundationQuestion } from "./cp001-foundation-normalizer";
import {
  MAL_CP001_FOUNDATION_FREEZE_METADATA,
  MAL_CP001_FROZEN_QL_TEMPLATES,
  MAL_CP001_FROZEN_SOLVE_MODES,
} from "./cp001-foundation-freeze-ledger";

export const MAL_CP001_FOUNDATION_REVIEW_SEEDS = [
  "foundation-review-a",
  "foundation-review-b",
  "foundation-review-c",
  "foundation-review-d",
] as const;

export type MalCp001FoundationReviewStatus = "PASS";

export interface MalCp001FoundationReviewRow {
  reviewKey: string;
  qlTemplateId: string;
  solveModeId: string;
  prototypeId: string;
  editorialReviewStatus: MalCp001FoundationReviewStatus;
  reviewMethod: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT";
  question: ReturnType<typeof generateMalCp001FoundationQuestion>;
}

export interface MalCp001FoundationPrototypeGroup {
  prototypeId: string;
  editorialReviewStatus: MalCp001FoundationReviewStatus;
  questions: readonly MalCp001FoundationReviewRow[];
}

export interface MalCp001FoundationTemplateGroup {
  template: (typeof MAL_CP001_FROZEN_QL_TEMPLATES)[number];
  editorialReviewStatus: MalCp001FoundationReviewStatus;
  prototypeGroups: readonly MalCp001FoundationPrototypeGroup[];
}

export interface MalCp001FoundationReviewModel {
  status: "FROZEN_FOUNDATION_ENGLISH_REVIEW_PASS";
  reviewAuthority: string;
  reviewMethod: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT";
  solveModeCount: number;
  qlTemplateCount: number;
  approvedPrototypeCount: number;
  questionCount: number;
  editorialReviewStatus: MalCp001FoundationReviewStatus;
  qlTemplateCountFrozen: true;
  solveModeCountFrozen: true;
  permanentQlCount: 0;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  templateGroups: readonly MalCp001FoundationTemplateGroup[];
}

function buildTemplateGroup(
  template: (typeof MAL_CP001_FROZEN_QL_TEMPLATES)[number],
): MalCp001FoundationTemplateGroup {
  const prototypeGroups = template.prototypeIds.map((prototypeId) => {
    const questions = MAL_CP001_FOUNDATION_REVIEW_SEEDS.map((seed) => {
      const reviewKey = `${template.qlTemplateId}:${prototypeId}:${seed}`;
      return {
        reviewKey,
        qlTemplateId: template.qlTemplateId,
        solveModeId: template.solveModeId,
        prototypeId,
        editorialReviewStatus: "PASS" as const,
        reviewMethod: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT" as const,
        question: generateMalCp001FoundationQuestion(prototypeId, reviewKey),
      };
    });

    return {
      prototypeId,
      editorialReviewStatus: "PASS" as const,
      questions,
    };
  });

  return {
    template,
    editorialReviewStatus: "PASS",
    prototypeGroups,
  };
}

export function buildMalCp001FoundationReviewModel(): MalCp001FoundationReviewModel {
  const templateGroups = MAL_CP001_FROZEN_QL_TEMPLATES.map(buildTemplateGroup);
  const approvedPrototypeCount = new Set(
    templateGroups.flatMap((group) => group.template.prototypeIds),
  ).size;
  const questionCount = templateGroups.reduce(
    (sum, group) =>
      sum + group.prototypeGroups.reduce(
        (prototypeSum, prototypeGroup) => prototypeSum + prototypeGroup.questions.length,
        0,
      ),
    0,
  );

  return {
    status: "FROZEN_FOUNDATION_ENGLISH_REVIEW_PASS",
    reviewAuthority: MAL_CP001_FOUNDATION_FREEZE_METADATA.authority,
    reviewMethod: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT",
    solveModeCount: MAL_CP001_FROZEN_SOLVE_MODES.length,
    qlTemplateCount: templateGroups.length,
    approvedPrototypeCount,
    questionCount,
    editorialReviewStatus: "PASS",
    qlTemplateCountFrozen: true,
    solveModeCountFrozen: true,
    permanentQlCount: 0,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    templateGroups,
  };
}
