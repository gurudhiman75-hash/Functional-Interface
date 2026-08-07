import type { MalDifficulty, Rational } from "./types";
import type { MalCp004Wave03EffectiveContractId } from "./cp004-equivalence-authority-wave03";

export const MAL_CP004_WAVE04_RUNTIME_ID =
  "MAL-CP004-EN-SOURCE-BACKED-UNIFIED-DISCOVERY-V1" as const;

export type MalCp004Wave04RepresentationVariant =
  | "TRACKED_COMPONENT_AMOUNT"
  | "OTHER_COMPONENT_AMOUNT"
  | "TRACKED_COMPONENT_PERCENT"
  | "TOTAL_FROM_TRACKED_COMPONENT"
  | "TOTAL_FROM_OTHER_COMPONENT"
  | "SOLVENT_ADDED"
  | "PURE_SOLUTE_ADDED"
  | "EVAPORATED_AMOUNT"
  | "FINAL_TOTAL_AFTER_EVAPORATION"
  | "FINAL_CONCENTRATION_AFTER_SOLVENT_ADDITION"
  | "FINAL_CONCENTRATION_AFTER_SOLVENT_EVAPORATION"
  | "INITIAL_TOTAL_BEFORE_EVAPORATION"
  | "FINAL_MASS"
  | "MOISTURE_LOST"
  | "INITIAL_MASS";

export type MalCp004Wave04SourceMatchKind =
  | "DIRECT_TASK_MATCH"
  | "FORMULA_EQUIVALENT_DIRECTION"
  | "INTERNAL_COLLISION_AUTHORITY";

export interface MalCp004Wave04OptionAudit {
  text: string;
  value: Rational;
  misconceptionId: string;
  isCorrect: boolean;
}

export interface MalCp004Wave04LedgerRow {
  stage: string;
  total: string;
  conserved: string;
  changing: string;
  rate: string;
}

export interface MalCp004Wave04Question {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-004";
  runtimeId: typeof MAL_CP004_WAVE04_RUNTIME_ID;
  effectiveContractId: MalCp004Wave03EffectiveContractId;
  representationVariant: MalCp004Wave04RepresentationVariant;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  sourceEvidenceIds: readonly string[];
  sourceMatchKind: MalCp004Wave04SourceMatchKind;
  stem: string;
  answer: string;
  answerValue: Rational;
  answerUnit: "litres" | "kg" | "percent";
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
  explanation: {
    layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1";
    concept: string;
    calculation: string[];
    verification: string;
    conclusion: string;
    fastMethod: string;
    commonMistake: string;
  };
  ledger: {
    type: "CONSERVED_QUANTITY_TABLE";
    title: string;
    conservedLabel: string;
    rows: MalCp004Wave04LedgerRow[];
    accessibleText: string;
  };
  exactState: Readonly<Record<string, Rational | string>>;
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  maturity: "SOURCE_BACKED_UNIFIED_DISCOVERY";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}
