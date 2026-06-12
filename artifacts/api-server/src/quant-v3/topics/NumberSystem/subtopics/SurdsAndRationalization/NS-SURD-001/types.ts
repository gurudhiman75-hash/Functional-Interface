export type SurdPackageId = "NS-SURD-001";

export type SurdCpId =
  | "CP01"
  | "CP02"
  | "CP03"
  | "CP04"
  | "CP05"
  | "CP06"
  | "CP07"
  | "CP08";

export type SurdTopologyId =
  | "NS-SURD-001-T01"
  | "NS-SURD-001-T02"
  | "NS-SURD-001-T03"
  | "NS-SURD-001-T04"
  | "NS-SURD-001-T05"
  | "NS-SURD-001-T06"
  | "NS-SURD-001-T07"
  | "NS-SURD-001-T08";

export type SurdReasoningPatternId =
  | "Pattern 1"
  | "Pattern 2"
  | "Pattern 3"
  | "Pattern 4"
  | "Pattern 5"
  | "Pattern 6"
  | "Pattern 7"
  | "Pattern 8";

export type SurdDifficultyBand = "Easy" | "Medium" | "Hard";

export type SurdQuestionLanguageId = `QL-${string}`;
export type SurdExplanationId =
  | "ES-001"
  | "ES-002"
  | "ES-003"
  | "ES-004"
  | "ES-005"
  | "ES-006"
  | "ES-007"
  | "ES-008";

export interface CpRegistryEntry {
  cpId: SurdCpId;
  packageId: SurdPackageId;
  title: string;
  topologyId: SurdTopologyId;
  reasoningPatternIds: SurdReasoningPatternId[];
  explanationId: SurdExplanationId;
  qlStart: SurdQuestionLanguageId;
  qlEnd: SurdQuestionLanguageId;
}

export interface TopologyRegistryEntry {
  topologyId: SurdTopologyId;
  packageId: SurdPackageId;
  parentCpId: SurdCpId;
  coverageStatus: "covered";
}

export interface ReasoningPatternRegistryEntry {
  patternId: SurdReasoningPatternId;
  packageId: SurdPackageId;
  supportedCpIds: SurdCpId[];
}

export interface DifficultyRegistryEntry {
  cpId: SurdCpId;
  packageId: SurdPackageId;
  bands: Record<SurdDifficultyBand, string>;
}

export interface QuestionLanguageItem {
  id: SurdQuestionLanguageId;
  packageId: SurdPackageId;
  cpId: SurdCpId;
  cpTitle: string;
  localStemNumber: number;
  globalStemNumber: number;
  source: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  authority: "Educational Authority";
  usage: "Runtime Consumption Only";
  stem: string;
}

export interface QuestionLanguageLibrary {
  packageId: SurdPackageId;
  sourceAuthority: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  authority: "Educational Authority";
  usage: "Runtime Consumption Only";
  total: number;
  items: QuestionLanguageItem[];
}

export interface ExplanationItem {
  id: SurdExplanationId;
  packageId: SurdPackageId;
  cpId: SurdCpId;
  cpTitle: string;
  source: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  authority: "Educational Authority";
  usage: "Runtime Consumption Only";
  explanation: string;
}

export interface ExplanationLibrary {
  packageId: SurdPackageId;
  sourceAuthority: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  authority: "Educational Authority";
  usage: "Runtime Consumption Only";
  total: number;
  items: ExplanationItem[];
}

export interface VariableRangesLibrary {
  packageId: SurdPackageId;
  sourceAuthority: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  usage: "Runtime Consumption Only";
  cps: Record<SurdCpId, string[]>;
}

export interface CoverageTargetsLibrary {
  packageId: SurdPackageId;
  sourceAuthority: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  usage: "Runtime Consumption Only";
  cps: Record<SurdCpId, string[]>;
}

export interface DistributionTargetsLibrary {
  packageId: SurdPackageId;
  sourceAuthority: "ns-surd-001-language-draft.md";
  ownership: "HUMAN_OWNED";
  usage: "Runtime Consumption Only";
  policy: string;
  cpAllocation: Record<
    SurdCpId,
    {
      stemRange: string;
      stemCount: number;
      minimumAllocation: number;
    }
  >;
  coverageCategoryAllocation: Record<
    SurdCpId,
    Record<string, { minimumAllocation: number }>
  >;
}

export interface PackageRegistryEntry {
  packageId: SurdPackageId;
  topic: "Number System";
  subtopic: "Surds And Rationalization";
  ownership: "HUMAN_OWNED";
  usage: "Runtime Consumption Only";
  sourceAuthority: "ns-surd-001-language-draft.md";
  authorityMap: "library-authority-map.md";
}
