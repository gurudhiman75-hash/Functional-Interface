export const QUANT_V4_EDUCATION_CONTRACT_VERSION = "1.0.0" as const;

export type QuantV4EducationDifficulty = "foundation" | "easy" | "medium" | "hard" | "advanced";

export type QuantV4EducationTopic =
  | "percentage"
  | "ratio"
  | "average"
  | "profit-loss"
  | "time-work"
  | "time-speed-distance"
  | "simple-interest"
  | "compound-interest"
  | "mixture-alligation"
  | "number-system"
  | "algebra"
  | "geometry"
  | "mensuration"
  | "data-interpretation"
  | "general-quant";

export interface QuantV4EducationExample {
  id: string;
  prompt: string;
  teachingMove: string;
  result?: string;
}

export interface QuantV4EducationLibraryMeta {
  version: typeof QUANT_V4_EDUCATION_CONTRACT_VERSION | string;
  status: "foundation" | "draft" | "active" | "deprecated";
  owner: "quant-v4-platform";
  description: string;
}

export interface Strategy {
  id: string;
  topic: QuantV4EducationTopic;
  title: string;
  description: string;
  applicableCPs: readonly string[];
  difficulty: QuantV4EducationDifficulty;
  reusableExamples: readonly QuantV4EducationExample[];
  tags?: readonly string[];
}

export interface MentalShortcut {
  id: string;
  topic: QuantV4EducationTopic;
  title: string;
  pattern: string;
  shortcut: string;
  explanation: string;
  difficulty: QuantV4EducationDifficulty;
  examples?: readonly QuantV4EducationExample[];
  tags?: readonly string[];
}

export interface ExamTrap {
  id: string;
  topic: QuantV4EducationTopic;
  misconception: string;
  whyItHappens: string;
  correction: string;
  detectionHints?: readonly string[];
  examples?: readonly QuantV4EducationExample[];
  tags?: readonly string[];
}

export interface RealismContext {
  id: string;
  domain: string;
  context: string;
  description: string;
  usableFor: readonly QuantV4EducationTopic[];
  naturalQuantities: readonly string[];
  avoidWhen?: readonly string[];
  tags?: readonly string[];
}

export interface TerminologyEntry {
  id: string;
  concept: string;
  preferred: string;
  avoid: readonly string[];
  rationale: string;
  examples?: readonly string[];
}

export interface PedagogyRule {
  id: string;
  title: string;
  principle: string;
  do: readonly string[];
  avoid: readonly string[];
  appliesTo: readonly QuantV4EducationTopic[];
  enforcementStage: "authoring" | "review" | "content-ready" | "production-ready";
}

export interface QuantV4EducationReferenceSet {
  strategyIds?: readonly string[];
  shortcutIds?: readonly string[];
  trapIds?: readonly string[];
  realismIds?: readonly string[];
  terminologyIds?: readonly string[];
  pedagogyRuleIds?: readonly string[];
}

export interface QuantV4EducationTraceability {
  educationContractVersion: typeof QUANT_V4_EDUCATION_CONTRACT_VERSION | string;
  references: QuantV4EducationReferenceSet;
}

export interface StrategyLibrary {
  meta: QuantV4EducationLibraryMeta;
  strategies: readonly Strategy[];
}

export interface MentalShortcutLibrary {
  meta: QuantV4EducationLibraryMeta;
  shortcuts: readonly MentalShortcut[];
}

export interface ExamTrapLibrary {
  meta: QuantV4EducationLibraryMeta;
  traps: readonly ExamTrap[];
}

export interface RealismLibrary {
  meta: QuantV4EducationLibraryMeta;
  contexts: readonly RealismContext[];
}

export interface TerminologyLibrary {
  meta: QuantV4EducationLibraryMeta;
  entries: readonly TerminologyEntry[];
}

export interface PedagogyLibrary {
  meta: QuantV4EducationLibraryMeta;
  rules: readonly PedagogyRule[];
}
