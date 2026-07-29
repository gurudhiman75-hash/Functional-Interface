import {
  MAL_CP001_FREEZE_CANDIDATE_IDS,
  MAL_CP001_FREEZE_CLASSIFICATION,
} from "./cp001-freeze-candidate-ledger";
import type {
  MalCp001FreezeCandidateId,
  MalCp001FreezeClassification,
} from "./cp001-freeze-candidate-ledger";
import {
  getMalCp001SourceFixtureLedgerEntry,
} from "./cp001-source-fixture-ledger";
import type {
  MalCp001FreezeReadiness,
  MalCp001SourceEvidenceStrength,
  MalCp001SourceFixtureLedgerEntry,
  MalCp001RepresentationKind,
} from "./cp001-source-fixture-ledger";
import { generateMalCp001DiscoveryPrototype } from "./cp001-discovery-pipeline";

export const MAL_CP001_FREEZE_REVIEW_SEEDS = [
  "review-a",
  "review-b",
  "review-c",
  "review-d",
] as const;

export type MalCp001FreezeReviewStatus = "PENDING";

export interface MalCp001FreezeReviewQuestion {
  reviewKey: string;
  freezeCandidateId: MalCp001FreezeCandidateId;
  prototypeId: MalCp001FreezeClassification["prototypeId"];
  disposition: MalCp001FreezeClassification["disposition"];
  classificationRationale: string;
  sourceReadiness: MalCp001FreezeReadiness;
  humanReviewStatus: MalCp001FreezeReviewStatus;
  question: ReturnType<typeof generateMalCp001DiscoveryPrototype>;
}

export interface MalCp001FreezeReviewPrototypeGroup {
  prototypeId: MalCp001FreezeClassification["prototypeId"];
  disposition: MalCp001FreezeClassification["disposition"];
  classificationRationale: string;
  questions: readonly MalCp001FreezeReviewQuestion[];
}

export interface MalCp001FreezeReviewCandidateGroup {
  freezeCandidateId: MalCp001FreezeCandidateId;
  humanReviewStatus: MalCp001FreezeReviewStatus;
  sourceReadiness: MalCp001FreezeReadiness;
  sourceConclusion: string;
  sourceFixtureCount: number;
  evidenceStrengths: readonly MalCp001SourceEvidenceStrength[];
  representationCoverage: readonly MalCp001RepresentationKind[];
  prototypeGroups: readonly MalCp001FreezeReviewPrototypeGroup[];
}

export interface MalCp001FreezeReviewModel {
  status: "FREEZE_CANDIDATE_REVIEW_PENDING";
  permanentQlCount: 0;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  candidateCount: number;
  prototypeCount: number;
  questionCount: number;
  humanReviewStatus: MalCp001FreezeReviewStatus;
  candidateGroups: readonly MalCp001FreezeReviewCandidateGroup[];
}

function uniqueSorted<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort() as T[];
}

function buildCandidateGroup(
  freezeCandidateId: MalCp001FreezeCandidateId,
  sourceEntry: MalCp001SourceFixtureLedgerEntry,
): MalCp001FreezeReviewCandidateGroup {
  const classifications = MAL_CP001_FREEZE_CLASSIFICATION.filter(
    (entry) => entry.freezeCandidateId === freezeCandidateId,
  );

  const prototypeGroups = classifications.map((classification) => {
    const questions = MAL_CP001_FREEZE_REVIEW_SEEDS.map((seed) => {
      const question = generateMalCp001DiscoveryPrototype(
        classification.prototypeId,
        `freeze-candidate-review:${freezeCandidateId}:${classification.prototypeId}:${seed}`,
      );
      return {
        reviewKey: `${freezeCandidateId}:${classification.prototypeId}:${seed}`,
        freezeCandidateId,
        prototypeId: classification.prototypeId,
        disposition: classification.disposition,
        classificationRationale: classification.rationale,
        sourceReadiness: sourceEntry.readiness,
        humanReviewStatus: "PENDING" as const,
        question,
      };
    });

    return {
      prototypeId: classification.prototypeId,
      disposition: classification.disposition,
      classificationRationale: classification.rationale,
      questions,
    };
  });

  return {
    freezeCandidateId,
    humanReviewStatus: "PENDING",
    sourceReadiness: sourceEntry.readiness,
    sourceConclusion: sourceEntry.sourceConclusion,
    sourceFixtureCount: sourceEntry.fixtures.length,
    evidenceStrengths: uniqueSorted(
      sourceEntry.fixtures.map((fixture) => fixture.evidenceStrength),
    ),
    representationCoverage: uniqueSorted(
      sourceEntry.fixtures.flatMap((fixture) => fixture.representations),
    ),
    prototypeGroups,
  };
}

export function buildMalCp001FreezeReviewModel(): MalCp001FreezeReviewModel {
  const candidateGroups = MAL_CP001_FREEZE_CANDIDATE_IDS.map(
    (freezeCandidateId) =>
      buildCandidateGroup(
        freezeCandidateId,
        getMalCp001SourceFixtureLedgerEntry(freezeCandidateId),
      ),
  );

  const prototypeCount = candidateGroups.reduce(
    (sum, group) => sum + group.prototypeGroups.length,
    0,
  );
  const questionCount = candidateGroups.reduce(
    (sum, group) =>
      sum + group.prototypeGroups.reduce(
        (prototypeSum, prototypeGroup) =>
          prototypeSum + prototypeGroup.questions.length,
        0,
      ),
    0,
  );

  return {
    status: "FREEZE_CANDIDATE_REVIEW_PENDING",
    permanentQlCount: 0,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    candidateCount: candidateGroups.length,
    prototypeCount,
    questionCount,
    humanReviewStatus: "PENDING",
    candidateGroups,
  };
}
