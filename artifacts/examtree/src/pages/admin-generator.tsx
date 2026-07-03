import {
  useEffect,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  SeatingDiagramData,
  SeatingExplanationFlow as SeatingExplanationFlowData,
} from "@workspace/api-zod";
import MathText from "@/components/MathText";
import SeatingExplanationFlow from "@/components/seating/SeatingExplanationFlow";
import SeatingDiagramRenderer from "@/components/seating/SeatingDiagramRenderer";
import {
  downloadQuestionExport,
  type QuestionExportContent,
  type QuestionExportFormat,
} from "@/lib/export-engine";

const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "";

const REQUIRED_REGISTRY_PATTERNS = [
  {
    id: "error-spotting",
    domain: "english",
    topic: "error-spotting",
    label: "Error Spotting",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "banking"],
    enabled: true,
  },
  {
    id: "sentence-improvement",
    domain: "english",
    topic: "sentence-improvement",
    label: "Sentence Improvement",
    supportedDifficulties: [
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "banking"],
    enabled: true,
  },
  {
    id: "fillers",
    domain: "english",
    topic: "fillers",
    label: "Fillers",
    supportedDifficulties: [
      "easy",
      "medium",
    ],
    examStyles: ["banking"],
    enabled: true,
  },
  {
    id: "active-passive",
    domain: "english",
    topic: "active-passive",
    label: "Active/Passive Voice",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "banking"],
    enabled: true,
  },
  {
    id: "narration",
    domain: "english",
    topic: "narration",
    label: "Narration",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "banking"],
    enabled: true,
  },
  {
    id: "para-jumbles",
    domain: "english",
    topic: "para-jumbles",
    label: "Para Jumbles",
    supportedDifficulties: [
      "medium",
      "hard",
    ],
    examStyles: ["banking", "cat"],
    enabled: true,
  },
  {
    id: "root-words",
    domain: "english",
    topic: "root-words",
    label: "Root Words",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "cat", "banking"],
    enabled: true,
  },
  {
    id: "synonyms-antonyms",
    domain: "english",
    topic: "vocabulary",
    label: "Synonyms / Antonyms",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "banking", "cat"],
    enabled: true,
  },
  {
    id: "idioms",
    domain: "english",
    topic: "idioms",
    label: "Idioms and Phrases",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "rrb", "banking"],
    enabled: true,
  },
  {
    id: "reading-comprehension",
    domain: "english",
    topic: "reading-comprehension",
    label: "Reading Comprehension",
    supportedDifficulties: [
      "medium",
      "hard",
    ],
    examStyles: ["ssc", "cat", "banking"],
    enabled: true,
  },
  {
    id: "punjabi-vyakaran-ling",
    domain: "punjabi",
    topic: "vyakaran",
    label: "Punjabi Vyakaran - Ling Badlo",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc", "rrb"],
    enabled: true,
  },
  {
    id: "punjabi-vyakaran-vachan",
    domain: "punjabi",
    topic: "vyakaran",
    label: "Punjabi Vyakaran - Vachan Badlo",
    supportedDifficulties: [
      "easy",
      "medium",
    ],
    examStyles: ["punjab", "psssb", "ppsc", "rrb"],
    enabled: true,
  },
  {
    id: "punjabi-vak-shuddhi",
    domain: "punjabi",
    topic: "vyakaran",
    label: "Punjabi Vak Shuddhi",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc"],
    enabled: true,
  },
  {
    id: "punjabi-shabad-jor",
    domain: "punjabi",
    topic: "shabad-jor",
    label: "Punjabi Shabad-Jor",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc", "rrb"],
    enabled: true,
  },
  {
    id: "punjabi-vocabulary",
    domain: "punjabi",
    topic: "vocabulary",
    label: "Punjabi Samanarthak / One Word",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc"],
    enabled: true,
  },
  {
    id: "punjabi-muhavre-akhaan",
    domain: "punjabi",
    topic: "muhavre-akhaan",
    label: "Punjabi Muhavre and Akhaan",
    supportedDifficulties: [
      "easy",
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc", "rrb"],
    enabled: true,
  },
  {
    id: "punjabi-translation-admin",
    domain: "punjabi",
    topic: "translation",
    label: "English-Punjabi Administrative Translation",
    supportedDifficulties: [
      "medium",
      "hard",
    ],
    examStyles: ["punjab", "psssb", "ppsc"],
    enabled: true,
  },
] as const;

const QUANT_V4_PERCENTAGE_ALL_PATTERN_ID =
  "PCT-ALL";

function mergeRequiredRegistryPatterns(
  registryPatterns: any[],
) {
  const quantV4Patterns =
    registryPatterns.filter(
    (pattern) =>
      pattern?.generationDomain === "quant-v4" ||
      pattern?.type === "quant-v4",
  );

  const percentagePatterns =
    quantV4Patterns.filter(
      (pattern) =>
        pattern?.topic ===
          "Arithmetic" &&
        pattern?.subtopic ===
          "Percentage" &&
        /^PCT-\d+$/.test(
          String(
            pattern?.packageId ??
              pattern?.id ??
              "",
          ),
        ),
    );

  if (
    !percentagePatterns.length ||
    quantV4Patterns.some(
      (pattern) =>
        pattern?.id ===
        QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
    )
  ) {
    return quantV4Patterns;
  }

  return [
    {
      id: QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
      packageId:
        QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: "Arithmetic",
      subtopic: "Percentage",
      label:
        "All Percentage Packages",
      name:
        "PCT-ALL All Percentage Packages",
      generationDomain: "quant-v4",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      supportedLanguages: ["en"],
      enabled: true,
      canonicalProblems: [],
    },
    ...quantV4Patterns,
  ];
}

type DIDataRow = Record<
  string,
  string | number
>;

type DifficultyLabel =
  | "Easy"
  | "Medium"
  | "Hard";

type DISetProfile =
  | "progressive"
  | "balanced"
  | "spike"
  | "uniform";

type DISeriesType =
  | "line"
  | "bar";

type DISeriesConfig = {
  column: string;
  type: DISeriesType;
  label?: string;
};

type ExamProfileId =
  | "custom"
  | "ssc"
  | "ibps"
  | "cat"
  | "sbi"
  | "rrb";

type DifficultyMetadata = {
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  estimatedSolveTime: number;
  operationCount: number;
  reasoningDepth: number;
  reasoningSteps?: string[];
  dependencyComplexity?: number;
  operationChain?: string[];
  usesPercentage: boolean;
  usesRatio: boolean;
  usesComparison: boolean;
  visualComplexity: number;
  inferenceComplexity: number;
};

type OptionMetadata = {
  value: string;
  isCorrect: boolean;
  distractorType?: string;
  likelyMistake?: string;
  reasoningTrap?: string;
};

type ExamRealismMetadata = {
  examProfile: ExamProfileId;
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy";
  archetypeId?: string;
  archetypeCategory?: string;
  reasoningTraps: string[];
  weightingSummary: string[];
  realismScore?: number;
  realismBand?:
    | "low"
    | "moderate"
    | "strong"
    | "pyq-like";
  realismSignals?: string[];
  realismPenalties?: string[];
};

type ValidationStageResult = {
  stage: string;
  passed: boolean;
  diagnostics: string[];
  metrics: Record<string, number>;
};

type ValidationReport = {
  passed: boolean;
  stageResults: ValidationStageResult[];
  warnings: string[];
  metrics: Record<string, number>;
};

type DifficultyAssessment = {
  difficultyLabel?: DifficultyLabel;
  difficultyScore?: number;
  cognitiveLoad: number;
  inferenceDepth: number;
  calculationComplexity: number;
  distractorComplexity: number;
  ambiguityScore: number;
  solvingTimeEstimate: number;
  domainContributions?: Record<
    string,
    number
  >;
  metrics: Record<string, number>;
};

type ExtractedPatternIntelligence = {
  domain: string;
  structure: {
    domain: string;
    subtype: string;
    entityCount: number;
    constraintCount: number;
    structureTokens: string[];
    topology?: string;
  };
  difficulty: {
    cognitiveLoad: number;
    inferenceDepth: number;
    calculationComplexity: number;
    distractorComplexity: number;
    ambiguityScore: number;
    solvingTimeEstimate: number;
    difficultyBand?: string;
  };
  distractors: Array<{
    type: string;
    label: string;
    trapType?: string;
    frequency: number;
  }>;
  motifs: Array<{
    motifId: string;
    domain: string;
    archetype: string;
    confidence: number;
  }>;
};

type StructuralSignature = {
  domain: string;
  topologyHash: string;
  inferenceHash: string;
  motifHash: string;
  distractorHash: string;
};

type QualityAssessment = {
  approved: boolean;
  rejectionReasons: string[];
  qualityMetrics: Record<string, number>;
};

type ReasoningRealismAnalysis = {
  overallScore: number;
  band:
    | "low"
    | "moderate"
    | "strong"
    | "pyq-like";
  clueNaturalness: number;
  anchorDensity: number;
  deductionSmoothness: number;
  branchingQuality: number;
  topologyDiversity: number;
  overconstraintDetection: number;
  pyqHeuristicAlignment: number;
  penalties: string[];
  matchedHeuristics: string[];
  diagnosticSummary: string[];
};

type GenerationDebugMetadata = {
  selectedPattern: string;
  generationDomain?:
    | "quant"
    | "quant-v4"
    | "quant-v2-percentage"
    | "quant-v2-profit-loss"
    | "quant-v2-interest"
    | "quant-v2-ratio-proportion"
    | "quant-v2-time-work"
    | "quant-v2-time-speed-distance"
    | "quant-v2-mixture-alligation"
    | "reasoning"
    | "english"
    | "punjabi"
    | "knowledge"
    | "computer"
    | "seating-arrangement"
    | "di"
    | "puzzle-sets"
    | "graph-reasoning"
    | "scheduling-puzzles";
  selectedMotif?: string;
  selectedArchetype?: string;
  fallbackReason?: string;
  compatibilityWarnings: string[];
  participantCount?: number;
  clueCount?: number;
  inferenceDepth?: number;
  solverComplexity?: number;
  validationWarnings?: string[];
  directClueCount?: number;
  indirectClueCount?: number;
  relationalClueCount?: number;
  deductionDepth?: number;
  eliminationDepth?: number;
  clueGraphDensity?: number;
  clueInteractionRatio?: number;
  redundancyScore?: number;
  structuralDiversityScore?: number;
  clueTypeDistribution?: Record<
    string,
    number
  >;
  repeatedStructureWarnings?: string[];
  seed?: string;
  generationId?: string;
  arrangementType?: string;
  orientationType?: string;
  uniquenessVerified?: boolean;
  finalArrangement?: string;
  generatedClues?: string[];
  solverTrace?: string[];
  solverTraceExport?: {
    text?: string[];
    json?: string;
  };
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlowData;
  generationMetrics?: {
    inferenceDepth?: number;
    redundancyScore?: number;
    clueDensity?: number;
    realismScore?: number;
  };
  realismAnalysis?: ReasoningRealismAnalysis;
  validationReportDetail?: ValidationReport;
  difficultyAssessment?: DifficultyAssessment;
  extractedPatternIntelligence?: ExtractedPatternIntelligence;
  structuralSignature?: StructuralSignature;
  qualityAssessment?: QualityAssessment;
  generationBackend?: string;
  debugSource?: string;
  quantV2?: Record<string, unknown>;
  reasoningGraph?: unknown;
  semanticMetadata?: unknown;
  svgRendering?: unknown;
  qualityMetrics?: unknown;
  localizationMetadata?: unknown;
  pedagogicalMetrics?: unknown;
  validatorReports?: unknown;
  proceduralScenario?: {
    domain: string;
    subtype: string;
  };
  canonicalProblemId?: string;
  questionLanguageId?: string;
  explanationId?: string;
  taskKind?: string;
  scenarioId?: string;
  questionIndex?: number;
  questionCount?: number;
  questionId?: string;
  packageSource?: string;
};

type DIQuestion = {
  text: string;
  options?: string[];
  optionMetadata?: OptionMetadata[];
  difficulty?: DifficultyLabel;
  difficultyScore?: number;
  difficultyLabel?: DifficultyLabel;
  difficultyMetadata?: DifficultyMetadata;
  examRealismMetadata?: ExamRealismMetadata;
  debugMetadata?: GenerationDebugMetadata;
  explanation?: string;
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlowData;
};

type DISet = {
  questionType: "di";
  visualType?: "table" | "bar" | "pie" | "line";
  diData: DIDataRow[];
  series?: DISeriesConfig[];
  title?: string;
  questions: DIQuestion[];
  averageDifficulty?: number;
  peakDifficulty?: number;
  difficultySpread?: DISetProfile;
  setProfile?: DISetProfile;
};

type FormulaQuestion = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  questionId?: string | null;
  seed?: string | null;
  answer?: string | null;
  packageSource?: string | null;
  packageId?: string | null;
  taskKind?: string | null;
  scenarioId?: string | null;
  questionIndex?: number | null;
  questionCount?: number | null;
  canonicalProblemId?: string | null;
  questionLanguageId?: string | null;
  explanationId?: string | null;
  textHi?: string | null;
  textPa?: string | null;
  optionsHi?: string[] | null;
  optionsPa?: string[] | null;
  explanationHi?: string | null;
  explanationPa?: string | null;
  patternId?: string | null;
  proceduralLogic?: unknown | null;
  logic?: unknown | null;
  motifs?: unknown | null;
  languages?: unknown | null;
  requestedLanguages?: RegistryLanguage[];
  nativeRealization?: Record<
    string,
    {
      supported?: boolean;
      reason?: string;
      source?: string;
      coverageCategory?: string;
      coveragePercent?: number;
      validation?: {
        passed?: boolean;
        diagnostics?: string[];
      };
    }
  >;
  nativeCoverage?: unknown;
  generationBackend?: string;
  debugSource?: string;
  reasoningGraph?: unknown;
  semanticMetadata?: unknown;
  visual?: unknown;
  svgRendering?: unknown;
  qualityMetrics?: unknown;
  localizationMetadata?: unknown;
  pedagogicalMetrics?: unknown;
  section?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: DifficultyLabel;
  difficultyScore?: number;
  difficultyLabel?: DifficultyLabel;
  difficultyMetadata?: DifficultyMetadata;
  optionMetadata?: OptionMetadata[];
  examRealismMetadata?: ExamRealismMetadata;
  debugMetadata?: GenerationDebugMetadata;
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlowData;
};

type KnowledgeExtractionCandidate = {
  candidateId: string;
  rawText: string;
  proposedFact: {
    factId: string;
    entityId: string;
    subject: string;
    topic: string;
    subtopic: string;
    factType: string;
    contextGroupId: string;
    sequenceIndex?: number;
    data: {
      entity: Record<
        RegistryLanguage,
        string
      >;
      fact: Record<
        RegistryLanguage,
        string
      >;
      detail?: Partial<
        Record<
          RegistryLanguage,
          string
        >
      >;
    };
    difficulty:
      | "easy"
      | "moderate"
      | "hard";
    examTags: string[];
    tags: string[];
    verification: {
      reviewed: boolean;
      confidence: number;
    };
    source: {
      book?: string;
      url?: string;
      page?: number;
      chapter?: string;
      note?: string;
    };
  };
  extractionNotes: string[];
  status:
    | "draft"
    | "needs_review"
    | "approved"
    | "rejected";
  review?: {
    reviewedAt: string;
    reviewerId?: string;
    notes?: string;
  };
};

type KnowledgeSourceIngestionMetadata = {
  sourceType: "pdf" | "text";
  fileName?: string;
  mimeType?: string;
  bytes: number;
  pageCount: number;
  totalPages?: number;
  selectedStartPage?: number;
  selectedEndPage?: number;
  selectedPageCount?: number;
  ocrUsed: boolean;
  ocrPages: number[];
  extractionQuality:
    | "high"
    | "medium"
    | "low";
  charCount: number;
  wordCount: number;
  warnings: string[];
};

function isExtractionRuntimeWarning(
  warning: string,
) {
  return (
    /^Chunk \d+ failed:/i.test(warning) ||
    /OpenAI connection failed/i.test(
      warning,
    ) ||
    /AI extraction did not produce candidates/i.test(
      warning,
    ) ||
    /offline heuristic extraction/i.test(
      warning,
    ) ||
    /OPENAI_API_KEY/i.test(warning)
  );
}

function mergeSourceAndExtractionWarnings(
  existingWarnings: string[],
  extractionWarnings: string[],
) {
  const sourceWarnings =
    existingWarnings.filter(
      (warning) =>
        !isExtractionRuntimeWarning(
          warning,
        ),
    );

  return Array.from(
    new Set([
      ...sourceWarnings,
      ...extractionWarnings.filter(Boolean),
    ]),
  );
}

type GeneratedQuestion =
  | FormulaQuestion
  | DISet;

type FilingSubjectId = string;

type FilingConfig = {
  subjectId: FilingSubjectId | "";
  subjectLabel: string;
  topicId: string;
  topicLabel: string;
  subTopicId: string;
  subTopicLabel: string;
  difficulty: number;
  targetExams: string[];
  tags: string;
};

type FilingTaxonomyTopic = {
  id: string;
  label: string;
  subTopics: Array<{
    id: string;
    label: string;
  }>;
};

type FilingTaxonomySubject = {
  id: FilingSubjectId;
  label: string;
  topics: FilingTaxonomyTopic[];
};

type MasterTopicOption = {
  id: string;
  name: string;
};

type MasterSectionOption = {
  id: string;
  name: string;
};

type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

type DifficultySettings = {
  examProfile: ExamProfileId;
  setProfile: DISetProfile;
  enableTargetDifficulty: boolean;
  targetDifficulty: number;
  difficultyTolerance: number;
  enableDistribution: boolean;
  difficultyDistribution: DifficultyDistribution;
  enableTargetAverageDifficulty: boolean;
  targetAverageDifficulty: number;
};

type QAReviewAction =
  | "approve"
  | "reject"
  | "weak-clues"
  | "too-easy"
  | "too-hard"
  | "repetitive"
  | "unnatural-wording"
  | "contradictory"
  | "duplicate-structure";

type QAIssueTag =
  | "repetitive"
  | "too-direct"
  | "ambiguous"
  | "unrealistic"
  | "weak-explanation";

type QAReviewStatus =
  | "approved"
  | "rejected"
  | "flagged";

type QAReviewRecord = {
  fingerprint: string;
  status: QAReviewStatus;
  action: QAReviewAction;
  topic?: string;
  generationDomain?: string;
  motif?: string;
  archetype?: string;
  arrangementType?: string;
  reviewerNotes?: string;
  validationStatus?: string;
  issueTags?: QAIssueTag[];
  seed?: string;
  topologyType?: string;
  inferenceDepth?: number;
  clueCount?: number;
  redundancyScore?: number;
  realismScore?: number;
  structuralDiversityScore?: number;
  difficultyConfidence?: number;
  generationLatencyMs?: number;
  uniquenessStatus?: string;
  bookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
};

type QAAnalyticsBucket = {
  date: string;
  approvalRate: number;
  realismScore: number;
  structuralDiversityScore: number;
  difficultyConfidence: number;
  generationLatencyMs: number;
  count: number;
};

type QAAnalyticsSummary = {
  totalReviews: number;
  approvalRate: number;
  averageRealismScore: number;
  averageStructuralDiversity: number;
  averageDifficultyConfidence: number;
  averageGenerationLatencyMs: number;
  rejectionReasons: Record<
    string,
    number
  >;
  byDomain: Record<
    string,
    {
      totalReviews: number;
      approvalRate: number;
      averageRealismScore: number;
      averageStructuralDiversity: number;
      averageDifficultyConfidence: number;
      averageGenerationLatencyMs: number;
    }
  >;
  trends: QAAnalyticsBucket[];
};

type QAFilterState = {
  topic: string;
  difficulty: string;
  arrangementType: string;
  generationDomain: string;
  motif: string;
  archetype: string;
  validationStatus: string;
  reviewStatus: string;
  reviewAction: string;
  bankStatus: string;
  onlyRepeated: boolean;
  sortBy:
    | "newest"
    | "difficulty-desc"
    | "difficulty-asc"
    | "topic"
    | "review-status";
};

type VennVisualPayload = {
  type: "venn";
  sets?: Array<{ id?: string; label?: string; value?: number }>;
  intersection?: number;
  universe?: number;
  outside?: number;
  unit?: string;
  regions?: {
    onlyA?: number;
    onlyB?: number;
    both?: number;
    neither?: number;
  };
  labels?: {
    en?: {
      onlyA?: string;
      onlyB?: string;
      both?: string;
      neither?: string;
      universe?: string;
    };
  };
  svg?: string;
};

type CorpusAuditPreset = {
  id: string;
  label: string;
  description: string;
  defaultCount: number;
  topicId?: string;
  generationDomain?: string;
  defaultTopology?: string;
  topologyOptions?: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  schedulerProfiles?: string[];
};

type CorpusAuditExportProfile = {
  id: string;
  label: string;
  description: string;
  includeMultilingualExplanations: boolean;
  estimatedSizeMb?: number;
};

type CorpusAuditJob = {
  id: string;
  status:
    | "queued"
    | "running"
    | "completed"
    | "failed";
  requestedCount: number;
  generatedCount: number;
  progress: number;
  presetId?: string;
  exportProfile?: string;
  outputDir?: string;
  files?: {
    json: string;
    txt: string;
    summary: string;
    preview: string;
    pdf?: string;
  };
  errorMessage?: string;
  queuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  summary?: CorpusAuditSummary;
};

type SchedulerProfileId =
  | "balanced_mock"
  | "ssc_mock"
  | "banking_mock"
  | "railway_mock"
  | "punjab_state_mock"
  | "pyq_balanced"
  | "pyq_hard"
  | "pyq_plus"
  | "ssc_mock_pyq"
  | "profit_loss_balanced"
  | "profit_loss_discount"
  | "profit_loss_hard"
  | "profit_loss_pyq_plus"
  | "interest_balanced"
  | "interest_pyq"
  | "interest_hard"
  | "interest_pyq_plus"
  | "ratio_basic"
  | "ratio_balanced"
  | "ratio_hard"
  | "ratio_pyq_plus"
  | "ratio_review_100"
  | "ratio_production_60"
  | "time_work_basic"
  | "time_work_balanced"
  | "time_work_hard"
  | "time_work_pyq_plus"
  | "time_work_review_100"
  | "time_work_production_60"
  | "tsd_basic"
  | "tsd_balanced"
  | "tsd_hard"
  | "tsd_pyq_plus"
  | "tsd_review_100"
  | "tsd_review_200"
  | "tsd_production_60"
  | "mix_basic"
  | "mix_balanced"
  | "mix_hard"
  | "mix_pyq_plus"
  | "mix_review_100"
  | "mix_review_200"
  | "mix_production_60"
  | "number_system_basic"
  | "number_system_balanced"
  | "number_system_hard"
  | "number_system_pyq_plus"
  | "number_system_review_100"
  | "number_system_review_200"
  | "number_system_production_300"
  | "number_system_audit_1000"
  | "number_system_production_1000"
  | "number_system_review_1000"
  | "number_system_pyq_plus_1000"
  | "number_system_elite_500"
  | "advanced_coverage_audit";

type CorpusAuditTopicId =
  | "percentage"
  | "profit_loss"
  | "interest"
  | "ratio_proportion"
  | "time_work"
  | "time_speed_distance"
  | "mixture_alligation"
  | "number_system";

type SchedulerSummary = {
  profileId: SchedulerProfileId;
  targetCount: number;
  acceptedCount: number;
  topologyDistribution?: Record<string, number>;
  topologyGroupDistribution?: Record<string, number>;
  examinerIntentDistribution?: Record<string, number>;
  semanticAnchorDistribution?: Record<string, number>;
  distractorTrapDistribution?: Record<string, number>;
  difficultyDistribution?: Record<string, number>;
  duplicateRisk?: {
    repeatedFingerprintCount: number;
    repeatedFingerprintShare: number;
    uniqueFingerprintCount: number;
  };
  pacingReport?: {
    hardStreakLimit: number;
    events: string[];
  };
  rejectionReasons?: Record<string, number>;
  balanceWarnings?: string[];
};

type CorpusQualitySummary = {
  score: number;
  tier: string;
  dimensions?: Record<string, number>;
  strengths?: string[];
  risks?: string[];
};

type CorpusAuditSummary = {
  scheduler?: SchedulerSummary;
  corpusQuality?: CorpusQualitySummary;
};

type CorpusAuditSample = {
  index: number;
  question: string;
  answer: string;
  difficulty: string;
  realismScore?: number;
  multilingual?: {
    hi?: {
      question: string;
    };
    pa?: {
      question: string;
    };
  };
};

type ReviewableGeneratedItem = {
  question: GeneratedQuestion;
  index: number;
  fingerprint: string;
  topic: string;
  difficulty: string;
  arrangementType: string;
  generationDomain: string;
  motif: string;
  archetype: string;
  validationStatus: string;
  repetitionFlags: string[];
  topologyType: string;
  inferenceDepth: number | null;
  clueCount: number | null;
  redundancyScore: number | null;
  uniquenessStatus: string;
  generationSeed: string;
  realismScore: number | null;
  difficultyConfidence: number | null;
  validationDiagnostics: string[];
  structuralWarnings: string[];
  review?: QAReviewRecord;
};

type QuestionLifecycleState =
  | "generated"
  | "reviewing"
  | "approved"
  | "rejected"
  | "pushed_to_bank"
  | "archived"
  | "published";

type EditorialSourceType =
  | "generated"
  | "pyq"
  | "ingested"
  | "extracted";

type EditorialBadgeTone =
  | "success"
  | "warning"
  | "error"
  | "neutral";

type EditorialBadge = {
  label: string;
  tone: EditorialBadgeTone;
};

const PIE_COLORS = [
  "#1f2937",
  "#4b5563",
  "#6b7280",
  "#9ca3af",
  "#374151",
  "#111827",
];

const AXIS_TICK = {
  fill: "#111827",
  fontSize: 11,
};

const COMPACT_CHART_MARGIN = {
  top: 8,
  right: 12,
  left: 0,
  bottom: 8,
};

const DIFFICULTY_BADGE_STYLES: Record<
  DifficultyLabel,
  string
> = {
  Easy:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium:
    "bg-amber-50 text-amber-700 border-amber-200",
  Hard:
    "bg-rose-50 text-rose-700 border-rose-200",
};

const LINE_SERIES_STROKES = [
  "#1d4ed8",
  "#b91c1c",
  "#047857",
  "#7c3aed",
  "#c2410c",
  "#0f766e",
];

const EXAM_PROFILE_OPTIONS: Array<{
  id: ExamProfileId;
  label: string;
  description: string;
}> = [
  {
    id: "custom",
    label: "Custom",
    description:
      "Manual admin tuning for calibration work.",
  },
  {
    id: "ssc",
    label: "SSC",
    description:
      "Placeholder for SSC-style distribution presets.",
  },
  {
    id: "ibps",
    label: "IBPS",
    description:
      "Placeholder for IBPS-style DI calibration.",
  },
  {
    id: "cat",
    label: "CAT",
    description:
      "Placeholder for CAT-style tougher reasoning curves.",
  },
  {
    id: "sbi",
    label: "SBI",
    description:
      "Placeholder for SBI PO style slot presets.",
  },
  {
    id: "rrb",
    label: "RRB",
    description:
      "Placeholder for RRB exam difficulty balancing.",
  },
];

const QA_ACTION_OPTIONS: Array<{
  action: QAReviewAction;
  status: QAReviewStatus;
  label: string;
}> = [
  {
    action: "approve",
    status: "approved",
    label: "Approve",
  },
  {
    action: "reject",
    status: "rejected",
    label: "Reject",
  },
  {
    action: "weak-clues",
    status: "flagged",
    label: "Weak Clues",
  },
  {
    action: "too-easy",
    status: "flagged",
    label: "Too Easy",
  },
  {
    action: "too-hard",
    status: "flagged",
    label: "Too Hard",
  },
  {
    action: "repetitive",
    status: "flagged",
    label: "Repetitive",
  },
  {
    action: "unnatural-wording",
    status: "flagged",
    label: "Unnatural Wording",
  },
  {
    action: "contradictory",
    status: "rejected",
    label: "Contradictory",
  },
  {
    action: "duplicate-structure",
    status: "flagged",
    label: "Duplicate Structure",
  },
];

const QA_ISSUE_TAG_OPTIONS: Array<{
  tag: QAIssueTag;
  label: string;
}> = [
  {
    tag: "repetitive",
    label: "Repetitive",
  },
  {
    tag: "too-direct",
    label: "Too Direct",
  },
  {
    tag: "ambiguous",
    label: "Ambiguous",
  },
  {
    tag: "unrealistic",
    label: "Unrealistic",
  },
  {
    tag: "weak-explanation",
    label: "Weak Explanation",
  },
];

const QA_FILTER_DEFAULTS: QAFilterState = {
  topic: "all",
  difficulty: "all",
  arrangementType: "all",
  generationDomain: "all",
  motif: "all",
  archetype: "all",
  validationStatus: "all",
  reviewStatus: "all",
  reviewAction: "all",
  bankStatus: "all",
  onlyRepeated: false,
  sortBy: "newest",
};

const MARKER_TYPES = [
  "circle",
  "square",
  "diamond",
  "triangle",
] as const;

type MarkerType =
  (typeof MARKER_TYPES)[number];

type CustomDotProps = {
  cx?: number;
  cy?: number;
  fill?: string;
  markerType: MarkerType;
  r?: number;
  stroke?: string;
  strokeWidth?: number;
};

function getNumericColumns(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).filter(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getHashSeed(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      (hash * 31 +
        value.charCodeAt(i)) >>>
      0;
  }

  return hash;
}

function getRandomMarkerType(
  availableMarkerTypes: MarkerType[],
  seed: number,
) {
  const index =
    seed % availableMarkerTypes.length;

  return availableMarkerTypes[index];
}

function getLineMarkerTypes(
  diSet: DISet,
  numericColumns: string[],
) {
  const seed = getHashSeed(
    JSON.stringify({
      title: diSet.title,
      visualType: diSet.visualType,
      diData: diSet.diData,
      numericColumns,
    }),
  );

  const availableMarkerTypes = [
    ...MARKER_TYPES,
  ];
  const markerTypes: Record<
    string,
    MarkerType
  > = {};

  numericColumns.forEach(
    (numericColumn, index) => {
      if (
        availableMarkerTypes.length === 0
      ) {
        availableMarkerTypes.push(
          ...MARKER_TYPES,
        );
      }

      const markerType =
        getRandomMarkerType(
          availableMarkerTypes,
          seed + index * 17,
        );

      markerTypes[numericColumn] =
        markerType;

      const markerIndex =
        availableMarkerTypes.indexOf(
          markerType,
        );

      availableMarkerTypes.splice(
        markerIndex,
        1,
      );
    },
  );

  return markerTypes;
}

function CustomDot({
  cx,
  cy,
  fill = "#ffffff",
  markerType,
  r = 5.5,
  stroke = "#111827",
  strokeWidth = 1.5,
}: CustomDotProps) {
  if (
    typeof cx !== "number" ||
    typeof cy !== "number"
  ) {
    return null;
  }

  const markerSize = r * 2;
  const triangleHalfWidth =
    r * 1.05;
  const triangleHeight =
    r * 1.2;

  switch (markerType) {
    case "square":
      return (
        <rect
          x={cx - markerSize / 2}
          y={cy - markerSize / 2}
          width={markerSize}
          height={markerSize}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "diamond":
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "triangle":
      return (
        <polygon
          points={`${cx},${cy - triangleHeight} ${cx + triangleHalfWidth},${cy + triangleHeight * 0.85} ${cx - triangleHalfWidth},${cy + triangleHeight * 0.85}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "circle":
    default:
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
  }
}

function renderExamTooltip() {
  return (
    <Tooltip
      cursor={false}
      isAnimationActive={false}
      contentStyle={{
        backgroundColor: "#ffffff",
        border: "1px solid #9ca3af",
        borderRadius: 0,
        color: "#111827",
        fontSize: 12,
        padding: "6px 8px",
      }}
      itemStyle={{
        color: "#111827",
      }}
      labelStyle={{
        color: "#111827",
        fontWeight: 600,
      }}
    />
  );
}

function getNumericColumn(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getSeriesColumns(
  diSet: DISet,
  visualType: DISeriesType,
) {
  if (diSet.series?.length) {
    return diSet.series
      .filter(
        (series) =>
          series.type === visualType,
      )
      .map((series) => series.column);
  }

  return getNumericColumns(diSet.diData);
}

function getCategoryColumn(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "string",
  );
}

function isDISet(
  question: GeneratedQuestion,
): question is DISet {
  return (
    "questionType" in question &&
    question.questionType === "di"
  );
}

function vennVisualFromQuestion(
  question: GeneratedQuestion,
): VennVisualPayload | undefined {
  if (isDISet(question)) return undefined;
  const debugQuantV2 = (question.debugMetadata as any)?.quantV2;
  const semantic = question.semanticMetadata as any;
  const visual =
    (question.visual as VennVisualPayload | undefined) ??
    (debugQuantV2?.visual as VennVisualPayload | undefined) ??
    (debugQuantV2?.semanticMetadata?.visual as VennVisualPayload | undefined) ??
    (semantic?.visual as VennVisualPayload | undefined);

  return visual?.type === "venn" ? visual : undefined;
}

function renderFallbackVennSvg(visual: VennVisualPayload) {
  const unit = visual.unit ?? "%";
  const regions = visual.regions ?? {};
  const labels = visual.labels?.en ?? {};
  const sets = visual.sets ?? [];
  const fmt = (value: number | undefined) =>
    typeof value === "number" && Number.isFinite(value)
      ? `${Number.isInteger(value) ? value : value.toFixed(2)}${unit}`
      : "";
  const escapeXml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 260" role="img" aria-label="Venn diagram">',
    '<rect x="12" y="18" width="436" height="218" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>',
    '<circle cx="185" cy="130" r="82" fill="#60a5fa" fill-opacity="0.28" stroke="#2563eb" stroke-width="2"/>',
    '<circle cx="275" cy="130" r="82" fill="#34d399" fill-opacity="0.28" stroke="#059669" stroke-width="2"/>',
    `<text x="142" y="48" fill="#1e3a8a" font-size="15" font-weight="700">${escapeXml(sets[0]?.label ?? "A")} (${fmt(sets[0]?.value)})</text>`,
    `<text x="258" y="48" fill="#065f46" font-size="15" font-weight="700">${escapeXml(sets[1]?.label ?? "B")} (${fmt(sets[1]?.value)})</text>`,
    `<text x="144" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${escapeXml(labels.onlyA ?? "only A")}</text>`,
    `<text x="144" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(regions.onlyA)}</text>`,
    `<text x="230" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${escapeXml(labels.both ?? "both")}</text>`,
    `<text x="230" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(regions.both)}</text>`,
    `<text x="316" y="126" text-anchor="middle" fill="#0f172a" font-size="13">${escapeXml(labels.onlyB ?? "only B")}</text>`,
    `<text x="316" y="145" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="700">${fmt(regions.onlyB)}</text>`,
    `<text x="230" y="216" text-anchor="middle" fill="#475569" font-size="13">${escapeXml(labels.neither ?? "neither")} = ${fmt(regions.neither)}</text>`,
    `<text x="230" y="238" text-anchor="middle" fill="#475569" font-size="12">${escapeXml(labels.universe ?? "universe")} = ${fmt(visual.universe)}</text>`,
    "</svg>",
  ].join("");
}

function VennVisualPreview({
  visual,
}: {
  visual: VennVisualPayload;
}) {
  const svg = visual.svg ?? renderFallbackVennSvg(visual);

  return (
    <div className="rounded border bg-white p-3 text-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Venn Diagram
      </div>
      <div
        className="overflow-auto rounded bg-slate-50 p-2"
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </div>
  );
}

function clampNumber(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function getDifficultyLabel(
  question: {
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyMetadata?: DifficultyMetadata;
  },
) {
  return (
    question.difficultyLabel ??
    question.difficultyMetadata
      ?.difficultyLabel ??
    question.difficulty
  );
}

function getDifficultyScore(
  question: {
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
  },
) {
  return (
    question.difficultyScore ??
    question.difficultyMetadata
      ?.difficultyScore
  );
}

function buildLocalFingerprint(
  source: {
    text?: string;
    options?: string[];
    topic?: string;
    motif?: string;
    archetype?: string;
  },
) {
  const serialized =
    JSON.stringify({
      text: source.text ?? "",
      options: source.options ?? [],
      topic: source.topic ?? "",
      motif: source.motif ?? "",
      archetype:
        source.archetype ?? "",
    });
  let hash = 0;

  for (
    let index = 0;
    index < serialized.length;
    index += 1
  ) {
    hash =
      (hash * 31 +
        serialized.charCodeAt(index)) >>>
      0;
  }

  return `qa_${hash.toString(16)}`;
}

function getPrimaryQuestion(
  question: GeneratedQuestion,
) {
  return isDISet(question)
    ? question.questions[0]
    : question;
}

function getQuestionTopic(
  question: GeneratedQuestion,
) {
  if (!isDISet(question)) {
    return question.topic ?? "General";
  }

  return (
    getPrimaryQuestion(question)?.text
      ? "Data Interpretation"
      : question.title || "Data Interpretation"
  );
}

function getQuestionDomain(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) {
    return (
      getPrimaryQuestion(question)
        ?.debugMetadata
        ?.generationDomain ?? "di"
    );
  }

  return (
    question.debugMetadata
      ?.generationDomain ?? "quant"
  );
}

function getQuestionArrangementType(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.arrangementType ?? "n/a"
  );
}

function getQuestionTopologyType(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const arrangementType =
    primaryQuestion?.debugMetadata
      ?.arrangementType;
  const generationDomain =
    primaryQuestion?.debugMetadata
      ?.generationDomain;

  return (
    arrangementType ??
    generationDomain ??
    "unknown"
  );
}

function getQuestionInferenceDepth(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion?.debugMetadata
      ?.inferenceDepth ??
    primaryQuestion?.debugMetadata
      ?.generationMetrics
      ?.inferenceDepth ??
    null
  );
}

function getQuestionClueCount(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion?.debugMetadata
      ?.clueCount ?? null
  );
}

function getQuestionRedundancyScore(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion?.debugMetadata
      ?.redundancyScore ??
    primaryQuestion?.debugMetadata
      ?.generationMetrics
      ?.redundancyScore ??
    null
  );
}

function getQuestionGenerationSeed(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata?.seed ??
    "unseeded"
  );
}

function getQuestionUniquenessStatus(
  question: GeneratedQuestion,
) {
  const uniquenessVerified =
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.uniquenessVerified;

  if (uniquenessVerified === true) {
    return "verified";
  }

  if (uniquenessVerified === false) {
    return "failed";
  }

  return "unknown";
}

function getQuestionRealismScore(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion
      ?.examRealismMetadata
      ?.realismScore ??
    primaryQuestion?.debugMetadata
      ?.generationMetrics
      ?.realismScore ??
    primaryQuestion?.debugMetadata
      ?.qualityAssessment
      ?.qualityMetrics
      ?.realismScore ??
    null
  );
}

function getQuestionDifficultyConfidence(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.qualityAssessment
      ?.qualityMetrics
      ?.difficultyConfidence ??
    null
  );
}

function getQuestionStructuralDiversityScore(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.structuralDiversityScore ??
    null
  );
}

function getQuestionGenerationLatency(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.generationMetrics
      ?.generationDurationMs ??
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.generationMetrics
      ?.generationDurationMs ??
    null
  );
}

function getQuestionSolverTrace(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const traceExport =
    primaryQuestion?.debugMetadata
      ?.solverTraceExport?.text;

  if (
    Array.isArray(traceExport) &&
    traceExport.length
  ) {
    return traceExport;
  }

  return (
    primaryQuestion?.debugMetadata
      ?.solverTrace ?? []
  );
}

function getQuestionMotif(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.selectedMotif ?? "none"
  );
}

function getQuestionArchetype(
  question: GeneratedQuestion,
) {
  return (
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.selectedArchetype ?? "none"
  );
}

function getQuestionDifficultyValue(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) {
    return question.averageDifficulty;
  }

  return getDifficultyScore(question);
}

function getQuestionDifficultyLabel(
  question: GeneratedQuestion,
) {
  if (!isDISet(question)) {
    return (
      getDifficultyLabel(question) ??
      "NA"
    );
  }

  const score =
    question.averageDifficulty;

  if (typeof score !== "number") {
    return "NA";
  }

  if (score <= 2.5) {
    return "Easy";
  }

  if (score <= 5.5) {
    return "Medium";
  }

  return "Hard";
}

function getQuestionFingerprint(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) {
    const firstQuestion =
      getPrimaryQuestion(question);

    return buildLocalFingerprint({
      text: `${question.title ?? "DI Set"} ${question.questions.map((item) => item.text).join(" | ")}`,
      options:
        firstQuestion?.options ?? [],
      topic: "Data Interpretation",
      motif:
        firstQuestion?.debugMetadata
          ?.selectedMotif,
      archetype:
        firstQuestion?.debugMetadata
          ?.selectedArchetype,
    });
  }

  return buildLocalFingerprint({
    text: question.text,
    options: question.options,
    topic: question.topic,
    motif:
      question.debugMetadata
        ?.selectedMotif,
    archetype:
      question.debugMetadata
        ?.selectedArchetype,
  });
}

function getExtractionCandidateId(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) {
    return null;
  }

  const logic =
    question.proceduralLogic as
      | { candidateId?: string }
      | undefined;
  const knowledgeLogic =
    question.debugMetadata
      ?.knowledgeLogic as
      | { candidateId?: string }
      | undefined;

  return (
    logic?.candidateId ??
    knowledgeLogic?.candidateId ??
    null
  );
}

function isKnowledgeExtractionQuestion(
  question: GeneratedQuestion,
) {
  return Boolean(
    getExtractionCandidateId(question),
  );
}

function getQuestionValidationStatus(
  question: GeneratedQuestion,
  isDuplicate = false,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const debugMetadata =
    primaryQuestion?.debugMetadata;
  const warnings = [
    ...(debugMetadata
      ?.validationWarnings ?? []),
    ...(debugMetadata
      ?.compatibilityWarnings ?? []),
  ];

  if (
    debugMetadata?.uniquenessVerified ===
    false
  ) {
    return "uniqueness-failed";
  }

  if (isDuplicate) {
    return "duplicate-text";
  }

  if (warnings.length) {
    return "warning";
  }

  return "passed";
}

function getQuestionValidationDiagnostics(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const report =
    primaryQuestion?.debugMetadata
      ?.validationReportDetail;
  const diagnostics = [
    ...(report?.warnings ?? []),
    ...(
      report?.stageResults.flatMap(
        (stage) =>
          stage.diagnostics.map(
            (diagnostic) =>
              `${stage.stage}: ${diagnostic}`,
          ),
      ) ?? []
    ),
    ...(primaryQuestion?.debugMetadata
      ?.validationWarnings ?? []),
    ...(primaryQuestion?.debugMetadata
      ?.compatibilityWarnings ?? []),
  ];

  return [
    ...new Set(diagnostics),
  ];
}

function normalizeSignatureText(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\b[a-z]\b/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function getQuestionStructureSignature(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const clues =
    primaryQuestion?.debugMetadata
      ?.generatedClues ?? [];
  const reasoning =
    primaryQuestion?.difficultyMetadata
      ?.reasoningSteps ?? [];
  const distractors = (
    primaryQuestion?.optionMetadata ?? []
  )
    .filter((option) => !option.isCorrect)
    .map(
      (option) =>
        option.distractorType ??
        "none",
    );

  return normalizeSignatureText(
    [
      getQuestionDomain(question),
      getQuestionArrangementType(
        question,
      ),
      clues
        .map(normalizeSignatureText)
        .join("|"),
      reasoning
        .map(normalizeSignatureText)
        .join("|"),
      distractors.join("|"),
    ].join("||"),
  );
}

function getQuestionArrangementSignature(
  question: GeneratedQuestion,
) {
  return normalizeSignatureText(
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.finalArrangement ?? "",
  );
}

function getQuestionReasoningSignature(
  question: GeneratedQuestion,
) {
  return normalizeSignatureText(
    (
      getPrimaryQuestion(question)
        ?.difficultyMetadata
        ?.reasoningSteps ?? []
    ).join(" | "),
  );
}

function getQuestionRepetitionFlags(
  question: GeneratedQuestion,
  structureCount: number,
  arrangementCount: number,
  reasoningCount: number,
) {
  const flags: string[] = [];
  const repeatedStructureWarnings =
    getPrimaryQuestion(question)
      ?.debugMetadata
      ?.repeatedStructureWarnings ?? [];

  if (structureCount > 1) {
    flags.push(
      "Repeated clue structure",
    );
  }

  if (
    arrangementCount > 1 &&
    getQuestionArrangementSignature(
      question,
    )
  ) {
    flags.push(
      "Repeated arrangement",
    );
  }

  if (
    reasoningCount > 1 &&
    getQuestionReasoningSignature(
      question,
    )
  ) {
    flags.push(
      "Repeated reasoning chain",
    );
  }

  flags.push(
    ...repeatedStructureWarnings,
  );

  return flags;
}

function getQuestionStructuralWarnings(
  question: GeneratedQuestion,
  repetitionFlags: string[],
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const qualityAssessment =
    primaryQuestion?.debugMetadata
      ?.qualityAssessment;
  const qualityWarnings =
    qualityAssessment?.rejectionReasons.map(
      (reason) =>
        reason
          .replace(/-/g, " ")
          .replace(
            /\b\w/g,
            (char) =>
              char.toUpperCase(),
          ),
    ) ?? [];

  return [
    ...new Set([
      ...repetitionFlags,
      ...qualityWarnings,
    ]),
  ];
}

function formatMetricValue(
  value: number | null | undefined,
  digits = 1,
) {
  return typeof value === "number"
    ? value.toFixed(digits)
    : "NA";
}

function formatDifficultyScore(
  score?: number,
) {
  return typeof score === "number"
    ? score.toFixed(1)
    : "NA";
}

function normalizeDifficultyDistribution(
  distribution: DifficultyDistribution,
) {
  const total =
    distribution.easy +
    distribution.medium +
    distribution.hard;

  if (total <= 0) {
    return distribution;
  }

  return {
    easy: Math.round(
      (distribution.easy / total) * 100,
    ),
    medium: Math.round(
      (distribution.medium / total) * 100,
    ),
    hard: Math.round(
      (distribution.hard / total) * 100,
    ),
  };
}

function getDistributionTotal(
  distribution: DifficultyDistribution,
) {
  return (
    distribution.easy +
    distribution.medium +
    distribution.hard
  );
}

async function fetchJsonWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 45000,
) {
  const controller =
    new AbortController();
  const timeout = window.setTimeout(
    () =>
      controller.abort(
        new DOMException(
          `Request timed out after ${Math.round(
            timeoutMs / 1000,
          )} seconds.`,
          "AbortError",
        ),
      ),
    timeoutMs,
  );

  try {
    const response = await fetch(
      input,
      {
        ...init,
        signal: controller.signal,
      },
    );

    return response;
  } finally {
    window.clearTimeout(timeout);
  }
}

function getGenerationTimeoutMs(
  patternId: string,
  patterns: Array<
    Record<string, unknown>
  >,
  count: number,
) {
  const selectedPattern =
    patterns.find(
      (pattern) =>
        pattern.id === patternId,
    );
  const generationDomain =
    typeof selectedPattern?.[
      "generationDomain"
    ] === "string"
      ? selectedPattern[
          "generationDomain"
        ]
      : "";
  const arrangementType =
    typeof selectedPattern?.[
      "arrangementType"
    ] === "string"
      ? selectedPattern[
          "arrangementType"
        ]
      : "";
  const topicText = `${selectedPattern?.["topic"] ?? ""} ${selectedPattern?.["subtopic"] ?? ""}`.toLowerCase();
  const isSeatingHeavy =
    generationDomain ===
      "seating-arrangement" ||
    patternId.startsWith("seating-") ||
    topicText.includes("seating") ||
    arrangementType ===
      "double-row" ||
    arrangementType ===
      "parallel-row" ||
    topicText.includes("mixed");

  if (isSeatingHeavy) {
    return Math.max(
      180000,
      count * 30000,
    );
  }

  return 45000;
}

function getDifficultyCounts(
  questions: Array<{
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
  }>,
) {
  const counts: Record<
    DifficultyLabel,
    number
  > = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  questions.forEach((question) => {
    const label =
      getDifficultyLabel(question);

    if (label) {
      counts[label] += 1;
    }
  });

  return counts;
}

function getProfileDescription(
  profile: ExamProfileId,
) {
  return (
    EXAM_PROFILE_OPTIONS.find(
      (option) =>
        option.id === profile,
    )?.description ??
    "Manual admin calibration."
  );
}

function getDifficultyRequestPayload(
  settings: DifficultySettings,
) {
  const payload: Record<
    string,
    | number
    | ExamProfileId
    | DifficultyDistribution
    | DISetProfile
  > = {};

  payload.examProfile =
    settings.examProfile;
  payload.setProfile =
    settings.setProfile;

  if (settings.enableTargetDifficulty) {
    payload.targetDifficulty =
      settings.targetDifficulty;
    payload.difficultyTolerance =
      settings.difficultyTolerance;
  }

  if (settings.enableDistribution) {
    payload.difficultyDistribution =
      normalizeDifficultyDistribution(
        settings.difficultyDistribution,
      );
  }

  if (
    settings.enableTargetAverageDifficulty
  ) {
    payload.targetAverageDifficulty =
      settings.targetAverageDifficulty;
  }

  return payload;
}

function renderDifficultyBarSummary(
  counts: Record<
    DifficultyLabel,
    number
  >,
) {
  const total =
    counts.Easy +
    counts.Medium +
    counts.Hard;

  if (!total) {
    return null;
  }

  return (
    <div className="space-y-2">
      {(
        [
          "Easy",
          "Medium",
          "Hard",
        ] as const
      ).map((label) => {
        const count =
          counts[label];
        const width =
          (count / total) * 100;

        return (
          <div
            key={label}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{label}</span>
              <span>{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${label === "Easy"
                  ? "bg-emerald-500"
                  : label === "Medium"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                  }`}
                style={{
                  width: `${width}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderDifficultyAnalytics(
  question: {
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
    optionMetadata?: OptionMetadata[];
    examRealismMetadata?: ExamRealismMetadata;
    debugMetadata?: GenerationDebugMetadata;
  },
) {
  const metadata =
    question.difficultyMetadata;
  const realismMetadata =
    question.examRealismMetadata;
  const debugMetadata =
    question.debugMetadata;
  const distractorMetadata = (
    question.optionMetadata ?? []
  ).filter(
    (option) =>
      !option.isCorrect &&
      (option.distractorType ||
        option.likelyMistake ||
        option.reasoningTrap),
  );
  const label =
    getDifficultyLabel(question);
  const score =
    getDifficultyScore(question);

  if (
    !metadata &&
    !label &&
    score === undefined &&
    !debugMetadata
  ) {
    return null;
  }

  return (
    <details className="rounded border bg-slate-50 p-3">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-900">
            Difficulty Analytics
          </span>
          {label && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-1 font-semibold ${DIFFICULTY_BADGE_STYLES[label]}`}
            >
              {formatDifficultyScore(score)}{" "}
              {label}
            </span>
          )}
          {metadata && (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
              {metadata.estimatedSolveTime} sec
            </span>
          )}
        </div>
      </summary>

      <div className="mt-3 space-y-3">
        <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Difficulty Score
            </div>
            <div className="font-semibold">
              {formatDifficultyScore(score)}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Estimated Solve Time
            </div>
            <div className="font-semibold">
              {metadata?.estimatedSolveTime ??
                "NA"}{" "}
              sec
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Operations
            </div>
            <div className="font-semibold">
              {metadata?.operationCount ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Reasoning Depth
            </div>
            <div className="font-semibold">
              {metadata?.reasoningDepth ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Visual Complexity
            </div>
            <div className="font-semibold">
              {metadata?.visualComplexity ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Inference Complexity
            </div>
            <div className="font-semibold">
              {metadata?.inferenceComplexity ??
                "NA"}
            </div>
          </div>
        </div>

        {metadata && (
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Percentage:{" "}
              {metadata.usesPercentage
                ? "Yes"
                : "No"}
            </span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Ratio:{" "}
              {metadata.usesRatio
                ? "Yes"
                : "No"}
            </span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Comparison:{" "}
              {metadata.usesComparison
                ? "Yes"
                : "No"}
            </span>
            {typeof metadata.dependencyComplexity ===
              "number" && (
              <span className="rounded border border-slate-200 bg-white px-2 py-1">
                Dependency Complexity:{" "}
                {metadata.dependencyComplexity}
              </span>
            )}
            {metadata.operationChain
              ?.length ? (
              <span className="rounded border border-slate-200 bg-white px-2 py-1">
                Operations:{" "}
                {metadata.operationChain.join(
                  " -> ",
                )}
              </span>
            ) : null}
          </div>
        )}

        {metadata?.reasoningSteps
          ?.length ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Reasoning Chain
            </div>
            <div className="space-y-1">
              {metadata.reasoningSteps.map(
                (step, index) => (
                  <div key={index}>
                    {index + 1}.{" "}
                    {step}
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}

        {realismMetadata ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Exam Realism
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                Profile:{" "}
                {realismMetadata.examProfile.toUpperCase()}
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                Wording:{" "}
                {realismMetadata.wordingStyle}
              </span>
              {realismMetadata.archetypeCategory ? (
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                  Archetype:{" "}
                  {realismMetadata.archetypeCategory}
                </span>
              ) : null}
            </div>
            {realismMetadata.weightingSummary
              ?.length ? (
              <div className="mt-2 space-y-1">
                {realismMetadata.weightingSummary.map(
                  (item, index) => (
                    <div key={index}>
                      {index + 1}. {item}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {realismMetadata.reasoningTraps
              ?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {realismMetadata.reasoningTraps.map(
                  (trap, index) => (
                    <span
                      key={index}
                      className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700"
                    >
                      {trap}
                    </span>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {distractorMetadata.length ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Logic Trap Intelligence
            </div>
            <div className="space-y-2">
              {distractorMetadata.map(
                (option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    className="rounded border border-slate-100 bg-slate-50 p-2"
                  >
                    <div className="font-medium text-slate-800">
                      Option {option.value}
                    </div>
                    <div>
                      Type:{" "}
                      {option.distractorType ??
                        "NA"}
                    </div>
                    <div>
                      Likely Mistake:{" "}
                      {option.likelyMistake ??
                        "NA"}
                    </div>
                    <div>
                      Trap:{" "}
                      {option.reasoningTrap ??
                        "NA"}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}

        {debugMetadata ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-semibold text-slate-800">
              Generation Debug
            </div>
            <div>
              Pattern:{" "}
              {debugMetadata.selectedPattern}
            </div>
            {debugMetadata.generationDomain ? (
              <div>
                Domain:{" "}
                {debugMetadata.generationDomain}
              </div>
            ) : null}
            {debugMetadata.debugSource ||
            debugMetadata.generationBackend ? (
              <div>
                Backend:{" "}
                {debugMetadata.debugSource ??
                  debugMetadata.generationBackend}
              </div>
            ) : null}
            <div>
              Logic Pattern:{" "}
              {debugMetadata.selectedMotif ??
                "none"}
            </div>
            <div>
              Archetype:{" "}
              {debugMetadata.selectedArchetype ??
                "none"}
            </div>
            {debugMetadata.canonicalProblemId ? (
              <div>
                CP ID:{" "}
                {debugMetadata.canonicalProblemId}
              </div>
            ) : null}
            {debugMetadata.questionLanguageId ? (
              <div>
                QL ID:{" "}
                {debugMetadata.questionLanguageId}
              </div>
            ) : null}
            {debugMetadata.explanationId ? (
              <div>
                ES ID:{" "}
                {debugMetadata.explanationId}
              </div>
            ) : null}
            {debugMetadata.taskKind ? (
              <div>
                Task Kind:{" "}
                {debugMetadata.taskKind}
              </div>
            ) : null}
            {debugMetadata.scenarioId ? (
              <div>
                Scenario:{" "}
                {debugMetadata.scenarioId}
              </div>
            ) : null}
            {debugMetadata.questionIndex &&
            debugMetadata.questionCount ? (
              <div>
                Question Index:{" "}
                {debugMetadata.questionIndex} of{" "}
                {debugMetadata.questionCount}
              </div>
            ) : null}
            {debugMetadata.packageSource ? (
              <div>
                Package Source:{" "}
                {debugMetadata.packageSource}
              </div>
            ) : null}
            {debugMetadata.participantCount ? (
              <div>
                Participants:{" "}
                {debugMetadata.participantCount}
              </div>
            ) : null}
            {debugMetadata.clueCount ? (
              <div>
                Clues:{" "}
                {debugMetadata.clueCount}
              </div>
            ) : null}
            {debugMetadata.arrangementType ? (
              <div>
                Arrangement:{" "}
                {debugMetadata.arrangementType}
              </div>
            ) : null}
            {debugMetadata.orientationType ? (
              <div>
                Orientation:{" "}
                {debugMetadata.orientationType}
              </div>
            ) : null}
            {debugMetadata.uniquenessVerified !==
            undefined ? (
              <div>
                Uniqueness Verified:{" "}
                {debugMetadata.uniquenessVerified
                  ? "yes"
                  : "no"}
              </div>
            ) : null}
            {debugMetadata.directClueCount !==
            undefined ? (
              <div>
                Direct Clues:{" "}
                {debugMetadata.directClueCount}
              </div>
            ) : null}
            {debugMetadata.relationalClueCount !==
            undefined ? (
              <div>
                Relational Clues:{" "}
                {debugMetadata.relationalClueCount}
              </div>
            ) : null}
            {debugMetadata.indirectClueCount !==
            undefined ? (
              <div>
                Indirect Clues:{" "}
                {debugMetadata.indirectClueCount}
              </div>
            ) : null}
            {debugMetadata.inferenceDepth ? (
              <div>
                Inference Depth:{" "}
                {debugMetadata.inferenceDepth}
              </div>
            ) : null}
            {debugMetadata.deductionDepth !==
            undefined ? (
              <div>
                Deduction Depth:{" "}
                {debugMetadata.deductionDepth}
              </div>
            ) : null}
            {debugMetadata.eliminationDepth !==
            undefined ? (
              <div>
                Elimination Depth:{" "}
                {debugMetadata.eliminationDepth}
              </div>
            ) : null}
            {debugMetadata.clueGraphDensity !==
            undefined ? (
              <div>
                Clue Graph Density:{" "}
                {debugMetadata.clueGraphDensity.toFixed(
                  2,
                )}
              </div>
            ) : null}
            {debugMetadata.clueInteractionRatio !==
            undefined ? (
              <div>
                Clue Interaction Ratio:{" "}
                {(debugMetadata.clueInteractionRatio *
                  100).toFixed(0)}
                %
              </div>
            ) : null}
            {debugMetadata.redundancyScore !==
            undefined ? (
              <div>
                Redundancy Score:{" "}
                {debugMetadata.redundancyScore.toFixed(
                  2,
                )}
              </div>
            ) : null}
            {debugMetadata.structuralDiversityScore !==
            undefined ? (
              <div>
                Structural Diversity:{" "}
                {debugMetadata.structuralDiversityScore.toFixed(
                  2,
                )}
              </div>
            ) : null}
            {debugMetadata.solverComplexity ? (
              <div>
                Solver Complexity:{" "}
                {debugMetadata.solverComplexity}
              </div>
            ) : null}
            {debugMetadata.fallbackReason ? (
              <div>
                Fallback:{" "}
                {debugMetadata.fallbackReason}
              </div>
            ) : null}
            {debugMetadata.quantV2 ? (
              <div className="mt-3 rounded border border-emerald-100 bg-emerald-50 p-3 text-emerald-900">
                <div className="mb-2 font-semibold">
                  Quant-v2 Artifacts
                </div>
                <div>
                  Debug Source:{" "}
                  {String(
                    (debugMetadata.quantV2 as any)
                      .debugSource ??
                      "quant-v2-percentage-adapter",
                  )}
                </div>
                <div>
                  Topology:{" "}
                  {String(
                    (debugMetadata.quantV2 as any)
                      .topology?.family ?? "none",
                  )}
                  {" / "}
                  {String(
                    (debugMetadata.quantV2 as any)
                      .topology?.variant ?? "none",
                  )}
                </div>
                <div>
                  Quality:{" "}
                  {String(
                    (debugMetadata.quantV2 as any)
                      .qualityMetrics?.tier ?? "NA",
                  )}
                  {" | "}
                  {String(
                    (debugMetadata.quantV2 as any)
                      .qualityMetrics?.confidence ??
                      "NA",
                  )}
                </div>
                <div>
                  Validators:{" "}
                  {Object.entries(
                    ((debugMetadata.quantV2 as any)
                      .validatorReports ?? {}) as Record<
                      string,
                      any
                    >,
                  )
                    .filter(
                      ([, report]) =>
                        report &&
                        typeof report === "object" &&
                        "valid" in report,
                    )
                    .map(
                      ([name, report]) =>
                        `${name}=${
                          report.valid ? "ok" : "check"
                        }`,
                    )
                    .join(", ") || "available"}
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">
                    Multilingual Preview
                  </summary>
                  <div className="mt-2 space-y-2">
                    {(["hi", "pa"] as const).map(
                      (language) => (
                        <div
                          key={language}
                          className="rounded bg-white/80 p-2"
                        >
                          <div className="font-semibold uppercase">
                            {language}
                          </div>
                          <div>
                            {String(
                              (debugMetadata.quantV2 as any)
                                .localized?.[language]
                                ?.explanation ?? "",
                            ).slice(0, 500)}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </details>
                {(debugMetadata.quantV2 as any)
                  .svgRendering?.svg ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">
                      SVG Preview
                    </summary>
                    <div
                      className="mt-2 overflow-auto rounded bg-white p-2"
                      dangerouslySetInnerHTML={{
                        __html: String(
                          (debugMetadata.quantV2 as any)
                            .svgRendering.svg,
                        ),
                      }}
                    />
                  </details>
                ) : null}
              </div>
            ) : null}
            {debugMetadata.finalArrangement ? (
              <div className="mt-2">
                Final Arrangement:{" "}
                {debugMetadata.finalArrangement}
              </div>
            ) : null}
            {debugMetadata.seatingDiagram ? (
              <div className="mt-3">
                <SeatingDiagramRenderer
                  diagram={
                    debugMetadata.seatingDiagram
                  }
                  inferenceTrace={
                    (debugMetadata as any)
                      .inferenceTrace
                  }
                  title="QA seating diagram"
                />
              </div>
            ) : null}
            {debugMetadata.seatingExplanationFlow ? (
              <div className="mt-3">
                <SeatingExplanationFlow
                  flow={
                    debugMetadata.seatingExplanationFlow
                  }
                />
              </div>
            ) : null}
            {debugMetadata.generatedClues
              ?.length ? (
              <div className="mt-2 space-y-1">
                {debugMetadata.generatedClues.map(
                  (
                    clue,
                    index,
                  ) => (
                    <div key={`clue-${index}`}>
                      Clue {index + 1}: {clue}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {debugMetadata.clueTypeDistribution ? (
              <div className="mt-2">
                Clue Mix:{" "}
                {Object.entries(
                  debugMetadata.clueTypeDistribution,
                )
                  .map(
                    ([type, count]) =>
                      `${type}=${count}`,
                  )
                  .join(", ")}
              </div>
            ) : null}
            {debugMetadata.solverTrace
              ?.length ? (
              <div className="mt-2 space-y-1">
                {debugMetadata.solverTrace.map(
                  (
                    step,
                    index,
                  ) => (
                    <div key={`solver-${index}`}>
                      Trace {index + 1}: {step}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {debugMetadata.repeatedStructureWarnings
              ?.length ? (
              <div className="mt-2 space-y-1">
                {debugMetadata.repeatedStructureWarnings.map(
                  (
                    warning,
                    index,
                  ) => (
                    <div key={`structure-${index}`}>
                      Structure: {warning}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {debugMetadata.validationWarnings
              ?.length ? (
              <div className="mt-2 space-y-1">
                {debugMetadata.validationWarnings.map(
                  (
                    warning,
                    index,
                  ) => (
                    <div key={`validation-${index}`}>
                      Validation: {warning}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {debugMetadata.compatibilityWarnings
              ?.length ? (
              <div className="mt-2 space-y-1">
                {debugMetadata.compatibilityWarnings.map(
                  (
                    warning,
                    index,
                  ) => (
                    <div key={index}>
                      Warning: {warning}
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function renderGeneratedDifficultySummary(
  generated: GeneratedQuestion[],
) {
  const allQuestions = generated.flatMap(
    (question) =>
      isDISet(question)
        ? question.questions
        : [question],
  );
  const scoredQuestions =
    allQuestions.filter(
      (question) =>
        typeof getDifficultyScore(
          question,
        ) === "number",
    );

  if (!scoredQuestions.length) {
    return null;
  }

  const totalScore =
    scoredQuestions.reduce(
      (sum, question) =>
        sum +
        (getDifficultyScore(
          question,
        ) ?? 0),
      0,
    );
  const averageScore =
    totalScore / scoredQuestions.length;
  const labelCounts =
    getDifficultyCounts(
      scoredQuestions,
    );

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-slate-900">
          Admin Difficulty Panel
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          Average Difficulty:{" "}
          {averageScore.toFixed(1)}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          Scored Questions:{" "}
          {scoredQuestions.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Difficulty Distribution
          </div>
          {renderDifficultyBarSummary(
            labelCounts,
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              Easy: {labelCounts.Easy}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
              Medium: {labelCounts.Medium}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
              Hard: {labelCounts.Hard}
            </span>
          </div>
        </div>

        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Future Calibration Hooks
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Solve Time Telemetry
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Accuracy Rate
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Skip Rate
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Abandonment Rate
            </span>
          </div>
          <p className="text-xs text-slate-500">
            This admin panel is structured for future real-user calibration data, but currently displays only generator-side analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

function renderSolverTraceWorkbench(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const solverTrace =
    getQuestionSolverTrace(question);
  const explanationFlow =
    primaryQuestion
      ?.seatingExplanationFlow ??
    primaryQuestion
      ?.debugMetadata
      ?.seatingExplanationFlow;
  const seatingDiagram =
    primaryQuestion?.seatingDiagram ??
    primaryQuestion?.debugMetadata
      ?.seatingDiagram;
  const inferenceTrace =
    primaryQuestion?.inferenceTrace;

  if (
    !solverTrace.length &&
    !explanationFlow &&
    !seatingDiagram
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Solver Review Desk
        </span>
        <span className="text-xs text-slate-500">
          Trace on the left, SVG reasoning preview on the right.
        </span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded border bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Solver Trace
          </div>
          {solverTrace.length ? (
            <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {solverTrace.map(
                (entry, index) => (
                  <div
                    key={`${index}-${entry}`}
                    className="rounded border border-slate-200 bg-slate-50 px-2 py-2 text-xs leading-5 text-slate-700"
                  >
                    <span className="mr-2 font-semibold text-slate-500">
                      {index + 1}.
                    </span>
                    {entry}
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              No solver trace available for this question.
            </div>
          )}
        </div>
        <div className="rounded border bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            SVG Explanation Preview
          </div>
          {explanationFlow ? (
            <SeatingExplanationFlow
              flow={explanationFlow}
            />
          ) : seatingDiagram ? (
            <SeatingDiagramRenderer
              diagram={seatingDiagram}
              inferenceTrace={
                inferenceTrace
              }
            />
          ) : (
            <div className="text-sm text-slate-500">
              No seating explanation preview available for this question.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type StoredPreviewLanguage =
  | "hi"
  | "pa";

type RegistryLanguage =
  | "en"
  | "hi"
  | "pa";

const REGISTRY_LANGUAGE_OPTIONS: Array<{
  id: RegistryLanguage;
  label: string;
  description: string;
  locked?: boolean;
}> = [
  {
    id: "en",
    label: "English",
    description: "Base question",
    locked: true,
  },
  {
    id: "hi",
    label: "\u0939\u093f\u0928\u094d\u0926\u0940",
    description: "Hindi preview",
  },
  {
    id: "pa",
    label: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",
    description: "Punjabi preview",
  },
];

function getSupportedRegistryLanguages(
  pattern: any,
): RegistryLanguage[] {
  const supported = Array.isArray(
    pattern?.supportedLanguages,
  )
    ? pattern.supportedLanguages.filter(
        (
          value: unknown,
        ): value is RegistryLanguage =>
          value === "en" ||
          value === "hi" ||
          value === "pa",
      )
    : REGISTRY_LANGUAGE_OPTIONS.map(
        (option) => option.id,
      );

  return supported.includes("en")
    ? supported
    : ["en", ...supported];
}

const QUANT_V2_CORPUS_AUDIT_TOPICS: Array<{
  id: CorpusAuditTopicId;
  label: string;
}> = [
  {
    id: "percentage",
    label: "Percentage",
  },
  {
    id: "profit_loss",
    label: "Profit, Loss & Discount",
  },
  {
    id: "interest",
    label: "Interest / SI & CI",
  },
  {
    id: "ratio_proportion",
    label: "Ratio, Proportion & Variation",
  },
  {
    id: "time_work",
    label: "Time & Work / Pipes",
  },
  {
    id: "time_speed_distance",
    label: "Time, Speed & Distance",
  },
  {
    id: "mixture_alligation",
    label: "Mixture & Alligation",
  },
  {
    id: "number_system",
    label: "Number System",
  },
];

const SCHEDULER_PROFILE_OPTIONS: Array<{
  id: SchedulerProfileId;
  label: string;
  description: string;
  topicId?: CorpusAuditTopicId;
}> = [
  {
    id: "balanced_mock",
    topicId: "percentage",
    label: "Balanced Mock",
    description: "General Percentage V2 set-level balance.",
  },
  {
    id: "ssc_mock",
    topicId: "percentage",
    label: "SSC Mock",
    description: "Compact Percentage V2 arithmetic-heavy pacing.",
  },
  {
    id: "banking_mock",
    topicId: "percentage",
    label: "Banking Mock",
    description: "Inference-heavy Percentage V2 layered reasoning.",
  },
  {
    id: "railway_mock",
    topicId: "percentage",
    label: "Railway Mock",
    description: "Direct Percentage V2 trap-oriented flow.",
  },
  {
    id: "punjab_state_mock",
    topicId: "percentage",
    label: "Punjab/State Mock",
    description: "Bilingual Percentage V2 state-exam realism.",
  },
  {
    id: "pyq_balanced",
    topicId: "percentage",
    label: "PYQ Balanced",
    description: "SSC PYQ-inspired Percentage V2 balance.",
  },
  {
    id: "pyq_hard",
    topicId: "percentage",
    label: "PYQ Hard",
    description: "Hard Percentage V2 inverse and hidden-base mix.",
  },
  {
    id: "pyq_plus",
    topicId: "percentage",
    label: "PYQ Plus",
    description: "Premium Percentage V2 PYQ+ benchmark mix.",
  },
  {
    id: "ssc_mock_pyq",
    topicId: "percentage",
    label: "SSC Mock PYQ",
    description: "SSC mock pacing using the Percentage V2 PYQ+ mix.",
  },
  {
    id: "advanced_coverage_audit",
    topicId: "percentage",
    label: "Advanced Coverage Audit",
    description: "Density-first Percentage V2 advanced motif audit.",
  },
  {
    id: "profit_loss_balanced",
    topicId: "profit_loss",
    label: "Profit/Loss Balanced",
    description: "Balanced Profit, Loss & Discount V2 family rotation.",
  },
  {
    id: "profit_loss_discount",
    topicId: "profit_loss",
    label: "Profit/Loss Discount",
    description: "Marked-price and discount-heavy Profit/Loss V2 rotation.",
  },
  {
    id: "profit_loss_hard",
    topicId: "profit_loss",
    label: "Profit/Loss Hard",
    description: "Fraud, inverse, inventory, and overhead Profit/Loss V2 traps.",
  },
  {
    id: "profit_loss_pyq_plus",
    topicId: "profit_loss",
    label: "Profit/Loss PYQ+",
    description: "Advanced Profit/Loss V2 PYQ+ trap mix.",
  },
  {
    id: "interest_balanced",
    topicId: "interest",
    label: "Interest Balanced",
    description: "Balanced SI/CI, repayment, growth, and discount-bill Interest V2 rotation.",
  },
  {
    id: "interest_pyq",
    topicId: "interest",
    label: "Interest PYQ",
    description: "SSC/IBPS Interest V2 medium-plus reasoning profile.",
  },
  {
    id: "interest_hard",
    topicId: "interest",
    label: "Interest Hard",
    description: "Hard Interest V2 inverse, repayment, and banker discount traps.",
  },
  {
    id: "interest_pyq_plus",
    topicId: "interest",
    label: "Interest PYQ+",
    description: "Advanced PYQ+ Interest V2 hybrid and inverse profile.",
  },
  {
    id: "ratio_basic",
    topicId: "ratio_proportion",
    label: "Ratio Basic",
    description: "Direct Ratio V2 fundamentals and light transformations.",
  },
  {
    id: "ratio_balanced",
    topicId: "ratio_proportion",
    label: "Ratio Balanced",
    description: "Balanced Ratio, Proportion & Variation V2 rotation.",
  },
  {
    id: "ratio_hard",
    topicId: "ratio_proportion",
    label: "Ratio Hard",
    description: "Transfer, chain, geometry, and combined-variation traps.",
  },
  {
    id: "ratio_pyq_plus",
    topicId: "ratio_proportion",
    label: "Ratio PYQ+",
    description: "Advanced PYQ+ Ratio V2 proportional reasoning profile.",
  },
  {
    id: "ratio_review_100",
    topicId: "ratio_proportion",
    label: "Ratio Review 100",
    description: "100Q review coverage for Ratio V2 Phase A/B motifs.",
  },
  {
    id: "ratio_production_60",
    topicId: "ratio_proportion",
    label: "Ratio Production 60",
    description: "Production 60Q Ratio V2 profile with broad motif coverage.",
  },
  {
    id: "time_work_basic",
    topicId: "time_work",
    label: "Time Work Basic",
    description: "Core Time & Work V2 fundamentals and basic pipes/resources.",
  },
  {
    id: "time_work_balanced",
    topicId: "time_work",
    label: "Time Work Balanced",
    description: "Balanced Time & Work / Pipes & Cisterns V2 rotation.",
  },
  {
    id: "time_work_hard",
    topicId: "time_work",
    label: "Time Work Hard",
    description: "Timeline, cycle, system, pipe, and resource traps.",
  },
  {
    id: "time_work_pyq_plus",
    topicId: "time_work",
    label: "Time Work PYQ+",
    description: "Advanced Time & Work V2 PYQ+ rate-state profile.",
  },
  {
    id: "time_work_review_100",
    topicId: "time_work",
    label: "Time Work Review 100",
    description: "100Q review coverage for Time & Work V2 motifs.",
  },
  {
    id: "time_work_production_60",
    topicId: "time_work",
    label: "Time Work Production 60",
    description: "Production 60Q Time & Work V2 broad coverage.",
  },
  {
    id: "tsd_basic",
    topicId: "time_speed_distance",
    label: "TSD Basic",
    description: "Core Time, Speed & Distance V2 profile without direct formula drills.",
  },
  {
    id: "tsd_balanced",
    topicId: "time_speed_distance",
    label: "TSD Balanced",
    description: "Balanced Time, Speed & Distance V2 rotation across journeys, trains, boats, races, and circular motion.",
  },
  {
    id: "tsd_hard",
    topicId: "time_speed_distance",
    label: "TSD Hard",
    description: "Hard Time, Speed & Distance V2 profile with traps, hidden values, trains, races, circular tracks, and escalators.",
  },
  {
    id: "tsd_pyq_plus",
    topicId: "time_speed_distance",
    label: "TSD PYQ+",
    description: "Advanced PYQ+ Time, Speed & Distance V2 trap profile.",
  },
  {
    id: "tsd_review_100",
    topicId: "time_speed_distance",
    label: "TSD Review 100",
    description: "100Q review coverage for Time, Speed & Distance V2 motifs.",
  },
  {
    id: "tsd_review_200",
    topicId: "time_speed_distance",
    label: "TSD Review 200",
    description: "200Q review coverage for Time, Speed & Distance V2 Phase A/B motifs.",
  },
  {
    id: "tsd_production_60",
    topicId: "time_speed_distance",
    label: "TSD Production 60",
    description: "Production 60Q Time, Speed & Distance V2 broad coverage.",
  },
  {
    id: "mix_basic",
    topicId: "mixture_alligation",
    label: "Mixture Basic",
    description: "Core Mixture & Alligation V2 profile.",
  },
  {
    id: "mix_balanced",
    topicId: "mixture_alligation",
    label: "Mixture Balanced",
    description: "Balanced Mixture & Alligation V2 rotation.",
  },
  {
    id: "mix_hard",
    topicId: "mixture_alligation",
    label: "Mixture Hard",
    description: "Hard Mixture & Alligation V2 profile.",
  },
  {
    id: "mix_pyq_plus",
    topicId: "mixture_alligation",
    label: "Mixture PYQ+",
    description: "Advanced PYQ+ Mixture & Alligation V2 trap profile.",
  },
  {
    id: "mix_review_100",
    topicId: "mixture_alligation",
    label: "Mixture Review 100",
    description: "100Q review coverage for Mixture & Alligation V2.",
  },
  {
    id: "mix_review_200",
    topicId: "mixture_alligation",
    label: "Mixture Review 200",
    description: "200Q review coverage for Mixture & Alligation V2.",
  },
  {
    id: "mix_production_60",
    topicId: "mixture_alligation",
    label: "Mixture Production 60",
    description: "Production 60Q Mixture & Alligation V2 broad coverage.",
  },
  {
    id: "number_system_basic",
    topicId: "number_system",
    label: "Number System Basic",
    description: "Core Number System V2 divisibility, factors, remainders, and digit logic profile.",
  },
  {
    id: "number_system_balanced",
    topicId: "number_system",
    label: "Number System Balanced",
    description: "Balanced Number System V2 rotation across divisibility, factors, HCF/LCM, remainders, digits, and factorials.",
  },
  {
    id: "number_system_hard",
    topicId: "number_system",
    label: "Number System Hard",
    description: "Hard Number System V2 profile with modular, hidden-variable, factorial, and hybrid reasoning traps.",
  },
  {
    id: "number_system_pyq_plus",
    topicId: "number_system",
    label: "Number System PYQ+",
    description: "Advanced PYQ+ Number System V2 trap profile.",
  },
  {
    id: "number_system_review_100",
    topicId: "number_system",
    label: "Number System Review 100",
    description: "100Q review coverage for Number System V2 families.",
  },
  {
    id: "number_system_review_200",
    topicId: "number_system",
    label: "Number System Review 200",
    description: "200Q review coverage for Number System V2 families.",
  },
  {
    id: "number_system_production_300",
    topicId: "number_system",
    label: "Number System Production 300",
    description: "Production 300Q Number System V2 broad coverage.",
  },
  {
    id: "number_system_audit_1000",
    topicId: "number_system",
    label: "Number System Audit 1000",
    description: "1000Q Number System V2 audit profile with broad family coverage.",
  },
  {
    id: "number_system_production_1000",
    topicId: "number_system",
    label: "Number System Production 1000",
    description: "Freeze-scale production Number System V2 coverage.",
  },
  {
    id: "number_system_review_1000",
    topicId: "number_system",
    label: "Number System Review 1000",
    description: "Freeze-scale review Number System V2 coverage.",
  },
  {
    id: "number_system_pyq_plus_1000",
    topicId: "number_system",
    label: "Number System PYQ+ 1000",
    description: "PYQ+ scale Number System V2 coverage.",
  },
  {
    id: "number_system_elite_500",
    topicId: "number_system",
    label: "Number System Elite 500",
    description: "Elite topology-chain Number System V2 coverage.",
  },
];

const FILING_TAXONOMY: FilingTaxonomySubject[] = [
  {
    id: "reasoning",
    label: "Reasoning",
    topics: [
      {
        id: "seating-arrangement",
        label: "Seating Arrangement",
        subTopics: [
          { id: "linear-row", label: "Linear Row" },
          { id: "parallel-row", label: "Parallel Row" },
          { id: "circular", label: "Circular" },
          { id: "floor-puzzle", label: "Floor Puzzle" },
        ],
      },
      {
        id: "syllogism",
        label: "Syllogism",
        subTopics: [
          { id: "definite", label: "Definite Conclusions" },
          { id: "possibility", label: "Possibility Cases" },
        ],
      },
      {
        id: "direction-sense",
        label: "Direction Sense",
        subTopics: [
          { id: "vector-path", label: "Vector Path" },
          { id: "shadow", label: "Shadow Logic" },
        ],
      },
    ],
  },
  {
    id: "quant",
    label: "Quant",
    topics: [
      {
        id: "mensuration",
        label: "Mensuration",
        subTopics: [
          { id: "2d-shapes", label: "2D Shapes" },
          { id: "3d-solids", label: "3D Solids" },
        ],
      },
      {
        id: "algebra",
        label: "Algebra",
        subTopics: [
          { id: "quadratic", label: "Quadratic" },
          { id: "identities", label: "Identities" },
        ],
      },
    ],
  },
  {
    id: "ga",
    label: "GA",
    topics: [
      {
        id: "static-gk",
        label: "Static GK",
        subTopics: [
          { id: "parks", label: "Parks and Sanctuaries" },
          { id: "polity", label: "Polity" },
        ],
      },
      {
        id: "computer-awareness",
        label: "Computer Awareness",
        subTopics: [
          { id: "hardware", label: "Hardware" },
          { id: "networking", label: "Networking" },
        ],
      },
    ],
  },
  {
    id: "english",
    label: "English",
    topics: [
      {
        id: "grammar",
        label: "Grammar",
        subTopics: [
          { id: "error-spotting", label: "Error Spotting" },
          { id: "sentence-improvement", label: "Sentence Improvement" },
        ],
      },
      {
        id: "vocabulary",
        label: "Vocabulary",
        subTopics: [
          { id: "synonyms-antonyms", label: "Synonyms / Antonyms" },
          { id: "idioms", label: "Idioms" },
        ],
      },
    ],
  },
  {
    id: "punjabi",
    label: "Punjabi",
    topics: [
      {
        id: "vyakaran",
        label: "Vyakaran",
        subTopics: [
          { id: "ling", label: "Ling Badlo" },
          { id: "vachan", label: "Vachan Badlo" },
          { id: "vak-shuddhi", label: "Vak Shuddhi" },
        ],
      },
      {
        id: "shabad-bodh",
        label: "Shabad Bodh",
        subTopics: [
          { id: "shabad-jor", label: "Shabad Jor" },
          { id: "muhavre", label: "Muhavre" },
        ],
      },
    ],
  },
];

const TARGET_EXAM_OPTIONS = [
  "SSC CGL",
  "SSC CHSL",
  "SBI PO",
  "IBPS Clerk",
  "Punjab Govt",
  "PSSSB",
  "PPSC",
  "CAT",
];

const DEFAULT_FILING_CONFIG: FilingConfig = {
  subjectId: "",
  subjectLabel: "",
  topicId: "",
  topicLabel: "",
  subTopicId: "",
  subTopicLabel: "",
  difficulty: 3,
  targetExams: [],
  tags: "",
};

function slugifyFilingId(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitleLabel(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) =>
      match.toUpperCase(),
    );
}

function mapDomainToFilingSubjectId(
  domain?: string,
): FilingSubjectId | null {
  const normalized =
    domain?.toLowerCase() ?? "";

  if (
    normalized.includes("reason")
  ) {
    return "reasoning";
  }

  if (
    normalized.includes("quant") ||
    normalized.includes("di")
  ) {
    return "quant";
  }

  if (
    normalized.includes("english")
  ) {
    return "english";
  }

  if (
    normalized.includes("punjabi")
  ) {
    return "punjabi";
  }

  if (
    normalized.includes("knowledge") ||
    normalized.includes("computer") ||
    normalized.includes("gk") ||
    normalized.includes("ga")
  ) {
    return "ga";
  }

  return null;
}

function guessFilingSubjectsForTopicName(
  topicName: string,
): FilingSubjectId[] {
  const normalized =
    topicName.toLowerCase();

  if (
    /percentage|average|profit|loss|ratio|mixture|time|work|speed|distance|algebra|number|mensuration|geometry|simplification|quant|data interpretation|di/.test(
      normalized,
    )
  ) {
    return ["quant"];
  }

  if (
    /seating|puzzle|syllogism|inequality|direction|blood|relation|coding|series|analogy|reasoning|clock|calendar|venn/.test(
      normalized,
    )
  ) {
    return ["reasoning"];
  }

  if (
    /grammar|vocabulary|english|cloze|comprehension|idiom|synonym|antonym|voice|narration/.test(
      normalized,
    )
  ) {
    return ["english"];
  }

  if (
    /punjabi|vyakaran|shabad|muhavre|gurmukhi|vachan|ling/.test(
      normalized,
    )
  ) {
    return ["punjabi"];
  }

  if (
    /computer|hardware|software|network|internet|polity|history|geography|science|economics|environment|current|punjab|gk|general awareness|banking/.test(
      normalized,
    )
  ) {
    return ["ga"];
  }

  return [
    "reasoning",
    "quant",
    "ga",
    "english",
    "punjabi",
  ];
}

function buildExpandedFilingTaxonomy({
  base,
  patterns,
  reviewableItems,
  masterTopics,
}: {
  base: FilingTaxonomySubject[];
  patterns: any[];
  reviewableItems: ReviewableGeneratedItem[];
  masterTopics: MasterTopicOption[];
}) {
  const subjects =
    new Map<
      FilingSubjectId,
      FilingTaxonomySubject
    >(
      base.map((subject) => [
        subject.id,
        {
          ...subject,
          topics: subject.topics.map(
            (topic) => ({
              ...topic,
              subTopics: [
                ...topic.subTopics,
              ],
            }),
          ),
        },
      ]),
    );

  const ensureTopic = (
    subjectId: FilingSubjectId,
    topicId: string,
    label: string,
  ) => {
    const subject =
      subjects.get(subjectId);
    if (!subject) {
      return null;
    }

    const normalizedTopicId =
      topicId || slugifyFilingId(label);
    let topic =
      subject.topics.find(
        (entry) =>
          entry.id === normalizedTopicId,
      );

    if (!topic) {
      topic = {
        id: normalizedTopicId,
        label,
        subTopics: [],
      };
      subject.topics.push(topic);
    }

    return topic;
  };

  const addSubTopic = (
    topic: FilingTaxonomyTopic | null,
    subTopicId?: string,
    label?: string,
  ) => {
    if (!topic || !subTopicId || !label) {
      return;
    }

    if (
      topic.subTopics.some(
        (entry) =>
          entry.id === subTopicId,
      )
    ) {
      return;
    }

    topic.subTopics.push({
      id: subTopicId,
      label,
    });
  };

  patterns.forEach((pattern) => {
    const subjectId =
      mapDomainToFilingSubjectId(
        pattern.domain,
      ) ??
      mapDomainToFilingSubjectId(
        pattern.section,
      );
    if (!subjectId) {
      return;
    }

    const topicLabel =
      pattern.topicLabel ??
      pattern.topic ??
      pattern.section ??
      pattern.domain ??
      "General";
    const topic =
      ensureTopic(
        subjectId,
        slugifyFilingId(
          String(topicLabel),
        ),
        toTitleLabel(String(topicLabel)),
      );

    addSubTopic(
      topic,
      pattern.subtopic
        ? slugifyFilingId(
            String(pattern.subtopic),
          )
        : pattern.id
        ? String(pattern.id)
        : undefined,
      pattern.subtopic ??
        pattern.label ??
        pattern.name ??
        pattern.id,
    );
  });

  reviewableItems.forEach((item) => {
    const subjectId =
      mapDomainToFilingSubjectId(
        item.generationDomain,
      ) ??
      mapDomainToFilingSubjectId(
        item.question.section,
      );
    if (!subjectId) {
      return;
    }

    const topic =
      ensureTopic(
        subjectId,
        slugifyFilingId(item.topic),
        item.topic,
      );

    addSubTopic(
      topic,
      slugifyFilingId(item.motif),
      item.motif,
    );
  });

  masterTopics.forEach((topic) => {
    const subjectIds =
      guessFilingSubjectsForTopicName(
        topic.name,
      );

    subjectIds.forEach((subjectId) => {
      ensureTopic(
        subjectId,
        topic.id,
        topic.name,
      );
    });
  });

  return Array.from(
    subjects.values(),
  ).map((subject) => ({
    ...subject,
    topics: subject.topics
      .map((topic) => ({
        ...topic,
        subTopics: [
          ...topic.subTopics,
        ].sort((left, right) =>
          left.label.localeCompare(
            right.label,
          ),
        ),
      }))
      .sort((left, right) =>
        left.label.localeCompare(
          right.label,
        ),
      ),
  }));
}

const STORED_PREVIEW_LANGUAGES: Array<{
  lang: StoredPreviewLanguage;
  label: string;
  textKey: "textHi" | "textPa";
  optionsKey: "optionsHi" | "optionsPa";
  explanationKey:
    | "explanationHi"
    | "explanationPa";
}> = [
  {
    lang: "hi",
    label: "Hindi",
    textKey: "textHi",
    optionsKey: "optionsHi",
    explanationKey: "explanationHi",
  },
  {
    lang: "pa",
    label: "Punjabi",
    textKey: "textPa",
    optionsKey: "optionsPa",
    explanationKey: "explanationPa",
  },
];

function hasStoredLanguagePreview(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) return false;
  if (
    question.requestedLanguages?.some(
      (language) =>
        language === "hi" ||
        language === "pa",
    )
  ) {
    return true;
  }
  return STORED_PREVIEW_LANGUAGES.some(
    (language) =>
      Boolean(
        question[language.textKey]?.trim(),
      ) ||
      Boolean(
        question[language.explanationKey]?.trim(),
      ) ||
      Boolean(
        question[language.optionsKey]?.length,
      ),
  );
}

function prepareGeneratedQuestionForLanguages(
  question: GeneratedQuestion,
  languages: RegistryLanguage[],
  patternId?: string,
): GeneratedQuestion {
  if (isDISet(question)) return question;

  const prepared: FormulaQuestion = {
    ...question,
    requestedLanguages: languages,
    patternId:
      question.patternId ??
      patternId ??
      null,
    proceduralLogic:
      question.proceduralLogic ??
      question.logic ??
      question.proceduralScenario ??
      question.debugMetadata
        ?.proceduralScenario ??
      null,
    motifs:
      question.motifs ??
      question
        .extractedPatternIntelligence
        ?.motifs ??
      (question.debugMetadata
        ?.selectedMotif
        ? [
            question.debugMetadata
              .selectedMotif,
          ]
        : null),
  };
  const isQuantV4Question =
    prepared.generationBackend ===
      "quant-v4" ||
    prepared.debugMetadata
      ?.generationDomain === "quant-v4";

  if (languages.includes("hi")) {
    prepared.textHi =
      prepared.textHi ?? "";
    prepared.optionsHi =
      prepared.optionsHi ??
      (isQuantV4Question
        ? []
        : [
            "",
            "",
            "",
            "",
          ]);
    prepared.explanationHi =
      prepared.explanationHi ?? "";
  }

  if (languages.includes("pa")) {
    prepared.textPa =
      prepared.textPa ?? "";
    prepared.optionsPa =
      prepared.optionsPa ??
      (isQuantV4Question
        ? []
        : [
            "",
            "",
            "",
            "",
          ]);
    prepared.explanationPa =
      prepared.explanationPa ?? "";
  }

  return prepared;
}

function getQuestionLogicObject(
  question: FormulaQuestion,
) {
  return (
    question.proceduralLogic ??
    question.logic ??
    (question as any).proceduralScenario ??
    question.debugMetadata
      ?.proceduralScenario ??
    question.debugMetadata ??
    null
  );
}

function getQuestionPatternId(
  question: FormulaQuestion,
) {
  return (
    question.patternId ??
    question.debugMetadata
      ?.selectedPattern ??
    question.debugMetadata
      ?.patternId ??
    "generated-pattern"
  );
}

function getFinalizedLanguageContent(
  question: FormulaQuestion,
) {
  const hasHindiContent =
    Boolean(question.textHi?.trim()) ||
    Boolean(
      question.explanationHi?.trim(),
    ) ||
    Boolean(
      question.optionsHi?.some((option) =>
        option?.trim(),
      ),
    );
  const hasPunjabiContent =
    Boolean(question.textPa?.trim()) ||
    Boolean(
      question.explanationPa?.trim(),
    ) ||
    Boolean(
      question.optionsPa?.some((option) =>
        option?.trim(),
      ),
    );
  const content: Record<
    string,
    {
      question: string;
      options: string[];
      explanation: string;
      correct: number;
    }
  > = {
    en: {
      question: question.text,
      options: question.options ?? [],
      explanation:
        question.explanation ?? "",
      correct: question.correct,
    },
  };

  if (hasHindiContent) {
    content.hi = {
      question: question.textHi ?? "",
      options: question.optionsHi ?? [],
      explanation:
        question.explanationHi ?? "",
      correct: question.correct,
    };
  }

  if (hasPunjabiContent) {
    content.pa = {
      question: question.textPa ?? "",
      options: question.optionsPa ?? [],
      explanation:
        question.explanationPa ?? "",
      correct: question.correct,
    };
  }

  return content;
}

function buildFilingPayloads(
  questions: GeneratedQuestion[],
  filing: FilingConfig,
) {
  const tags = filing.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return questions
    .filter(
      (question): question is FormulaQuestion =>
        !isDISet(question),
    )
    .map((question, index) => {
      const logic =
        getQuestionLogicObject(question);
      return {
        questionId: `studio-${Date.now()}-${index + 1}`,
        subject_id: filing.subjectId,
        subject_label:
          filing.subjectLabel ||
          filing.subjectId,
        topic_id: filing.topicId,
        topic_label:
          filing.topicLabel ||
          filing.topicId,
        sub_topic_id: filing.subTopicId,
        sub_topic_label:
          filing.subTopicLabel ||
          filing.subTopicId,
        difficulty: filing.difficulty,
        pattern_id:
          getQuestionPatternId(question),
        logic: {
          source: logic,
          arrangement:
            question.debugMetadata
              ?.finalArrangement ??
            (logic as any)
              ?.finalArrangement ??
            null,
          entity_ids:
            (logic as any)
              ?.participants ??
            (logic as any)?.nodes ??
            null,
          motifs:
            question.motifs ??
            question.debugMetadata
              ?.selectedMotif ??
            null,
        },
        content:
          getFinalizedLanguageContent(
            question,
          ),
        metadata: {
          exams: filing.targetExams,
          tags,
          is_verified: true,
          sectionId: filing.subjectId,
          sectionName:
            filing.subjectLabel ||
            filing.subjectId,
          topicId: filing.topicId,
          topicName:
            filing.topicLabel ||
            filing.topicId,
          subTopicId:
            filing.subTopicId || null,
          subTopicName:
            filing.subTopicLabel || null,
          generated_at:
            new Date().toISOString(),
        },
      };
    });
}

function extractionCandidateToQuestion(
  candidate: KnowledgeExtractionCandidate,
): FormulaQuestion {
  const fact = candidate.proposedFact;
  const entity = fact.data.entity;
  const answer = fact.data.fact;
  const sourceLabel = [
    fact.source.book,
    fact.source.chapter,
    fact.source.page
      ? `p. ${fact.source.page}`
      : "",
  ]
    .filter(Boolean)
    .join(" / ");
  const difficulty: DifficultyLabel =
    fact.difficulty === "hard"
      ? "Hard"
      : fact.difficulty === "easy"
        ? "Easy"
        : "Medium";
  const optionsEn = [
    answer.en,
    "Related fact pending review",
    "Nearby distractor pending review",
    "None of these",
  ];
  const optionsHi = [
    answer.hi,
    "संबंधित तथ्य समीक्षा हेतु लंबित",
    "निकट विकल्प समीक्षा हेतु लंबित",
    "इनमें से कोई नहीं",
  ];
  const optionsPa = [
    answer.pa,
    "ਸੰਬੰਧਿਤ ਤੱਥ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ",
    "ਨੇੜਲਾ ਵਿਕਲਪ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ",
    "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ",
  ];

  return {
    text: `Which option is correctly associated with ${entity.en}?`,
    textHi: `${entity.hi} से सही रूप से संबंधित विकल्प कौन-सा है?`,
    textPa: `${entity.pa} ਨਾਲ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਸੰਬੰਧਿਤ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?`,
    options: optionsEn,
    optionsHi,
    optionsPa,
    correct: 0,
    explanation: [
      `Structured fact: ${entity.en} -> ${answer.en}.`,
      sourceLabel
        ? `Source: ${sourceLabel}.`
        : "Source metadata requires review.",
      "This AI-extracted candidate must be verified before publishing.",
    ].join("\n"),
    explanationHi: [
      `संरचित तथ्य: ${entity.hi} -> ${answer.hi}.`,
      sourceLabel
        ? `स्रोत: ${sourceLabel}.`
        : "स्रोत मेटाडेटा समीक्षा हेतु लंबित है।",
      "प्रकाशन से पहले इस AI-extracted candidate की पुष्टि करें।",
    ].join("\n"),
    explanationPa: [
      `ਸੰਰਚਿਤ ਤੱਥ: ${entity.pa} -> ${answer.pa}.`,
      sourceLabel
        ? `ਸਰੋਤ: ${sourceLabel}.`
        : "ਸਰੋਤ ਮੈਟਾਡਾਟਾ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ ਹੈ।",
      "ਪਬਲਿਸ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਸ AI-extracted candidate ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
    ].join("\n"),
    requestedLanguages: [
      "en",
      "hi",
      "pa",
    ],
    patternId:
      `knowledge-extraction-${fact.factType}`,
    proceduralLogic: {
      source:
        "knowledge-extraction",
      candidateId:
        candidate.candidateId,
      factId: fact.factId,
      entityId: fact.entityId,
      factType: fact.factType,
      contextGroupId:
        fact.contextGroupId,
      rawText: candidate.rawText,
    },
    motifs: [
      "knowledge-extraction",
      fact.factType,
      fact.contextGroupId,
    ],
    section: "ga",
    topic: fact.topic,
    subtopic: fact.subtopic,
    difficulty,
    difficultyLabel: difficulty,
    debugMetadata: {
      generationDomain: "knowledge",
      selectedMotif:
        "knowledge-extraction",
      selectedPattern:
        `knowledge-extraction-${fact.factType}`,
      selectedArchetype:
        "AI Fact Extraction",
      compatibilityWarnings:
        candidate.extractionNotes,
      validationWarnings:
        candidate.status ===
        "needs_review"
          ? [
              "Human verification required before save.",
            ]
          : [],
      knowledgeLogic: {
        source:
          "knowledge-extraction",
        candidateId:
          candidate.candidateId,
        factId: fact.factId,
        factType: fact.factType,
        contextGroupId:
          fact.contextGroupId,
      },
      factSnapshot: fact,
    } as any,
  };
}

function extractionCandidateToQuestionNative(
  candidate: KnowledgeExtractionCandidate,
): FormulaQuestion {
  const fact = candidate.proposedFact;
  const entity = fact.data.entity;
  const answer = fact.data.fact;
  const sourceLabel = [
    fact.source.book,
    fact.source.chapter,
    fact.source.page
      ? `p. ${fact.source.page}`
      : "",
  ]
    .filter(Boolean)
    .join(" / ");
  const difficulty: DifficultyLabel =
    fact.difficulty === "hard"
      ? "Hard"
      : fact.difficulty === "easy"
        ? "Easy"
        : "Medium";

  return {
    text: `Which option is correctly associated with ${entity.en}?`,
    textHi: `${entity.hi} से सही रूप से संबंधित विकल्प कौन-सा है?`,
    textPa: `${entity.pa} ਨਾਲ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਸੰਬੰਧਿਤ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?`,
    options: [
      answer.en,
      "Related fact pending review",
      "Nearby distractor pending review",
      "None of these",
    ],
    optionsHi: [
      answer.hi,
      "संबंधित तथ्य समीक्षा हेतु लंबित",
      "निकट विकल्प समीक्षा हेतु लंबित",
      "इनमें से कोई नहीं",
    ],
    optionsPa: [
      answer.pa,
      "ਸੰਬੰਧਿਤ ਤੱਥ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ",
      "ਨੇੜਲਾ ਵਿਕਲਪ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ",
      "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ",
    ],
    correct: 0,
    explanation: [
      `Structured fact: ${entity.en} -> ${answer.en}.`,
      sourceLabel
        ? `Source: ${sourceLabel}.`
        : "Source metadata requires review.",
      "This extracted candidate must be verified before publishing.",
    ].join("\n"),
    explanationHi: [
      `संरचित तथ्य: ${entity.hi} -> ${answer.hi}.`,
      sourceLabel
        ? `स्रोत: ${sourceLabel}.`
        : "स्रोत मेटाडेटा समीक्षा हेतु लंबित है।",
      "प्रकाशन से पहले इस extracted candidate की पुष्टि करें।",
    ].join("\n"),
    explanationPa: [
      `ਸੰਰਚਿਤ ਤੱਥ: ${entity.pa} -> ${answer.pa}.`,
      sourceLabel
        ? `ਸਰੋਤ: ${sourceLabel}.`
        : "ਸਰੋਤ ਮੈਟਾਡਾਟਾ ਸਮੀਖਿਆ ਲਈ ਲੰਬਿਤ ਹੈ।",
      "ਪਬਲਿਸ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਸ extracted candidate ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
    ].join("\n"),
    requestedLanguages: [
      "en",
      "hi",
      "pa",
    ],
    patternId:
      `knowledge-extraction-${fact.factType}`,
    proceduralLogic: {
      source:
        "knowledge-extraction",
      candidateId:
        candidate.candidateId,
      factId: fact.factId,
      entityId: fact.entityId,
      factType: fact.factType,
      contextGroupId:
        fact.contextGroupId,
      rawText: candidate.rawText,
    },
    motifs: [
      "knowledge-extraction",
      fact.factType,
      fact.contextGroupId,
    ],
    section: "ga",
    topic: fact.topic,
    subtopic: fact.subtopic,
    difficulty,
    difficultyLabel: difficulty,
    debugMetadata: {
      generationDomain: "knowledge",
      selectedMotif:
        "knowledge-extraction",
      selectedPattern:
        `knowledge-extraction-${fact.factType}`,
      selectedArchetype:
        "AI Fact Extraction",
      compatibilityWarnings:
        candidate.extractionNotes,
      validationWarnings:
        candidate.status ===
        "needs_review"
          ? [
              "Human verification required before save.",
            ]
          : [],
      knowledgeLogic: {
        source:
          "knowledge-extraction",
        candidateId:
          candidate.candidateId,
        factId: fact.factId,
        factType: fact.factType,
        contextGroupId:
          fact.contextGroupId,
      },
      factSnapshot: fact,
    } as any,
  };
}

function renderStoredLanguagePreviewPane(
  question: GeneratedQuestion,
  editMode: boolean,
  onLocalizedQuestionTextChange: (
    lang: StoredPreviewLanguage,
    value: string,
  ) => void,
  onLocalizedQuestionExplanationChange: (
    lang: StoredPreviewLanguage,
    value: string,
  ) => void,
  onLocalizedQuestionOptionChange: (
    lang: StoredPreviewLanguage,
    optionIndex: number,
    value: string,
  ) => void,
) {
  if (
    isDISet(question) ||
    !hasStoredLanguagePreview(question)
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Stored Language Preview
        </div>
        <p className="mt-1 text-xs text-slate-500">
          These are the multilingual fields stored with this question. Use Edit to correct them before approval.
        </p>
      </div>
      <div className="space-y-3">
        {STORED_PREVIEW_LANGUAGES.map(
          (language) => {
            const text =
              question[language.textKey] ??
              "";
            const explanation =
              question[
                language.explanationKey
              ] ?? "";
            const localizedOptions =
              question[
                language.optionsKey
              ];
            const requestedLanguage =
              question.requestedLanguages?.includes(
                language.lang,
              ) ?? false;
            const hasExplicitLanguageRequest =
              Boolean(
                question.requestedLanguages
                  ?.length,
              );

            if (
              hasExplicitLanguageRequest &&
              !requestedLanguage
            ) {
              return null;
            }

            const realization =
              question.nativeRealization?.[
                language.lang
              ];
            const nativeSupported =
              realization?.supported === true;
            const options =
              localizedOptions?.length
                ? localizedOptions
                : requestedLanguage
                  ? [
                      "",
                      "",
                      "",
                      "",
                    ]
                  : question.options;
            const hasLanguage =
              Boolean(text.trim()) ||
              Boolean(
                explanation.trim(),
              ) ||
              Boolean(
                localizedOptions?.some(
                  (option) =>
                    option?.trim(),
                ),
              );

            if (
              !hasLanguage &&
              !requestedLanguage
            )
              return null;

            return (
              <div
                key={language.lang}
                lang={
                  language.lang ===
                  "pa"
                    ? "pa"
                    : "hi"
                }
                className={`rounded border bg-white p-3 ${language.lang === "pa" ? "punjabi-text leading-loose" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    {language.label}
                  </div>
                  <span className="rounded border bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {nativeSupported
                      ? "Native"
                      : "Stored"}
                  </span>
                </div>
                {realization ? (
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    {realization.coverageCategory ? (
                      <span className="rounded border bg-slate-50 px-2 py-0.5">
                        Coverage: {realization.coverageCategory}
                        {typeof realization.coveragePercent ===
                        "number"
                          ? ` ${realization.coveragePercent}%`
                          : ""}
                      </span>
                    ) : null}
                    {realization.validation ? (
                      <span
                        className={`rounded border px-2 py-0.5 ${realization.validation.passed === false ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
                      >
                        {realization.validation.passed ===
                        false
                          ? "Validation issue"
                          : "Validated"}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {!nativeSupported &&
                requestedLanguage &&
                realization?.supported ===
                  false ? (
                  <div className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
                    {realization.reason ??
                      `Native ${language.label} realizer is not available for this logic object yet.`}{" "}
                    Enter and verify the localized version manually before saving.
                    {realization.validation?.diagnostics?.length ? (
                      <div className="mt-1 text-[11px]">
                        {realization.validation.diagnostics.join(
                          " ",
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="space-y-2">
                  {editMode ? (
                    <textarea
                      value={text}
                      onChange={(event) =>
                        onLocalizedQuestionTextChange(
                          language.lang,
                          event.target.value,
                        )
                      }
                      className="min-h-[84px] w-full rounded border bg-white p-2 text-sm text-slate-800"
                      placeholder={`${language.label} question text`}
                    />
                  ) : (
                    <div className="min-h-[84px] rounded border bg-slate-50 p-2 text-sm text-slate-800">
                      {text.trim() ? (
                        <MathText
                          content={text}
                        />
                      ) : (
                        <span className="text-slate-500">
                          Localized question pending. Click Edit and enter the finalized {language.label} version before saving.
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {options.map(
                      (option, index) => (
                        <div
                          key={`${language.lang}-${index}`}
                          className={`rounded border px-2 py-1.5 text-sm ${question.correct === index ? "border-emerald-300 bg-emerald-50" : "bg-white"}`}
                        >
                          <span className="mr-2 font-semibold text-slate-500">
                            {String.fromCharCode(
                              65 + index,
                            )}
                          </span>
                          {editMode ? (
                            <input
                              value={option}
                              onChange={(
                                event,
                              ) =>
                                onLocalizedQuestionOptionChange(
                                  language.lang,
                                  index,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              className="w-[calc(100%-1.5rem)] rounded border bg-white px-2 py-1"
                            />
                          ) : (
                            option.trim() ? (
                              <MathText
                                content={option}
                                inline
                              />
                            ) : (
                              <span className="text-slate-400">
                                Option translation pending
                              </span>
                            )
                          )}
                        </div>
                      ),
                    )}
                  </div>

                  <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Explanation
                    </div>
                    {editMode ? (
                      <textarea
                        value={explanation}
                        onChange={(event) =>
                          onLocalizedQuestionExplanationChange(
                            language.lang,
                            event.target
                              .value,
                          )
                        }
                        className="min-h-[92px] w-full rounded border bg-white p-2 text-sm text-slate-800"
                        placeholder={`${language.label} explanation`}
                      />
                    ) : (
                      <div className="min-h-[92px] rounded border bg-slate-50 p-2 text-sm text-slate-800">
                        {explanation.trim() ? (
                          <MathText
                            content={
                              explanation
                            }
                          />
                        ) : (
                          <span className="text-slate-500">
                            Localized explanation pending. Click Edit and enter the finalized {language.label} explanation before saving.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

function getEditorialLifecycleState(
  item: ReviewableGeneratedItem,
  lifecycleStates: Record<string, QuestionLifecycleState>,
): QuestionLifecycleState {
  const explicitState =
    lifecycleStates[item.fingerprint];

  if (explicitState) {
    return explicitState;
  }

  if (item.review?.status === "approved") {
    return "approved";
  }

  if (item.review?.status === "rejected") {
    return "rejected";
  }

  if (item.review?.status === "flagged") {
    return "reviewing";
  }

  return "generated";
}

function getReviewWorkflowStatus(
  item: ReviewableGeneratedItem,
  lifecycleStates: Record<string, QuestionLifecycleState>,
) {
  const lifecycle =
    getEditorialLifecycleState(
      item,
      lifecycleStates,
    );

  if (lifecycle === "pushed_to_bank") {
    return "approved";
  }

  if (lifecycle === "approved") {
    return "approved";
  }

  if (lifecycle === "rejected") {
    return "rejected";
  }

  return item.review?.status ?? "generated";
}

function getBankWorkflowStatus(
  item: ReviewableGeneratedItem,
  lifecycleStates: Record<string, QuestionLifecycleState>,
) {
  return getEditorialLifecycleState(
    item,
    lifecycleStates,
  ) === "pushed_to_bank"
    ? "pushed"
    : "not_pushed";
}

function getReviewStatusBadgeClass(
  status: string,
) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (status === "pushed") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getEditorialSourceType(
  item: ReviewableGeneratedItem,
): EditorialSourceType {
  const primary =
    getPrimaryQuestion(item.question);
  const factSnapshot =
    primary?.debugMetadata
      ?.factSnapshot as any;

  if (
    factSnapshot?.pyqMetadata
      ?.wasAsked
  ) {
    return "pyq";
  }

  if (
    factSnapshot?.source?.book ||
    factSnapshot?.source?.page ||
    factSnapshot?.source?.chapter
  ) {
    return "ingested";
  }

  if (
    (primary?.debugMetadata as any)
      ?.knowledgeLogic
  ) {
    return "extracted";
  }

  return "generated";
}

function getLanguageBadges(
  question: GeneratedQuestion,
) {
  if (isDISet(question)) {
    return ["EN"];
  }

  const badges = ["EN"];

  if (
    question.textHi?.trim() ||
    question.optionsHi?.some(
      (option) =>
        option?.trim(),
    ) ||
    question.explanationHi?.trim()
  ) {
    badges.push("HI");
  }

  if (
    question.textPa?.trim() ||
    question.optionsPa?.some(
      (option) =>
        option?.trim(),
    ) ||
    question.explanationPa?.trim()
  ) {
    badges.push("PA");
  }

  return badges;
}

function getSourceLineage(
  item: ReviewableGeneratedItem,
) {
  const primary =
    getPrimaryQuestion(item.question);
  const factSnapshot =
    primary?.debugMetadata
      ?.factSnapshot as any;

  if (!factSnapshot?.source) {
    return "Generator output";
  }

  return [
    factSnapshot.source.book,
    factSnapshot.source.chapter,
    factSnapshot.source.page
      ? `p. ${factSnapshot.source.page}`
      : "",
  ]
    .filter(Boolean)
    .join(" / ");
}

function getEditorialBadges(
  item: ReviewableGeneratedItem,
): EditorialBadge[] {
  const primary =
    getPrimaryQuestion(item.question);
  const badges: EditorialBadge[] =
    [];
  const solverVerified =
    item.uniquenessStatus
      .toLowerCase()
      .includes("unique") ||
    item.validationStatus
      .toLowerCase()
      .includes("valid") ||
    primary?.debugMetadata
      ?.uniquenessVerified === true;

  badges.push({
    label: solverVerified
      ? "Solver Verified"
      : "Solver Warning",
    tone: solverVerified
      ? "success"
      : "warning",
  });

  if (
    item.uniquenessStatus
      .toLowerCase()
      .includes("unique")
  ) {
    badges.push({
      label: "Unique Solution",
      tone: "success",
    });
  }

  if (
    !isDISet(item.question) &&
    item.question.textPa?.trim() &&
    item.question.explanationPa?.trim()
  ) {
    badges.push({
      label: "Punjabi Verified",
      tone: "success",
    });
  } else if (
    !isDISet(item.question) &&
    item.question.requestedLanguages?.includes(
      "pa",
    )
  ) {
    badges.push({
      label: "Punjabi Pending",
      tone: "warning",
    });
  }

  if (
    primary?.section ||
    primary?.topic ||
    (primary?.debugMetadata as any)
      ?.knowledgeLogic
  ) {
    badges.push({
      label: "Metadata Complete",
      tone: "success",
    });
  } else {
    badges.push({
      label: "Missing Taxonomy",
      tone: "warning",
    });
  }

  if (item.repetitionFlags.length) {
    badges.push({
      label: "Duplicate Risk",
      tone: "warning",
    });
  }

  if (
    item.validationDiagnostics.length
  ) {
    badges.push({
      label: "Diagnostics",
      tone: "neutral",
    });
  }

  return badges;
}

function getBadgeClasses(
  tone: EditorialBadgeTone,
) {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (tone === "error") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function renderEditorialBadge(
  badge: EditorialBadge,
) {
  return (
    <span
      key={badge.label}
      className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${getBadgeClasses(badge.tone)}`}
    >
      {badge.label}
    </span>
  );
}

function renderQuestionWorkspace(
  item: ReviewableGeneratedItem,
  reviewerNotes: string,
  issueTags: QAIssueTag[],
  editMode: boolean,
  refinementLoading: boolean,
  onChangeNotes: (
    value: string,
  ) => void,
  onToggleTag: (
    tag: QAIssueTag,
  ) => void,
  onEditToggle: () => void,
  onQuestionTextChange: (
    value: string,
  ) => void,
  onQuestionExplanationChange: (
    value: string,
  ) => void,
  onQuestionOptionChange: (
    optionIndex: number,
    value: string,
  ) => void,
  onLocalizedQuestionTextChange: (
    lang: StoredPreviewLanguage,
    value: string,
  ) => void,
  onLocalizedQuestionExplanationChange: (
    lang: StoredPreviewLanguage,
    value: string,
  ) => void,
  onLocalizedQuestionOptionChange: (
    lang: StoredPreviewLanguage,
    optionIndex: number,
    value: string,
  ) => void,
  onGeneratedCluesChange: (
    clues: string[],
  ) => void,
  onReviewAction: (
    action: QAReviewAction,
    status: QAReviewStatus,
  ) => void,
  onToggleBookmark: () => void,
  onRegenerate: () => void,
) {
  const question = item.question;
  const primaryQuestion =
    getPrimaryQuestion(question);
  const qualityAssessment =
    primaryQuestion?.debugMetadata
      ?.qualityAssessment;
  const realismAnalysis =
    primaryQuestion?.debugMetadata
      ?.realismAnalysis;
  const validationReport =
    primaryQuestion?.debugMetadata
      ?.validationReportDetail;
  const difficultyAssessment =
    primaryQuestion?.debugMetadata
      ?.difficultyAssessment;
  const extractedPatternIntelligence =
    primaryQuestion?.debugMetadata
      ?.extractedPatternIntelligence;
  const structuralSignature =
    primaryQuestion?.debugMetadata
      ?.structuralSignature;
  const generatedClues =
    primaryQuestion?.debugMetadata
      ?.generatedClues ?? [];
  const isBookmarked =
    item.review?.bookmarked === true;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Procedural Review Panel
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {item.topic}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full border bg-slate-50 px-2 py-1">
              {item.generationDomain}
            </span>
            <span className="rounded-full border bg-slate-50 px-2 py-1">
              {item.difficulty}
            </span>
            <span className="rounded-full border bg-slate-50 px-2 py-1">
              Seed: {item.generationSeed}
            </span>
            <span className="rounded-full border bg-slate-50 px-2 py-1">
              {item.validationStatus}
            </span>
            {refinementLoading ? (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700">
                Revalidating refinement...
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onReviewAction(
                "approve",
                "approved",
              )
            }
            className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-100"
          >
            Approve
          </button>
          <button
            onClick={() =>
              onReviewAction(
                "reject",
                "rejected",
              )
            }
            className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
          >
            Reject
          </button>
          <button
            onClick={onEditToggle}
            className="rounded border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {editMode ? "Done Editing" : "Edit"}
          </button>
          <button
            onClick={onRegenerate}
            className="rounded border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Regenerate
          </button>
          <button
            onClick={onToggleBookmark}
            className={`rounded border px-3 py-2 text-sm ${isBookmarked
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
          >
            {isBookmarked
              ? "Bookmarked"
              : "Bookmark"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Rendered Question
            </div>
            {!isDISet(question) ? (
              <>
                {editMode ? (
                  <textarea
                    value={question.text}
                    onChange={(event) =>
                      onQuestionTextChange(
                        event.target.value,
                      )
                    }
                    readOnly={!editMode}
                    className="min-h-[88px] w-full rounded border bg-white p-3 text-sm text-slate-800"
                  />
                ) : (
                  <div className="min-h-[88px] w-full rounded border bg-white p-3 text-sm text-slate-800">
                    <MathText
                      content={question.text}
                    />
                  </div>
                )}
                {vennVisualFromQuestion(question) ? (
                  <VennVisualPreview
                    visual={vennVisualFromQuestion(question)!}
                  />
                ) : null}
                {question.options.length ? (
                  <div className="space-y-2">
                    {question.options.map(
                      (
                        option,
                        index,
                      ) => (
                        <div
                          key={`${index}-${option}`}
                          className={`rounded border px-3 py-2 text-sm ${question.correct ===
                            index
                            ? "border-emerald-300 bg-emerald-50"
                            : "bg-white"
                            }`}
                        >
                          <span className="mr-2 font-semibold text-slate-500">
                            {String.fromCharCode(
                              65 + index,
                            )}
                          </span>
                          {editMode ? (
                            <input
                              value={option}
                              onChange={(
                                event,
                              ) =>
                                onQuestionOptionChange(
                                  index,
                                  event.target.value,
                                )
                              }
                              className="w-[calc(100%-1.5rem)] rounded border bg-white px-2 py-1"
                            />
                          ) : (
                            <MathText
                              content={option}
                              inline
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                ) : null}
                <div className="rounded border bg-white p-3 text-sm">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Answer
                  </div>
                  <MathText
                    content={
                      question.answer ??
                      question.options[
                        question.correct
                      ] ??
                      "NA"
                    }
                    inline
                  />
                </div>
                <div className="rounded border bg-white p-3 text-sm whitespace-pre-wrap">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Explanation
                  </div>
                  {editMode ? (
                    <textarea
                      value={
                        question.explanation ||
                        ""
                      }
                      onChange={(event) =>
                        onQuestionExplanationChange(
                          event.target.value,
                        )
                      }
                      readOnly={!editMode}
                      className="min-h-[120px] w-full rounded border bg-white p-2 text-sm"
                      placeholder="No explanation available."
                    />
                  ) : (
                    <div className="min-h-[120px] w-full rounded border bg-slate-50 p-2 text-sm">
                      <MathText
                        content={
                          question.explanation ||
                          "No explanation available."
                        }
                      />
                    </div>
                  )}
                </div>
                {generatedClues.length ? (
                  <div className="rounded border bg-white p-3 text-sm space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Clue Order
                    </div>
                    <div className="space-y-2">
                      {generatedClues.map(
                        (
                          clue,
                          index,
                        ) => (
                          <div
                            key={`${index}-${clue}`}
                            className="flex items-center gap-2"
                          >
                            <span className="w-5 text-xs font-semibold text-slate-500">
                              {index + 1}
                            </span>
                            <input
                              value={clue}
                              onChange={(
                                event,
                              ) =>
                                onGeneratedCluesChange(
                                  generatedClues.map(
                                    (
                                      entry,
                                      clueIndex,
                                    ) =>
                                      clueIndex ===
                                      index
                                        ? event
                                            .target
                                            .value
                                        : entry,
                                  ),
                                )
                              }
                              readOnly={
                                !editMode
                              }
                              className={`flex-1 rounded border px-2 py-1 text-sm ${editMode
                                ? "bg-white"
                                : "bg-slate-50"
                                }`}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded border bg-white p-3 text-sm text-slate-700">
                DI set workspace editing is still handled in the queue cards below.
              </div>
            )}
          </div>

          {renderQAReviewPanel(
            item,
            reviewerNotes,
            issueTags,
            onChangeNotes,
            onToggleTag,
            onReviewAction,
          )}

          {renderSolverTraceWorkbench(
            question,
          )}
        </div>

        <div className="space-y-4">
          {renderStoredLanguagePreviewPane(
            question,
            editMode,
            onLocalizedQuestionTextChange,
            onLocalizedQuestionExplanationChange,
            onLocalizedQuestionOptionChange,
          )}

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Review Signals
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded border bg-white p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Realism Score
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {formatMetricValue(
                    item.realismScore,
                  )}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Difficulty Confidence
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {formatMetricValue(
                    item.difficultyConfidence,
                  )}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Validation
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {validationReport?.passed
                    ? "Passed"
                    : "Needs review"}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Quality Gate
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {qualityAssessment?.approved ===
                  false
                    ? "Rejected"
                    : "Approved"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Validation Diagnostics
            </div>
            <div className="space-y-2">
              {item.validationDiagnostics
                .length ? (
                  item.validationDiagnostics.map(
                    (entry) => (
                      <div
                        key={entry}
                        className="rounded border bg-white px-3 py-2 text-xs text-slate-700"
                      >
                        {entry}
                      </div>
                    ),
                  )
                ) : (
                  <div className="rounded border bg-white px-3 py-2 text-xs text-slate-500">
                    No validation issues reported.
                  </div>
                )}
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Structural Similarity Warnings
            </div>
            <div className="space-y-2">
              {item.structuralWarnings
                .length ? (
                  item.structuralWarnings.map(
                    (warning) => (
                      <div
                        key={warning}
                        className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
                      >
                        {warning}
                      </div>
                    ),
                  )
                ) : (
                  <div className="rounded border bg-white px-3 py-2 text-xs text-slate-500">
                    No structural similarity warnings.
                  </div>
                )}
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Topology Visualization
            </div>
            {(primaryQuestion?.seatingDiagram ??
              primaryQuestion?.debugMetadata
                ?.seatingDiagram) ? (
              <SeatingDiagramRenderer
                diagram={
                  primaryQuestion?.seatingDiagram ??
                  primaryQuestion
                    ?.debugMetadata
                    ?.seatingDiagram!
                }
                inferenceTrace={
                  primaryQuestion?.inferenceTrace
                }
              />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded border bg-white p-3 text-xs">
                  <div className="text-slate-500">
                    Topology Type
                  </div>
                  <div className="font-medium text-slate-900">
                    {item.topologyType}
                  </div>
                </div>
                <div className="rounded border bg-white p-3 text-xs">
                  <div className="text-slate-500">
                    Structural Signature
                  </div>
                  <div className="font-mono text-slate-900 break-all">
                    {structuralSignature
                      ? `${structuralSignature.topologyHash.slice(0, 10)} / ${structuralSignature.inferenceHash.slice(0, 10)}`
                      : "Unavailable"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              PYQ Similarity Insights
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="rounded border bg-white p-3">
                <div className="font-semibold text-slate-900">
                  Realism Band
                </div>
                <div>
                  {primaryQuestion
                    ?.examRealismMetadata
                    ?.realismBand ??
                    realismAnalysis?.band ??
                    "NA"}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="font-semibold text-slate-900">
                  Matched Logic Patterns
                </div>
                <div>
                  {extractedPatternIntelligence?.motifs
                    ?.map(
                      (motif) =>
                        `${motif.motifId} (${motif.confidence.toFixed(2)})`,
                    )
                    .join(", ") ||
                    "No logic-pattern intelligence available."}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="font-semibold text-slate-900">
                  Structure
                </div>
                <div>
                  {extractedPatternIntelligence
                    ? `${extractedPatternIntelligence.structure.subtype}, ${extractedPatternIntelligence.structure.entityCount} entities, ${extractedPatternIntelligence.structure.constraintCount} constraints`
                    : "No extracted pattern intelligence available."}
                </div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="font-semibold text-slate-900">
                  Heuristic Notes
                </div>
                <div>
                  {realismAnalysis?.diagnosticSummary
                    ?.join(" ")
                    || qualityAssessment?.rejectionReasons.join(", ")
                    || "No heuristic notes available."}
                </div>
              </div>
              {difficultyAssessment ? (
                <div className="rounded border bg-white p-3">
                  <div className="font-semibold text-slate-900">
                    Difficulty Snapshot
                  </div>
                  <div>
                    Cognitive load {formatMetricValue(
                      difficultyAssessment.cognitiveLoad,
                    )}, inference depth {formatMetricValue(
                      difficultyAssessment.inferenceDepth,
                    )}, distractor complexity {formatMetricValue(
                      difficultyAssessment.distractorComplexity,
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderQADashboard(
  items: ReviewableGeneratedItem[],
) {
  if (!items.length) {
    return null;
  }

  const approved = items.filter(
    (item) =>
      item.review?.status ===
      "approved",
  ).length;
  const rejected = items.filter(
    (item) =>
      item.review?.status ===
      "rejected",
  ).length;
  const flagged = items.filter(
    (item) =>
      item.review?.status ===
      "flagged",
  ).length;
  const repeated = items.filter(
    (item) =>
      item.repetitionFlags.length > 0,
  ).length;
  const validationFailures =
    items.filter(
      (item) =>
        item.validationStatus !==
        "passed",
    ).length;
  const contradictionFailures =
    items.filter((item) =>
      item.review?.action ===
      "contradictory",
    ).length;
  const duplicateStructure =
    items.filter((item) =>
      item.review?.action ===
      "duplicate-structure",
    ).length;
  const taggedIssues =
    items.filter(
      (item) =>
        (item.review?.issueTags ?? [])
          .length > 0,
    ).length;
  const averageInferenceDepth =
    items.reduce(
      (total, item) =>
        total +
        (item.inferenceDepth ?? 0),
      0,
    ) / items.length;

  const stats = [
    {
      label: "Generated",
      value: items.length,
    },
    {
      label: "Approved",
      value: approved,
    },
    {
      label: "Rejected",
      value: rejected,
    },
    {
      label: "Flagged",
      value: flagged,
    },
    {
      label: "Validation Failures",
      value: validationFailures,
    },
    {
      label: "Repetition Flags",
      value: repeated,
    },
    {
      label: "Contradictory",
      value: contradictionFailures,
    },
    {
      label: "Duplicate Structure",
      value: duplicateStructure,
    },
    {
      label: "Issue Tagged",
      value: taggedIssues,
    },
    {
      label: "Avg Inference",
      value:
        averageInferenceDepth > 0
          ? averageInferenceDepth.toFixed(
            1,
          )
          : "NA",
    },
  ];

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">
          QA Dashboard
        </span>
        <span className="text-xs text-slate-500">
          Operational review metrics for the current generated queue.
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded border bg-white p-3"
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              {stat.label}
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderProceduralAnalyticsDashboard(
  analytics: QAAnalyticsSummary | null,
) {
  if (!analytics) {
    return null;
  }

  const rejectionEntries =
    Object.entries(
      analytics.rejectionReasons,
    )
      .sort(
        (left, right) =>
          right[1] - left[1],
      )
      .slice(0, 6);
  const domainEntries =
    Object.entries(
      analytics.byDomain,
    ).sort(
      (left, right) =>
        right[1].totalReviews -
        left[1].totalReviews,
    );

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">
          Procedural Analytics
        </span>
        <span className="text-xs text-slate-500">
          Persisted QA signals across reviewed generations.
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          {
            label: "Approval Rate",
            value: `${analytics.approvalRate.toFixed(1)}%`,
          },
          {
            label: "Reviews",
            value:
              analytics.totalReviews,
          },
          {
            label: "Realism",
            value:
              analytics.averageRealismScore.toFixed(
                2,
              ),
          },
          {
            label: "Diversity",
            value:
              analytics.averageStructuralDiversity.toFixed(
                2,
              ),
          },
          {
            label: "Difficulty Accuracy",
            value:
              analytics.averageDifficultyConfidence.toFixed(
                2,
              ),
          },
          {
            label: "Latency",
            value: `${analytics.averageGenerationLatencyMs.toFixed(
              0,
            )} ms`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded border bg-white p-3"
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              {stat.label}
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Rejection Reasons
          </div>
          {rejectionEntries.length ? (
            <div className="space-y-2">
              {rejectionEntries.map(
                ([reason, count]) => (
                  <div
                    key={reason}
                    className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-700">
                      {reason}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              No rejection data yet.
            </div>
          )}
        </div>

        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Domain Analytics
          </div>
          {domainEntries.length ? (
            <div className="space-y-2">
              {domainEntries.map(
                ([domain, stats]) => (
                  <div
                    key={domain}
                    className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        {domain}
                      </span>
                      <span className="text-slate-500">
                        {stats.totalReviews} reviews
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4 text-xs text-slate-600">
                      <div>
                        Approval{" "}
                        {stats.approvalRate.toFixed(
                          1,
                        )}
                        %
                      </div>
                      <div>
                        Realism{" "}
                        {stats.averageRealismScore.toFixed(
                          2,
                        )}
                      </div>
                      <div>
                        Diversity{" "}
                        {stats.averageStructuralDiversity.toFixed(
                          2,
                        )}
                      </div>
                      <div>
                        Confidence{" "}
                        {stats.averageDifficultyConfidence.toFixed(
                          2,
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              No domain analytics yet.
            </div>
          )}
        </div>
      </div>

      <div className="rounded border bg-white p-4 space-y-3">
        <div className="text-sm font-medium text-slate-900">
          Trend Samples
        </div>
        {analytics.trends.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {analytics.trends
              .slice(-8)
              .map((trend) => (
                <div
                  key={trend.date}
                  className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700"
                >
                  <div className="font-semibold text-slate-900">
                    {trend.date}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div>
                      Approval{" "}
                      {trend.approvalRate.toFixed(
                        1,
                      )}
                      %
                    </div>
                    <div>
                      Realism{" "}
                      {trend.realismScore.toFixed(
                        2,
                      )}
                    </div>
                    <div>
                      Diversity{" "}
                      {trend.structuralDiversityScore.toFixed(
                        2,
                      )}
                    </div>
                    <div>
                      Difficulty{" "}
                      {trend.difficultyConfidence.toFixed(
                        2,
                      )}
                    </div>
                    <div>
                      Latency{" "}
                      {trend.generationLatencyMs.toFixed(
                        0,
                      )}{" "}
                      ms
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            No time-series review data yet.
          </div>
        )}
      </div>
    </div>
  );
}

function renderQAReviewPanel(
  item: ReviewableGeneratedItem,
  reviewerNotes: string,
  issueTags: QAIssueTag[],
  onChangeNotes: (
    value: string,
  ) => void,
  onToggleTag: (
    tag: QAIssueTag,
  ) => void,
  onReviewAction: (
    action: QAReviewAction,
    status: QAReviewStatus,
  ) => void,
) {
  const activeTags =
    issueTags.length
      ? issueTags
      : item.review?.issueTags ?? [];

  return (
    <div className="rounded border bg-slate-50 p-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-900">
          QA Review
        </span>
        {item.review ? (
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
            {item.review.status} /{" "}
            {item.review.action}
          </span>
        ) : (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
            Unreviewed
          </span>
        )}
        <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
          Validation:{" "}
          {item.validationStatus}
        </span>
        {item.repetitionFlags.length ? (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-rose-700">
            Repetition Flagged
          </span>
        ) : null}
        {activeTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid gap-2 text-[11px] text-slate-600 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Topic
          </div>
          <div className="font-medium text-slate-900">
            {item.topic}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Domain
          </div>
          <div className="font-medium text-slate-900">
            {item.generationDomain}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Logic Pattern
          </div>
          <div className="font-medium text-slate-900">
            {item.motif}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Archetype
          </div>
          <div className="font-medium text-slate-900">
            {item.archetype}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Seed
          </div>
          <div className="font-medium text-slate-900">
            {item.generationSeed}
          </div>
        </div>
      </div>

      <div className="grid gap-2 text-[11px] text-slate-600 md:grid-cols-2 xl:grid-cols-6">
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Topology
          </div>
          <div className="font-medium text-slate-900">
            {item.topologyType}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Inference Depth
          </div>
          <div className="font-medium text-slate-900">
            {item.inferenceDepth ?? "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Clue Count
          </div>
          <div className="font-medium text-slate-900">
            {item.clueCount ?? "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Redundancy Score
          </div>
          <div className="font-medium text-slate-900">
            {typeof item.redundancyScore ===
            "number"
              ? item.redundancyScore.toFixed(
                2,
              )
              : "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Uniqueness
          </div>
          <div className="font-medium text-slate-900">
            {item.uniquenessStatus}
          </div>
        </div>
        <div className="rounded border bg-white p-2">
          <div className="text-slate-500">
            Arrangement
          </div>
          <div className="font-medium text-slate-900">
            {item.arrangementType}
          </div>
        </div>
      </div>

      {item.repetitionFlags.length ? (
        <div className="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {item.repetitionFlags.map(
            (flag) => (
              <div key={flag}>
                {flag}
              </div>
            ),
          )}
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700">
          Issue Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {QA_ISSUE_TAG_OPTIONS.map(
            (option) => {
              const active =
                activeTags.includes(
                  option.tag,
                );

              return (
                <button
                  key={option.tag}
                  onClick={() =>
                    onToggleTag(
                      option.tag,
                    )
                  }
                  className={`rounded border px-3 py-1 text-xs ${active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {option.label}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            onReviewAction(
              "approve",
              "approved",
            )
          }
          className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100"
        >
          Approve
        </button>
        <button
          onClick={() =>
            onReviewAction(
              "reject",
              "rejected",
            )
          }
          className="rounded border border-rose-300 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
        >
          Reject
        </button>
        <button
          onClick={() =>
            onReviewAction(
              activeTags[0] ??
                "repetitive",
              "flagged",
            )
          }
          className="rounded border bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          Save Tags
        </button>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          Reviewer Notes
        </label>
        <textarea
          value={reviewerNotes}
          onChange={(event) =>
            onChangeNotes(
              event.target.value,
            )
          }
          className="h-20 w-full rounded border p-2 text-sm"
          placeholder="Capture clue realism issues, solver concerns, or regeneration notes."
        />
      </div>
    </div>
  );
}

function renderDISetAnalytics(
  diSet: DISet,
) {
  const labelCounts =
    getDifficultyCounts(
      diSet.questions,
    );
  const questionScores =
    diSet.questions
      .map((question) =>
        getDifficultyScore(question),
      )
      .filter(
        (
          score,
        ): score is number =>
          typeof score === "number",
      );
  const progression =
    questionScores.length
      ? questionScores
          .map((score, index) =>
            `Q${index + 1}: ${score.toFixed(1)}`,
          )
          .join(" -> ")
      : "NA";

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">
          DI Set Calibration
        </span>
        {diSet.setProfile && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs capitalize">
            Profile: {diSet.setProfile}
          </span>
        )}
        {diSet.difficultySpread && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs capitalize">
            Spread:{" "}
            {diSet.difficultySpread}
          </span>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Average Difficulty
          </div>
          <div className="font-semibold">
            {typeof diSet.averageDifficulty ===
            "number"
              ? diSet.averageDifficulty.toFixed(
                  1,
                )
              : "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Peak Difficulty
          </div>
          <div className="font-semibold">
            {typeof diSet.peakDifficulty ===
            "number"
              ? diSet.peakDifficulty.toFixed(
                  1,
                )
              : "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Question Count
          </div>
          <div className="font-semibold">
            {diSet.questions.length}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Progression
          </div>
          <div className="font-semibold capitalize">
            {diSet.setProfile ??
              diSet.difficultySpread ??
              "NA"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Difficulty Mix
          </div>
          {renderDifficultyBarSummary(
            labelCounts,
          )}
        </div>

        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Progression Trace
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            {progression}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              Easy: {labelCounts.Easy}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
              Medium: {labelCounts.Medium}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
              Hard: {labelCounts.Hard}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTableDI(diSet: DISet) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {Object.keys(
            diSet.diData[0] || {},
          ).map((col) => (
            <th
              key={col}
              className="border p-2"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {diSet.diData.map(
          (row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map(
                (value, valueIndex) => (
                  <td
                    key={valueIndex}
                    className="border p-2"
                  >
                    {String(value)}
                  </td>
                ),
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

function renderBarDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumns =
    getSeriesColumns(
      diSet,
      "bar",
    );

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return renderTableDI(diSet);
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={diSet.diData}
          margin={
            COMPACT_CHART_MARGIN
          }
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="0"
          />
          <XAxis
            dataKey={categoryColumn}
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <YAxis
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          {renderExamTooltip()}
          {numericColumns.length > 1 && (
            <Legend
              iconType="square"
              wrapperStyle={{
                fontSize: 11,
                color: "#111827",
              }}
            />
          )}
          {numericColumns.map(
            (
              numericColumn,
              index,
            ) => (
              <Bar
                key={numericColumn}
                dataKey={numericColumn}
                name={numericColumn}
                fill={
                  LINE_SERIES_STROKES[
                    index %
                      LINE_SERIES_STROKES.length
                  ]
                }
                activeBar={false}
                isAnimationActive={false}
                radius={[0, 0, 0, 0]}
              />
            ),
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderPieDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumn =
    getNumericColumn(diSet.diData);

  if (
    !categoryColumn ||
    !numericColumn
  ) {
    return renderTableDI(diSet);
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={diSet.diData}
            dataKey={numericColumn}
            nameKey={categoryColumn}
            cx="50%"
            cy="50%"
            outerRadius={76}
            label
            activeShape={false}
            isAnimationActive={false}
            stroke="#ffffff"
            strokeWidth={1}
          >
            {diSet.diData.map(
              (_row, index) => (
                <Cell
                  key={index}
                  fill={
                    PIE_COLORS[
                      index %
                        PIE_COLORS.length
                    ]
                  }
                />
              ),
            )}
          </Pie>
          {renderExamTooltip()}
          <Legend
            iconType="plainline"
            wrapperStyle={{
              fontSize: 11,
              color: "#111827",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderLineDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumns =
    getSeriesColumns(
      diSet,
      "line",
    );

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return renderTableDI(diSet);
  }

  const markerTypes =
    getLineMarkerTypes(
      diSet,
      numericColumns,
    );

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={diSet.diData}
          margin={
            COMPACT_CHART_MARGIN
          }
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="0"
          />
          <XAxis
            dataKey={categoryColumn}
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <YAxis
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <Legend
            iconType="plainline"
            wrapperStyle={{
              fontSize: 11,
              color: "#111827",
            }}
          />
          {numericColumns.map(
            (
              numericColumn,
              index,
            ) => (
              <Line
                key={numericColumn}
                type="linear"
                dataKey={numericColumn}
                name={numericColumn}
                stroke={
                  LINE_SERIES_STROKES[
                    index %
                      LINE_SERIES_STROKES.length
                  ]
                }
                strokeWidth={2.25}
                dot={(props) => {
                  const {
                    key,
                    ...rest
                  } = props;

                  return (
                    <CustomDot
                      key={key}
                      {...rest}
                      fill={
                        LINE_SERIES_STROKES[
                          index %
                            LINE_SERIES_STROKES.length
                        ]
                      }
                      markerType={
                        markerTypes[
                          numericColumn
                        ]
                      }
                      r={6.5}
                      stroke="#ffffff"
                      strokeWidth={1.75}
                    />
                  );
                }}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={numericColumn}
                  position="top"
                  fill="#111827"
                  fontSize={11}
                />
              </Line>
            ),
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderDIVisual(diSet: DISet) {
  switch (diSet.visualType) {
    case "bar":
      return renderBarDI(diSet);
    case "pie":
      return renderPieDI(diSet);
    case "line":
      return renderLineDI(diSet);
    case "table":
    default:
      return renderTableDI(diSet);
  }
}

function renderDIQuestions(
  questions: DIQuestion[],
) {
  return (
    <div className="space-y-4">
      {questions.map(
        (question, questionIndex) => (
          <div
            key={questionIndex}
            className="border rounded p-3"
          >
            <div className="font-medium">
              <MathText
                content={question.text}
              />
            </div>

            {renderDifficultyAnalytics(
              question,
            )}

            <div className="mt-2 space-y-1">
              {question.options?.map(
                (opt, optionIndex) => (
                  <div key={optionIndex}>
                    <MathText
                      content={opt}
                      inline
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function renderDISet(
  diSet: DISet,
  idx: number,
) {
  return (
    <div
      key={idx}
      className="border rounded-lg p-4 space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {diSet.title || "DI Set"}
      </h2>

      {renderDISetAnalytics(diSet)}

      {renderDIVisual(diSet)}

      {renderDIQuestions(
        diSet.questions,
      )}
    </div>
  );
}

function distributionEntries(
  distribution?: Record<string, number>,
) {
  return Object.entries(distribution ?? {})
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8);
}

function renderDistribution(
  title: string,
  distribution?: Record<string, number>,
) {
  const entries =
    distributionEntries(distribution);

  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      {entries.length ? (
        <div className="mt-2 space-y-1">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="truncate text-slate-700">
                {key}
              </span>
              <span className="font-semibold text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-xs text-slate-500">
          Not returned
        </div>
      )}
    </div>
  );
}

function isProfitLossRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  return /profit[-_\s]*loss|discount/u.test(text);
}

function isInterestRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  return /simple[-_\s]*interest|compound[-_\s]*interest|\bsi[-_\s]*ci\b|\binterest\b/u.test(text);
}

function isRatioProportionRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  return /ratio[-_\s]*(?:proportion|variation)|ratio,\s*proportion|ratio and proportion|\bratios?\b|\bproportion\b|\bvariation\b/u.test(text);
}

function isTimeWorkRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  return /\btime[-_\s]*(?:and\s*)?work\b|pipes?[-_\s]*(?:and\s*)?cisterns?|work[-_\s]*wages?/u.test(text);
}

function isTimeSpeedDistanceRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  return /\btime[-_\s,]*speed[-_\s]*(?:and\s*)?distance\b|\bspeed[-_\s]*distance\b|\btrains?\b|\bboats?\b|\braces?\b|circular[-_\s]*track|escalator|moving[-_\s]*walkway/u.test(text);
}

function quantV2TopicIdForRegistryPattern(
  pattern?: {
    id?: string;
    topic?: string;
    label?: string;
  } | null,
) {
  if (isProfitLossRegistryPattern(pattern)) {
    return "profit_loss" as const;
  }
  if (isInterestRegistryPattern(pattern)) {
    return "interest" as const;
  }
  if (isRatioProportionRegistryPattern(pattern)) {
    return "ratio_proportion" as const;
  }
  if (isTimeWorkRegistryPattern(pattern)) {
    return "time_work" as const;
  }
  if (isTimeSpeedDistanceRegistryPattern(pattern)) {
    return "time_speed_distance" as const;
  }
  if (String(pattern?.generationDomain ?? "") === "quant-v2-mixture-alligation") {
    return "mixture_alligation" as const;
  }
  if (String(pattern?.generationDomain ?? "") === "quant-v2-number-system") {
    return "number_system" as const;
  }
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.label ?? ""}`.toLowerCase();
  if (/\bpercent(age|ages)?\b/u.test(text)) {
    return "percentage" as const;
  }
  return undefined;
}

function schedulerOptionsForTopic(
  topicId?: CorpusAuditTopicId,
) {
  return topicId
    ? SCHEDULER_PROFILE_OPTIONS.filter(
        (profile) =>
          profile.topicId === topicId,
      )
    : SCHEDULER_PROFILE_OPTIONS;
}

function defaultSchedulerProfileForTopic(
  topicId?: CorpusAuditTopicId,
) {
  return (
    schedulerOptionsForTopic(topicId)[0]?.id ??
    "balanced_mock"
  );
}

function corpusAuditTopicLabel(
  topicId?: string,
) {
  if (topicId === "profit_loss") {
    return "Profit, Loss & Discount";
  }
  if (topicId === "interest") {
    return "Interest / SI & CI";
  }
  if (topicId === "ratio_proportion") {
    return "Ratio, Proportion & Variation";
  }
  if (topicId === "time_work") {
    return "Time & Work / Pipes";
  }
  if (topicId === "time_speed_distance") {
    return "Time, Speed & Distance";
  }
  if (topicId === "mixture_alligation") {
    return "Mixture & Alligation";
  }
  if (topicId === "number_system") {
    return "Number System";
  }
  return "Percentage";
}

function applyCorpusAuditPresetDefaults(
  preset: CorpusAuditPreset,
  setters: {
    setCount: (value: number) => void;
    setTopology: (value: string) => void;
    setSchedulerProfile: (
      value: SchedulerProfileId,
    ) => void;
  },
) {
  setters.setCount(
    preset.defaultCount ?? 1000,
  );
  setters.setTopology(
    preset.defaultTopology ??
      preset.topologyOptions?.[0]?.id ??
      "mixed_percentage",
  );
  setters.setSchedulerProfile(
    (preset.schedulerProfiles?.[0] as SchedulerProfileId | undefined) ??
      "balanced_mock",
  );
}

export default function AdminGeneratorPage() {
  const [patternId, setPatternId] =
    useState("");
  const [
    generationMode,
    setGenerationMode,
  ] = useState<"registry">(
    "registry",
  );
  const [
    patternManagerOpen,
    setPatternManagerOpen,
  ] = useState(false);
  const [
    patternManagerPage,
    setPatternManagerPage,
  ] = useState(0);

  const [count, setCount] =
    useState(5);
  const [
    useScheduler,
    setUseScheduler,
  ] = useState(false);
  const [
    schedulerProfile,
    setSchedulerProfile,
  ] = useState<SchedulerProfileId>(
    "balanced_mock",
  );
  const [
    schedulerSummary,
    setSchedulerSummary,
  ] = useState<SchedulerSummary | null>(
    null,
  );
  const [
    corpusQuality,
    setCorpusQuality,
  ] = useState<CorpusQualitySummary | null>(
    null,
  );
  const [
    corpusAuditOpen,
    setCorpusAuditOpen,
  ] = useState(false);
  const [
    corpusAuditPresets,
    setCorpusAuditPresets,
  ] = useState<CorpusAuditPreset[]>([]);
  const [
    corpusAuditProfiles,
    setCorpusAuditProfiles,
  ] = useState<CorpusAuditExportProfile[]>([]);
  const [
    corpusAuditExportProfile,
    setCorpusAuditExportProfile,
  ] = useState("audit_light");
  const [
    corpusAuditPresetId,
    setCorpusAuditPresetId,
  ] = useState("ssc_percentage_audit");
  const [
    corpusAuditTopicId,
    setCorpusAuditTopicId,
  ] = useState<CorpusAuditTopicId>(
    "percentage",
  );
  const [
    corpusAuditCount,
    setCorpusAuditCount,
  ] = useState(1000);
  const [
    corpusAuditIncludeSvg,
    setCorpusAuditIncludeSvg,
  ] = useState(true);
  const [
    corpusAuditIncludeMultilingualExplanations,
    setCorpusAuditIncludeMultilingualExplanations,
  ] = useState(false);
  const [
    corpusAuditUseScheduler,
    setCorpusAuditUseScheduler,
  ] = useState(false);
  const [
    corpusAuditSchedulerProfile,
    setCorpusAuditSchedulerProfile,
  ] = useState<SchedulerProfileId>(
    "balanced_mock",
  );
  const [
    corpusAuditLanguages,
    setCorpusAuditLanguages,
  ] = useState<
    Array<"en" | "hi" | "pa">
  >(["en", "hi", "pa"]);
  const [
    corpusAuditTopology,
    setCorpusAuditTopology,
  ] = useState("mixed_percentage");
  const [
    corpusAuditRealismProfile,
    setCorpusAuditRealismProfile,
  ] = useState<"balanced" | "pyq" | "stress">(
    "balanced",
  );
  const [
    corpusAuditCompactness,
    setCorpusAuditCompactness,
  ] = useState<
    "compact" | "balanced" | "ultra_compact"
  >("compact");
  const [
    corpusAuditDifficultyMix,
    setCorpusAuditDifficultyMix,
  ] = useState<
    "balanced" | "easy" | "medium" | "hard"
  >("balanced");
  const [
    corpusAuditFormats,
    setCorpusAuditFormats,
  ] = useState<
    Array<"json" | "txt" | "summary" | "pdf">
  >(["json", "txt", "summary"]);
  const [
    corpusAuditJob,
    setCorpusAuditJob,
  ] = useState<CorpusAuditJob | null>(null);
  const [
    corpusAuditSamples,
    setCorpusAuditSamples,
  ] = useState<CorpusAuditSample[]>([]);
  const [
    corpusAuditLoading,
    setCorpusAuditLoading,
  ] = useState(false);

  const [generated, setGenerated] =
    useState<GeneratedQuestion[]>([]);
  const [
    exportFormat,
    setExportFormat,
  ] = useState<QuestionExportFormat>("pdf");
  const [
    exportContent,
    setExportContent,
  ] = useState<QuestionExportContent>(
    "explanations",
  );
  const [
    exportIncludeAnswers,
    setExportIncludeAnswers,
  ] = useState(true);
  const [
    exportIncludeExplanations,
    setExportIncludeExplanations,
  ] = useState(true);
  const [
    exportIncludeReasoning,
    setExportIncludeReasoning,
  ] = useState(false);
  const [
    exportIncludeTraceability,
    setExportIncludeTraceability,
  ] = useState(false);
  const [
    exportCleanExport,
    setExportCleanExport,
  ] = useState(false);
  const [
    exportStatus,
    setExportStatus,
  ] = useState<string | null>(null);
  const [
    filingDrawerOpen,
    setFilingDrawerOpen,
  ] = useState(false);
  const [
    filingConfig,
    setFilingConfig,
  ] = useState<FilingConfig>(
    DEFAULT_FILING_CONFIG,
  );
  const [
    filingLoading,
    setFilingLoading,
  ] = useState(false);
  const [
    filingToast,
    setFilingToast,
  ] = useState<string | null>(null);
  const [
    activeInlineEditKey,
    setActiveInlineEditKey,
  ] = useState<string | null>(null);
  const [qaReviews, setQaReviews] =
    useState<
      Record<string, QAReviewRecord>
    >({});
  const [qaNotes, setQaNotes] =
    useState<Record<string, string>>(
      {},
    );
  const [qaIssueTags, setQaIssueTags] =
    useState<
      Record<string, QAIssueTag[]>
    >({});
  const [qaFilters, setQaFilters] =
    useState<QAFilterState>(
      QA_FILTER_DEFAULTS,
    );
  const [qaLoading, setQaLoading] =
    useState(false);
  const [qaAnalytics, setQaAnalytics] =
    useState<QAAnalyticsSummary | null>(
      null,
    );
  const [
    selectedWorkspaceFingerprint,
    setSelectedWorkspaceFingerprint,
  ] = useState<string | null>(
    null,
  );
  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);
  const [
    workspaceEditMode,
    setWorkspaceEditMode,
  ] = useState(false);
  const [
    selectedBatchFingerprints,
    setSelectedBatchFingerprints,
  ] = useState<string[]>([]);
  const [
    filingTargetFingerprints,
    setFilingTargetFingerprints,
  ] = useState<string[]>([]);
  const [
    lifecycleStates,
    setLifecycleStates,
  ] = useState<
    Record<string, QuestionLifecycleState>
  >({});
  const [
    reviewWorkflowMetadata,
    setReviewWorkflowMetadata,
  ] = useState<
    Record<
      string,
      {
        approvedAt?: string;
        approvedBy?: string;
        pushedAt?: string;
        pushedBy?: string;
      }
    >
  >({});
  const [
    activeModerationLanguage,
    setActiveModerationLanguage,
  ] = useState<RegistryLanguage>(
    "en",
  );
  const [
    pendingRefinementFingerprint,
    setPendingRefinementFingerprint,
  ] = useState<string | null>(
    null,
  );
  const [
    refinementLoading,
    setRefinementLoading,
  ] = useState(false);

  const [patterns, setPatterns] =
    useState<any[]>([]);
  const [
    masterSections,
    setMasterSections,
  ] = useState<
    MasterSectionOption[]
  >([]);
  const [
    masterTopics,
    setMasterTopics,
  ] = useState<MasterTopicOption[]>(
    [],
  );
  const [
    questionPatterns,
    setQuestionPatterns,
  ] = useState<any[]>([]);
  const [
    registryPatternId,
    setRegistryPatternId,
  ] = useState("");
  const [
    registryDomain,
    setRegistryDomain,
  ] = useState("all");
  const [registryTopic, setRegistryTopic] = useState("all");
  const [registrySubtopic, setRegistrySubtopic] = useState("all");
  const [
    registryDifficulty,
    setRegistryDifficulty,
  ] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [
    registryExamStyle,
    setRegistryExamStyle,
  ] = useState("ssc");
  const [
    registryLanguages,
    setRegistryLanguages,
  ] = useState<RegistryLanguage[]>([
    "en",
  ]);
  const [
    enableNameClash,
    setEnableNameClash,
  ] = useState(false);
  const [
    seatingGenerationQuality,
    setSeatingGenerationQuality,
  ] = useState<
    "draft" | "standard" | "production"
  >("standard");
  const [
    extractionSourceName,
    setExtractionSourceName,
  ] = useState("Lucent GK");
  const [
    extractionSourceChapter,
    setExtractionSourceChapter,
  ] = useState("");
  const [
    extractionSourcePage,
    setExtractionSourcePage,
  ] = useState("");
  const [
    extractionSourceUrl,
    setExtractionSourceUrl,
  ] = useState("");
  const [
    extractionStartPage,
    setExtractionStartPage,
  ] = useState("");
  const [
    extractionEndPage,
    setExtractionEndPage,
  ] = useState("");
  const [
    extractionQueueLoading,
    setExtractionQueueLoading,
  ] = useState(false);
  const [
    sourceIngestionLoading,
    setSourceIngestionLoading,
  ] = useState(false);
  const [
    sourceIngestionMetadata,
    setSourceIngestionMetadata,
  ] =
    useState<KnowledgeSourceIngestionMetadata | null>(
      null,
    );
  const [
    extractionSourceText,
    setExtractionSourceText,
  ] = useState("");
  const [
    extractionCandidates,
    setExtractionCandidates,
  ] = useState<
    KnowledgeExtractionCandidate[]
  >([]);
  const [
    extractionLoading,
    setExtractionLoading,
  ] = useState(false);
  const [
    editingPatternId,
    setEditingPatternId,
  ] = useState<string | null>(
    null,
  );

  const [loading, setLoading] =
    useState(false);
  const [
    difficultySettings,
    setDifficultySettings,
  ] = useState<DifficultySettings>({
    examProfile: "custom",
    setProfile: "progressive",
    enableTargetDifficulty: false,
    targetDifficulty: 6.5,
    difficultyTolerance: 1,
    enableDistribution: false,
    difficultyDistribution: {
      easy: 20,
      medium: 60,
      hard: 20,
    },
    enableTargetAverageDifficulty:
      false,
    targetAverageDifficulty: 6.2,
  });
  const [newPattern, setNewPattern] =
    useState({
      id: "",

      name: "",

      section: "quant",

      topic: "",

      subtopic: "",

      difficulty: "Easy",


      formula: "",
      type: "formula",
      visualType: "table",


      explanationTemplate: "",

      template: "",

      diPattern: `{
  "title": "DI Table",
  "columns": ["Category", "Value"],
  "rowCount": 5,
  "categories": ["A", "B", "C", "D", "E"],
      "valueRanges": {
    "Value": {
      "min": 100,
      "max": 500
    }
  }
}`,

      variables: `{
  "a": { "min": 1, "max": 10 },
  "b": { "min": 1, "max": 10 }
}`,

      offsets: "-1,1,2",
    });

  useEffect(() => {
    async function loadPatterns() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

        const data =
          await res.json();

        setPatterns(
          data.patterns || [],
        );

        const registryRes =
          await fetch(
            `${API_BASE_URL}/api/generator/question-patterns`,
          );
        const registryData =
          await registryRes.json();
        const registryPatterns =
          mergeRequiredRegistryPatterns(
            registryData.patterns || [],
          );

        setQuestionPatterns(
          registryPatterns,
        );
        const firstRegistryPattern =
          (
            registryPatterns.find(
              (pattern: any) =>
                pattern.enabled !== false,
            ) ?? registryPatterns[0]
          );
        setRegistryDomain(
          firstRegistryPattern?.domain ?? "all",
        );
        setRegistryTopic(
          firstRegistryPattern?.topic ?? "all",
        );
        setRegistrySubtopic(
          firstRegistryPattern?.subtopic ?? "all",
        );
        setRegistryPatternId(
          firstRegistryPattern?.id ?? "",
        );

        const [
          sectionsRes,
          topicsRes,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/sections`,
          ),
          fetch(
            `${API_BASE_URL}/api/topics`,
          ),
        ]);
        if (sectionsRes.ok) {
          const sectionsData =
            await sectionsRes.json();
          setMasterSections(
            Array.isArray(sectionsData)
              ? sectionsData
              : [],
          );
        }
        if (topicsRes.ok) {
          const topicsData =
            await topicsRes.json();
          setMasterTopics(
            Array.isArray(topicsData)
              ? topicsData
              : [],
          );
        }
        const auditPresetRes =
          await fetch(
            `${API_BASE_URL}/api/generator/corpus-audit/presets`,
          );
        if (auditPresetRes.ok) {
          const auditPresetData =
            await auditPresetRes.json();
          const presets = Array.isArray(
            auditPresetData.presets,
          )
            ? (auditPresetData.presets as CorpusAuditPreset[])
            : [];
          setCorpusAuditPresets(presets);
          if (presets[0]?.id) {
            setCorpusAuditPresetId(
              presets[0].id,
            );
            setCorpusAuditTopicId(
              (presets[0].topicId as CorpusAuditTopicId | undefined) ??
                "percentage",
            );
            applyCorpusAuditPresetDefaults(
              presets[0],
              {
                setCount:
                  setCorpusAuditCount,
                setTopology:
                  setCorpusAuditTopology,
                setSchedulerProfile:
                  setCorpusAuditSchedulerProfile,
              },
            );
          }
        }
        const auditProfileRes =
          await fetch(
            `${API_BASE_URL}/api/generator/corpus-audit/profiles`,
          );
        if (auditProfileRes.ok) {
          const auditProfileData =
            await auditProfileRes.json();
          const profiles = Array.isArray(
            auditProfileData.profiles,
          )
            ? (auditProfileData.profiles as CorpusAuditExportProfile[])
            : [];
          setCorpusAuditProfiles(profiles);
          if (profiles[0]?.id) {
            setCorpusAuditExportProfile(
              profiles[0].id,
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadPatterns();
  }, []);

  useEffect(() => {
    const preset =
      corpusAuditPresets.find(
        (item) =>
          item.id ===
          corpusAuditPresetId,
      );
    const options =
      preset?.topologyOptions ?? [];

    if (
      options.length > 0 &&
      !options.some(
        (option) =>
          option.id ===
          corpusAuditTopology,
      )
    ) {
      setCorpusAuditTopology(
        preset?.defaultTopology ??
          options[0]?.id ??
          "mixed_percentage",
      );
    }
  }, [
    corpusAuditPresetId,
    corpusAuditPresets,
    corpusAuditTopology,
  ]);

  useEffect(() => {
    const currentPreset =
      corpusAuditPresets.find(
        (preset) =>
          preset.id ===
          corpusAuditPresetId,
      );

    if (
      currentPreset?.topicId ===
      corpusAuditTopicId
    ) {
      return;
    }

    const nextPreset =
      corpusAuditPresets.find(
        (preset) =>
          preset.topicId ===
          corpusAuditTopicId,
      );

    if (!nextPreset) {
      return;
    }

    setCorpusAuditPresetId(
      nextPreset.id,
    );
    applyCorpusAuditPresetDefaults(
      nextPreset,
      {
        setCount:
          setCorpusAuditCount,
        setTopology:
          setCorpusAuditTopology,
        setSchedulerProfile:
          setCorpusAuditSchedulerProfile,
      },
    );
  }, [
    corpusAuditPresetId,
    corpusAuditPresets,
    corpusAuditTopicId,
  ]);

  useEffect(() => {
    async function loadQAReviews() {
      try {
        setQaLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/generator/qa/reviews`,
        );
        const analyticsRes =
          await fetch(
            `${API_BASE_URL}/api/generator/qa/analytics`,
          );
        const data =
          await res.json();
        const analyticsData =
          await analyticsRes.json();
        const reviews = Array.isArray(
          data.reviews,
        )
          ? (data.reviews as QAReviewRecord[])
          : [];
        const reviewMap: Record<
          string,
          QAReviewRecord
        > = {};
        const noteMap: Record<
          string,
          string
        > = {};
        const issueTagMap: Record<
          string,
          QAIssueTag[]
        > = {};

        reviews.forEach((review) => {
          reviewMap[
            review.fingerprint
          ] = review;
          noteMap[
            review.fingerprint
          ] =
            review.reviewerNotes ??
            "";
          issueTagMap[
            review.fingerprint
          ] =
            review.issueTags ?? [];
        });

        setQaReviews(reviewMap);
        setQaNotes(noteMap);
        setQaIssueTags(
          issueTagMap,
        );
        setQaAnalytics(
          analyticsData.analytics ??
            null,
        );
      } catch (error) {
        console.error(error);
      } finally {
        setQaLoading(false);
      }
    }

    loadQAReviews();
  }, []);

  useEffect(() => {
    if (
      !corpusAuditJob ||
      ![
        "queued",
        "running",
      ].includes(corpusAuditJob.status)
    ) {
      return;
    }

    const timer = window.setInterval(
      async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/generator/corpus-audit/exports/${corpusAuditJob.id}`,
          );
          if (!res.ok) return;
          const data = await res.json();
          if (data.job) {
            setCorpusAuditJob(
              data.job as CorpusAuditJob,
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
      2000,
    );

    return () =>
      window.clearInterval(timer);
  }, [corpusAuditJob]);

  useEffect(() => {
    if (
      corpusAuditJob?.status ===
        "completed" &&
      corpusAuditJob.files?.preview &&
      corpusAuditSamples.length === 0
    ) {
      void loadCorpusAuditSamples(
        corpusAuditJob.id,
      );
    }
  }, [corpusAuditJob, corpusAuditSamples.length]);

  async function loadExtractionQueue() {
    try {
      setExtractionQueueLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/knowledge/extraction-candidates`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Failed to load extraction candidates.",
        );
      }

      const candidates =
        Array.isArray(
          data.candidates,
        )
          ? (data.candidates as KnowledgeExtractionCandidate[])
          : [];
      setExtractionCandidates(
        candidates,
      );
      const staged =
        candidates
          .filter(
            (candidate) =>
              candidate.status !==
              "rejected",
          )
          .map(
            extractionCandidateToQuestionNative,
          );

      setGenerated((current) => {
        const existingIds =
          new Set(
            current
              .map(
                getExtractionCandidateId,
              )
              .filter(Boolean),
          );
        const fresh = staged.filter(
          (question) => {
            const candidateId =
              getExtractionCandidateId(
                question,
              );
            return (
              candidateId &&
              !existingIds.has(
                candidateId,
              )
            );
          },
        );

        return fresh.length
          ? [...fresh, ...current]
          : current;
      });
    } catch (error) {
      console.error(error);
      setFilingToast(
        error instanceof Error
          ? error.message
          : "Failed to load extraction queue.",
      );
    } finally {
      setExtractionQueueLoading(false);
    }
  }

  useEffect(() => {
    loadExtractionQueue();
  }, []);
  async function savePattern() {
    try {
      const res = await fetch(
        editingPatternId
          ? `${API_BASE_URL}/api/generator/patterns/${editingPatternId}`
          : `${API_BASE_URL}/api/generator/patterns`,
        {
          method:
            editingPatternId
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: newPattern.id,

            name: newPattern.name,

            section: newPattern.section,

            topic: newPattern.topic,

            subtopic: newPattern.subtopic,
            type: newPattern.type,



            difficulty:
              newPattern.difficulty,

            formula:
              newPattern.formula,

            explanationTemplate:
              newPattern.explanationTemplate,

            diPattern:
              newPattern.type === "di"
                ? {
                  ...JSON.parse(
                    newPattern.diPattern,
                  ),
                  visualType:
                    newPattern.visualType,
                }
                : undefined,

            templateVariants: [
              newPattern.template,
            ],

            variables: JSON.parse(
              newPattern.variables,
            ),

            distractorStrategy: {
              type:
                "numeric_offsets",

              offsets:
                newPattern.offsets
                  .split(",")
                  .map((x) =>
                    Number(x.trim()),
                  ),
            },
          }),
        },
      );

      const data = await res.json();

      console.log(data);

      alert(
        "Pattern created",
      );

      const patternsRes =
        await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

      const patternsData =
        await patternsRes.json();

      setPatterns(
        patternsData.patterns ||
        [],
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create pattern",
      );
    }
  }
  function isDuplicateQuestion(
    currentIndex: number,
  ) {
    const current =
      generated[
        currentIndex
      ]?.text
        ?.toLowerCase()
        ?.replace(/\s+/g, " ")
        ?.trim();

    return generated.some(
      (q, idx) => {
        if (
          idx === currentIndex
        ) {
          return false;
        }

        const compare =
          q?.text
            ?.toLowerCase()
            ?.replace(
              /\s+/g,
              " ",
            )
            ?.trim();

        return (
          current === compare
        );
      },
    );
  }

  async function persistQAReview(
    item: ReviewableGeneratedItem,
    action: QAReviewAction,
    status: QAReviewStatus,
    overrides?: {
      bookmarked?: boolean;
    },
  ) {
    try {
      setQaLoading(true);
      const reviewerNotes =
        qaNotes[item.fingerprint] ??
        "";
      const issueTags =
        qaIssueTags[
          item.fingerprint
        ] ??
        item.review?.issueTags ??
        [];
      const payload = {
        fingerprint:
          item.fingerprint,
        status,
        action,
        topic: item.topic,
        generationDomain:
          item.generationDomain,
        motif: item.motif,
        archetype:
          item.archetype,
        arrangementType:
          item.arrangementType ===
          "n/a"
            ? undefined
            : item.arrangementType,
        reviewerNotes,
        validationStatus:
          item.validationStatus,
        issueTags,
        seed: item.generationSeed,
        topologyType:
          item.topologyType,
        inferenceDepth:
          item.inferenceDepth ??
          undefined,
        clueCount:
          item.clueCount ??
          undefined,
        redundancyScore:
          item.redundancyScore ??
          undefined,
        realismScore:
          item.realismScore ??
          undefined,
        structuralDiversityScore:
          getQuestionStructuralDiversityScore(
            item.question,
          ) ?? undefined,
        difficultyConfidence:
          item.difficultyConfidence ??
          undefined,
        generationLatencyMs:
          getQuestionGenerationLatency(
            item.question,
          ) ?? undefined,
        uniquenessStatus:
          item.uniquenessStatus,
        bookmarked:
          overrides?.bookmarked ??
          item.review
            ?.bookmarked ??
          false,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/generator/qa/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload,
          ),
        },
      );
      const data =
        await res.json();

      if (data.review) {
        setQaReviews((prev) => ({
          ...prev,
          [data.review.fingerprint]:
            data.review,
        }));
        setQaIssueTags((prev) => ({
          ...prev,
          [data.review.fingerprint]:
            data.review.issueTags ??
            [],
        }));
        const analyticsRes =
          await fetch(
            `${API_BASE_URL}/api/generator/qa/analytics`,
          );
        const analyticsData =
          await analyticsRes.json();
        setQaAnalytics(
          analyticsData.analytics ??
            null,
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save QA review",
      );
    } finally {
      setQaLoading(false);
    }
  }

  function toggleQAIssueTag(
    fingerprint: string,
    tag: QAIssueTag,
  ) {
    setQaIssueTags((prev) => {
      const current =
        prev[fingerprint] ?? [];
      const next =
        current.includes(tag)
          ? current.filter(
            (entry) =>
              entry !== tag,
          )
          : [
            ...current,
            tag,
          ];

      return {
        ...prev,
        [fingerprint]: next,
      };
    });
  }

  async function toggleQABookmark(
    item: ReviewableGeneratedItem,
  ) {
    await persistQAReview(
      item,
      item.review?.action ??
        "weak-clues",
      item.review?.status ??
        "flagged",
      {
        bookmarked:
          !item.review
            ?.bookmarked,
      },
    );
  }

  function updateGeneratedQuestionAt(
    index: number,
    updater: (
      current: FormulaQuestion,
    ) => FormulaQuestion,
  ) {
    let nextFingerprint:
      | string
      | null = null;

    setGenerated((prev) =>
      prev.map((entry, entryIndex) => {
        if (
          entryIndex !== index ||
          isDISet(entry)
        ) {
          return entry;
        }

        const updated =
          updater(entry);
        nextFingerprint =
          getQuestionFingerprint(
            updated,
          );
        return updated;
      }),
    );

    if (nextFingerprint) {
      setPendingRefinementFingerprint(
        nextFingerprint,
      );
      setSelectedWorkspaceFingerprint(
        nextFingerprint,
      );
    }
  }

  async function refineQuestionAt(
    index: number,
  ) {
    const target =
      generated[index];

    if (!target) {
      return;
    }

    try {
      setRefinementLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/generator/refine`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            patternId:
              getPrimaryQuestion(
                target,
              )?.debugMetadata
                ?.selectedPattern ??
              patternId,
            question: target,
          }),
        },
      );

      if (!res.ok) {
        throw new Error(
          `Refinement failed with status ${res.status}`,
        );
      }

      const data = await res.json();

      if (data.question) {
        setGenerated((prev) => {
          const updated = [
            ...prev,
          ];

          updated[index] =
            data.question;

          return updated;
        });
        setSelectedWorkspaceFingerprint(
          getQuestionFingerprint(
            data.question,
          ),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefinementLoading(false);
    }
  }

  async function bulkPersistQAReviews(
    items: ReviewableGeneratedItem[],
    action: QAReviewAction,
    status: QAReviewStatus,
  ) {
    if (!items.length) {
      return;
    }

    try {
      setQaLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/generator/qa/reviews/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reviews: items.map(
              (item) => ({
                fingerprint:
                  item.fingerprint,
                status,
                action,
                topic: item.topic,
                generationDomain:
                  item.generationDomain,
                motif: item.motif,
                archetype:
                  item.archetype,
                arrangementType:
                  item.arrangementType ===
                  "n/a"
                    ? undefined
                    : item.arrangementType,
                reviewerNotes:
                  qaNotes[
                    item.fingerprint
                  ] ?? "",
                validationStatus:
                  item.validationStatus,
                issueTags:
                  qaIssueTags[
                    item.fingerprint
                  ] ??
                  item.review
                    ?.issueTags ??
                  [],
                seed:
                  item.generationSeed,
                topologyType:
                  item.topologyType,
                inferenceDepth:
                  item.inferenceDepth ??
                  undefined,
                clueCount:
                  item.clueCount ??
                  undefined,
                redundancyScore:
                  item.redundancyScore ??
                  undefined,
                realismScore:
                  item.realismScore ??
                  undefined,
                structuralDiversityScore:
                  getQuestionStructuralDiversityScore(
                    item.question,
                  ) ?? undefined,
                difficultyConfidence:
                  item.difficultyConfidence ??
                  undefined,
                generationLatencyMs:
                  getQuestionGenerationLatency(
                    item.question,
                  ) ?? undefined,
                uniquenessStatus:
                  item.uniquenessStatus,
                bookmarked:
                  item.review
                    ?.bookmarked ??
                  false,
              }),
            ),
          }),
        },
      );
      const data =
        await res.json();
      const reviews = Array.isArray(
        data.reviews,
      )
        ? (data.reviews as QAReviewRecord[])
        : [];

      if (reviews.length) {
        setQaReviews((prev) => {
          const next = {
            ...prev,
          };

          reviews.forEach((review) => {
            next[
              review.fingerprint
            ] = review;
          });

          return next;
        });
        setQaIssueTags((prev) => {
          const next = {
            ...prev,
          };

          reviews.forEach((review) => {
            next[
              review.fingerprint
            ] =
              review.issueTags ?? [];
          });

          return next;
        });
        const analyticsRes =
          await fetch(
            `${API_BASE_URL}/api/generator/qa/analytics`,
          );
        const analyticsData =
          await analyticsRes.json();
        setQaAnalytics(
          analyticsData.analytics ??
            null,
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save bulk QA reviews",
      );
    } finally {
      setQaLoading(false);
    }
  }

  function markLifecycle(
    fingerprints: string[],
    state: QuestionLifecycleState,
  ) {
    if (!fingerprints.length) {
      return;
    }

    setLifecycleStates((prev) => {
      const next = {
        ...prev,
      };

      fingerprints.forEach(
        (fingerprint) => {
          next[fingerprint] =
            state;
        },
      );

      return next;
    });
  }

  function toggleBatchSelection(
    fingerprint: string,
  ) {
    setSelectedBatchFingerprints(
      (prev) =>
        prev.includes(fingerprint)
          ? prev.filter(
              (entry) =>
                entry !==
                fingerprint,
            )
          : [
              ...prev,
              fingerprint,
            ],
    );
  }

  function setReviewFocus(
    item: ReviewableGeneratedItem,
  ) {
    const nextIndex = visibleItems.findIndex(
      (entry) =>
        entry.fingerprint ===
        item.fingerprint,
    );
    focusQuestionAtIndex(
      nextIndex >= 0 ? nextIndex : 0,
    );
  }

  function focusQuestionAtIndex(
    requestedIndex: number,
  ) {
    if (!visibleItems.length) {
      setCurrentQuestionIndex(0);
      setSelectedWorkspaceFingerprint(
        null,
      );
      setWorkspaceEditMode(false);
      return;
    }

    const nextIndex = Math.min(
      Math.max(0, requestedIndex),
      visibleItems.length - 1,
    );
    const nextItem =
      visibleItems[nextIndex] ?? null;

    setCurrentQuestionIndex(nextIndex);
    setSelectedWorkspaceFingerprint(
      nextItem?.fingerprint ?? null,
    );
    setWorkspaceEditMode(false);
  }

  async function approveModerationItems(
    items: ReviewableGeneratedItem[],
  ) {
    await bulkPersistQAReviews(
      items,
      "approve",
      "approved",
    );
    const extractionItems =
      items.filter((item) =>
        isKnowledgeExtractionQuestion(
          item.question,
        ),
      );
    if (extractionItems.length) {
      await Promise.all(
        extractionItems.map((item) =>
          reviewExtractionCandidate(
            item.question,
            "approved",
            "Approved from Question Studio moderation.",
          ),
        ),
      );
    }
    markLifecycle(
      items.map(
        (item) =>
          item.fingerprint,
      ),
      "approved",
    );
    const approvedAt =
      new Date().toISOString();
    setReviewWorkflowMetadata(
      (prev) => {
        const next = {
          ...prev,
        };

        items.forEach((item) => {
          next[item.fingerprint] = {
            ...next[item.fingerprint],
            approvedAt,
            approvedBy: "admin",
          };
        });

        return next;
      },
    );
    setSelectedBatchFingerprints(
      [],
    );
  }

  async function rejectModerationItems(
    items: ReviewableGeneratedItem[],
  ) {
    await bulkPersistQAReviews(
      items,
      "reject",
      "rejected",
    );
    const extractionItems =
      items.filter((item) =>
        isKnowledgeExtractionQuestion(
          item.question,
        ),
      );
    if (extractionItems.length) {
      await Promise.all(
        extractionItems.map((item) =>
          reviewExtractionCandidate(
            item.question,
            "rejected",
            "Rejected from Question Studio moderation.",
          ),
        ),
      );
    }
    markLifecycle(
      items.map(
        (item) =>
          item.fingerprint,
      ),
      "rejected",
    );
    setSelectedBatchFingerprints(
      [],
    );
  }

  async function deletePattern(
    id: string,
  ) {
    try {
      await fetch(
        `${API_BASE_URL}/api/generator/patterns/${id}`,
        {
          method: "DELETE",
        },
      );

      setPatterns(
        patterns.filter(
          (p) => p.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete pattern",
      );
    }
  }

  function toggleRegistryLanguage(
    language: RegistryLanguage,
  ) {
    if (language === "en") return;
    const supportedLanguages =
      getSupportedRegistryLanguages(
        selectedRegistryPattern,
      );
    if (
      !supportedLanguages.includes(
        language,
      )
    ) {
      return;
    }

    setRegistryLanguages((current) => {
      const next = current.includes(
        language,
      )
        ? current.filter(
          (item) => item !== language,
        )
        : [...current, language];

      return REGISTRY_LANGUAGE_OPTIONS.map(
        (option) => option.id,
      ).filter(
        (option) =>
          option === "en" ||
          next.includes(option),
      );
    });
  }

  async function startCorpusAuditExport() {
    try {
      setCorpusAuditLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/generator/corpus-audit/exports`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            presetId:
              corpusAuditPresetId,
            exportProfile:
              corpusAuditExportProfile,
            count: corpusAuditCount,
            includeSvg:
              corpusAuditIncludeSvg,
            includeMultilingualExplanations:
              corpusAuditIncludeMultilingualExplanations,
            languages:
              corpusAuditLanguages,
            topologySelection:
              corpusAuditTopology,
            realismProfile:
              corpusAuditRealismProfile,
            compactnessProfile:
              corpusAuditCompactness,
            difficultyMix:
              corpusAuditDifficultyMix,
            formats:
              corpusAuditFormats,
            useScheduler:
              corpusAuditUseScheduler,
            schedulerProfile:
              corpusAuditSchedulerProfile,
          }),
        },
      );

      if (!res.ok) {
        const text =
          await res.text().catch(
            () => "",
          );
        throw new Error(
          text ||
            `Corpus audit export failed with status ${res.status}`,
        );
      }

      const data = await res.json();
      setCorpusAuditSamples([]);
      setCorpusAuditJob(
        data.job as CorpusAuditJob,
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start corpus audit export",
      );
    } finally {
      setCorpusAuditLoading(false);
    }
  }

  async function loadCorpusAuditSamples(
    jobId: string,
  ) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/generator/corpus-audit/exports/${jobId}/samples?limit=6`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setCorpusAuditSamples(
        Array.isArray(data.samples)
          ? (data.samples as CorpusAuditSample[])
          : [],
      );
    } catch (error) {
      console.error(error);
    }
  }

  function estimateCorpusAuditSizeMb() {
    const profile =
      corpusAuditProfiles.find(
        (item) =>
          item.id ===
          corpusAuditExportProfile,
      );
    const perQuestionKb =
      6 +
      (corpusAuditIncludeMultilingualExplanations ||
      profile?.includeMultilingualExplanations
        ? 8
        : 0) +
      (corpusAuditExportProfile ===
      "topology_audit"
        ? 20
        : 0) +
      (corpusAuditIncludeSvg ? 10 : 0);

    return (
      Math.round(
        ((corpusAuditCount * perQuestionKb) /
          1024) *
          10,
      ) / 10
    );
  }

  async function generate() {
    const selectedRegistryPattern =
      questionPatterns.find(
        (pattern) =>
          pattern.id ===
          registryPatternId,
      );
    const useRegistryPattern =
      generationMode ===
        "registry" &&
      Boolean(
        selectedRegistryPattern &&
          selectedRegistryPattern.enabled !==
            false,
      );
    const effectiveRegistryLanguages =
      registryLanguages;
    const timeoutMs =
      useRegistryPattern
        ? 90_000
        : getGenerationTimeoutMs(
          patternId,
          patterns,
          count,
        );

    try {
      setLoading(true);

      const difficultyPayload: Record<
        string,
        unknown
      > =
        getDifficultyRequestPayload(
          difficultySettings,
        );
      const requestPayload =
        useRegistryPattern
          ? {
            ...difficultyPayload,
            domain:
              selectedRegistryPattern.domain,
            topic:
              selectedRegistryPattern.topic,
            pattern:
              selectedRegistryPattern.id,
            difficulty:
              registryDifficulty,
            examStyle:
              registryExamStyle,
            languages:
              effectiveRegistryLanguages,
            availableLangs:
              effectiveRegistryLanguages,
            enableNameClash,
            seatingGeneration: {
              quality:
                seatingGenerationQuality,
            },
            count,
          }
          : {
            patternId,
            count,
            languages:
              effectiveRegistryLanguages,
            seatingGeneration: {
              quality:
                seatingGenerationQuality,
            },
            ...difficultyPayload,
          };

      if (useRegistryPattern) {
        delete (
          requestPayload as Record<
            string,
            unknown
          >
        )[
          "examProfile"
        ];
      }

      const res =
        await fetchJsonWithTimeout(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            requestPayload,
          ),
        },
        timeoutMs,
      );

      if (!res.ok) {
        const errorText =
          await res.text().catch(
            () => "",
          );
        let errorMessage =
          errorText;

        try {
          const parsed =
            JSON.parse(errorText);
          errorMessage =
            parsed.error ??
            parsed.message ??
            errorText;
        } catch {
          // Keep the raw response text when the backend returns non-JSON.
        }

        throw new Error(
          errorMessage
            ? `Generation failed with status ${res.status}: ${errorMessage}`
            : `Generation failed with status ${res.status}`,
        );
      }

      const data = await res.json();

      console.log(data);
      setSchedulerSummary(
        data.schedulerSummary ??
          null,
      );
      setCorpusQuality(
        data.corpusQuality ?? null,
      );

      const nextQuestions = (
        data.questions || []
      ).map((question: GeneratedQuestion) =>
        useRegistryPattern
          ? prepareGeneratedQuestionForLanguages(
              question,
              effectiveRegistryLanguages,
              selectedRegistryPattern.id,
            )
          : prepareGeneratedQuestionForLanguages(
              question,
              effectiveRegistryLanguages,
              patternId,
            ),
      );

      setGenerated(nextQuestions);
      setCurrentQuestionIndex(0);
      setSelectedWorkspaceFingerprint(
        null,
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error &&
          error.name ===
            "AbortError"
          ? `Generation timed out after ${Math.round(
            timeoutMs / 1000,
          )} seconds. The selected pattern may be expensive to solve.`
          : "Generation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function extractKnowledgeFacts() {
    if (!extractionSourceText.trim()) {
      alert(
        "Paste source text before extracting facts.",
      );
      return;
    }

    try {
      setExtractionLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/knowledge/extract`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sourceName:
              extractionSourceName ||
              "Untitled source",
            sourceBook:
              extractionSourceName ||
              "Untitled source",
            sourceChapter:
              extractionSourceChapter ||
              undefined,
            sourcePage:
              extractionSourcePage ||
              undefined,
            sourceUrl:
              extractionSourceUrl ||
              undefined,
            sourceMetadata:
              sourceIngestionMetadata
                ? {
                    sourceType:
                      sourceIngestionMetadata.sourceType,
                    ocrUsed:
                      sourceIngestionMetadata.ocrUsed,
                    pageCount:
                      sourceIngestionMetadata.pageCount,
                    totalPages:
                      sourceIngestionMetadata.totalPages,
                    selectedStartPage:
                      sourceIngestionMetadata.selectedStartPage,
                    selectedEndPage:
                      sourceIngestionMetadata.selectedEndPage,
                  }
                : undefined,
            rawText:
              extractionSourceText,
          }),
        },
      );

      if (!res.ok) {
        const detail =
          await res.text();
        throw new Error(detail);
      }

      const data = await res.json();
      if (data.extractionMetadata) {
        setSourceIngestionMetadata(
          (current) =>
            current
              ? {
                  ...current,
                  warnings:
                    mergeSourceAndExtractionWarnings(
                      current.warnings,
                      data.extractionMetadata
                        .warnings ?? [],
                    ),
                }
              : current,
        );
      }
      const candidates =
        Array.isArray(
          data.candidates,
        )
          ? (data.candidates as KnowledgeExtractionCandidate[])
          : [];
      const staged =
        candidates.map(
          extractionCandidateToQuestionNative,
        );

      setExtractionCandidates(
        candidates,
      );
      setGenerated((current) => [
        ...staged,
        ...current,
      ]);

      if (staged[0]) {
        setSelectedWorkspaceFingerprint(
          getQuestionFingerprint(
            staged[0],
          ),
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Knowledge extraction failed",
      );
    } finally {
      setExtractionLoading(false);
    }
  }

  function clearExtractionWorkspace() {
    setExtractionSourceText("");
    setSourceIngestionMetadata(null);
    setExtractionCandidates([]);
    setExtractionStartPage("");
    setExtractionEndPage("");
    setExtractionSourceChapter("");
    setExtractionSourcePage("");
    setExtractionSourceUrl("");
    setExtractionLoading(false);
    setSourceIngestionLoading(false);
    setExtractionQueueLoading(false);
  }

  async function loadExtractionSourceFile(
    file: File | null,
  ) {
    if (!file) return;

    try {
      setSourceIngestionLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      if (extractionStartPage.trim()) {
        formData.append(
          "startPage",
          extractionStartPage.trim(),
        );
      }
      if (extractionEndPage.trim()) {
        formData.append(
          "endPage",
          extractionEndPage.trim(),
        );
      }

      const res = await fetch(
        `${API_BASE_URL}/api/knowledge/ingest-file`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Source ingestion failed.",
        );
      }

      setExtractionSourceText(
        data.text ?? "",
      );
      setSourceIngestionMetadata(
        data.metadata ?? null,
      );
      setExtractionSourceName(
        (current) =>
          current || file.name,
      );
      setFilingToast(
        data.metadata?.ocrUsed
          ? `Text extracted from ${file.name}. OCR fallback used on ${data.metadata.ocrPages?.length ?? 0} page(s).`
          : `Text extracted from ${file.name}.`,
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Source ingestion failed",
      );
    } finally {
      setSourceIngestionLoading(false);
    }
  }

  async function reviewExtractionCandidate(
    question: GeneratedQuestion,
    status:
      | "approved"
      | "rejected"
      | "needs_review",
    notes?: string,
  ) {
    const candidateId =
      getExtractionCandidateId(
        question,
      );

    if (
      !candidateId ||
      isDISet(question)
    ) {
      return null;
    }

    const proposedFact =
      question.debugMetadata
        ?.factSnapshot;
    const res = await fetch(
      `${API_BASE_URL}/api/knowledge/extraction-candidates/${candidateId}/review`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status,
          notes,
          proposedFact,
        }),
      },
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ??
          "Failed to review extraction candidate.",
      );
    }

    if (data.candidate) {
      const updated =
        data.candidate as KnowledgeExtractionCandidate;
      setExtractionCandidates(
        (current) => {
          const exists =
            current.some(
              (candidate) =>
                candidate.candidateId ===
                updated.candidateId,
            );
          return exists
            ? current.map(
                (candidate) =>
                  candidate.candidateId ===
                  updated.candidateId
                    ? updated
                    : candidate,
              )
            : [updated, ...current];
        },
      );
    }

    return data.candidate as
      | KnowledgeExtractionCandidate
      | undefined;
  }

  async function regenerateQuestion(
    index: number,
  ) {
    const selectedRegistryPattern =
      questionPatterns.find(
        (pattern) =>
          pattern.id ===
          registryPatternId,
      );
    const useRegistryPattern =
      generationMode ===
        "registry" &&
      Boolean(
        selectedRegistryPattern &&
          selectedRegistryPattern.enabled !==
            false,
      );
    const timeoutMs =
      useRegistryPattern
        ? 90_000
        : getGenerationTimeoutMs(
          patternId,
          patterns,
          1,
        );

    try {
      const difficultyPayload: Record<
        string,
        unknown
      > =
        getDifficultyRequestPayload(
          difficultySettings,
        );
      const requestPayload =
        useRegistryPattern
          ? {
            ...difficultyPayload,
            domain:
              selectedRegistryPattern.domain,
            topic:
              selectedRegistryPattern.topic,
            pattern:
              selectedRegistryPattern.id,
            difficulty:
              registryDifficulty,
            examStyle:
              registryExamStyle,
            languages:
              registryLanguages,
            availableLangs:
              registryLanguages,
            enableNameClash,
            seatingGeneration: {
              quality:
                seatingGenerationQuality,
            },
            count: 1,
          }
          : {
            patternId,
            count: 1,
            languages:
              registryLanguages,
            seatingGeneration: {
              quality:
                seatingGenerationQuality,
            },
            ...difficultyPayload,
          };

      if (useRegistryPattern) {
        delete (
          requestPayload as Record<
            string,
            unknown
          >
        )[
          "examProfile"
        ];
      }

      const res =
        await fetchJsonWithTimeout(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            requestPayload,
          ),
        },
        timeoutMs,
      );

      if (!res.ok) {
        throw new Error(
          `Regeneration failed with status ${res.status}`,
        );
      }

      const data = await res.json();

      if (
        data.questions?.length
      ) {
        const updated = [
          ...generated,
        ];

        updated[index] =
          useRegistryPattern
            ? prepareGeneratedQuestionForLanguages(
                data.questions[0],
                registryLanguages,
                selectedRegistryPattern.id,
              )
            : prepareGeneratedQuestionForLanguages(
                data.questions[0],
                registryLanguages,
                patternId,
              );

        setGenerated(updated);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error &&
          error.name ===
            "AbortError"
          ? `Regeneration timed out after ${Math.round(
            timeoutMs / 1000,
          )} seconds. Try a smaller batch or easier pattern.`
          : "Failed to regenerate question",
      );
    }
  }
  function openFilingDrawer(
    scope:
      | "active"
      | "selected"
      | "all-approved" = "active",
  ) {
    const sourceItems =
      scope === "all-approved"
        ? reviewableItems
        : scope === "selected"
          ? selectedBatchItems
          : selectedWorkspaceItem
            ? [selectedWorkspaceItem]
            : [];
    const eligibleItems =
      sourceItems.filter(
        (item) =>
          getReviewWorkflowStatus(
            item,
            lifecycleStates,
          ) === "approved" &&
          getBankWorkflowStatus(
            item,
            lifecycleStates,
          ) !== "pushed",
      );

    if (!eligibleItems.length) {
      alert(
        "Approve at least one non-pushed question before pushing it to the bank.",
      );
      return;
    }

    setFilingTargetFingerprints(
      eligibleItems.map(
        (item) =>
          item.fingerprint,
      ),
    );

    const primary = getPrimaryQuestion(
      eligibleItems[0].question,
    );
    const inferredSubjectLabel =
      (primary?.section ?? "")
        .trim();
    const inferredSection =
      masterSections.find(
        (section) =>
          section.name.toLowerCase() ===
          inferredSubjectLabel.toLowerCase(),
      ) ??
      masterSections.find((section) =>
        inferredSubjectLabel
          .toLowerCase()
          .includes(
            section.name.toLowerCase(),
          ),
      );

    const inferredTopic =
      masterTopics.find(
        (topic) =>
          topic.name.toLowerCase() ===
          (primary?.topic ?? "")
            .trim()
            .toLowerCase(),
      );
    const inferredLegacySubject =
      inferredSubjectLabel
        .toLowerCase()
        .includes("reason")
        ? "Reasoning"
        : (primary?.section ?? "")
            .toLowerCase()
            .includes("english")
          ? "English"
          : (primary?.section ?? "")
              .toLowerCase()
              .includes("punjabi")
            ? "Punjabi"
            : (primary?.section ?? "")
                .toLowerCase()
                .includes("quant")
              ? "Quant"
              : "";
    const fallbackSection =
      masterSections.find(
        (section) =>
          section.name.toLowerCase() ===
          inferredLegacySubject.toLowerCase(),
      );

    setFilingConfig((prev) => ({
      ...prev,
      subjectId:
        prev.subjectId ||
        inferredSection?.id ||
        fallbackSection?.id ||
        "",
      subjectLabel:
        prev.subjectLabel ||
        inferredSection?.name ||
        fallbackSection?.name ||
        inferredSubjectLabel ||
        inferredLegacySubject,
      topicId:
        prev.topicId ||
        inferredTopic?.id ||
        "",
      topicLabel:
        prev.topicLabel ||
        inferredTopic?.name ||
        primary?.topic ||
        "",
    }));
    setFilingDrawerOpen(true);
  }

  async function saveQuestions() {
    const targetItems =
      reviewableItems.filter((item) =>
        filingTargetFingerprints.includes(
          item.fingerprint,
        ),
      );
    const targetQuestions =
      targetItems.map(
        (item) => item.question,
      );
    const filingPayloads =
      buildFilingPayloads(
        targetQuestions,
        filingConfig,
      );

    if (
      !filingConfig.subjectId ||
      !filingConfig.topicId
    ) {
      return;
    }

    if (!filingPayloads.length) {
      alert(
        "Only approved formula/reasoning questions can be filed from this drawer right now.",
      );
      return;
    }

    const unapprovedExtraction =
      targetQuestions.filter((question) => {
        const candidateId =
          getExtractionCandidateId(
            question,
          );
        if (!candidateId) return false;
        const candidate =
          extractionCandidates.find(
            (entry) =>
              entry.candidateId ===
              candidateId,
          );
        return (
          candidate?.status !==
          "approved"
        );
      });

    if (unapprovedExtraction.length) {
      alert(
        "Approve extracted knowledge facts in the moderation queue before pushing them to the question bank.",
      );
      return;
    }

    try {
      setFilingLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/generator/save`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            filingPayloads,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Save failed",
        );
      }

      const taxonomyForToast =
        buildExpandedFilingTaxonomy({
          base: FILING_TAXONOMY,
          patterns: [
            ...questionPatterns,
            ...patterns,
          ],
          reviewableItems,
          masterTopics,
        });
      const topic =
        taxonomyForToast.find(
          (subject) =>
            subject.id ===
            filingConfig.subjectId,
        )?.topics.find(
          (entry) =>
            entry.id ===
            filingConfig.topicId,
        )?.label ??
        filingConfig.topicId;
      const subTopic =
        taxonomyForToast.flatMap(
          (subject) => subject.topics,
        )
          .find(
            (entry) =>
              entry.id ===
              filingConfig.topicId,
          )
          ?.subTopics.find(
            (entry) =>
              entry.id ===
              filingConfig.subTopicId,
          )?.label ??
        filingConfig.subTopicId;

      setFilingDrawerOpen(false);
      markLifecycle(
        filingTargetFingerprints,
        "pushed_to_bank",
      );
      const pushedAt =
        new Date().toISOString();
      setReviewWorkflowMetadata(
        (prev) => {
          const next = {
            ...prev,
          };

          filingTargetFingerprints.forEach(
            (fingerprint) => {
              next[fingerprint] = {
                ...next[fingerprint],
                pushedAt,
                pushedBy: "admin",
              };
            },
          );

          return next;
        },
      );
      setFilingTargetFingerprints([]);
      setFilingConfig(
        DEFAULT_FILING_CONFIG,
      );
      setFilingToast(
        `${filingPayloads.length} approved question(s) successfully filed under ${topic}${subTopic ? ` > ${subTopic}` : ""}.`,
      );
      window.setTimeout(
        () => setFilingToast(null),
        4500,
      );
    } catch (error) {
      console.error(error);

      alert("Save failed");
    } finally {
      setFilingLoading(false);
    }
  }

  const structureCounts =
    generated.reduce(
      (accumulator, question) => {
        const signature =
          getQuestionStructureSignature(
            question,
          );

        if (signature) {
          accumulator[
            signature
          ] =
            (accumulator[
              signature
            ] ?? 0) + 1;
        }

        return accumulator;
      },
      {} as Record<
        string,
        number
      >,
    );

  const arrangementCounts =
    generated.reduce(
      (accumulator, question) => {
        const signature =
          getQuestionArrangementSignature(
            question,
          );

        if (signature) {
          accumulator[
            signature
          ] =
            (accumulator[
              signature
            ] ?? 0) + 1;
        }

        return accumulator;
      },
      {} as Record<
        string,
        number
      >,
    );

  const reasoningCounts =
    generated.reduce(
      (accumulator, question) => {
        const signature =
          getQuestionReasoningSignature(
            question,
          );

        if (signature) {
          accumulator[
            signature
          ] =
            (accumulator[
              signature
            ] ?? 0) + 1;
        }

        return accumulator;
      },
      {} as Record<
        string,
        number
      >,
    );

  const reviewableItems: ReviewableGeneratedItem[] =
    generated.map(
      (question, index) => {
        const baseFingerprint =
          getQuestionFingerprint(
            question,
          );
        const fingerprint =
          `${baseFingerprint}-${index}`;
        const structureSignature =
          getQuestionStructureSignature(
            question,
          );
        const arrangementSignature =
          getQuestionArrangementSignature(
            question,
          );
        const reasoningSignature =
          getQuestionReasoningSignature(
            question,
          );

        return {
          question,
          index,
          fingerprint,
          topic:
            getQuestionTopic(
              question,
            ),
          difficulty:
            getQuestionDifficultyLabel(
              question,
            ),
          arrangementType:
            getQuestionArrangementType(
              question,
            ),
          generationDomain:
            getQuestionDomain(
              question,
            ),
          motif:
            getQuestionMotif(
              question,
            ),
          archetype:
            getQuestionArchetype(
              question,
            ),
          topologyType:
            getQuestionTopologyType(
              question,
            ),
          inferenceDepth:
            getQuestionInferenceDepth(
              question,
            ),
          clueCount:
            getQuestionClueCount(
              question,
            ),
          redundancyScore:
            getQuestionRedundancyScore(
              question,
            ),
          uniquenessStatus:
            getQuestionUniquenessStatus(
              question,
            ),
          generationSeed:
            getQuestionGenerationSeed(
              question,
            ),
          validationStatus:
            getQuestionValidationStatus(
              question,
              !isDISet(
                question,
              ) &&
                isDuplicateQuestion(
                  index,
                ),
            ),
          repetitionFlags:
            getQuestionRepetitionFlags(
              question,
              structureCounts[
                structureSignature
              ] ?? 0,
              arrangementCounts[
                arrangementSignature
              ] ?? 0,
              reasoningCounts[
                reasoningSignature
              ] ?? 0,
            ),
          realismScore:
            getQuestionRealismScore(
              question,
            ),
          difficultyConfidence:
            getQuestionDifficultyConfidence(
              question,
            ),
          validationDiagnostics:
            getQuestionValidationDiagnostics(
              question,
            ),
          structuralWarnings: [],
          review:
            qaReviews[
              fingerprint
            ],
        };
      },
    );
  reviewableItems.forEach((item) => {
    item.structuralWarnings =
      getQuestionStructuralWarnings(
        item.question,
        item.repetitionFlags,
      );
  });

  const filterOptions = {
    topics: [
      ...new Set(
        reviewableItems.map(
          (item) => item.topic,
        ),
      ),
    ].sort(),
    domains: [
      ...new Set(
        reviewableItems.map(
          (item) =>
            item.generationDomain,
        ),
      ),
    ].sort(),
    arrangements: [
      ...new Set(
        reviewableItems.map(
          (item) =>
            item.arrangementType,
        ),
      ),
    ].sort(),
    motifs: [
      ...new Set(
        reviewableItems.map(
          (item) => item.motif,
        ),
      ),
    ].sort(),
    archetypes: [
      ...new Set(
        reviewableItems.map(
          (item) =>
            item.archetype,
        ),
      ),
    ].sort(),
    validationStatuses: [
      ...new Set(
        reviewableItems.map(
          (item) =>
            item.validationStatus,
        ),
      ),
    ].sort(),
  };

  const visibleItems =
    [...reviewableItems]
      .filter((item) =>
        qaFilters.topic ===
          "all"
          ? true
          : item.topic ===
            qaFilters.topic,
      )
      .filter((item) =>
        qaFilters.difficulty ===
          "all"
          ? true
          : item.difficulty ===
            qaFilters.difficulty,
      )
      .filter((item) =>
        qaFilters.arrangementType ===
          "all"
          ? true
          : item.arrangementType ===
            qaFilters.arrangementType,
      )
      .filter((item) =>
        qaFilters.generationDomain ===
          "all"
          ? true
          : item.generationDomain ===
            qaFilters.generationDomain,
      )
      .filter((item) =>
        qaFilters.motif ===
          "all"
          ? true
          : item.motif ===
            qaFilters.motif,
      )
      .filter((item) =>
        qaFilters.archetype ===
          "all"
          ? true
          : item.archetype ===
            qaFilters.archetype,
      )
      .filter((item) =>
        qaFilters.validationStatus ===
          "all"
          ? true
          : item.validationStatus ===
            qaFilters.validationStatus,
      )
      .filter((item) =>
        qaFilters.reviewStatus ===
          "all"
          ? true
          : getReviewWorkflowStatus(
              item,
              lifecycleStates,
            ) ===
            qaFilters.reviewStatus,
      )
      .filter((item) =>
        qaFilters.bankStatus === "all"
          ? true
          : getBankWorkflowStatus(
              item,
              lifecycleStates,
            ) === qaFilters.bankStatus,
      )
      .filter((item) =>
        qaFilters.reviewAction ===
          "all"
          ? true
          : (item.review?.action ??
              "unreviewed") ===
            qaFilters.reviewAction,
      )
      .filter((item) =>
        qaFilters.onlyRepeated
          ? item.repetitionFlags
              .length > 0
          : true,
      )
      .sort((left, right) => {
        switch (
        qaFilters.sortBy
        ) {
          case "difficulty-desc":
            return (
              (getQuestionDifficultyValue(
                right.question,
              ) ?? 0) -
              (getQuestionDifficultyValue(
                left.question,
              ) ?? 0)
            );
          case "difficulty-asc":
            return (
              (getQuestionDifficultyValue(
                left.question,
              ) ?? 0) -
              (getQuestionDifficultyValue(
                right.question,
              ) ?? 0)
            );
          case "topic":
            return left.topic.localeCompare(
              right.topic,
            );
          case "review-status":
            return getReviewWorkflowStatus(
              left,
              lifecycleStates,
            ).localeCompare(
              getReviewWorkflowStatus(
                right,
                lifecycleStates,
              ),
            );
          case "newest":
          default:
            return (
              left.index -
              right.index
            );
        }
      });

  useEffect(() => {
    if (!visibleItems.length) {
      setSelectedWorkspaceFingerprint(
        null,
      );
      setCurrentQuestionIndex(0);
      setWorkspaceEditMode(false);
      return;
    }

    if (currentQuestionIndex >= visibleItems.length) {
      setCurrentQuestionIndex(
        Math.max(0, visibleItems.length - 1),
      );
      setWorkspaceEditMode(false);
    }
  }, [
    visibleItems,
    currentQuestionIndex,
  ]);

  useEffect(() => {
    const activeItem =
      visibleItems[currentQuestionIndex] ?? null;
    const activeFingerprint =
      activeItem?.fingerprint ?? null;

    if (
      selectedWorkspaceFingerprint !==
      activeFingerprint
    ) {
      setSelectedWorkspaceFingerprint(
        activeFingerprint,
      );
    }
  }, [
    visibleItems,
    currentQuestionIndex,
    selectedWorkspaceFingerprint,
  ]);

  const selectedWorkspaceItem =
    visibleItems[currentQuestionIndex] ?? null;
  const selectedVisibleIndex =
    selectedWorkspaceItem
      ? currentQuestionIndex
      : -1;
  const previousVisibleItem =
    selectedVisibleIndex > 0
      ? visibleItems[
          selectedVisibleIndex - 1
        ]
      : null;
  const nextVisibleItem =
    selectedVisibleIndex >= 0 &&
    selectedVisibleIndex <
      visibleItems.length - 1
      ? visibleItems[
          selectedVisibleIndex + 1
        ]
      : null;
  const focusPreviousQuestion = () => {
    focusQuestionAtIndex(
      currentQuestionIndex - 1,
    );
  };
  const focusNextQuestion = () => {
    focusQuestionAtIndex(
      currentQuestionIndex + 1,
    );
  };
  const selectedBatchItems =
    visibleItems.filter((item) =>
      selectedBatchFingerprints.includes(
        item.fingerprint,
      ),
    );
  const exportVisibleQuestions = () => {
    if (!visibleItems.length) {
      setExportStatus(
        "Generate questions before exporting.",
      );
      return;
    }

    try {
      const exportItems = visibleItems.map(
        (item) =>
          getPrimaryQuestion(
            item.question,
          ) as unknown as Parameters<
            typeof downloadQuestionExport
          >[0][number],
      );
      const result =
        downloadQuestionExport(
          exportItems,
          {
            format: exportFormat,
            content: exportCleanExport
              ? "explanations"
              : exportContent,
            cleanExport: exportCleanExport,
            includeAnswers:
              exportCleanExport
                ? false
                : exportIncludeAnswers,
            includeExplanations:
              exportCleanExport
                ? true
                : exportIncludeExplanations,
            includeReasoningGraph:
              exportCleanExport
                ? false
                : exportIncludeReasoning,
            includeTraceability:
              exportCleanExport
                ? false
                : exportIncludeTraceability,
            includeMetadata:
              !exportCleanExport,
            language:
              registryLanguages.join(
                "+",
              ),
            title:
              "Question Studio Export",
          },
        );
      setExportStatus(
        `Downloaded ${result.questionCount} question${result.questionCount === 1 ? "" : "s"} as ${exportFormat.toUpperCase()}.`,
      );
    } catch (error) {
      console.error(error);
      setExportStatus(
        "Export failed. Check the console for details.",
      );
    }
  };

  useEffect(() => {
    if (
      !workspaceEditMode ||
      !pendingRefinementFingerprint ||
      !selectedWorkspaceItem ||
      selectedWorkspaceItem.fingerprint !==
        pendingRefinementFingerprint
    ) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        refineQuestionAt(
          selectedWorkspaceItem.index,
        );
        setPendingRefinementFingerprint(
          null,
        );
      }, 800);

    return () =>
      window.clearTimeout(timeout);
  }, [
    workspaceEditMode,
    pendingRefinementFingerprint,
    selectedWorkspaceItem,
  ]);

  useEffect(() => {
    setSelectedBatchFingerprints(
      (current) => {
        const next = current.filter((fingerprint) =>
          visibleItems.some(
            (item) =>
              item.fingerprint ===
              fingerprint,
          ),
        );

        if (
          next.length ===
            current.length &&
          next.every(
            (fingerprint, index) =>
              fingerprint ===
              current[index],
          )
        ) {
          return current;
        }

        return next;
      },
    );
  }, [visibleItems]);

  useEffect(() => {
    function handleEditorialShortcut(
      event: KeyboardEvent,
    ) {
      const target =
        event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTyping || !generated.length) {
        return;
      }

      const key =
        event.key.toLowerCase();

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusPreviousQuestion();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusNextQuestion();
        return;
      }

      if (key === "a" && selectedWorkspaceItem) {
        event.preventDefault();
        approveModerationItems([
          selectedWorkspaceItem,
        ]);
      }

      if (key === "r" && selectedWorkspaceItem) {
        event.preventDefault();
        rejectModerationItems([
          selectedWorkspaceItem,
        ]);
      }

      if (key === "e") {
        event.preventDefault();
        setWorkspaceEditMode(
          (current) => !current,
        );
      }

      if (key === "t") {
        event.preventDefault();
        openFilingDrawer("active");
      }

      if (key === "d") {
        event.preventDefault();
        setQaFilters((current) => ({
          ...current,
          onlyRepeated:
            !current.onlyRepeated,
        }));
      }
    }

    window.addEventListener(
      "keydown",
      handleEditorialShortcut,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEditorialShortcut,
      );
  }, [
    generated.length,
    selectedWorkspaceItem,
    previousVisibleItem,
    nextVisibleItem,
    qaFilters.onlyRepeated,
  ]);

  const selectedRegistryPattern =
    questionPatterns.find(
      (pattern) =>
        pattern.id ===
        registryPatternId,
    );
  const selectedRegistrySupportedLanguages =
    getSupportedRegistryLanguages(
      selectedRegistryPattern,
    );
  const selectedRegistrySupportedLanguageKey =
    selectedRegistrySupportedLanguages.join(
      "|",
    );
  const selectedCorpusAuditPreset =
    corpusAuditPresets.find(
      (preset) =>
        preset.id ===
        corpusAuditPresetId,
    );
  const corpusAuditTopicOptions =
    Array.from(
      new Map(
        [
          ...QUANT_V2_CORPUS_AUDIT_TOPICS,
          ...corpusAuditPresets
            .filter(
              (preset) => preset.topicId,
            )
            .map((preset) => ({
              id:
                preset.topicId as CorpusAuditTopicId,
              label: corpusAuditTopicLabel(
                preset.topicId,
              ),
            })),
        ].map((topic) => [
          topic.id,
          topic,
        ]),
      ).values(),
    );
  const corpusAuditPresetsForTopic =
    corpusAuditPresets.filter(
      (preset) =>
        !preset.topicId ||
        preset.topicId ===
          corpusAuditTopicId,
    );
  const corpusAuditTopologyOptions =
    selectedCorpusAuditPreset?.topologyOptions
      ?.length
      ? selectedCorpusAuditPreset.topologyOptions
      : [
          {
            id:
              selectedCorpusAuditPreset?.defaultTopology ??
              "mixed_percentage",
            label:
              selectedCorpusAuditPreset?.defaultTopology ??
              "Mixed Percentage",
            description:
              "Default topology for the selected audit preset.",
          },
        ];
  const corpusAuditSchedulerOptions =
    selectedCorpusAuditPreset?.schedulerProfiles
      ?.length
      ? SCHEDULER_PROFILE_OPTIONS.filter(
          (profile) =>
            selectedCorpusAuditPreset.schedulerProfiles?.includes(
              profile.id,
            ),
        )
      : SCHEDULER_PROFILE_OPTIONS;
  const selectedRegistryPatternIsProfitLoss =
    isProfitLossRegistryPattern(
      selectedRegistryPattern,
    );
  const selectedRegistryPatternIsInterest =
    isInterestRegistryPattern(
      selectedRegistryPattern,
    );
  const selectedRegistryPatternIsRatio =
    isRatioProportionRegistryPattern(
      selectedRegistryPattern,
    );
  const selectedRegistryTopicId =
    quantV2TopicIdForRegistryPattern(
      selectedRegistryPattern,
    );
  const selectedRegistryTopicLabel =
    selectedRegistryTopicId
      ? corpusAuditTopicLabel(
          selectedRegistryTopicId,
        )
      : undefined;
  const schedulerProfileOptions =
    schedulerOptionsForTopic(
      selectedRegistryTopicId,
    );
  const schedulerIsMandatory =
    count > 1 &&
    generationMode === "registry" &&
    (selectedRegistryPatternIsProfitLoss ||
      selectedRegistryPatternIsInterest ||
      selectedRegistryPatternIsRatio);

  useEffect(() => {
    setRegistryLanguages((current) => {
      const next =
        REGISTRY_LANGUAGE_OPTIONS.map(
          (option) => option.id,
        ).filter(
          (option) =>
            option === "en" ||
            (current.includes(option) &&
              selectedRegistrySupportedLanguages.includes(
                option,
              )),
        );

      return current.length ===
        next.length &&
        current.every(
          (value, index) =>
            value === next[index],
        )
        ? current
        : next;
    });
  }, [
    selectedRegistrySupportedLanguageKey,
  ]);

  useEffect(() => {
    if (
      schedulerProfileOptions.length > 0 &&
      !schedulerProfileOptions.some(
        (profile) =>
          profile.id === schedulerProfile,
      )
    ) {
      setSchedulerProfile(
        defaultSchedulerProfileForTopic(
          selectedRegistryTopicId,
        ),
      );
    }
  }, [
    schedulerProfile,
    schedulerProfileOptions,
    selectedRegistryTopicId,
  ]);

  useEffect(() => {
    if (
      corpusAuditSchedulerOptions.length > 0 &&
      !corpusAuditSchedulerOptions.some(
        (profile) =>
          profile.id ===
          corpusAuditSchedulerProfile,
      )
    ) {
      setCorpusAuditSchedulerProfile(
        corpusAuditSchedulerOptions[0]!.id,
      );
    }
  }, [
    corpusAuditSchedulerOptions,
    corpusAuditSchedulerProfile,
  ]);
  const registryDomains = [
    "quant",
    "reasoning",
    "english",
    "punjabi",
    "computer",
    "di",
  ].filter((domain) =>
    questionPatterns.some(
      (pattern) =>
        pattern.domain === domain,
    ),
  );
  const visibleRegistryPatterns =
    questionPatterns.filter(
      (pattern) =>
        registryDomain === "all" ||
        pattern.domain === registryDomain,
    );
  const PATTERN_MANAGER_PAGE_SIZE = 8;
  const patternManagerPageCount =
    Math.max(
      1,
      Math.ceil(
        patterns.length /
          PATTERN_MANAGER_PAGE_SIZE,
      ),
    );
  const clampedPatternManagerPage =
    Math.min(
      patternManagerPage,
      patternManagerPageCount - 1,
    );
  const pagedPatterns = patterns.slice(
    clampedPatternManagerPage *
      PATTERN_MANAGER_PAGE_SIZE,
    (clampedPatternManagerPage + 1) *
      PATTERN_MANAGER_PAGE_SIZE,
  );
  const filingTaxonomy =
    buildExpandedFilingTaxonomy({
      base: FILING_TAXONOMY,
      patterns: [
        ...questionPatterns,
        ...patterns,
      ],
      reviewableItems,
      masterTopics,
    });
  const selectedFilingSection =
    masterSections.find(
      (section) =>
        section.id === filingConfig.subjectId,
    );
  const selectedFilingTopicFromMaster =
    masterTopics.find(
      (topic) =>
        topic.id === filingConfig.topicId,
    );
  const selectedFilingSubject =
    filingTaxonomy.find(
      (subject) =>
        subject.id ===
        filingConfig.subjectId,
    );
  const selectedFilingTopic =
    filingTaxonomy
      .flatMap(
        (subject) => subject.topics,
      )
      .find(
        (topic) =>
          topic.id ===
          filingConfig.topicId,
      ) ??
    selectedFilingSubject?.topics.find(
      (topic) =>
        topic.id ===
        filingConfig.topicId,
    );
  const filingPreviewQuestions =
    filingTargetFingerprints.length
      ? reviewableItems
          .filter((item) =>
            filingTargetFingerprints.includes(
              item.fingerprint,
            ),
          )
          .map((item) => item.question)
      : [];
  const filingPayloadPreview =
    buildFilingPayloads(
      filingPreviewQuestions,
      filingConfig,
    );
  const selectedPrimaryQuestion =
    selectedWorkspaceItem
      ? getPrimaryQuestion(
          selectedWorkspaceItem.question,
        )
      : null;
  const selectedFormulaQuestion =
    selectedWorkspaceItem &&
    !isDISet(selectedWorkspaceItem.question)
      ? selectedWorkspaceItem.question
      : null;
  const selectedLanguageContent =
    selectedFormulaQuestion
      ? activeModerationLanguage === "hi"
        ? {
            label: "Hindi",
            question:
              selectedFormulaQuestion.textHi ??
              "",
            options:
              selectedFormulaQuestion.optionsHi ??
              [],
            explanation:
              selectedFormulaQuestion.explanationHi ??
              "",
          }
        : activeModerationLanguage === "pa"
          ? {
              label: "Punjabi",
              question:
                selectedFormulaQuestion.textPa ??
                "",
              options:
                selectedFormulaQuestion.optionsPa ??
                [],
              explanation:
                selectedFormulaQuestion.explanationPa ??
                "",
            }
          : {
              label: "English",
              question:
                selectedFormulaQuestion.text,
              options:
                selectedFormulaQuestion.options ??
                [],
              explanation:
                selectedFormulaQuestion.explanation ??
                "",
            }
      : null;

  return (
    <div className="p-6 space-y-6">
      {filingToast && (
        <div className="fixed right-6 top-6 z-50 max-w-md rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
          {filingToast}
        </div>
      )}

      {filingDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30">
          <button
            aria-label="Close filing drawer"
            className="flex-1 cursor-default"
            onClick={() =>
              setFilingDrawerOpen(false)
            }
          />
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-slate-50 shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Targeted Filing
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    Push to Question Bank
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Categorize this verified logic object before it enters the bank.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilingDrawerOpen(false)
                  }
                  className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Section
                  </span>
                  <select
                    value={filingConfig.subjectId}
                    onChange={(event) => {
                      const section =
                        masterSections.find(
                          (entry) =>
                            entry.id ===
                            event.target.value,
                        );
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          subjectId:
                            event.target
                              .value as FilingSubjectId,
                          subjectLabel:
                            section?.name ?? "",
                          topicId: "",
                          topicLabel: "",
                          subTopicId: "",
                          subTopicLabel: "",
                        }),
                      );
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">
                      Select section
                    </option>
                    {masterSections.map(
                      (section) => (
                        <option
                          key={section.id}
                          value={section.id}
                        >
                          {section.name}
                        </option>
                      ),
                    )}
                  </select>
                  {!masterSections.length ? (
                    <p className="text-xs text-amber-600">
                      No sections found. Add sections in Admin Panel &gt; Sections.
                    </p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Topic
                  </span>
                  <select
                    value={filingConfig.topicId}
                    onChange={(event) => {
                      const topic =
                        masterTopics.find(
                          (entry) =>
                            entry.id ===
                            event.target.value,
                        );
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          topicId:
                            event.target.value,
                          topicLabel:
                            topic?.name ?? "",
                          subTopicId: "",
                          subTopicLabel: "",
                        }),
                      );
                    }}
                    disabled={!selectedFilingSection}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                  >
                    <option value="">
                      Select topic
                    </option>
                    {masterTopics.map(
                      (topic) => (
                        <option
                          key={topic.id}
                          value={topic.id}
                        >
                          {topic.name}
                        </option>
                      ),
                    )}
                  </select>
                  {!masterTopics.length ? (
                    <p className="text-xs text-amber-600">
                      No topics found. Add topics in Admin Panel &gt; Sections.
                    </p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Sub-Topic
                  </span>
                  <select
                    value={filingConfig.subTopicId}
                    onChange={(event) => {
                      const subTopic =
                        selectedFilingTopic?.subTopics.find(
                          (entry) =>
                            entry.id ===
                            event.target.value,
                        );
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          subTopicId:
                            event.target.value,
                          subTopicLabel:
                            subTopic?.label ??
                            "",
                        }),
                      );
                    }}
                    disabled={
                      !selectedFilingTopic
                        ?.subTopics.length
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                  >
                    <option value="">
                      {selectedFilingTopic
                        ?.subTopics.length
                        ? "Select sub-topic"
                        : "No sub-topic configured"}
                    </option>
                    {selectedFilingTopic?.subTopics.map(
                      (subTopic) => (
                        <option
                          key={subTopic.id}
                          value={subTopic.id}
                        >
                          {subTopic.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Difficulty
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(
                      (level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFilingConfig(
                              (prev) => ({
                                ...prev,
                                difficulty: level,
                              }),
                            )
                          }
                          className={`h-8 w-8 rounded-full border text-sm font-semibold ${
                            filingConfig.difficulty >=
                            level
                              ? "border-blue-950 bg-blue-950 text-white"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          {level}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-800">
                  Target Exams
                </span>
                <div className="flex flex-wrap gap-2">
                  {TARGET_EXAM_OPTIONS.map(
                    (exam) => {
                      const selected =
                        filingConfig.targetExams.includes(
                          exam,
                        );
                      return (
                        <button
                          key={exam}
                          type="button"
                          onClick={() =>
                            setFilingConfig(
                              (prev) => ({
                                ...prev,
                                targetExams:
                                  selected
                                    ? prev.targetExams.filter(
                                        (item) =>
                                          item !==
                                          exam,
                                      )
                                    : [
                                        ...prev.targetExams,
                                        exam,
                                      ],
                              }),
                            )
                          }
                          className={`rounded-md border px-3 py-1 text-sm ${
                            selected
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {exam}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm font-medium text-slate-800">
                  System Tags
                </span>
                <input
                  value={filingConfig.tags}
                  onChange={(event) =>
                    setFilingConfig(
                      (prev) => ({
                        ...prev,
                        tags: event.target.value,
                      }),
                    )
                  }
                  placeholder="High-Priority, New Pattern"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </label>

              <div className="rounded-md border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Payload Preview
                </div>
                <pre className="mt-3 max-h-72 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                  {JSON.stringify(
                    filingPayloadPreview[0] ?? {
                      message:
                        "No formula question selected.",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
              <button
                onClick={saveQuestions}
                disabled={
                  filingLoading ||
                  !filingConfig.subjectId ||
                  !filingConfig.topicId
                }
                className="flex w-full items-center justify-center rounded-md bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {filingLoading
                  ? "Filing..."
                  : "Finalize & Commit"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <h1 className="text-3xl font-bold">
        Question Generator
      </h1>
      <div className="border rounded-lg p-4 space-y-4">
        <details
          className="border rounded-lg p-4"
          open={patternManagerOpen}
          onToggle={(event) =>
            setPatternManagerOpen(
              event.currentTarget.open,
            )
          }
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Pattern Manager
              </h2>
              <p className="text-sm text-slate-600">
                Review, edit, and create legacy saved patterns without taking over the studio.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {patterns.length} saved
            </span>
          </summary>

          <div className="mt-4 space-y-4">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  Existing Patterns
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() =>
                      setPatternManagerPage(
                        (prev) =>
                          Math.max(
                            0,
                            prev - 1,
                          ),
                      )
                    }
                    disabled={
                      clampedPatternManagerPage ===
                      0
                    }
                    className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>
                    Page{" "}
                    {clampedPatternManagerPage +
                      1}{" "}
                    of{" "}
                    {
                      patternManagerPageCount
                    }
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPatternManagerPage(
                        (prev) =>
                          Math.min(
                            patternManagerPageCount -
                              1,
                            prev + 1,
                          ),
                      )
                    }
                    disabled={
                      clampedPatternManagerPage >=
                      patternManagerPageCount -
                        1
                    }
                    className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {pagedPatterns.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium">
                        {p.name}
                      </div>

                      <div className="text-sm text-gray-600">
                        {p.topic}
                      </div>

                      <div className="text-xs text-gray-500">
                        {p.formula}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setGenerationMode(
                            "legacy",
                          );
                          setPatternId(
                            p.id,
                          );
                        }}
                        className="bg-black text-white px-3 py-1 rounded text-sm"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => {
                          setEditingPatternId(
                            p.id,
                          );

                          setNewPattern({
                            id: p.id,
                            name: p.name,
                            section:
                              p.section,
                            topic: p.topic,
                            subtopic:
                              p.subtopic,
                            difficulty:
                              p.difficulty,
                            formula:
                              p.formula || "",
                            explanationTemplate:
                              p.explanationTemplate || "",

                            template:
                              p.templateVariants?.[0] ||
                              "",
                            type:
                              p.type || "formula",
                            visualType:
                              p.diPattern?.visualType ||
                              "table",

                            diPattern:
                              JSON.stringify(
                                p.diPattern || {},
                                null,
                                2,
                              ),
                            variables:
                              JSON.stringify(
                                p.variables,
                                null,
                                2,
                              ),

                            offsets:
                              p
                                .distractorStrategy
                                ?.offsets?.join(
                                  ",",
                                ) || "",
                          });
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          deletePattern(p.id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {editingPatternId
                  ? "Edit Pattern"
                  : "Create Pattern"}
              </h3>

              <input
                placeholder="Pattern ID"
                value={newPattern.id}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    id: e.target.value,
                  })
                }
                className="border rounded p-2 w-full"
              />

              <input
                placeholder="Pattern Name"
                value={newPattern.name}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    name: e.target.value,
                  })
                }
                className="border rounded p-2 w-full"
              />

              <input
                placeholder="Topic"
                value={newPattern.topic}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    topic:
                      e.target.value,
                  })
                }
                className="border rounded p-2 w-full"
              />
              <select
                value={newPattern.type}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    type: e.target.value,
                  })
                }
                className="border rounded p-2 w-full"
              >
                <option value="formula">
                  Formula
                </option>

                <option value="di">
                  DI
                </option>
              </select>

              {newPattern.type === "di" && (
                <select
                  value={newPattern.visualType}
                  onChange={(e) =>
                    setNewPattern({
                      ...newPattern,
                      visualType:
                        e.target.value,
                    })
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="table">
                    Table
                  </option>

                  <option value="bar">
                    Bar Chart
                  </option>

                  <option value="pie">
                    Pie Chart
                  </option>

                  <option value="line">
                    Line Graph
                  </option>
                </select>
              )}

              <input
                placeholder="Formula (example: a + b)"
                value={newPattern.formula}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    formula:
                      e.target.value,
                  })
                }
                className="border rounded p-2 w-full"
              />
              <textarea
                placeholder="Explanation Template"
                value={
                  newPattern.explanationTemplate
                }
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    explanationTemplate:
                      e.target.value,
                  })
                }
                className="border rounded p-2 w-full h-32"
              />
              {newPattern.type === "di" && (
                <textarea
                  placeholder="DI Pattern JSON"
                  value={newPattern.diPattern}
                  onChange={(e) =>
                    setNewPattern({
                      ...newPattern,
                      diPattern:
                        e.target.value,
                    })
                  }
                  className="border rounded p-2 w-full h-40"
                />
              )}
              <textarea
                placeholder="Template"
                value={newPattern.template}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    template:
                      e.target.value,
                  })
                }
                className="border rounded p-2 w-full h-24"
              />

              <textarea
                placeholder="Variables JSON"
                value={newPattern.variables}
                onChange={(e) =>
                  setNewPattern({
                    ...newPattern,
                    variables:
                      e.target.value,
                  })
                }
                className="border rounded p-2 w-full h-32"
              />

              <button
                onClick={savePattern}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingPatternId
                  ? "Update Pattern"
                  : "Create Pattern"}
              </button>
            </div>
          </div>
        </details>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setGenerationMode(
                "registry",
              )
            }
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              generationMode ===
              "registry"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Pattern Registry
          </button>
        </div>

        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Pattern Registry
                </h2>
                <p className="text-sm text-slate-600">
                  Preferred exam-oriented generator flow. Pick a topic family; motifs stay internal.
                </p>
              </div>
              {selectedRegistryPattern?.enabled ===
              false ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Coming Soon
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Domain
                </label>
                <select
                  value={registryDomain}
                  onChange={(event) => {
                    const nextDomain =
                      event.target.value;
                    setRegistryDomain(nextDomain);
                    setRegistryTopic("all");
                    setRegistrySubtopic("all");
                    
                    const firstEnabled =
                      questionPatterns.find(
                        (pattern) =>
                          (nextDomain === "all" ||
                            pattern.domain === nextDomain) &&
                          pattern.enabled !== false,
                      );
                    if (firstEnabled) {
                      setRegistryPatternId(firstEnabled.id);
                    }
                  }}
                  className="border rounded p-2 w-full bg-white"
                >
                  <option value="all">All Domains</option>
                  {registryDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Topic
                </label>
                <select
                  value={registryTopic}
                  onChange={(event) => {
                    setRegistryTopic(event.target.value);
                    setRegistrySubtopic("all");
                  }}
                  className="border rounded p-2 w-full bg-white"
                >
                  <option value="all">All Topics</option>
                  {[
                    ...new Set(
                      questionPatterns
                        .filter(
                          (p) =>
                            registryDomain === "all" ||
                            p.domain === registryDomain,
                        )
                        .map((p) => p.topic),
                    ),
                  ].map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Subtopic
                </label>
                <select
                  value={registrySubtopic}
                  onChange={(event) => setRegistrySubtopic(event.target.value)}
                  className="border rounded p-2 w-full bg-white"
                >
                  <option value="all">All Subtopics</option>
                  {[
                    ...new Set(
                      questionPatterns
                        .filter(
                          (p) =>
                            (registryDomain === "all" ||
                              p.domain === registryDomain) &&
                            (registryTopic === "all" ||
                              p.topic === registryTopic),
                        )
                        .map((p) => p.subtopic),
                    ),
                  ].map((subtopic) => (
                    <option key={subtopic} value={subtopic}>
                      {subtopic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Archetype (Package)
                </label>
                <select
                  value={registryPatternId}
                  onChange={(event) => {
                    const nextPattern = questionPatterns.find(
                      (pattern) => pattern.id === event.target.value,
                    );
                    setRegistryPatternId(event.target.value);
                    if (
                      nextPattern?.supportedDifficulties?.length &&
                      !nextPattern.supportedDifficulties.includes(
                        registryDifficulty,
                      )
                    ) {
                      setRegistryDifficulty(
                        nextPattern.supportedDifficulties[0],
                      );
                    }
                  }}
                  className="border rounded p-2 w-full bg-white"
                >
                  <option value="">Select Archetype</option>
                  {questionPatterns
                    .filter(
                      (p) =>
                        (registryDomain === "all" ||
                          p.domain === registryDomain) &&
                        (registryTopic === "all" ||
                          p.topic === registryTopic) &&
                        (registrySubtopic === "all" ||
                          p.subtopic === registrySubtopic),
                    )
                    .map((pattern) => (
                      <option
                        key={pattern.id}
                        value={pattern.id}
                        disabled={pattern.enabled === false}
                      >
                        {pattern.id ===
                        QUANT_V4_PERCENTAGE_ALL_PATTERN_ID
                          ? `All Packages: ${pattern.label}`
                          : `${pattern.packageId}: ${pattern.label}`}
                        {pattern.enabled === false ? " (Coming Soon)" : ""}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Difficulty
              </label>
              <select
                value={registryDifficulty}
                onChange={(event) =>
                  setRegistryDifficulty(
                    event.target
                      .value as typeof registryDifficulty,
                  )
                }
                className="border rounded p-2 w-full bg-white"
              >
                {(
                  [
                    "easy",
                    "medium",
                    "hard",
                  ] as const
                ).map((difficulty) => (
                  <option
                    key={difficulty}
                    value={difficulty}
                    disabled={
                      selectedRegistryPattern &&
                      !selectedRegistryPattern.supportedDifficulties?.includes(
                        difficulty,
                      )
                    }
                  >
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex min-h-[86px] items-start gap-3 rounded-md border border-slate-200 bg-white p-3">
              <input
                type="checkbox"
                checked={enableNameClash}
                onChange={(event) =>
                  setEnableNameClash(
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Enable Name Clash (Hard)
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Prioritizes same-initial names for high-difficulty seating puzzles so students cannot rely on first-letter shortcuts.
                </span>
              </span>
            </label>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Seating / logic puzzle build quality
              </label>
              <select
                value={seatingGenerationQuality}
                onChange={(event) =>
                  setSeatingGenerationQuality(
                    event.target
                      .value as typeof seatingGenerationQuality,
                  )
                }
                className="border rounded p-2 w-full bg-white"
              >
                <option value="draft">
                  Draft — faster previews, lighter validation search
                </option>
                <option value="standard">
                  Standard — default balance
                </option>
                <option value="production">
                  Production — deeper search, no fast-preview shortcut
                </option>
              </select>
              <p className="text-xs text-slate-500 leading-5">
                Applies to seating arrangement items. Constraint-style puzzles
                already use the full construction path.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Exam Style
              </label>
              <select
                value={registryExamStyle}
                onChange={(event) =>
                  setRegistryExamStyle(
                    event.target.value,
                  )
                }
                className="border rounded p-2 w-full bg-white"
              >
                <option value="ssc">
                  SSC
                </option>
                <option value="banking">
                  Banking
                </option>
                <option value="sbi">
                  SBI
                </option>
                <option value="rrb">
                  RRB
                </option>
                <option value="punjab_state">
                  Punjab State (PSC / PSSSB quant)
                </option>
                <option value="punjab">
                  Punjab
                </option>
                <option value="psssb">
                  PSSSB
                </option>
                <option value="ppsc">
                  PPSC
                </option>
                <option value="cat">
                  CAT
                </option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2 xl:col-span-4">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-slate-900">
                  Target Languages
                </label>
                <span className="text-xs text-slate-500">
                  English locked
                </span>
              </div>
              <div className="grid gap-2 rounded-md border border-slate-200 bg-white p-2 sm:grid-cols-3">
                {REGISTRY_LANGUAGE_OPTIONS.map(
                  (language) => {
                    const selected =
                      registryLanguages.includes(
                        language.id,
                      );

                    return (
                      <button
                        key={language.id}
                        type="button"
                        aria-pressed={selected}
                        disabled={
                          language.locked ||
                          !selectedRegistrySupportedLanguages.includes(
                            language.id,
                          )
                        }
                        onClick={() =>
                          toggleRegistryLanguage(
                            language.id,
                          )
                        }
                        className={`rounded-md border px-3 py-2 text-left transition ${
                          selected
                            ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        } ${
                          language.locked ||
                          !selectedRegistrySupportedLanguages.includes(
                            language.id,
                          )
                            ? "cursor-default"
                            : ""
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              readOnly
                              disabled={
                                language.locked ||
                                !selectedRegistrySupportedLanguages.includes(
                                  language.id,
                                )
                              }
                              className="h-4 w-4 accent-indigo-600"
                            />
                            <span>
                              {language.label}
                            </span>
                          </span>
                          {language.locked ? (
                            <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                              Locked
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {selectedRegistrySupportedLanguages.includes(
                            language.id,
                          )
                            ? language.description
                            : "Not active for this package in Question Studio"}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
              <p className="text-xs text-slate-500">
                The generator only requests languages enabled for the selected Quant V4 package. Percentage currently runs in English-only mode in Question Studio.
              </p>
            </div>

            {selectedRegistryPattern ? (
              <div className="text-xs text-slate-600">
                {selectedRegistryPattern.domain} /{" "}
                {selectedRegistryPattern.topic} /{" "}
                {selectedRegistryPattern.subtopic} /{" "}
                {selectedRegistryPattern.label}
                {" "}• Languages:{" "}
                {registryLanguages
                  .map((language) =>
                    language.toUpperCase(),
                  )
                  .join(", ")}
                {selectedRegistryPattern.enabled ===
                false
                  ? " - Coming Soon"
                  : ""}
                {selectedRegistryPatternIsProfitLoss
                  ? " - Profit/Loss V2"
                  : ""}
                {selectedRegistryPatternIsInterest
                  ? " - Interest V2"
                  : ""}
                {selectedRegistryPatternIsRatio
                  ? " - Ratio V2"
                  : ""}
              </div>
            ) : null}
          </div>
        </>

        <div>
          <label className="block mb-2 font-medium">
            Number of Questions
          </label>

          <input
            type="number"
            value={count}
            min="1"
            max="1000"
            onChange={(e) =>
              setCount(
                Math.min(
                  1000,
                  Math.max(
                    1,
                    Number(
                      e.target.value,
                    ) || 1,
                  ),
                ),
              )
            }
            className="border rounded p-2 w-full"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[100, 250, 500, 1000].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCount(value)}
                className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Difficulty Settings
              </h2>
              <p className="text-sm text-slate-600">
                Tune generation difficulty only when you need targeted or mixed-difficulty output.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Exam Profile
                </label>
                <select
                  value={
                    difficultySettings.examProfile
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        examProfile:
                          e.target
                            .value as ExamProfileId,
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                >
                  {EXAM_PROFILE_OPTIONS.map(
                    (profile) => (
                      <option
                        key={profile.id}
                        value={profile.id}
                      >
                        {profile.label}
                      </option>
                    ),
                  )}
                </select>
                <p className="text-xs text-slate-500">
                  {getProfileDescription(
                    difficultySettings.examProfile,
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  DI Set Profile
                </label>
                <select
                  value={
                    difficultySettings.setProfile
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        setProfile:
                          e.target
                            .value as DISetProfile,
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="progressive">
                    Progressive
                  </option>
                  <option value="balanced">
                    Balanced
                  </option>
                  <option value="spike">
                    Spike
                  </option>
                  <option value="uniform">
                    Uniform
                  </option>
                </select>
                <p className="text-xs text-slate-500">
                  Controls how DI sets ramp from easier starter questions to harder inference-heavy questions.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableTargetDifficulty
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableTargetDifficulty:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Target Difficulty
              </span>
            </label>

            {difficultySettings.enableTargetDifficulty && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium">
                      Target Difficulty
                    </label>
                    <span className="rounded border bg-white px-2 py-1">
                      {difficultySettings.targetDifficulty.toFixed(
                        1,
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={
                      difficultySettings.targetDifficulty
                    }
                    onChange={(e) =>
                      setDifficultySettings(
                        (prev) => ({
                          ...prev,
                          targetDifficulty:
                            Number(
                              e.target.value,
                            ),
                        }),
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Difficulty Tolerance
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={
                        difficultySettings.difficultyTolerance
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyTolerance:
                              Number(
                                e.target.value,
                              ),
                          }),
                        )
                      }
                      className="w-full"
                    />
                    <span className="min-w-14 rounded border bg-white px-2 py-1 text-center text-sm">
                      +/-
                      {difficultySettings.difficultyTolerance.toFixed(
                        1,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableDistribution
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableDistribution:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Difficulty Distribution
              </span>
            </label>

            {difficultySettings.enableDistribution && (
              <div className="space-y-4 rounded border bg-white p-4">
                {(
                  [
                    "easy",
                    "medium",
                    "hard",
                  ] as const
                ).map((key) => (
                  <div
                    key={key}
                    className="grid items-center gap-3 md:grid-cols-[120px_1fr_80px]"
                  >
                    <label className="text-sm font-medium capitalize">
                      {key}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={
                        difficultySettings
                          .difficultyDistribution[
                          key
                        ]
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyDistribution:
                              {
                                ...prev.difficultyDistribution,
                                [key]:
                                  clampNumber(
                                    Number(
                                      e.target.value,
                                    ),
                                    0,
                                    100,
                                  ),
                              },
                          }),
                        )
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        difficultySettings
                          .difficultyDistribution[
                          key
                        ]
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyDistribution:
                              {
                                ...prev.difficultyDistribution,
                                [key]:
                                  clampNumber(
                                    Number(
                                      e.target.value,
                                    ) || 0,
                                    0,
                                    100,
                                  ),
                              },
                          }),
                        )
                      }
                      className="border rounded p-2 w-full"
                    />
                  </div>
                ))}

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium">
                    Total:
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 ${getDistributionTotal(
                      difficultySettings.difficultyDistribution,
                    ) === 100
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                  >
                    {getDistributionTotal(
                      difficultySettings.difficultyDistribution,
                    )}
                    %
                  </span>
                  <span className="text-slate-600">
                    If this is not 100, the request is normalized automatically before generation.
                  </span>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableTargetAverageDifficulty
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableTargetAverageDifficulty:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Target Average Difficulty
              </span>
            </label>

            {difficultySettings.enableTargetAverageDifficulty && (
              <div className="max-w-xs space-y-2">
                <label className="block text-sm font-medium">
                  Target Average
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={
                    difficultySettings.targetAverageDifficulty
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        targetAverageDifficulty:
                          clampNumber(
                            Number(
                              e.target.value,
                            ) || 1,
                            1,
                            10,
                          ),
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Batch"}
        </button>
        <button
          onClick={() =>
            {
              setGenerated([]);
              setSchedulerSummary(null);
              setCorpusQuality(null);
            }
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm">
            <div className="border-b border-slate-200 bg-[#1e1b4b] px-5 py-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                    Editorial Moderation Studio
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">
                    Staging Queue Review
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm text-indigo-100">
                    Generate or ingest, review multilingual content, classify, approve, and then push verified questions into the bank.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <button
                    onClick={() =>
                      selectedBatchItems.length
                        ? approveModerationItems(
                            selectedBatchItems,
                          )
                        : selectedWorkspaceItem
                          ? approveModerationItems(
                              [
                                selectedWorkspaceItem,
                              ],
                            )
                          : undefined
                    }
                    disabled={
                      qaLoading ||
                      (!selectedBatchItems.length &&
                        !selectedWorkspaceItem)
                    }
                    className="rounded-md border border-emerald-400/40 bg-emerald-500 px-3 py-2 font-medium text-white disabled:opacity-50"
                  >
                    {selectedBatchItems.length
                      ? "Approve Selected"
                      : "Approve Active"}
                  </button>
                  <button
                    onClick={() =>
                      selectedBatchItems.length
                        ? rejectModerationItems(
                            selectedBatchItems,
                          )
                        : selectedWorkspaceItem
                          ? rejectModerationItems(
                              [
                                selectedWorkspaceItem,
                              ],
                            )
                          : undefined
                    }
                    disabled={
                      qaLoading ||
                      (!selectedBatchItems.length &&
                        !selectedWorkspaceItem)
                    }
                    className="rounded-md border border-rose-400/40 bg-rose-500 px-3 py-2 font-medium text-white disabled:opacity-50"
                  >
                    {selectedBatchItems.length
                      ? "Reject Selected"
                      : "Reject Active"}
                  </button>
                  <button
                    onClick={() =>
                      openFilingDrawer("active")
                    }
                    className="rounded-md bg-white px-3 py-2 font-medium text-slate-950"
                  >
                    Push Active
                  </button>
                  <button
                    onClick={() =>
                      openFilingDrawer(
                        "all-approved",
                      )
                    }
                    className="rounded-md border border-indigo-200/40 bg-indigo-100 px-3 py-2 font-medium text-indigo-950"
                  >
                    Push All Approved
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-indigo-100">
                <span className="rounded border border-indigo-300/30 px-2 py-1">
                  A approve
                </span>
                <span className="rounded border border-indigo-300/30 px-2 py-1">
                  R reject
                </span>
                <span className="rounded border border-indigo-300/30 px-2 py-1">
                  E edit
                </span>
                <span className="rounded border border-indigo-300/30 px-2 py-1">
                  T taxonomy
                </span>
                <span className="rounded border border-indigo-300/30 px-2 py-1">
                  D duplicate filter
                </span>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(event) =>
                      setExportFormat(
                        event.target
                          .value as QuestionExportFormat,
                      )
                    }
                    className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="pdf">
                      PDF
                    </option>
                    <option value="docx">
                      DOCX
                    </option>
                    <option value="json">
                      JSON
                    </option>
                    <option value="csv">
                      CSV
                    </option>
                    <option value="txt">
                      TXT
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Content
                  </label>
                  <select
                    value={exportContent}
                    onChange={(event) =>
                      setExportContent(
                        event.target
                          .value as QuestionExportContent,
                      )
                    }
                    disabled={
                      exportCleanExport
                    }
                    className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="questions">
                      Questions only
                    </option>
                    <option value="answers">
                      Questions + Answers
                    </option>
                    <option value="explanations">
                      Questions + Answers + Explanations
                    </option>
                    <option value="reasoning">
                      Questions + Answers + Explanations + Reasoning Graph
                    </option>
                    <option value="traceability">
                      Questions + Full Traceability
                    </option>
                  </select>
                </div>
                <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={
                      exportIncludeAnswers
                    }
                    disabled={
                      exportCleanExport
                    }
                    onChange={(event) =>
                      setExportIncludeAnswers(
                        event.target.checked,
                      )
                    }
                  />
                  Answers
                </label>
                <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={
                      exportIncludeExplanations
                    }
                    disabled={
                      exportCleanExport
                    }
                    onChange={(event) =>
                      setExportIncludeExplanations(
                        event.target.checked,
                      )
                    }
                  />
                  Explanations
                </label>
                <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={
                      exportIncludeReasoning
                    }
                    disabled={
                      exportCleanExport
                    }
                    onChange={(event) =>
                      setExportIncludeReasoning(
                        event.target.checked,
                      )
                    }
                  />
                  Reasoning graph
                </label>
                <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={
                      exportIncludeTraceability
                    }
                    disabled={
                      exportCleanExport
                    }
                    onChange={(event) =>
                      setExportIncludeTraceability(
                        event.target.checked,
                      )
                    }
                  />
                  Traceability
                </label>
                <label className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  <input
                    type="checkbox"
                    checked={
                      exportCleanExport
                    }
                    onChange={(event) =>
                      setExportCleanExport(
                        event.target.checked,
                      )
                    }
                  />
                  Only question + options + explanation
                </label>
                <button
                  type="button"
                  onClick={
                    exportVisibleQuestions
                  }
                  disabled={!visibleItems.length}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Download
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {exportCleanExport
                  ? "Clean export mode is on: only the question, options, and explanation will be exported."
                  : "Exports the current visible generated batch, up to 1000 questions, with topic, subtopic, archetype, CP, QL, task kind, difficulty, language, question ID, scenario, validation, seed, and timestamp metadata."}
                {exportStatus ? (
                  <span className="ml-2 font-medium text-slate-700">
                    {exportStatus}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid min-h-[720px] gap-0 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
              <aside className="border-b border-slate-200 bg-white p-4 lg:border-b-0 lg:border-r">
                <div className="space-y-4 lg:sticky lg:top-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Workflow
                    </div>
                    <div className="mt-2 space-y-2">
                      {[
                        {
                          id: "all",
                          label: "All",
                          reviewStatus: "all",
                          bankStatus: "all",
                        },
                        {
                          id: "generated",
                          label: "Pending Review",
                          reviewStatus:
                            "generated",
                          bankStatus: "all",
                        },
                        {
                          id: "approved",
                          label: "Approved",
                          reviewStatus:
                            "approved",
                          bankStatus: "all",
                        },
                        {
                          id: "rejected",
                          label: "Rejected",
                          reviewStatus:
                            "rejected",
                          bankStatus: "all",
                        },
                        {
                          id: "pushed",
                          label: "Already Pushed",
                          reviewStatus: "all",
                          bankStatus:
                            "pushed",
                        },
                      ].map((state) => {
                        const total =
                          reviewableItems.filter(
                            (item) => {
                              const reviewStatus =
                                getReviewWorkflowStatus(
                                  item,
                                  lifecycleStates,
                                );
                              const bankStatus =
                                getBankWorkflowStatus(
                                  item,
                                  lifecycleStates,
                                );

                              return (
                                (state.reviewStatus ===
                                  "all" ||
                                  reviewStatus ===
                                    state.reviewStatus) &&
                                (state.bankStatus ===
                                  "all" ||
                                  bankStatus ===
                                    state.bankStatus)
                              );
                            },
                          ).length;
                        const active =
                          qaFilters.reviewStatus ===
                            state.reviewStatus &&
                          qaFilters.bankStatus ===
                            state.bankStatus;

                        return (
                          <button
                            key={state.id}
                            onClick={() =>
                              setQaFilters(
                                (prev) => ({
                                  ...prev,
                                  reviewStatus:
                                    state.reviewStatus,
                                  bankStatus:
                                    state.bankStatus,
                                }),
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 ${active ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}
                          >
                            <span>
                              {state.label}
                            </span>
                            <span className="font-semibold text-slate-950">
                              {total}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Question Queue
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {visibleItems.length}
                      </span>
                    </div>
                    <div className="max-h-[360px] space-y-1 overflow-y-auto pr-1">
                      {visibleItems.map(
                        (item) => {
                          const selected =
                            selectedWorkspaceFingerprint ===
                            item.fingerprint;
                          const reviewStatus =
                            getReviewWorkflowStatus(
                              item,
                              lifecycleStates,
                            );
                          const bankStatus =
                            getBankWorkflowStatus(
                              item,
                              lifecycleStates,
                            );
                          const badge =
                            bankStatus ===
                            "pushed"
                              ? "pushed"
                              : reviewStatus;

                          return (
                            <button
                              key={`queue-${item.fingerprint}`}
                              onClick={() =>
                                setReviewFocus(
                                  item,
                                )
                              }
                              className={`w-full rounded-md border px-3 py-2 text-left transition ${selected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-slate-950">
                                  Q{item.index + 1}
                                </span>
                                <span
                                  className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${getReviewStatusBadgeClass(
                                    badge,
                                  )}`}
                                >
                                  {badge}
                                </span>
                              </div>
                              <div className="mt-1 truncate text-xs text-slate-500">
                                {item.topic}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Queue Filters
                    </div>
                    <select
                      value={
                        qaFilters.topic
                      }
                      onChange={(e) =>
                        setQaFilters(
                          (prev) => ({
                            ...prev,
                            topic:
                              e.target
                                .value,
                          }),
                        )
                      }
                      className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm"
                    >
                      <option value="all">
                        All Topics
                      </option>
                      {filterOptions.topics.map(
                        (topic) => (
                          <option
                            key={topic}
                            value={topic}
                          >
                            {topic}
                          </option>
                        ),
                      )}
                    </select>
                    <select
                      value={
                        qaFilters.validationStatus
                      }
                      onChange={(e) =>
                        setQaFilters(
                          (prev) => ({
                            ...prev,
                            validationStatus:
                              e.target
                                .value,
                          }),
                        )
                      }
                      className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm"
                    >
                      <option value="all">
                        All Solver States
                      </option>
                      {filterOptions.validationStatuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ),
                      )}
                    </select>
                    <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={
                          qaFilters.onlyRepeated
                        }
                        onChange={(e) =>
                          setQaFilters(
                            (prev) => ({
                              ...prev,
                              onlyRepeated:
                                e.target
                                  .checked,
                            }),
                          )
                        }
                      />
                      Duplicate warnings only
                    </label>
                    <button
                      onClick={() =>
                        setQaFilters(
                          QA_FILTER_DEFAULTS,
                        )
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      Reset Filters
                    </button>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="font-semibold text-slate-900">
                      Review Speed Mode
                    </div>
                    <p className="mt-1">
                      Select cards, batch approve or reject, then use Push To Bank for final classification and verification.
                    </p>
                  </div>
                </div>
              </aside>

              <main className="relative min-w-0 border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
                {selectedBatchItems.length ? (
                  <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3 shadow-sm">
                    <div className="text-sm font-medium text-indigo-950">
                      {selectedBatchItems.length} selected for batch moderation
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          approveModerationItems(
                            selectedBatchItems,
                          )
                        }
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
                      >
                        Approve Selected
                      </button>
                      <button
                        onClick={() =>
                          rejectModerationItems(
                            selectedBatchItems,
                          )
                        }
                        className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white"
                      >
                        Reject Selected
                      </button>
                      <button
                        onClick={() =>
                          openFilingDrawer(
                            "selected",
                          )
                        }
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800"
                      >
                        Push Selected
                      </button>
                      <button
                        onClick={() =>
                          setSelectedBatchFingerprints(
                            [],
                          )
                        }
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Active Question Review
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {selectedWorkspaceItem
                        ? `Question ${selectedVisibleIndex + 1} of ${visibleItems.length}`
                        : `${visibleItems.length} visible / ${reviewableItems.length} staged`}
                    </div>
                    {selectedWorkspaceItem &&
                    selectedPrimaryQuestion ? (
                      <div className="mt-2 flex max-w-3xl flex-wrap gap-1.5 text-[11px] text-slate-600">
                        <span className="rounded border bg-white px-2 py-1">
                          Index: {selectedVisibleIndex + 1}/{visibleItems.length}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          ID: {selectedPrimaryQuestion.questionId ?? selectedPrimaryQuestion.debugMetadata?.questionId ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Seed: {selectedPrimaryQuestion.seed ?? selectedPrimaryQuestion.debugMetadata?.seed ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          CP: {selectedPrimaryQuestion.canonicalProblemId ?? selectedPrimaryQuestion.debugMetadata?.canonicalProblemId ?? selectedWorkspaceItem.motif}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          QL: {selectedPrimaryQuestion.questionLanguageId ?? selectedPrimaryQuestion.debugMetadata?.questionLanguageId ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          ES: {selectedPrimaryQuestion.explanationId ?? selectedPrimaryQuestion.debugMetadata?.explanationId ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Task: {selectedPrimaryQuestion.taskKind ?? selectedPrimaryQuestion.debugMetadata?.taskKind ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Scenario: {selectedPrimaryQuestion.scenarioId ?? selectedPrimaryQuestion.debugMetadata?.scenarioId ?? "none"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Archetype: {selectedPrimaryQuestion.packageId ?? selectedPrimaryQuestion.debugMetadata?.selectedArchetype ?? selectedWorkspaceItem.archetype}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Source: {selectedPrimaryQuestion.packageSource ?? selectedPrimaryQuestion.debugMetadata?.packageSource ?? selectedPrimaryQuestion.debugSource ?? "unknown"}
                        </span>
                        <span className="rounded border bg-white px-2 py-1">
                          Answer: {selectedPrimaryQuestion.answer ?? selectedPrimaryQuestion.options?.[selectedPrimaryQuestion.correct] ?? "none"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={focusPreviousQuestion}
                      disabled={
                        !previousVisibleItem
                      }
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={focusNextQuestion}
                      disabled={
                        !nextVisibleItem
                      }
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() =>
                        selectedWorkspaceItem
                          ? approveModerationItems(
                              [
                                selectedWorkspaceItem,
                              ],
                            )
                          : undefined
                      }
                      disabled={
                        qaLoading ||
                        !selectedWorkspaceItem
                      }
                      className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        selectedWorkspaceItem
                          ? rejectModerationItems(
                              [
                                selectedWorkspaceItem,
                              ],
                            )
                          : undefined
                      }
                      disabled={
                        qaLoading ||
                        !selectedWorkspaceItem
                      }
                      className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="hidden"
                >
                  {previousVisibleItem?.fingerprint}
                  {nextVisibleItem?.fingerprint}
                </div>

                {selectedWorkspaceItem ? (
                  <div
                    key={`active-workspace-${selectedVisibleIndex}-${selectedWorkspaceItem.fingerprint}`}
                    className="space-y-3"
                  >
                    {renderQuestionWorkspace(
                      selectedWorkspaceItem,
                      qaNotes[
                        selectedWorkspaceItem
                          .fingerprint
                      ] ?? "",
                      qaIssueTags[
                        selectedWorkspaceItem
                          .fingerprint
                      ] ??
                        selectedWorkspaceItem
                          .review
                          ?.issueTags ??
                        [],
                      workspaceEditMode,
                      refinementLoading,
                      (value) =>
                        setQaNotes(
                          (prev) => ({
                            ...prev,
                            [selectedWorkspaceItem.fingerprint]:
                              value,
                          }),
                        ),
                      (tag) =>
                        toggleQAIssueTag(
                          selectedWorkspaceItem.fingerprint,
                          tag,
                        ),
                      () => {
                        if (
                          workspaceEditMode
                        ) {
                          refineQuestionAt(
                            selectedWorkspaceItem.index,
                          );
                          setPendingRefinementFingerprint(
                            null,
                          );
                        }
                        setWorkspaceEditMode(
                          (prev) => !prev,
                        );
                      },
                      (value) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) => ({
                            ...current,
                            text: value,
                          }),
                        ),
                      (value) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) => ({
                            ...current,
                            explanation:
                              value,
                          }),
                        ),
                      (
                        optionIndex,
                        value,
                      ) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) => ({
                            ...current,
                            options:
                              current.options.map(
                                (
                                  option,
                                  index,
                                ) =>
                                  index ===
                                  optionIndex
                                    ? value
                                    : option,
                              ),
                          }),
                        ),
                      (lang, value) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) =>
                            lang === "hi"
                              ? {
                                  ...current,
                                  textHi: value,
                                }
                              : {
                                  ...current,
                                  textPa: value,
                                },
                        ),
                      (lang, value) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) =>
                            lang === "hi"
                              ? {
                                  ...current,
                                  explanationHi:
                                    value,
                                }
                              : {
                                  ...current,
                                  explanationPa:
                                    value,
                                },
                        ),
                      (
                        lang,
                        optionIndex,
                        value,
                      ) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) => {
                            const source =
                              lang === "hi"
                                ? current.optionsHi
                                : current.optionsPa;
                            const nextOptions = [
                              ...(source?.length
                                ? source
                                : current.options),
                            ];
                            nextOptions[
                              optionIndex
                            ] = value;
                            return lang === "hi"
                              ? {
                                  ...current,
                                  optionsHi:
                                    nextOptions,
                                }
                              : {
                                  ...current,
                                  optionsPa:
                                    nextOptions,
                                };
                          },
                        ),
                      (clues) =>
                        updateGeneratedQuestionAt(
                          selectedWorkspaceItem.index,
                          (current) => ({
                            ...current,
                            debugMetadata: {
                              ...(current.debugMetadata ??
                                {}),
                              generatedClues:
                                clues,
                            },
                          }),
                        ),
                      (
                        action,
                        status,
                      ) => {
                        persistQAReview(
                          selectedWorkspaceItem,
                          action,
                          status,
                        );

                        if (
                          status === "approved"
                        ) {
                          markLifecycle(
                            [
                              selectedWorkspaceItem.fingerprint,
                            ],
                            "approved",
                          );
                          setReviewWorkflowMetadata(
                            (prev) => ({
                              ...prev,
                              [selectedWorkspaceItem.fingerprint]:
                                {
                                  ...prev[
                                    selectedWorkspaceItem.fingerprint
                                  ],
                                  approvedAt:
                                    new Date().toISOString(),
                                  approvedBy:
                                    "admin",
                                },
                            }),
                          );
                        }

                        if (
                          status === "rejected"
                        ) {
                          markLifecycle(
                            [
                              selectedWorkspaceItem.fingerprint,
                            ],
                            "rejected",
                          );
                        }
                      },
                      () =>
                        toggleQABookmark(
                          selectedWorkspaceItem,
                        ),
                      () =>
                        regenerateQuestion(
                          selectedWorkspaceItem.index,
                        ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                    No question matches the current review filters.
                  </div>
                )}
              </main>

              <aside className="bg-white p-4">
                <div className="space-y-4 lg:sticky lg:top-4">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Metadata Sidebar
                    </div>
                    {selectedWorkspaceItem ? (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Subject
                          </span>
                          <span className="font-medium text-slate-900">
                            {selectedWorkspaceItem.generationDomain}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Topic
                          </span>
                          <span className="font-medium text-slate-900">
                            {selectedWorkspaceItem.topic}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Logic Pattern
                          </span>
                          <span className="max-w-[190px] truncate font-medium text-slate-900">
                            {selectedWorkspaceItem.motif}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Source
                          </span>
                          <span className="font-medium capitalize text-slate-900">
                            {getEditorialSourceType(
                              selectedWorkspaceItem,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Lineage
                          </span>
                          <span className="max-w-[190px] text-right text-slate-900">
                            {getSourceLineage(
                              selectedWorkspaceItem,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Review
                          </span>
                          <span
                            className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase ${getReviewStatusBadgeClass(
                              getReviewWorkflowStatus(
                                selectedWorkspaceItem,
                                lifecycleStates,
                              ),
                            )}`}
                          >
                            {getReviewWorkflowStatus(
                              selectedWorkspaceItem,
                              lifecycleStates,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Bank
                          </span>
                          <span
                            className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase ${getReviewStatusBadgeClass(
                              getBankWorkflowStatus(
                                selectedWorkspaceItem,
                                lifecycleStates,
                              ) === "pushed"
                                ? "pushed"
                                : "generated",
                            )}`}
                          >
                            {getBankWorkflowStatus(
                              selectedWorkspaceItem,
                              lifecycleStates,
                            ) === "pushed"
                              ? "pushed"
                              : "not pushed"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Approved At
                          </span>
                          <span className="max-w-[190px] text-right text-slate-900">
                            {reviewWorkflowMetadata[
                              selectedWorkspaceItem
                                .fingerprint
                            ]?.approvedAt
                              ? new Date(
                                  reviewWorkflowMetadata[
                                    selectedWorkspaceItem.fingerprint
                                  ].approvedAt,
                                ).toLocaleString()
                              : "Pending"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Pushed At
                          </span>
                          <span className="max-w-[190px] text-right text-slate-900">
                            {reviewWorkflowMetadata[
                              selectedWorkspaceItem
                                .fingerprint
                            ]?.pushedAt
                              ? new Date(
                                  reviewWorkflowMetadata[
                                    selectedWorkspaceItem.fingerprint
                                  ].pushedAt,
                                ).toLocaleString()
                              : "Not pushed"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Select a staged question to inspect metadata.
                      </p>
                    )}
                  </div>

                  {selectedWorkspaceItem ? (
                    <>
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Multilingual Verification
                            </div>
                            <div className="text-xs text-slate-500">
                              EN / HI / PA tabs show stored final content.
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setWorkspaceEditMode(
                                (current) =>
                                  !current,
                              )
                            }
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium"
                          >
                            {workspaceEditMode
                              ? "Preview"
                              : "Edit"}
                          </button>
                        </div>
                        <div className="mb-3 flex rounded-md border border-slate-200 bg-slate-50 p-1">
                          {REGISTRY_LANGUAGE_OPTIONS.map(
                            (language) => (
                              <button
                                key={`moderation-${language.id}`}
                                onClick={() =>
                                  setActiveModerationLanguage(
                                    language.id,
                                  )
                                }
                                className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold ${activeModerationLanguage === language.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
                              >
                                {language.id.toUpperCase()}
                              </button>
                            ),
                          )}
                        </div>
                        <div
                          lang={
                            activeModerationLanguage ===
                            "pa"
                              ? "pa"
                              : activeModerationLanguage ===
                                  "hi"
                                ? "hi"
                                : "en"
                          }
                          className={`space-y-3 ${activeModerationLanguage === "pa" ? "punjabi-text leading-loose" : ""}`}
                        >
                          {selectedLanguageContent ? (
                            <>
                              <div>
                                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  Question
                                </div>
                                {workspaceEditMode &&
                                activeModerationLanguage !==
                                  "en" ? (
                                  <textarea
                                    value={
                                      selectedLanguageContent.question
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      updateGeneratedQuestionAt(
                                        selectedWorkspaceItem.index,
                                        (current) =>
                                          activeModerationLanguage ===
                                          "hi"
                                            ? {
                                                ...current,
                                                textHi:
                                                  event
                                                    .target
                                                    .value,
                                              }
                                            : {
                                                ...current,
                                                textPa:
                                                  event
                                                    .target
                                                    .value,
                                              },
                                      )
                                    }
                                    className="min-h-[92px] w-full rounded-md border border-slate-200 bg-white p-2 text-sm"
                                  />
                                ) : (
                                  <div className="min-h-[92px] rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800">
                                    {selectedLanguageContent.question?.trim() ? (
                                      <MathText
                                        content={
                                          selectedLanguageContent.question
                                        }
                                      />
                                    ) : (
                                      <span className="text-slate-500">
                                        Localized question pending.
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {(selectedLanguageContent.options.length
                                  ? selectedLanguageContent.options
                                  : selectedFormulaQuestion?.options ??
                                    []
                                ).map(
                                  (
                                    option,
                                    optionIndex,
                                  ) => (
                                    <div
                                      key={`${activeModerationLanguage}-${optionIndex}`}
                                      className={`rounded-md border px-2 py-1.5 text-sm ${selectedFormulaQuestion?.correct === optionIndex ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
                                    >
                                      <span className="mr-2 font-semibold text-slate-500">
                                        {String.fromCharCode(
                                          65 +
                                            optionIndex,
                                        )}
                                      </span>
                                      {option ? (
                                        <MathText
                                          content={
                                            option
                                          }
                                          inline
                                        />
                                      ) : (
                                        <span className="text-slate-400">
                                          Option pending
                                        </span>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                              <div>
                                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  Explanation
                                </div>
                                {workspaceEditMode &&
                                activeModerationLanguage !==
                                  "en" ? (
                                  <textarea
                                    value={
                                      selectedLanguageContent.explanation
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      updateGeneratedQuestionAt(
                                        selectedWorkspaceItem.index,
                                        (current) =>
                                          activeModerationLanguage ===
                                          "hi"
                                            ? {
                                                ...current,
                                                explanationHi:
                                                  event
                                                    .target
                                                    .value,
                                              }
                                            : {
                                                ...current,
                                                explanationPa:
                                                  event
                                                    .target
                                                    .value,
                                              },
                                      )
                                    }
                                    className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white p-2 text-sm"
                                  />
                                ) : (
                                  <div className="min-h-[110px] rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800">
                                    {selectedLanguageContent.explanation?.trim() ? (
                                      <MathText
                                        content={
                                          selectedLanguageContent.explanation
                                        }
                                      />
                                    ) : (
                                      <span className="text-slate-500">
                                        Localized explanation pending.
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                              Select a non-DI question to review language content.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Validation Badges
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {getEditorialBadges(
                            selectedWorkspaceItem,
                          ).map(
                            renderEditorialBadge,
                          )}
                        </div>
                        {selectedWorkspaceItem.repetitionFlags.length ? (
                          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                            <div className="font-semibold">
                              Similar To
                            </div>
                            <div className="mt-1">
                              {selectedWorkspaceItem.repetitionFlags.join(
                                " ",
                              )}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button className="rounded border border-amber-200 bg-white px-2 py-1">
                                Compare
                              </button>
                              <button
                                onClick={() =>
                                  setQaFilters(
                                    (prev) => ({
                                      ...prev,
                                      onlyRepeated:
                                        false,
                                    }),
                                  )
                                }
                                className="rounded border border-amber-200 bg-white px-2 py-1"
                              >
                                Ignore
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Source Diff Review
                        </div>
                        <div className="mt-3 grid gap-2 text-xs md:grid-cols-2 lg:grid-cols-1">
                          <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                            <div className="font-semibold text-slate-700">
                              Original Source
                            </div>
                            <p className="mt-1 text-slate-600">
                              {getSourceLineage(
                                selectedWorkspaceItem,
                              )}
                            </p>
                          </div>
                          <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                            <div className="font-semibold text-slate-700">
                              Generated / Extracted Version
                            </div>
                            <p className="mt-1 line-clamp-4 text-slate-600">
                              {selectedPrimaryQuestion?.text ??
                                "DI set generated from structured data."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </aside>
            </div>
          </section>

          {generated.length > 0 ? (
          <>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-2xl font-semibold">
              Generated Questions
            </h2>

            <button
              onClick={
                openFilingDrawer
              }
              className="bg-blue-950 text-white px-4 py-2 rounded-md"
            >
              Push to Bank
            </button>
            <button
              onClick={() =>
                bulkPersistQAReviews(
                  visibleItems,
                  "approve",
                  "approved",
                )
              }
              disabled={
                qaLoading ||
                !visibleItems.length
              }
              className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Bulk Approve Filtered
            </button>
            <button
              onClick={() =>
                bulkPersistQAReviews(
                  visibleItems,
                  "reject",
                  "rejected",
                )
              }
              disabled={
                qaLoading ||
                !visibleItems.length
              }
              className="bg-rose-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Bulk Reject Filtered
            </button>
            <span className="text-sm text-slate-500">
              {qaLoading
                ? "Syncing QA decisions..."
                : `${visibleItems.length} visible / ${reviewableItems.length} total`}
            </span>
          </div>

          {renderGeneratedDifficultySummary(
            generated,
          )}

          {renderQADashboard(
            reviewableItems,
          )}

          {renderProceduralAnalyticsDashboard(
            qaAnalytics,
          )}

          <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-900">
                QA Filters
              </span>
              <button
                onClick={() =>
                  setQaFilters(
                    QA_FILTER_DEFAULTS,
                  )
                }
                className="rounded border bg-white px-3 py-1 text-sm"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <select
                value={qaFilters.topic}
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    topic:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Topics
                </option>
                {filterOptions.topics.map(
                  (topic) => (
                    <option
                      key={topic}
                      value={topic}
                    >
                      {topic}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.difficulty
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    difficulty:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Difficulty
                </option>
                <option value="Easy">
                  Easy
                </option>
                <option value="Medium">
                  Medium
                </option>
                <option value="Hard">
                  Hard
                </option>
              </select>
              <select
                value={
                  qaFilters.arrangementType
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    arrangementType:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Arrangements
                </option>
                {filterOptions.arrangements.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.generationDomain
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    generationDomain:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Domains
                </option>
                {filterOptions.domains.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.validationStatus
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    validationStatus:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Validation States
                </option>
                {filterOptions.validationStatuses.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.reviewStatus
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    reviewStatus:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Review Status
                </option>
                <option value="unreviewed">
                  Unreviewed
                </option>
                <option value="approved">
                  Approved
                </option>
                <option value="rejected">
                  Rejected
                </option>
                <option value="flagged">
                  Flagged
                </option>
              </select>
              <select
                value={qaFilters.motif}
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    motif:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Logic Patterns
                </option>
                {filterOptions.motifs.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.archetype
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    archetype:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Archetypes
                </option>
                {filterOptions.archetypes.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.reviewAction
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    reviewAction:
                      e.target.value,
                  }))
                }
                className="border rounded p-2"
              >
                <option value="all">
                  All Review Actions
                </option>
                <option value="unreviewed">
                  Unreviewed
                </option>
                {QA_ACTION_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.action
                      }
                      value={
                        option.action
                      }
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
              <select
                value={
                  qaFilters.sortBy
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    sortBy:
                      e.target
                        .value as QAFilterState["sortBy"],
                  }))
                }
                className="border rounded p-2"
              >
                <option value="newest">
                  Generated Order
                </option>
                <option value="difficulty-desc">
                  Difficulty High to Low
                </option>
                <option value="difficulty-asc">
                  Difficulty Low to High
                </option>
                <option value="topic">
                  Topic
                </option>
                <option value="review-status">
                  Review Status
                </option>
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={
                  qaFilters.onlyRepeated
                }
                onChange={(e) =>
                  setQaFilters((prev) => ({
                    ...prev,
                    onlyRepeated:
                      e.target.checked,
                  }))
                }
              />
              Show only repetition-flagged items
            </label>
          </div>

          {selectedWorkspaceItem ? (
            <div
              key={`generated-workspace-${selectedVisibleIndex}-${selectedWorkspaceItem.fingerprint}`}
              className="space-y-3"
            >
              {renderQuestionWorkspace(
                selectedWorkspaceItem,
                qaNotes[
                  selectedWorkspaceItem
                    .fingerprint
                ] ?? "",
                qaIssueTags[
                  selectedWorkspaceItem
                    .fingerprint
                ] ??
                  selectedWorkspaceItem
                    .review
                    ?.issueTags ??
                  [],
                workspaceEditMode,
                refinementLoading,
                (value) =>
                  setQaNotes(
                    (prev) => ({
                      ...prev,
                      [selectedWorkspaceItem.fingerprint]:
                        value,
                    }),
                  ),
                (tag) =>
                  toggleQAIssueTag(
                    selectedWorkspaceItem.fingerprint,
                    tag,
                  ),
                () => {
                  if (
                    workspaceEditMode
                  ) {
                    refineQuestionAt(
                      selectedWorkspaceItem.index,
                    );
                    setPendingRefinementFingerprint(
                      null,
                    );
                  }
                  setWorkspaceEditMode(
                    (prev) => !prev,
                  );
                },
                (value) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) => ({
                      ...current,
                      text: value,
                    }),
                  ),
                (value) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) => ({
                      ...current,
                      explanation:
                        value,
                    }),
                  ),
                (
                  optionIndex,
                  value,
                ) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) => ({
                      ...current,
                      options:
                        current.options.map(
                          (
                            option,
                            index,
                          ) =>
                            index ===
                            optionIndex
                              ? value
                              : option,
                        ),
                    }),
                  ),
                (lang, value) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) =>
                      lang === "hi"
                        ? {
                            ...current,
                            textHi: value,
                          }
                        : {
                            ...current,
                            textPa: value,
                          },
                  ),
                (lang, value) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) =>
                      lang === "hi"
                        ? {
                            ...current,
                            explanationHi:
                              value,
                          }
                        : {
                            ...current,
                            explanationPa:
                              value,
                          },
                  ),
                (
                  lang,
                  optionIndex,
                  value,
                ) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) => {
                      const source =
                        lang === "hi"
                          ? current.optionsHi
                          : current.optionsPa;
                      const nextOptions = [
                        ...(source?.length
                          ? source
                          : current.options),
                      ];
                      nextOptions[
                        optionIndex
                      ] = value;
                      return lang === "hi"
                        ? {
                            ...current,
                            optionsHi:
                              nextOptions,
                          }
                        : {
                            ...current,
                            optionsPa:
                              nextOptions,
                          };
                    },
                  ),
                (clues) =>
                  updateGeneratedQuestionAt(
                    selectedWorkspaceItem.index,
                    (current) => ({
                      ...current,
                      debugMetadata: {
                        ...(current.debugMetadata ??
                          {}),
                        generatedClues:
                          clues,
                      },
                    }),
                  ),
                (
                  action,
                  status,
                ) =>
                  persistQAReview(
                    selectedWorkspaceItem,
                    action,
                    status,
                  ),
                () =>
                  toggleQABookmark(
                    selectedWorkspaceItem,
                  ),
                () =>
                  regenerateQuestion(
                    selectedWorkspaceItem.index,
                  ),
              )}
            </div>
          ) : null}

          <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-900">
                Review Queue
              </span>
              <span className="text-xs text-slate-500">
                Select an item to open it in the review workspace.
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map(
                (item) => (
                  <button
                    key={`tray-${item.fingerprint}`}
                    onClick={() =>
                      setReviewFocus(item)
                    }
                    className={`rounded-lg border p-3 text-left ${selectedWorkspaceFingerprint ===
                      item.fingerprint
                      ? "border-slate-900 bg-white shadow-sm"
                      : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium text-slate-900 line-clamp-2">
                        Question {item.index + 1}
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          {item.topic}
                        </span>
                      </div>
                      {item.review
                        ?.bookmarked ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-700">
                          Saved
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="rounded-full border px-2 py-1">
                        {item.difficulty}
                      </span>
                      <span className="rounded-full border px-2 py-1">
                        {item.validationStatus}
                      </span>
                      <span className="rounded-full border px-2 py-1">
                        realism {formatMetricValue(
                          item.realismScore,
                        )}
                      </span>
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
          {visibleItems.map(
            (item) => {
              const q =
                item.question;
              const idx =
                item.index;
              if (isDISet(q)) {
                return (
                  <div
                    key={item.fingerprint}
                    className="space-y-4"
                  >
                    {renderQAReviewPanel(
                      item,
                      qaNotes[
                        item.fingerprint
                      ] ?? "",
                      qaIssueTags[
                        item.fingerprint
                      ] ??
                        item.review
                          ?.issueTags ??
                        [],
                      (value) =>
                        setQaNotes(
                          (prev) => ({
                            ...prev,
                            [item.fingerprint]:
                              value,
                          }),
                        ),
                      (tag) =>
                        toggleQAIssueTag(
                          item.fingerprint,
                          tag,
                        ),
                      (
                        action,
                        status,
                      ) =>
                        persistQAReview(
                          item,
                          action,
                          status,
                        ),
                    )}
                    {renderDISet(
                      q,
                      idx,
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={item.fingerprint}
                  className={`border rounded-lg p-4 space-y-3 ${isDuplicateQuestion(idx)
                    ? "border-red-500 bg-red-50"
                    : ""
                    }`}
                >
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() =>
                        regenerateQuestion(idx)
                      }
                      className="text-blue-600 text-sm"
                    >
                      Regenerate Similar
                    </button>

                    <button
                      onClick={() => {
                        setGenerated(
                          generated.filter(
                            (
                              _: GeneratedQuestion,
                              questionIndex: number,
                            ) =>
                              questionIndex !==
                              idx,
                          ),
                        );
                      }}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  {isDuplicateQuestion(
                    idx,
                  ) && (
                      <div className="text-red-600 text-sm font-medium">
                        Duplicate Question
                      </div>
                    )}
                  {(() => {
                    const questionEditKey = `question-${idx}`;
                    const explanationEditKey = `explanation-${idx}`;

                    return (
                      <>
                  <div className="font-medium">
                    <div className="rounded border bg-white p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Question Preview
                      </div>
                      {activeInlineEditKey ===
                      questionEditKey ? (
                        <textarea
                          value={q.text}
                          onChange={(e) => {
                            const updated = [
                              ...generated,
                            ];

                            updated[idx].text =
                              e.target.value;

                            setGenerated(updated);
                          }}
                          onBlur={() =>
                            setActiveInlineEditKey(
                              null,
                            )
                          }
                          autoFocus
                          className="min-h-[96px] w-full rounded border p-2 text-sm"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveInlineEditKey(
                              questionEditKey,
                            )
                          }
                          className="w-full rounded text-left text-sm text-slate-900 transition hover:bg-slate-50"
                        >
                          <span className="mr-1">
                            {idx + 1}.
                          </span>
                          <MathText
                            content={q.text}
                            inline
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {(q.seatingExplanationFlow ??
                    q.debugMetadata
                      ?.seatingExplanationFlow) ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Coaching Explanation
                      </div>
                      <SeatingExplanationFlow
                        flow={
                          q.seatingExplanationFlow ??
                          q.debugMetadata
                            ?.seatingExplanationFlow
                        }
                      />
                    </div>
                  ) : (q.seatingDiagram ??
                    q.debugMetadata
                      ?.seatingDiagram) ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Final Arrangement Diagram
                      </div>
                      <SeatingDiagramRenderer
                        diagram={
                          q.seatingDiagram ??
                          q.debugMetadata
                            ?.seatingDiagram
                        }
                        inferenceTrace={
                          q.inferenceTrace
                        }
                      />
                    </div>
                  ) : null}

                  {renderSolverTraceWorkbench(
                    q,
                  )}

                  {renderQAReviewPanel(
                    item,
                    qaNotes[
                      item.fingerprint
                    ] ?? "",
                    qaIssueTags[
                      item.fingerprint
                    ] ??
                      item.review
                        ?.issueTags ??
                      [],
                    (value) =>
                      setQaNotes(
                        (prev) => ({
                          ...prev,
                          [item.fingerprint]:
                            value,
                        }),
                      ),
                    (tag) =>
                      toggleQAIssueTag(
                        item.fingerprint,
                        tag,
                      ),
                    (
                      action,
                      status,
                    ) =>
                      persistQAReview(
                        item,
                        action,
                        status,
                      ),
                  )}

                  {renderDifficultyAnalytics(
                    q,
                  )}

                  <div className="space-y-2">
                    {q.options?.map(
                      (
                        opt: string,
                        i: number,
                      ) => {
                        const optionEditKey = `option-${idx}-${i}`;
                        return (
                          <div
                            key={i}
                            className={`border rounded p-2 ${q.correct === i
                              ? "bg-green-100"
                              : ""
                              }`}
                          >
                            {activeInlineEditKey ===
                            optionEditKey ? (
                              <input
                                value={opt}
                                onChange={(e) => {
                                  const updated = [
                                    ...generated,
                                  ];

                                  updated[idx].options[i] =
                                    e.target.value;

                                  setGenerated(updated);
                                }}
                                onBlur={() =>
                                  setActiveInlineEditKey(
                                    null,
                                  )
                                }
                                autoFocus
                                className="w-full rounded border p-2 bg-white outline-none"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveInlineEditKey(
                                    optionEditKey,
                                  )
                                }
                                className="w-full text-left text-sm text-slate-900 transition hover:bg-white/70"
                              >
                                <MathText
                                  content={opt}
                                  inline
                                />
                              </button>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Correct Answer:
                    </span>

                    <select
                      value={q.correct}
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].correct =
                          Number(
                            e.target.value,
                          );

                        setGenerated(updated);
                      }}
                      className="border rounded p-2"
                    >
                      {q.options.map(
                        (
                          _: string,
                          optionIndex: number,
                        ) => (
                          <option
                            key={optionIndex}
                            value={optionIndex}
                          >
                            Option{" "}
                            {optionIndex + 1}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>
                      <label className="text-sm font-medium">
                        Topic
                      </label>

                      <input
                        value={q.topic || ""}
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].topic =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Section
                      </label>

                      <input
                        value={
                          q.section || ""
                        }
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].section =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Difficulty
                      </label>

                      <select
                        value={
                          q.difficulty ||
                          "Easy"
                        }
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].difficulty =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      >
                        <option value="Easy">
                          Easy
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="Hard">
                          Hard
                        </option>
                      </select>
                    </div>
                    <div className="rounded border bg-white p-3 text-sm text-slate-700">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Explanation Preview
                      </div>
                      {activeInlineEditKey ===
                      explanationEditKey ? (
                        <textarea
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = [
                              ...generated,
                            ];

                            updated[idx].explanation =
                              e.target.value;

                            setGenerated(updated);
                          }}
                          onBlur={() =>
                            setActiveInlineEditKey(
                              null,
                            )
                          }
                          autoFocus
                          className="min-h-[120px] w-full rounded border p-2 text-sm"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveInlineEditKey(
                              explanationEditKey,
                            )
                          }
                          className="w-full rounded text-left transition hover:bg-slate-50"
                        >
                          <MathText
                            content={
                              q.explanation || ""
                            }
                          />
                        </button>
                      )}
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </div>
             );
},
          )}
          </div>
          </>
          ) : null}
        </div>
      )}
    </div>
  );
}
