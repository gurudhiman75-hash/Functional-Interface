import { runMalCp003DiscoveryPipeline } from "./cp003-discovery-pipeline";
import {
  generateMalCp003VariedSourceRuntimeQuestion,
} from "./cp003-source-runtime-wave07-varied";
import type { MalCp003SourceRuntimeQuestion } from "./cp003-source-runtime-wave07";
import {
  generateMalCp003Wave09SourceRuntimeQuestion,
  type MalCp003Wave09SourceRuntimeQuestion,
} from "./cp003-source-runtime-wave09";
import type {
  MalCp003ExecutablePrototypeId,
  MalCp003GeneratedPrototype,
} from "./cp003-types";
import type { MalDifficulty } from "./types";

export const MAL_CP003_WAVE12_RUNTIME_ID =
  "MAL-CP003-EN-UNIFIED-EDITORIAL-RUNTIME-WAVE12" as const;

export const MAL_CP003_WAVE12_CONTRACT_IDS = [
  "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE",
  "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL",
  "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL",
  "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL",
  "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL",
  "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER",
  "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO",
  "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO",
  "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD",
] as const;

export type MalCp003Wave12ContractId =
  (typeof MAL_CP003_WAVE12_CONTRACT_IDS)[number];

export type MalCp003Wave12SourceRuntimeKind =
  | "CP003_DISCOVERY_PIPELINE_V1"
  | "MAL_CP003_SOURCE_RUNTIME_WAVE07"
  | "MAL_CP003_SOURCE_RUNTIME_WAVE09";

export type MalCp003Wave12RepresentationVariant =
  | "FINAL_ORIGINAL_QUANTITY"
  | "FINAL_ORIGINAL_FRACTION"
  | "FINAL_REFILL_QUANTITY"
  | "PRIMARY_CONTRACT_OUTPUT";

export interface MalCp003Wave12UnifiedQuestion {
  packageId: "MAL-001";
  canonicalProblemId: "MAL-CP-003";
  runtimeId: typeof MAL_CP003_WAVE12_RUNTIME_ID;
  contractId: MalCp003Wave12ContractId;
  sourceRuntimeKind: MalCp003Wave12SourceRuntimeKind;
  sourceContractId: string;
  representationVariant: MalCp003Wave12RepresentationVariant;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  locale: "en-IN";
  seed: string;
  difficulty: MalDifficulty;
  sourceEvidenceIds: readonly string[];
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: readonly {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
  explanation: {
    coreConcept: string;
    formula: string;
    steps: string[];
    verification: string;
    conclusion: string;
    examShortcut: string;
    commonTrap: string;
  };
  diagram: unknown;
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  maturity: "EDITORIAL_RUNTIME_CANDIDATE";
  allocationStatus: "UNALLOCATED_READY_FOR_FREEZE_REVIEW";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

type UnderlyingQuestion =
  | MalCp003GeneratedPrototype
  | MalCp003SourceRuntimeQuestion
  | MalCp003Wave09SourceRuntimeQuestion;

const CONTRACT_EVIDENCE: Readonly<
  Record<MalCp003Wave12ContractId, readonly string[]>
> = {
  "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE": [
    "PREPP-SSC-CGL-2025-FORWARD-QUANTITY",
    "MAL-CP003-WAVE10-REPRESENTATION-MERGE-PROOF",
  ],
  "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL": [
    "OLIVEBOARD-LIC-AAO-2023-INITIAL-WATER",
    "MAL-CP003-WAVE11-COMPLEMENT-REPRESENTATION-POLICY",
  ],
  "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL": [
    "TESTBOOK-REMOVAL-INVERSE-60-48.6-TWO",
    "TESTBOOK-REMOVAL-INVERSE-1000-512-THREE",
  ],
  "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL": [
    "EXAMTREE-RAP003-QL1110-EXACT-OPERATION-COUNT",
    "GMATCLUB-REPLACEMENT-ITERATIONS-17-TO-8",
  ],
  "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL": [
    "TESTBOOK-UNEQUAL-STAGES-50-5-8",
    "EXAMTREE-RAP003-QL1112-UNEQUAL-STAGES",
  ],
  "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER": [
    "TESTBOOK-THREE-COMPONENT-36-12-ACID",
    "CAT-2025-ACID-WATER-STAGE-SWITCHING",
    "MAL001-END-TO-END-CP003-CP006-BOUNDARY",
  ],
  "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO": [
    "MAL-CP003-WAVE04-FINAL-RATIO-SOURCE-CONTRACT",
  ],
  "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO": [
    "MAL-CP003-WAVE04-VESSEL-CAPACITY-SOURCE-CONTRACT",
  ],
  "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD": [
    "TESTBOOK-MINIMUM-COUNT-40-4-BELOW-HALF",
  ],
};

const FINAL_STATE_PROTOTYPES = [
  "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
] as const satisfies readonly MalCp003ExecutablePrototypeId[];

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function underlyingContractId(question: UnderlyingQuestion): string {
  return "prototypeId" in question ? question.prototypeId : question.candidateId;
}

function underlyingEvidence(question: UnderlyingQuestion): readonly string[] {
  return "sourceEvidenceIds" in question ? question.sourceEvidenceIds : [];
}

function representationVariant(
  sourceContractId: string,
): MalCp003Wave12RepresentationVariant {
  switch (sourceContractId) {
    case "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS":
      return "FINAL_ORIGINAL_QUANTITY";
    case "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS":
      return "FINAL_ORIGINAL_FRACTION";
    case "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS":
      return "FINAL_REFILL_QUANTITY";
    default:
      return "PRIMARY_CONTRACT_OUTPUT";
  }
}

function validateUnifiedQuestion(
  question: Omit<MalCp003Wave12UnifiedQuestion, "validation">,
  underlyingValidation: { ok: boolean; errors: string[] },
): { ok: boolean; errors: string[] } {
  const errors = [...underlyingValidation.errors];
  if (!underlyingValidation.ok && underlyingValidation.errors.length === 0) {
    errors.push("Underlying runtime validation failed without an error message.");
  }
  if (!question.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (question.options.length !== 4) errors.push("Question does not have four options.");
  if (new Set(question.options).size !== 4) errors.push("Options are not unique.");
  if (question.options[question.correctIndex] !== question.answer) {
    errors.push("Correct option does not match the canonical answer.");
  }
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Option audit does not contain exactly one correct option.");
  }
  if (question.sourceEvidenceIds.length === 0) errors.push("Source evidence is missing.");
  if (question.explanation.steps.length < 4) errors.push("Explanation has fewer than four worked steps.");
  if (!question.explanation.verification.trim()) errors.push("Verification is missing.");
  if (!question.explanation.conclusion.trim()) errors.push("Conclusion is missing.");
  if (question.diagram === null || question.diagram === undefined) errors.push("Diagram or stage ledger is missing.");
  if (/\balligation\b/iu.test(JSON.stringify(question.explanation))) {
    errors.push("Repeated-replacement explanation incorrectly invokes alligation.");
  }
  if (
    question.permanentQlId !== null ||
    question.active ||
    question.publiclyPublishable ||
    question.questionStudioDiscoverable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    errors.push("A Wave 12 allocation or delivery boundary was violated.");
  }
  return { ok: errors.length === 0, errors: unique(errors) };
}

function normalize(
  contractId: MalCp003Wave12ContractId,
  sourceRuntimeKind: MalCp003Wave12SourceRuntimeKind,
  question: UnderlyingQuestion,
): MalCp003Wave12UnifiedQuestion {
  const sourceContractId = underlyingContractId(question);
  const sourceEvidenceIds = unique([
    ...underlyingEvidence(question),
    ...CONTRACT_EVIDENCE[contractId],
  ]);
  const withoutValidation = {
    packageId: "MAL-001" as const,
    canonicalProblemId: "MAL-CP-003" as const,
    runtimeId: MAL_CP003_WAVE12_RUNTIME_ID,
    contractId,
    sourceRuntimeKind,
    sourceContractId,
    representationVariant: representationVariant(sourceContractId),
    permanentQlId: null,
    questionLanguageId: `${contractId}-EN-W12`,
    language: "en" as const,
    locale: "en-IN" as const,
    seed: question.seed,
    difficulty: question.difficulty,
    sourceEvidenceIds,
    stem: question.stem,
    answer: question.answer,
    options: [...question.options],
    correctIndex: question.correctIndex,
    optionAudit: question.optionAudit.map((option) => ({ ...option })),
    explanation: {
      coreConcept: question.explanation.coreConcept,
      formula: question.explanation.formula,
      steps: [...question.explanation.steps],
      verification: question.explanation.verification,
      conclusion: question.explanation.conclusion,
      examShortcut: question.explanation.examShortcut,
      commonTrap: question.explanation.commonTrap,
    },
    diagram: question.diagram,
    mathematicalFingerprint: [
      contractId,
      sourceContractId,
      question.mathematicalFingerprint,
    ].join("|"),
    maturity: "EDITORIAL_RUNTIME_CANDIDATE" as const,
    allocationStatus: "UNALLOCATED_READY_FOR_FREEZE_REVIEW" as const,
    active: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  };
  return {
    ...withoutValidation,
    validation: validateUnifiedQuestion(withoutValidation, question.validation),
  };
}

export function generateMalCp003Wave12UnifiedQuestion(
  contractId: MalCp003Wave12ContractId,
  seed = `mal-cp003-wave12:${contractId}:default`,
): MalCp003Wave12UnifiedQuestion {
  switch (contractId) {
    case "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE": {
      const prototypeId =
        FINAL_STATE_PROTOTYPES[
          hash(`${seed}:representation`) % FINAL_STATE_PROTOTYPES.length
        ]!;
      return normalize(
        contractId,
        "CP003_DISCOVERY_PIPELINE_V1",
        runMalCp003DiscoveryPipeline(prototypeId, seed),
      );
    }
    case "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL":
      return normalize(
        contractId,
        "CP003_DISCOVERY_PIPELINE_V1",
        runMalCp003DiscoveryPipeline(
          "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL":
      return normalize(
        contractId,
        "MAL_CP003_SOURCE_RUNTIME_WAVE09",
        generateMalCp003Wave09SourceRuntimeQuestion(
          "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL":
      return normalize(
        contractId,
        "CP003_DISCOVERY_PIPELINE_V1",
        runMalCp003DiscoveryPipeline(
          "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL":
      return normalize(
        contractId,
        "CP003_DISCOVERY_PIPELINE_V1",
        runMalCp003DiscoveryPipeline(
          "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER":
      return normalize(
        contractId,
        "CP003_DISCOVERY_PIPELINE_V1",
        runMalCp003DiscoveryPipeline(
          "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO":
      return normalize(
        contractId,
        "MAL_CP003_SOURCE_RUNTIME_WAVE07",
        generateMalCp003VariedSourceRuntimeQuestion(
          "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO":
      return normalize(
        contractId,
        "MAL_CP003_SOURCE_RUNTIME_WAVE07",
        generateMalCp003VariedSourceRuntimeQuestion(
          "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
          seed,
        ),
      );
    case "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD":
      return normalize(
        contractId,
        "MAL_CP003_SOURCE_RUNTIME_WAVE09",
        generateMalCp003Wave09SourceRuntimeQuestion(
          "MAL-CP003-PROT-MINIMUM-OPERATIONS-TO-CROSS-ORIGINAL-QUANTITY-THRESHOLD",
          seed,
        ),
      );
  }
}

export function malCp003Wave12UnifiedStable(
  question: MalCp003Wave12UnifiedQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}

export const MAL_CP003_WAVE12_READINESS = Object.freeze({
  runtimeId: MAL_CP003_WAVE12_RUNTIME_ID,
  effectiveContractCount: MAL_CP003_WAVE12_CONTRACT_IDS.length,
  sourcePolicyReadiness: true,
  runtimeEditorialReadiness: true,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  nextPermanentQlId: "MAL-QL-029",
  nextPermanentQlIdReserved: false,
  verdict: "READY_FOR_PERMANENT_ENGLISH_ALLOCATION_AUDIT" as const,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
});
