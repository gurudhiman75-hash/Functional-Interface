import type { MalDifficulty, Rational } from "./types";

export const MAL_CP005_ID = "MAL-CP-005" as const;
export const MAL_CP005_DISCOVERY_RUNTIME_ID = "MAL-CP005-EN-OPEN-DISCOVERY-V1" as const;

export const MAL_CP005_DISCOVERY_PROTOTYPE_IDS = [
  "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES",
  "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST",
  "MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT",
  "MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT",
  "MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT",
  "MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT",
  "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE",
  "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT",
  "MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT",
  "MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND",
  "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT",
  "MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT",
] as const;

export type MalCp005DiscoveryPrototypeId = (typeof MAL_CP005_DISCOVERY_PROTOTYPE_IDS)[number];
export type MalCp005AnswerSemantic = "PROFIT_PERCENT" | "PURE_TO_ADULTERANT_RATIO" | "PURE_TO_CHEAPER_RATIO" | "ADULTERANT_QUANTITY" | "PURE_QUANTITY" | "ADULTERANT_PERCENT_OF_MIXTURE" | "SELLING_RATE";
export type MalCp005TaskDirection = "FORWARD" | "INVERSE" | "RECONSTRUCTION";
export type MalCp005Method = "FREE_ADULTERANT_COST_BASE" | "COMMERCIAL_MULTIPLIER" | "WEIGHTED_MIXTURE_COST";

export type MalCp005SolveRequest =
  | { mode: "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES"; pureQuantity: Rational; adulterantQuantity: Rational }
  | { mode: "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT"; targetProfitPercent: Rational }
  | { mode: "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET"; pureQuantity: Rational; targetProfitPercent: Rational }
  | { mode: "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET"; adulterantQuantity: Rational; targetProfitPercent: Rational }
  | { mode: "ADULTERANT_PERCENT_FROM_TARGET_PROFIT"; targetProfitPercent: Rational }
  | { mode: "TARGET_PROFIT_FROM_ADULTERANT_PERCENT"; adulterantPercentOfMixture: Rational }
  | { mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE"; pureQuantity: Rational; adulterantQuantity: Rational; pureUnitCost: Rational; sellingRate: Rational }
  | { mode: "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT"; pureUnitCost: Rational; sellingRate: Rational; targetProfitPercent: Rational }
  | { mode: "FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT"; pureQuantity: Rational; adulterantQuantity: Rational; pureUnitCost: Rational; targetProfitPercent: Rational }
  | { mode: "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE"; pureQuantity: Rational; adulterantQuantity: Rational; pureUnitCost: Rational; adulterantUnitCost: Rational; sellingRate: Rational }
  | { mode: "CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT"; pureUnitCost: Rational; adulterantUnitCost: Rational; sellingRate: Rational; targetProfitPercent: Rational }
  | { mode: "CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT"; pureQuantity: Rational; adulterantQuantity: Rational; pureUnitCost: Rational; adulterantUnitCost: Rational; targetProfitPercent: Rational };

export type MalCp005SolveResult =
  | { kind: "PERCENT"; value: Rational }
  | { kind: "RATIO"; firstPart: Rational; secondPart: Rational }
  | { kind: "QUANTITY"; value: Rational }
  | { kind: "SELLING_RATE"; value: Rational };

export interface MalCp005DiscoveryRegistryEntry {
  prototypeId: MalCp005DiscoveryPrototypeId;
  canonicalProblemId: typeof MAL_CP005_ID;
  answerSemantic: MalCp005AnswerSemantic;
  taskDirection: MalCp005TaskDirection;
  method: MalCp005Method;
  legacyFamilyAuthorities: readonly string[];
  directReferenceAuthorities: readonly string[];
  sourceEvidenceStatus: "REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION";
  baseDifficulty: MalDifficulty;
  permanentQlId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp005OptionAudit { text: string; misconceptionId: string; isCorrect: boolean; }
export interface MalCp005CommercialLedgerRow {
  stage: string;
  pureQuantity: string;
  adulterantQuantity: string;
  totalQuantity: string;
  actualCost: string;
  revenue: string;
  commercialResult: string;
}
export interface MalCp005DiscoveryQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: typeof MAL_CP005_ID;
  runtimeId: typeof MAL_CP005_DISCOVERY_RUNTIME_ID;
  prototypeId: MalCp005DiscoveryPrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  taskDirection: MalCp005TaskDirection;
  answerSemantic: MalCp005AnswerSemantic;
  sourceEvidenceIds: readonly string[];
  sourceEvidenceStatus: "REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION";
  request: MalCp005SolveRequest;
  solution: MalCp005SolveResult;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp005OptionAudit[];
  explanation: {
    layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1";
    concept: string;
    calculation: string[];
    verification: string;
    conclusion: string;
    fastMethod: string;
    commonMistake: string;
  };
  commercialLedger: {
    type: "COMMERCIAL_MIXTURE_LEDGER";
    title: string;
    costBaseLabel: string;
    rows: MalCp005CommercialLedgerRow[];
    accessibleText: string;
  };
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  maturity: "DISCOVERY_PROTOTYPE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}
