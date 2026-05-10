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
  SeatingExplanationFlow,
} from "@workspace/api-zod";
import MathText from "@/components/MathText";
import SeatingExplanationFlow from "@/components/seating/SeatingExplanationFlow";
import SeatingDiagramRenderer from "@/components/seating/SeatingDiagramRenderer";

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

function mergeRequiredRegistryPatterns(
  registryPatterns: any[],
) {
  const byId = new Map();

  for (const pattern of registryPatterns) {
    if (
      pattern?.id &&
      !byId.has(pattern.id)
    ) {
      byId.set(pattern.id, pattern);
    }
  }

  for (const pattern of REQUIRED_REGISTRY_PATTERNS) {
    if (!byId.has(pattern.id)) {
      byId.set(pattern.id, pattern);
    }
  }

  return [...byId.values()];
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
  seatingExplanationFlow?: SeatingExplanationFlow;
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
  proceduralScenario?: {
    domain: string;
    subtype: string;
  };
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
  seatingExplanationFlow?: SeatingExplanationFlow;
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
  seatingExplanationFlow?: SeatingExplanationFlow;
};

type GeneratedQuestion =
  | FormulaQuestion
  | DISet;

type FilingSubjectId =
  | "reasoning"
  | "quant"
  | "ga"
  | "english"
  | "punjabi";

type FilingConfig = {
  subjectId: FilingSubjectId | "";
  topicId: string;
  subTopicId: string;
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
  onlyRepeated: boolean;
  sortBy:
    | "newest"
    | "difficulty-desc"
    | "difficulty-asc"
    | "topic"
    | "review-status";
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
      90000,
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
  topicId: "",
  subTopicId: "",
  difficulty: 3,
  targetExams: [],
  tags: "",
};

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

  if (languages.includes("hi")) {
    prepared.textHi =
      prepared.textHi ?? "";
    prepared.optionsHi =
      prepared.optionsHi ?? [
        "",
        "",
        "",
        "",
      ];
    prepared.explanationHi =
      prepared.explanationHi ?? "";
  }

  if (languages.includes("pa")) {
    prepared.textPa =
      prepared.textPa ?? "";
    prepared.optionsPa =
      prepared.optionsPa ?? [
        "",
        "",
        "",
        "",
      ];
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
        topic_id: filing.topicId,
        sub_topic_id: filing.subTopicId,
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
          generated_at:
            new Date().toISOString(),
        },
      };
    });
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
                <div className="rounded border bg-white p-3 text-sm">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Answer
                  </div>
                  <MathText
                    content={
                      question.options[
                        question.correct
                      ] ?? "NA"
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

export default function AdminGeneratorPage() {
  const [patternId, setPatternId] =
    useState("");
  const [
    generationMode,
    setGenerationMode,
  ] = useState<"registry" | "legacy">(
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

  const [generated, setGenerated] =
    useState<GeneratedQuestion[]>([]);
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
    workspaceEditMode,
    setWorkspaceEditMode,
  ] = useState(false);
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
        setRegistryDomain(
          (
            registryPatterns.find(
              (pattern: any) =>
                pattern.enabled !== false,
            ) ?? registryPatterns[0]
          )?.domain ?? "all",
        );
        setRegistryPatternId(
          (
            registryPatterns.find(
              (pattern: any) =>
                pattern.enabled !== false,
            ) ?? registryPatterns[0]
          )?.id ?? "",
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadPatterns();
  }, []);

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
              registryLanguages,
            availableLangs:
              registryLanguages,
            enableNameClash,
            count,
          }
          : {
            patternId,
            count,
            languages:
              registryLanguages,
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
          `Generation failed with status ${res.status}`,
        );
      }

      const data = await res.json();

      console.log(data);

      const nextQuestions = (
        data.questions || []
      ).map((question: GeneratedQuestion) =>
        useRegistryPattern
          ? prepareGeneratedQuestionForLanguages(
              question,
              registryLanguages,
              selectedRegistryPattern.id,
            )
          : prepareGeneratedQuestionForLanguages(
              question,
              registryLanguages,
              patternId,
            ),
      );

      setGenerated((prev) => [
        ...prev,
        ...nextQuestions,
      ]);
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
            count: 1,
          }
          : {
            patternId,
            count: 1,
            languages:
              registryLanguages,
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
  function openFilingDrawer() {
    if (!generated.length) {
      return;
    }

    const primary = getPrimaryQuestion(
      generated[0],
    );
    const inferredSubject =
      (primary?.section ?? "")
        .toLowerCase()
        .includes("reason")
        ? "reasoning"
        : (primary?.section ?? "")
            .toLowerCase()
            .includes("english")
          ? "english"
          : (primary?.section ?? "")
              .toLowerCase()
              .includes("punjabi")
            ? "punjabi"
            : (primary?.section ?? "")
                .toLowerCase()
                .includes("quant")
              ? "quant"
              : "";

    setFilingConfig((prev) => ({
      ...prev,
      subjectId:
        prev.subjectId ||
        (inferredSubject as FilingSubjectId | ""),
    }));
    setFilingDrawerOpen(true);
  }

  async function saveQuestions() {
    const filingPayloads =
      buildFilingPayloads(
        generated,
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
        "Only formula/reasoning questions can be filed from this drawer right now.",
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

      const topic =
        FILING_TAXONOMY.find(
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
        FILING_TAXONOMY.flatMap(
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
      setGenerated([]);
      setFilingConfig(
        DEFAULT_FILING_CONFIG,
      );
      setFilingToast(
        `Logic Object ${data.questions?.[0]?.id ?? data.count ?? ""} successfully filed under ${topic}${subTopic ? ` > ${subTopic}` : ""}.`,
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
        const fingerprint =
          getQuestionFingerprint(
            question,
          );
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
          : (item.review?.status ??
              "unreviewed") ===
            qaFilters.reviewStatus,
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
            return (
              left.review?.status ??
              "unreviewed"
            ).localeCompare(
              right.review?.status ??
                "unreviewed",
            );
          case "newest":
          default:
            return (
              right.index -
              left.index
            );
        }
      });

  useEffect(() => {
    if (!visibleItems.length) {
      setSelectedWorkspaceFingerprint(
        null,
      );
      setWorkspaceEditMode(false);
      return;
    }

    if (
      !selectedWorkspaceFingerprint ||
      !visibleItems.some(
        (item) =>
          item.fingerprint ===
          selectedWorkspaceFingerprint,
      )
    ) {
      setSelectedWorkspaceFingerprint(
        visibleItems[0]
          ?.fingerprint ?? null,
      );
      setWorkspaceEditMode(false);
    }
  }, [
    visibleItems,
    selectedWorkspaceFingerprint,
  ]);

  const selectedWorkspaceItem =
    visibleItems.find(
      (item) =>
        item.fingerprint ===
        selectedWorkspaceFingerprint,
    ) ?? null;

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

  const selectedRegistryPattern =
    questionPatterns.find(
      (pattern) =>
        pattern.id ===
        registryPatternId,
    );
  const registryDomains = [
    "quant",
    "reasoning",
    "english",
    "punjabi",
    "knowledge",
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
  const selectedFilingSubject =
    FILING_TAXONOMY.find(
      (subject) =>
        subject.id ===
        filingConfig.subjectId,
    );
  const selectedFilingTopic =
    selectedFilingSubject?.topics.find(
      (topic) =>
        topic.id ===
        filingConfig.topicId,
    );
  const filingPayloadPreview =
    buildFilingPayloads(
      generated,
      filingConfig,
    );

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
                    Subject
                  </span>
                  <select
                    value={filingConfig.subjectId}
                    onChange={(event) =>
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          subjectId:
                            event.target
                              .value as FilingSubjectId,
                          topicId: "",
                          subTopicId: "",
                        }),
                      )
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">
                      Select subject
                    </option>
                    {FILING_TAXONOMY.map(
                      (subject) => (
                        <option
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Topic
                  </span>
                  <select
                    value={filingConfig.topicId}
                    onChange={(event) =>
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          topicId:
                            event.target.value,
                          subTopicId: "",
                        }),
                      )
                    }
                    disabled={!selectedFilingSubject}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                  >
                    <option value="">
                      Select topic
                    </option>
                    {selectedFilingSubject?.topics.map(
                      (topic) => (
                        <option
                          key={topic.id}
                          value={topic.id}
                        >
                          {topic.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">
                    Sub-Topic
                  </span>
                  <select
                    value={filingConfig.subTopicId}
                    onChange={(event) =>
                      setFilingConfig(
                        (prev) => ({
                          ...prev,
                          subTopicId:
                            event.target.value,
                        }),
                      )
                    }
                    disabled={!selectedFilingTopic}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                  >
                    <option value="">
                      Select sub-topic
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
          <button
            type="button"
            onClick={() =>
              setGenerationMode(
                "legacy",
              )
            }
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              generationMode ===
              "legacy"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Legacy Template
          </button>
        </div>

        {generationMode ===
        "registry" ? (
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
                  const firstEnabled =
                    questionPatterns.find(
                      (pattern) =>
                        (nextDomain ===
                          "all" ||
                          pattern.domain ===
                            nextDomain) &&
                        pattern.enabled !==
                          false,
                    );

                  setRegistryDomain(
                    nextDomain,
                  );
                  if (firstEnabled) {
                    setRegistryPatternId(
                      firstEnabled.id,
                    );
                    if (
                      firstEnabled
                        .supportedDifficulties
                        ?.length &&
                      !firstEnabled.supportedDifficulties.includes(
                        registryDifficulty,
                      )
                    ) {
                      setRegistryDifficulty(
                        firstEnabled
                          .supportedDifficulties[0],
                      );
                    }
                  }
                }}
                className="border rounded p-2 w-full bg-white"
              >
                <option value="all">
                  All Domains
                </option>
                {registryDomains.map(
                  (domain) => (
                    <option
                      key={domain}
                      value={domain}
                    >
                      {domain}
                    </option>
                  ),
                )}
                </select>
              </div>

            <div className="space-y-2 xl:col-span-3">
              <label className="block text-sm font-medium">
                Topic / Pattern
              </label>
              <select
                value={registryPatternId}
                onChange={(event) => {
                  const nextPattern =
                    questionPatterns.find(
                      (pattern) =>
                        pattern.id ===
                        event.target.value,
                    );

                  setRegistryPatternId(
                    event.target.value,
                  );
                  if (
                    nextPattern
                      ?.supportedDifficulties
                      ?.length &&
                    !nextPattern.supportedDifficulties.includes(
                      registryDifficulty,
                    )
                  ) {
                    setRegistryDifficulty(
                      nextPattern
                        .supportedDifficulties[0],
                    );
                  }
                }}
                className="border rounded p-2 w-full bg-white"
              >
                <option value="">
                  Select registry pattern
                </option>
                {registryDomains
                  .filter(
                    (domain) =>
                      registryDomain ===
                        "all" ||
                      domain ===
                        registryDomain,
                  )
                  .map(
                  (domain) => {
                    const domainPatterns =
                      visibleRegistryPatterns.filter(
                        (pattern) =>
                          pattern.domain ===
                          domain,
                      );
                    const topics = [
                      ...new Set(
                        domainPatterns.map(
                          (pattern) =>
                            pattern.topic,
                        ),
                      ),
                    ];

                    return topics.map(
                      (topic) => (
                        <optgroup
                          key={`${domain}-${topic}`}
                          label={`${domain.toUpperCase()} - ${topic}`}
                        >
                          {domainPatterns
                            .filter(
                              (pattern) =>
                                pattern.topic ===
                                topic,
                            )
                            .map(
                              (pattern) => (
                                <option
                                  key={
                                    pattern.id
                                  }
                                  value={
                                    pattern.id
                                  }
                                  disabled={
                                    pattern.enabled ===
                                    false
                                  }
                                >
                                  {pattern.label}
                                  {pattern.enabled ===
                                  false
                                    ? " (Coming Soon)"
                                    : ""}
                                </option>
                              ),
                            )}
                        </optgroup>
                      ),
                    );
                  },
                )}
              </select>
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
                          language.locked
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
                          language.locked
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
                              disabled={language.locked}
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
                          {language.description}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
              <p className="text-xs text-slate-500">
                The generator will request these languages, and any Hindi/Punjabi fields returned will appear in the selected question preview pane for editing.
              </p>
            </div>

          </div>

            {selectedRegistryPattern ? (
              <div className="text-xs text-slate-600">
                {selectedRegistryPattern.domain} /{" "}
                {selectedRegistryPattern.topic} /{" "}
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
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Legacy Saved Pattern
              </h2>
              <p className="text-sm text-slate-600">
                Generate from the original pattern-template workflow using a stored editable pattern.
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Saved Pattern
              </label>

              <select
                value={patternId}
                onChange={(e) =>
                  setPatternId(
                    e.target.value,
                  )
                }
                className="border rounded p-2 w-full bg-white"
              >
                <option value="">
                  Select Pattern
                </option>

                {patterns.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name} (
                    {p.topic})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">
            Number of Questions
          </label>

          <input
            type="number"
            value={count}
            min="1"
            max="50"
            onChange={(e) =>
              setCount(
                Math.min(
                  50,
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
            setGenerated([])
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-6">
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
                  Newest First
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
            <div className="space-y-3">
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
                    onClick={() => {
                      setSelectedWorkspaceFingerprint(
                        item.fingerprint,
                      );
                      setWorkspaceEditMode(
                        false,
                      );
                    }}
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
        </div>
      )}
    </div>
  );
}
