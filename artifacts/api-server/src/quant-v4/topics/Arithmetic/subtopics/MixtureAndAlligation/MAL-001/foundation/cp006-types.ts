import type { Rational } from "./types";

export const MAL_CP006_ID = "MAL-CP-006" as const;
export const MAL_CP006_WAVE01_RUNTIME_ID =
  "MAL-CP006-EN-OPEN-DISCOVERY-WAVE01-V1" as const;

export const MAL_CP006_WAVE01_PROTOTYPE_IDS = [
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
  "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
  "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
  "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
  "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
  "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
] as const;

export type MalCp006Wave01PrototypeId =
  (typeof MAL_CP006_WAVE01_PROTOTYPE_IDS)[number];

export type MalCp006Difficulty = "Medium" | "Hard";
export type MalCp006AnswerSemantic =
  | "FINAL_COMPONENT_RATIO"
  | "TRANSFER_QUANTITY"
  | "FINAL_CONCENTRATION_PERCENT"
  | "CROSS_VESSEL_COMPONENT_RATIO";

export interface MalCp006VesselState {
  id: string;
  volume: Rational;
  componentA: Rational;
}

export type MalCp006Operation =
  | {
      kind: "TRANSFER";
      from: string;
      to: string;
      amount: Rational;
    }
  | {
      kind: "REFILL";
      vessel: string;
      amount: Rational;
      componentAFraction: Rational;
    }
  | {
      kind: "SIMULTANEOUS_EQUAL_EXCHANGE";
      vesselA: string;
      vesselB: string;
      amount: Rational;
    };

export interface MalCp006LedgerSnapshot {
  stage: number;
  operation: "INITIAL" | MalCp006Operation["kind"];
  vessels: readonly MalCp006VesselState[];
  globalVolume: Rational;
  globalComponentA: Rational;
}

export interface MalCp006LedgerResult {
  finalVessels: readonly MalCp006VesselState[];
  snapshots: readonly MalCp006LedgerSnapshot[];
}

export type MalCp006ExactAnswer =
  | { kind: "RATIO"; first: Rational; second: Rational }
  | { kind: "QUANTITY"; value: Rational }
  | { kind: "PERCENT"; value: Rational };

export interface MalCp006OptionAudit {
  text: string;
  misconceptionId: string;
  isCorrect: boolean;
}

export interface MalCp006DiscoveryQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: typeof MAL_CP006_ID;
  prototypeId: MalCp006Wave01PrototypeId;
  runtimeId: typeof MAL_CP006_WAVE01_RUNTIME_ID;
  permanentQlId: null;
  permanentSolveModeId: null;
  language: "en";
  requestedSeed: string;
  selectedSeed: string;
  questionId: string;
  stateKey: string;
  siblingStateKey: string;
  difficulty: MalCp006Difficulty;
  answerSemantic: MalCp006AnswerSemantic;
  sourceEvidenceIds: readonly string[];
  stem: string;
  answer: string;
  exactAnswer: MalCp006ExactAnswer;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp006OptionAudit[];
  explanation: {
    visibleLines: string[];
    answerLine: string;
    optionalHelp: {
      commonMistake: string;
      verification: string[];
    };
  };
  exactState: {
    initialVessels: readonly MalCp006VesselState[];
    operations: readonly MalCp006Operation[];
    ledger: MalCp006LedgerResult;
  };
  validation: {
    ok: boolean;
    errors: string[];
  };
  maturity: "DISCOVERY_PROTOTYPE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  reviewStatus: "PENDING_PRODUCT_REVIEW";
  runtimeMode: "REVIEW_ONLY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp006SourceFixture {
  sourceId: string;
  publisher: string;
  title: string;
  url: string;
  retrievedOn: "2026-08-13";
  disposition:
    | "CP006_DIRECT"
    | "CP001_BOUNDARY"
    | "CP003_BOUNDARY"
    | "CP004_BOUNDARY"
    | "LEGACY_NOT_DIRECT_EVIDENCE";
  supportedPrototypeIds: readonly MalCp006Wave01PrototypeId[];
  observedContract: string;
  ownershipReason: string;
}
