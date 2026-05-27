import type { ExamProfileId, FormulaQuestion } from "../../lib/core/generator-engine";
import type {
  CorpusSchedulerProfileId,
  CorpusSchedulerSummary,
} from "../corpus-scheduler/corpus-scheduler";
import type { CorpusQualityReport } from "../corpus-scheduler/corpus-quality-evaluator";
import type {
  MigratedQuantV2Domain,
  QuantV2TopicId,
  QuantV2TopologyGroup,
  QuantV2TopologyGroupId,
} from "../../lib/quant-v2/migrated-quant-topics";

export type CorpusAuditPresetId =
  | "ssc_percentage_audit"
  | "profit_loss_audit"
  | "interest_audit"
  | "ratio_proportion_audit"
  | "time_work_audit"
  | "banking_relational_audit"
  | "percentage_advanced_coverage_audit"
  | "punjabi_realism_audit"
  | "compactness_stress_test"
  | "difficulty_distribution_audit";

export type CorpusAuditStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type CorpusAuditExportProfileId =
  | "audit_light"
  | "multilingual_review"
  | "realism_review"
  | "topology_audit"
  | "editorial_pdf";

export interface CorpusAuditExportProfile {
  id: CorpusAuditExportProfileId;
  label: string;
  description: string;
  includeMultilingualExplanations: boolean;
  includeLocalizationMetadata: boolean;
  includeCompactnessMetadata: boolean;
  includeReasoningGraph: boolean;
  includeValidatorReports: boolean;
  includeRealismMetadata: boolean;
  includeSvgByDefault: boolean;
}

export interface CorpusAuditPreset {
  id: CorpusAuditPresetId;
  label: string;
  description: string;
  defaultCount: number;
  topicId?: QuantV2TopicId;
  generationDomain?: MigratedQuantV2Domain;
  defaultTopology?: QuantV2TopologyGroupId;
  topologyOptions?: readonly QuantV2TopologyGroup[];
  schedulerProfiles?: readonly string[];
  examProfile: ExamProfileId;
  seedPrefix: string;
  forcedMotifIds?: string[];
  languages: Array<"en" | "hi" | "pa">;
}

export interface CorpusAuditExportOptions {
  count: number;
  presetId?: CorpusAuditPresetId;
  outDir?: string;
  seed?: string;
  examProfile?: ExamProfileId;
  batchSize?: number;
  includeSvg?: boolean;
  includeFullQuestion?: boolean;
  forcedMotifIds?: string[];
  languages?: Array<"en" | "hi" | "pa">;
  topologySelection?: QuantV2TopologyGroupId;
  realismProfile?: "balanced" | "pyq" | "stress";
  compactnessProfile?: "compact" | "balanced" | "ultra_compact";
  difficultyMix?: "balanced" | "easy" | "medium" | "hard";
  formats?: Array<"json" | "txt" | "summary" | "pdf">;
  exportProfile?: CorpusAuditExportProfileId;
  includeMultilingualExplanations?: boolean;
  useScheduler?: boolean;
  schedulerProfile?: CorpusSchedulerProfileId;
}

export interface CorpusAuditExportItem {
  index: number;
  id: string;
  question: string;
  options: string[];
  correct: number;
  answer: string;
  explanation: string;
  explanationHi?: string;
  explanationPa?: string;
  multilingual: {
    en: {
      question: string;
      options: string[];
      explanation: string;
    };
    hi?: {
      question: string;
      options: string[];
      explanation?: string;
    };
    pa?: {
      question: string;
      options: string[];
      explanation?: string;
    };
  };
  difficulty: string;
  topology: unknown;
  reasoningGraph: unknown;
  semanticMetadata: unknown;
  visual?: unknown;
  validatorReports: unknown;
  traps: unknown;
  qualityMetrics: unknown;
  realismMetadata: unknown;
  difficultyMetadata: unknown;
  compactnessProfile: string;
  semanticAnchors: unknown;
  corpusRealism: unknown;
  svgRendering?: unknown;
  sourceQuestion?: FormulaQuestion;
}

export interface CorpusAuditSummary {
  runId?: string;
  seed?: string;
  explicitSeed?: boolean;
  generatedCount: number;
  topologyDistribution: Record<string, number>;
  subtypeDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  compactnessDistribution: Record<string, number>;
  domainDistribution: Record<string, number>;
  objectFrequency: Record<string, number>;
  realismScores: {
    min: number;
    max: number;
    average: number;
  };
  validatorFailureCounts: Record<string, number>;
  repeatedStructureWarnings: string[];
  multilingualConsistency: {
    hindiCoverage: number;
    punjabiCoverage: number;
    hindiScriptConsistency: number;
    punjabiScriptConsistency: number;
    hindiExplanationCoverage: number;
    punjabiExplanationCoverage: number;
    localizationCompleteness: number;
    fallbackCount: number;
  };
  explanationCompactness: {
    englishAverageLines: number;
    hindiAverageLines: number;
    punjabiAverageLines: number;
  };
  exportProfile: CorpusAuditExportProfileId;
  includeMultilingualExplanations: boolean;
  estimatedSizeMb: number;
  exportWarnings: string[];
  scheduler?: CorpusSchedulerSummary;
  corpusQuality?: CorpusQualityReport;
}

export interface CorpusAuditExportResult {
  exportId: string;
  status: "completed";
  count: number;
  outputDir: string;
  files: {
    json: string;
    txt: string;
    summary: string;
    preview: string;
    pdf?: string;
  };
  summary: CorpusAuditSummary;
  durationMs: number;
}

export interface CorpusAuditJobSnapshot {
  id: string;
  status: CorpusAuditStatus;
  requestedCount: number;
  generatedCount: number;
  progress: number;
  presetId?: CorpusAuditPresetId;
  outputDir?: string;
  files?: CorpusAuditExportResult["files"];
  summary?: CorpusAuditSummary;
  errorMessage?: string;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}
