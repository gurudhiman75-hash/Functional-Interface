import type {
  ExamTrap,
  MentalShortcut,
  PedagogyRule,
  QuantV4EducationReferenceSet,
  Strategy,
  TerminologyEntry,
} from "./contracts";
import type { QuantV4AnswerLike, QuantV4CanonicalAnswer } from "../answers/answer-contract";

export const QUANT_V4_ERE_CONTRACT_VERSION = "1.0.0" as const;

export type EducationalRendererTarget = "blocks" | "markdown" | "mathjax" | "html" | "pdf" | "flutter-card" | "statement-math-lines";

export type EducationalBlockKind =
  | "introduction"
  | "teaching-step"
  | "math-illustration"
  | "shortcut"
  | "trap-warning"
  | "recap"
  | "final-answer";

export type MathIllustrationKind = "percentage" | "fraction" | "ratio" | "equation" | "unit" | "currency" | "numeric" | "symbolic";

export interface EducationalReviewMetadata {
  author?: string;
  reviewer?: string;
  reviewStatus?: "draft" | "needs-review" | "reviewed" | "approved" | "deprecated";
  reviewDate?: string;
  version?: string;
  confidence?: number;
}

export interface EducationalKnowledgeLink {
  sourceId: string;
  targetId: string;
  relation:
    | "uses"
    | "supports"
    | "warns-about"
    | "phrased-by"
    | "governed-by"
    | "prerequisite"
    | "related";
  rationale?: string;
}

export interface EducationalReasoningNode {
  id?: string;
  label?: string;
  statement?: string;
  expression?: string;
  consequence?: string;
  value?: unknown;
  unit?: string;
  tags?: readonly string[];
  metadata?: Record<string, unknown>;
}

export interface EducationalReasoningGraphLike {
  nodes?: readonly EducationalReasoningNode[];
  steps?: readonly EducationalReasoningNode[];
  edges?: readonly unknown[];
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface ResolvedStrategy extends Strategy {
  source: "explicit" | "fallback" | "inferred";
  order: number;
  prerequisites?: readonly string[];
  relatedShortcutIds?: readonly string[];
  relatedTrapIds?: readonly string[];
  relatedPedagogyRuleIds?: readonly string[];
  relatedTerminologyIds?: readonly string[];
  review?: EducationalReviewMetadata;
}

export interface ResolvedShortcut extends MentalShortcut {
  source: "explicit" | "related" | "inferred";
  usefulness: "primary-support" | "speed-up" | "optional";
  review?: EducationalReviewMetadata;
}

export interface ResolvedTrap extends ExamTrap {
  source: "explicit" | "related" | "inferred";
  relevance: "high" | "medium" | "low";
  review?: EducationalReviewMetadata;
}

export interface ResolvedPedagogyRule extends PedagogyRule {
  source: "explicit" | "strategy-related" | "default";
  priority: number;
  review?: EducationalReviewMetadata;
}

export interface ResolvedTerminologyEntry extends TerminologyEntry {
  source: "explicit" | "pedagogy-related" | "default";
  review?: EducationalReviewMetadata;
}

export interface MathIllustration {
  id: string;
  kind: MathIllustrationKind;
  statement: string;
  mathjax: string;
  consequence: string;
  sourceNodeId?: string;
  review?: EducationalReviewMetadata;
}

export interface EducationalTeachingStep {
  id: string;
  title?: string;
  narrative: string;
  mathIllustrationIds: readonly string[];
  strategyIds: readonly string[];
  pedagogyRuleIds: readonly string[];
  terminologyIds: readonly string[];
  review?: EducationalReviewMetadata;
}

export interface ChapterOwnedEducationalStep {
  id: string;
  title?: string;
  statement: string;
  mathjax: string;
  consequence?: string;
  kind?: MathIllustrationKind;
  assetIds?: readonly string[];
  sourceNodeId?: string;
  review?: EducationalReviewMetadata;
}

export interface EducationalShortcutBlock {
  id: string;
  shortcutId: string;
  title: string;
  explanation: string;
  mathIllustrationIds: readonly string[];
  review?: EducationalReviewMetadata;
}

export interface EducationalTrapWarning {
  id: string;
  trapId: string;
  misconception: string;
  correction: string;
  relevance: "high" | "medium" | "low";
  review?: EducationalReviewMetadata;
}

export interface EducationalExplanationBlock {
  id: string;
  kind: EducationalBlockKind;
  title?: string;
  markdown: string;
  mathjax?: string;
  assetIds?: readonly string[];
  review?: EducationalReviewMetadata;
}

export interface EducationalExplanation {
  contractVersion: typeof QUANT_V4_ERE_CONTRACT_VERSION | string;
  introduction: string;
  teachingSteps: readonly EducationalTeachingStep[];
  mathIllustrations: readonly MathIllustration[];
  shortcutBlocks: readonly EducationalShortcutBlock[];
  trapWarnings: readonly EducationalTrapWarning[];
  recap: string;
  finalAnswer: string;
  blocks: readonly EducationalExplanationBlock[];
  knowledgeLinks: readonly EducationalKnowledgeLink[];
  review?: EducationalReviewMetadata;
}

export interface EducationRenderResult {
  target: EducationalRendererTarget;
  blocks: readonly EducationalExplanationBlock[];
  markdown?: string;
  mathjax?: string;
  html?: string;
  lines?: readonly string[];
  futurePayload?: unknown;
}

export interface EducationalRenderingInput {
  reasoningGraph?: EducationalReasoningGraphLike | readonly EducationalReasoningNode[] | unknown;
  educationTraceability?: { references?: QuantV4EducationReferenceSet } | QuantV4EducationReferenceSet;
  answer?: QuantV4AnswerLike;
  canonicalAnswer?: QuantV4CanonicalAnswer;
  stem?: string;
  topic?: string;
  canonicalProblemId?: string;
  taskKind?: string;
  metadata?: Record<string, unknown>;
}

export interface EducationalAssetBundle {
  strategies?: readonly Partial<ResolvedStrategy>[];
  shortcuts?: readonly Partial<ResolvedShortcut>[];
  traps?: readonly Partial<ResolvedTrap>[];
  pedagogyRules?: readonly Partial<ResolvedPedagogyRule>[];
  terminologyEntries?: readonly Partial<ResolvedTerminologyEntry>[];
  knowledgeLinks?: readonly EducationalKnowledgeLink[];
}

export interface EducationalResolverContext {
  input: EducationalRenderingInput;
  references: QuantV4EducationReferenceSet;
  assets: EducationalAssetBundle;
}

export interface ExplanationComposerInput extends EducationalRenderingInput {
  assets?: EducationalAssetBundle;
  chapterOwnedSteps?: readonly ChapterOwnedEducationalStep[];
}
