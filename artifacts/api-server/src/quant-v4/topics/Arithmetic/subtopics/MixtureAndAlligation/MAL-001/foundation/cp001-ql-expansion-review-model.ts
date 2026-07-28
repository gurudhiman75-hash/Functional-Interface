import { generateMalCp001DiscoveryPrototype } from "./cp001-discovery-pipeline";
import {
  MAL_CP001_PROVISIONAL_QL_TEMPLATES,
  MAL_CP001_PROVISIONAL_SOLVE_MODES,
} from "./cp001-ql-expansion-ledger";
import type {
  MalCp001ProvisionalQlTemplate,
  MalCp001ProvisionalQlTemplateId,
  MalCp001ProvisionalSolveModeId,
} from "./cp001-ql-expansion-ledger";

export const MAL_CP001_QL_EXPANSION_REVIEW_SEEDS = [
  "ql-review-a",
  "ql-review-b",
  "ql-review-c",
  "ql-review-d",
] as const;

export type MalCp001QlExpansionReviewStatus = "PENDING";

export interface MalCp001QlExpansionReviewRow {
  reviewKey: string;
  qlTemplateId: MalCp001ProvisionalQlTemplateId;
  solveModeId: MalCp001ProvisionalSolveModeId;
  prototypeId: MalCp001ProvisionalQlTemplate["prototypeIds"][number];
  humanReviewStatus: MalCp001QlExpansionReviewStatus;
  question: ReturnType<typeof generateMalCp001DiscoveryPrototype>;
}

export interface MalCp001QlExpansionPrototypeGroup {
  prototypeId: MalCp001ProvisionalQlTemplate["prototypeIds"][number];
  questions: readonly MalCp001QlExpansionReviewRow[];
}

export interface MalCp001QlExpansionTemplateGroup {
  template: MalCp001ProvisionalQlTemplate;
  humanReviewStatus: MalCp001QlExpansionReviewStatus;
  prototypeGroups: readonly MalCp001QlExpansionPrototypeGroup[];
}

export interface MalCp001QlExpansionReviewModel {
  status: "PROVISIONAL_QL_EXPANSION_REVIEW_PENDING";
  provisionalSolveModeCount: number;
  provisionalQlTemplateCount: number;
  approvedPrototypeCount: number;
  questionCount: number;
  humanReviewStatus: MalCp001QlExpansionReviewStatus;
  qlTemplateCountFrozen: false;
  solveModeCountFrozen: false;
  permanentQlCount: 0;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  templateGroups: readonly MalCp001QlExpansionTemplateGroup[];
}

function buildTemplateGroup(
  template: MalCp001ProvisionalQlTemplate,
): MalCp001QlExpansionTemplateGroup {
  const prototypeGroups = template.prototypeIds.map((prototypeId) => {
    const questions = MAL_CP001_QL_EXPANSION_REVIEW_SEEDS.map((seed) => {
      const reviewKey = `${template.qlTemplateId}:${prototypeId}:${seed}`;
      return {
        reviewKey,
        qlTemplateId: template.qlTemplateId,
        solveModeId: template.solveModeId,
        prototypeId,
        humanReviewStatus: "PENDING" as const,
        question: generateMalCp001DiscoveryPrototype(prototypeId, reviewKey),
      };
    });
    return { prototypeId, questions };
  });

  return {
    template,
    humanReviewStatus: "PENDING",
    prototypeGroups,
  };
}

export function buildMalCp001QlExpansionReviewModel(): MalCp001QlExpansionReviewModel {
  const templateGroups = MAL_CP001_PROVISIONAL_QL_TEMPLATES.map(buildTemplateGroup);
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
    status: "PROVISIONAL_QL_EXPANSION_REVIEW_PENDING",
    provisionalSolveModeCount: MAL_CP001_PROVISIONAL_SOLVE_MODES.length,
    provisionalQlTemplateCount: templateGroups.length,
    approvedPrototypeCount,
    questionCount,
    humanReviewStatus: "PENDING",
    qlTemplateCountFrozen: false,
    solveModeCountFrozen: false,
    permanentQlCount: 0,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    templateGroups,
  };
}
