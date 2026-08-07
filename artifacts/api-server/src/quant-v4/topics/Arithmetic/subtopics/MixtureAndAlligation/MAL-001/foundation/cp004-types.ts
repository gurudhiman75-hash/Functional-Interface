import type { MalDifficulty, Rational } from "./types";

export const MAL_CP004_ID = "MAL-CP-004" as const;
export const MAL_CP004_DISCOVERY_RUNTIME_ID =
  "MAL-CP004-EN-OPEN-DISCOVERY-V1" as const;

export const MAL_CP004_DISCOVERY_PROTOTYPE_IDS = [
  "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION",
  "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
  "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
  "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
  "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
  "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
  "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
] as const;

export type MalCp004DiscoveryPrototypeId =
  (typeof MAL_CP004_DISCOVERY_PROTOTYPE_IDS)[number];

export type MalCp004AnswerSemantic =
  | "COMPONENT_QUANTITY"
  | "CONCENTRATION_PERCENT"
  | "SOLVENT_QUANTITY_ADDED"
  | "PURE_SOLUTE_QUANTITY_ADDED"
  | "SOLVENT_QUANTITY_EVAPORATED"
  | "FINAL_MASS"
  | "INITIAL_MASS";

export type MalCp004SolveRequest =
  | {
      mode: "COMPONENT_AMOUNT_FROM_CONCENTRATION";
      totalQuantity: Rational;
      concentration: Rational;
    }
  | {
      mode: "CONCENTRATION_FROM_COMPONENT_AMOUNT";
      totalQuantity: Rational;
      componentQuantity: Rational;
    }
  | {
      mode: "ADD_SOLVENT_FOR_TARGET_CONCENTRATION";
      initialTotal: Rational;
      initialConcentration: Rational;
      targetConcentration: Rational;
    }
  | {
      mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION";
      initialTotal: Rational;
      initialConcentration: Rational;
      targetConcentration: Rational;
    }
  | {
      mode: "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION";
      initialTotal: Rational;
      initialConcentration: Rational;
      targetConcentration: Rational;
    }
  | {
      mode: "FINAL_MASS_FROM_MOISTURE_SHIFT";
      initialMass: Rational;
      initialMoistureFraction: Rational;
      finalMoistureFraction: Rational;
    }
  | {
      mode: "INITIAL_MASS_FROM_MOISTURE_SHIFT";
      finalMass: Rational;
      initialMoistureFraction: Rational;
      finalMoistureFraction: Rational;
    };

export type MalCp004SolveResult =
  | { kind: "COMPONENT_QUANTITY"; value: Rational }
  | { kind: "CONCENTRATION"; value: Rational }
  | { kind: "SOLVENT_ADDED"; value: Rational }
  | { kind: "PURE_SOLUTE_ADDED"; value: Rational }
  | { kind: "SOLVENT_EVAPORATED"; value: Rational }
  | { kind: "FINAL_MASS"; value: Rational }
  | { kind: "INITIAL_MASS"; value: Rational };

export interface MalCp004DiscoveryRegistryEntry {
  prototypeId: MalCp004DiscoveryPrototypeId;
  canonicalProblemId: typeof MAL_CP004_ID;
  answerSemantic: MalCp004AnswerSemantic;
  taskDirection: "FORWARD" | "INVERSE" | "RECONSTRUCTION";
  invariant:
    | "SOLUTE_AMOUNT"
    | "SOLVENT_AMOUNT"
    | "DRY_MATTER_AMOUNT";
  legacyFamilyAuthorities: readonly string[];
  sourceEvidenceStatus:
    | "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION";
  baseDifficulty: MalDifficulty;
  permanentQlId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp004OptionAudit {
  text: string;
  misconceptionId: string;
  isCorrect: boolean;
}

export interface MalCp004LedgerRow {
  stage: string;
  totalQuantity: string;
  conservedQuantity: string;
  changingQuantity: string;
  concentrationOrMoisture: string;
}

export interface MalCp004DiscoveryQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: typeof MAL_CP004_ID;
  runtimeId: typeof MAL_CP004_DISCOVERY_RUNTIME_ID;
  prototypeId: MalCp004DiscoveryPrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  sourceEvidenceIds: readonly string[];
  sourceEvidenceStatus:
    "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION";
  request: MalCp004SolveRequest;
  solution: MalCp004SolveResult;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004OptionAudit[];
  explanation: {
    layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-DISCOVERY-V1";
    concept: string;
    calculation: string[];
    verification: string;
    conclusion: string;
    fastMethod: string;
    commonMistake: string;
  };
  ledger: {
    type: "CONSERVED_QUANTITY_LEDGER";
    title: string;
    conservedLabel: string;
    rows: MalCp004LedgerRow[];
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
