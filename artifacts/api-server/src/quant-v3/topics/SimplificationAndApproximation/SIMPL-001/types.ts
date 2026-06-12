export type SimplPackageId = "SIMPL-001";

export type SimplCpId =
  | "CP-001"
  | "CP-002"
  | "CP-003"
  | "CP-004"
  | "CP-005"
  | "CP-006"
  | "CP-007";

export type SimplTopologyId =
  | "SIMPL-001-T01"
  | "SIMPL-001-T02"
  | "SIMPL-001-T03"
  | "SIMPL-001-T04"
  | "SIMPL-001-T05"
  | "SIMPL-001-T06"
  | "SIMPL-001-T07";

export type SimplReasoningPatternId =
  | "RP-001"
  | "RP-002"
  | "RP-003"
  | "RP-004"
  | "RP-005"
  | "RP-006"
  | "RP-007";

export type SimplDifficultyBand = "Easy" | "Medium" | "Hard";

export type SimplQuestionLanguageId = `QL-${string}`;

export type SimplExplanationId =
  | "ES-001"
  | "ES-002"
  | "ES-003"
  | "ES-004"
  | "ES-005"
  | "ES-006"
  | "ES-007";

export type OwnershipStatus = "HUMAN_OWNED";
export type RuntimeUsage = "Runtime Consumption Only";

export interface CpRegistryEntry {
  cpId: SimplCpId;
  packageId: SimplPackageId;
  title: string;
  topologyId: SimplTopologyId;
  reasoningPatternIds: SimplReasoningPatternId[];
  explanationId: SimplExplanationId;
  qlStart: SimplQuestionLanguageId;
  qlEnd: SimplQuestionLanguageId;
}

export interface TopologyRegistryEntry {
  topologyId: SimplTopologyId;
  packageId: SimplPackageId;
  parentCpId: SimplCpId;
  title: string;
  outputType: string;
  coverageStatus: "covered";
}

export interface ReasoningPatternRegistryEntry {
  patternId: SimplReasoningPatternId;
  packageId: SimplPackageId;
  title: string;
  supportedCpIds: SimplCpId[];
  steps: string[];
}

export interface DifficultyRegistryEntry {
  cpId: SimplCpId;
  packageId: SimplPackageId;
  bands: Record<SimplDifficultyBand, string[]>;
}

export interface RuntimePolicy {
  may: string[];
  mayNot: string[];
}

export interface QuestionLanguageEntry {
  id: SimplQuestionLanguageId;
  text: string;
}

export interface QuestionLanguageCpBlock {
  cpId: SimplCpId;
  name: string;
  entries: QuestionLanguageEntry[];
}

export interface QuestionLanguageLibrary {
  libraryId: string;
  archetypeId: SimplPackageId;
  ownership: OwnershipStatus;
  status: string;
  sourceAuthority: "simpl-001-language-draft.md";
  runtimePolicy: RuntimePolicy;
  canonicalProblems: QuestionLanguageCpBlock[];
}

export interface FlattenedQuestionLanguageEntry extends QuestionLanguageEntry {
  cpId: SimplCpId;
  cpTitle: string;
  ownership: OwnershipStatus;
  sourceAuthority: "simpl-001-language-draft.md";
}

export interface ExplanationEntry {
  id: SimplExplanationId;
  text: string;
}

export interface ExplanationFamily {
  familyId: string;
  name: string;
  appliesTo: SimplCpId[];
  entries: ExplanationEntry[];
}

export interface ExplanationLibrary {
  libraryId: string;
  archetypeId: SimplPackageId;
  ownership: OwnershipStatus;
  status: string;
  sourceAuthority: "simpl-001-language-draft.md";
  runtimePolicy: RuntimePolicy;
  families: ExplanationFamily[];
}

export interface FlattenedExplanationEntry extends ExplanationEntry {
  cpId: SimplCpId;
  familyId: string;
  familyName: string;
  ownership: OwnershipStatus;
  sourceAuthority: "simpl-001-language-draft.md";
}

export interface VariableRangesLibrary {
  libraryId: string;
  archetypeId: SimplPackageId;
  ownership: OwnershipStatus;
  status: string;
  activeCanonicalProblems: SimplCpId[];
  variables: Record<string, unknown>;
}

export interface CoverageTargetsLibrary {
  libraryId: string;
  archetypeId: SimplPackageId;
  ownership: OwnershipStatus;
  status: string;
  activeCanonicalProblems: SimplCpId[];
  targets: Record<string, unknown>;
}

export interface DistributionTargetsLibrary {
  libraryId: string;
  archetypeId: SimplPackageId;
  ownership: OwnershipStatus;
  status: string;
  canonicalProblems: Record<SimplCpId, { targetShare: number; allocation: string }>;
  difficulty: Record<SimplDifficultyBand, number>;
  questionLanguage: Record<string, unknown>;
  explanations?: Record<string, unknown>;
  coverage?: Record<string, unknown>;
}

export interface PackageRegistryEntry {
  packageId: SimplPackageId;
  topic: "Simplification And Approximation";
  ownership: OwnershipStatus;
  usage: RuntimeUsage;
  sourceAuthority: "simpl-001-language-draft.md";
  authorityMap: "library-authority-map.md";
}

export interface RenderParameters {
  [key: string]: string | number;
}
