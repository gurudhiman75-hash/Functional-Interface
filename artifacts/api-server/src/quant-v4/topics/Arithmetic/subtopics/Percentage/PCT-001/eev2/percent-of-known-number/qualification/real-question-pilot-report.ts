import {
  REAL_QUESTION_PILOT_CORPUS,
  REAL_QUESTION_REVIEW_NOTES,
  type RealQuestionDifficulty,
  type RealQuestionProvenance,
} from "./real-question-review-notes";
import {
  runRealQuestionPilot,
  type FrozenRealQuestionRecord,
  type RealQuestionDimension,
  type RealQuestionFinding,
} from "./real-question-pilot";

export interface RealQuestionPilotReport {
  reportId: "QUAL-001-E0";
  totalQuestions: number;
  approvedQuestions: number;
  criticalFindings: readonly RealQuestionFinding[];
  majorFindings: readonly RealQuestionFinding[];
  minorFindings: readonly RealQuestionFinding[];
  sourceDistribution: readonly {
    publisher: string;
    provenance: RealQuestionProvenance;
    questions: number;
  }[];
  difficultyDistribution: readonly {
    difficulty: RealQuestionDifficulty;
    questions: number;
  }[];
  dimensionSummaries: readonly {
    dimension: RealQuestionDimension;
    affectedQuestions: number;
    criticalFindings: number;
    majorFindings: number;
    minorFindings: number;
  }[];
  sourceLevelFindings: readonly {
    source: string;
    finding: string;
  }[];
  reviewerNotes: typeof REAL_QUESTION_REVIEW_NOTES;
  unexpectedObservations: readonly string[];
  examplesRequiringReview: readonly FrozenRealQuestionRecord[];
  examplesApproved: readonly FrozenRealQuestionRecord[];
  successTarget: {
    criticalZero: boolean;
    majorAtMostTen: boolean;
    minorAtMostTen: boolean;
    approvalAtLeastNinetyPercent: boolean;
    genuineExamCorpusSatisfied: boolean;
    requestedContextCoverageSatisfied: boolean;
  };
}

export function produceRealQuestionPilotReport(): RealQuestionPilotReport {
  const records = runRealQuestionPilot(REAL_QUESTION_PILOT_CORPUS);
  const findings = records.flatMap((record) => record.findings);
  const critical = findings.filter((entry) => entry.severity === "CRITICAL");
  const major = findings.filter((entry) => entry.severity === "MAJOR");
  const minor = findings.filter((entry) => entry.severity === "MINOR");
  const approved = records.filter((record) => record.approvalStatus === "APPROVED");
  const provenanceValues: readonly RealQuestionProvenance[] = [
    "OFFICIAL_EXAM",
    "TRUSTED_PLATFORM",
  ];
  const difficulties: readonly RealQuestionDifficulty[] = [
    "Easy",
    "Medium",
    "Hard",
  ];
  const dimensions: readonly RealQuestionDimension[] = [
    "TUTOR_REALISM",
    "ONE_UNIT_VISIBILITY",
    "STEM_ALIGNMENT",
    "CONTEXT_PERSISTENCE",
    "ANSWER_CONFIDENCE",
    "WEAK_STUDENT_FRIENDLINESS",
    "PLATFORM_COMPARISON",
    "UNEXPECTED_MISMATCH",
  ];
  const officialCount = records.filter(
    (record) => record.source.provenance === "OFFICIAL_EXAM",
  ).length;
  const contextKinds = new Set(
    REAL_QUESTION_PILOT_CORPUS.map((entry) => entry.contextKind),
  );
  const genuineExamCorpusSatisfied = officialCount === records.length;
  const requestedContextCoverageSatisfied = [
    "abstract",
    "money",
    "count",
    "continuous",
  ].every((context) => contextKinds.has(context as "abstract"));

  return {
    reportId: "QUAL-001-E0",
    totalQuestions: records.length,
    approvedQuestions: approved.length,
    criticalFindings: critical,
    majorFindings: major,
    minorFindings: minor,
    sourceDistribution: provenanceValues.map((provenance) => ({
      publisher: "Testbook",
      provenance,
      questions: records.filter(
        (record) => record.source.provenance === provenance,
      ).length,
    })),
    difficultyDistribution: difficulties.map((difficulty) => ({
      difficulty,
      questions: records.filter((record) => record.difficulty === difficulty)
        .length,
    })),
    dimensionSummaries: dimensions.map((dimension) => {
      const relevant = findings.filter(
        (finding) => finding.dimension === dimension,
      );
      return {
        dimension,
        affectedQuestions: new Set(
          relevant.map((finding) => finding.pilotId),
        ).size,
        criticalFindings: relevant.filter(
          (finding) => finding.severity === "CRITICAL",
        ).length,
        majorFindings: relevant.filter(
          (finding) => finding.severity === "MAJOR",
        ).length,
        minorFindings: relevant.filter(
          (finding) => finding.severity === "MINOR",
        ).length,
      };
    }),
    sourceLevelFindings: [
      {
        source: "Testbook / ACC 127 SER",
        finding:
          "One selected page explicitly identifies an official paper held in August 2022.",
      },
      {
        source: "Testbook question bank",
        finding:
          "Forty-nine selected pages do not state official-paper provenance and are classified as trusted-platform questions.",
      },
      {
        source: "Exact-family source pool",
        finding:
          "The located questions are abstract-number items; requested money, count, and continuous-context coverage is absent.",
      },
    ],
    reviewerNotes: REAL_QUESTION_REVIEW_NOTES,
    unexpectedObservations: [
      `${officialCount}/${records.length} selected source pages explicitly identify a prior official exam.`,
      "The exact percentOfKnownNumber pool found in the trusted source is almost entirely abstract-number wording.",
      "Money, count, and continuous contexts could not be added honestly without broadening into other percentage task kinds.",
      "Fraction-worded stems test whether percentage-based explanations remain aligned with the source wording.",
    ],
    examplesRequiringReview: records.filter(
      (record) => record.approvalStatus === "REVIEW_REQUIRED",
    ),
    examplesApproved: approved,
    successTarget: {
      criticalZero: critical.length === 0,
      majorAtMostTen: major.length <= 10,
      minorAtMostTen: minor.length <= 10,
      approvalAtLeastNinetyPercent:
        approved.length / records.length >= 0.9,
      genuineExamCorpusSatisfied,
      requestedContextCoverageSatisfied,
    },
  };
}

export const REAL_QUESTION_PILOT_REPORT = produceRealQuestionPilotReport();
