import {
  USER_CORPUS,
  auditUserCorpus,
  type FrozenUserCorpusRecord,
  type UserCorpusDimension,
  type UserCorpusFinding,
} from "./user-corpus";
import {
  USER_CORPUS_REVIEW_NOTES,
  USER_CORPUS_SOURCE_INVENTORY,
} from "./user-review-notes";

export interface UserCorpusReport {
  reportId: "REAL-WORLD-001";
  requestedCorpusRange: {
    minimum: 100;
    maximum: 200;
  };
  verifiedStrictQuestionCount: number;
  approvedQuestions: number;
  criticalFindings: readonly UserCorpusFinding[];
  majorFindings: readonly UserCorpusFinding[];
  minorFindings: readonly UserCorpusFinding[];
  sourceDistribution: readonly {
    fileName: string;
    questions: number;
  }[];
  difficultyDistribution: readonly {
    difficulty: "Easy" | "Medium" | "Hard";
    questions: number;
  }[];
  contextDistribution: readonly {
    context: "abstract" | "money" | "count" | "continuous";
    questions: number;
  }[];
  dimensionSummaries: readonly {
    dimension: UserCorpusDimension;
    affectedQuestions: number;
    critical: number;
    major: number;
    minor: number;
  }[];
  comparisonDistribution: readonly {
    result: FrozenUserCorpusRecord["bookComparison"];
    questions: number;
  }[];
  sourceInventory: typeof USER_CORPUS_SOURCE_INVENTORY;
  reviewNotes: typeof USER_CORPUS_REVIEW_NOTES;
  examplesRequiringReview: readonly FrozenUserCorpusRecord[];
  examplesApproved: readonly FrozenUserCorpusRecord[];
  qualification: {
    criticalZero: boolean;
    majorAtMostTen: boolean;
    minorAtMostTen: boolean;
    approvalAtLeastNinetyPercent: boolean;
    requestedCorpusSizeSatisfied: boolean;
    productionChangesMade: false;
    qualified: boolean;
  };
}

export function produceUserCorpusReport(): UserCorpusReport {
  const records = auditUserCorpus(USER_CORPUS);
  const findings = records.flatMap((record) => record.findings);
  const critical = findings.filter((entry) => entry.severity === "CRITICAL");
  const major = findings.filter((entry) => entry.severity === "MAJOR");
  const minor = findings.filter((entry) => entry.severity === "MINOR");
  const approved = records.filter(
    (record) => record.approvalStatus === "APPROVED",
  );
  const dimensions: readonly UserCorpusDimension[] = [
    "STEM_ALIGNMENT",
    "TUTOR_REALISM",
    "ONE_UNIT_VISIBILITY",
    "CONTEXT_PERSISTENCE",
    "ANSWER_CONFIDENCE",
    "WEAK_STUDENT_FRIENDLINESS",
    "BOOK_COMPARISON",
    "UNEXPECTED_MISMATCH",
  ];
  const comparisonResults: readonly FrozenUserCorpusRecord["bookComparison"][] =
    [
      "EEV2_CLEARER",
      "SOURCE_CLEARER",
      "EDUCATIONALLY_EQUIVALENT",
      "NOT_ASSESSABLE",
    ];
  const requestedCorpusSizeSatisfied =
    records.length >= 100 && records.length <= 200;
  const approvalAtLeastNinetyPercent =
    approved.length / records.length >= 0.9;

  return {
    reportId: "REAL-WORLD-001",
    requestedCorpusRange: {
      minimum: 100,
      maximum: 200,
    },
    verifiedStrictQuestionCount: records.length,
    approvedQuestions: approved.length,
    criticalFindings: critical,
    majorFindings: major,
    minorFindings: minor,
    sourceDistribution: USER_CORPUS_SOURCE_INVENTORY.map((source) => ({
      fileName: source.fileName,
      questions: records.filter(
        (record) => record.item.source.fileName === source.fileName,
      ).length,
    })),
    difficultyDistribution: (["Easy", "Medium", "Hard"] as const).map(
      (difficulty) => ({
        difficulty,
        questions: records.filter(
          (record) => record.item.difficulty === difficulty,
        ).length,
      }),
    ),
    contextDistribution: (
      ["abstract", "money", "count", "continuous"] as const
    ).map((context) => ({
      context,
      questions: records.filter(
        (record) => record.item.contextKind === context,
      ).length,
    })),
    dimensionSummaries: dimensions.map((dimension) => {
      const relevant = findings.filter(
        (entry) => entry.dimension === dimension,
      );
      return {
        dimension,
        affectedQuestions: new Set(
          relevant.map((entry) => entry.corpusId),
        ).size,
        critical: relevant.filter(
          (entry) => entry.severity === "CRITICAL",
        ).length,
        major: relevant.filter((entry) => entry.severity === "MAJOR").length,
        minor: relevant.filter((entry) => entry.severity === "MINOR").length,
      };
    }),
    comparisonDistribution: comparisonResults.map((result) => ({
      result,
      questions: records.filter(
        (record) => record.bookComparison === result,
      ).length,
    })),
    sourceInventory: USER_CORPUS_SOURCE_INVENTORY,
    reviewNotes: USER_CORPUS_REVIEW_NOTES,
    examplesRequiringReview: records.filter(
      (record) => record.approvalStatus === "REVIEW_REQUIRED",
    ),
    examplesApproved: approved,
    qualification: {
      criticalZero: critical.length === 0,
      majorAtMostTen: major.length <= 10,
      minorAtMostTen: minor.length <= 10,
      approvalAtLeastNinetyPercent,
      requestedCorpusSizeSatisfied,
      productionChangesMade: false,
      qualified:
        critical.length === 0 &&
        major.length <= 10 &&
        minor.length <= 10 &&
        approvalAtLeastNinetyPercent &&
        requestedCorpusSizeSatisfied,
    },
  };
}

export const USER_CORPUS_REPORT = produceUserCorpusReport();

