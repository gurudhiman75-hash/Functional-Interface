import {
  generateMalCp003Wave12EditorialQuestion,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12-editorial";
import type {
  MalDifficulty,
  MalReasoningGraph,
  MalTaskDirection,
} from "./types";

export const MAL_CP003_PERMANENT_RUNTIME_ID =
  "MAL-CP003-EN-PERMANENT-RUNTIME-V1" as const;

export const MAL_CP003_PERMANENT_QL_IDS = [
  "MAL-QL-029",
  "MAL-QL-030",
  "MAL-QL-031",
  "MAL-QL-032",
  "MAL-QL-033",
  "MAL-QL-034",
  "MAL-QL-035",
  "MAL-QL-036",
  "MAL-QL-037",
] as const;

export type MalCp003PermanentQlId =
  (typeof MAL_CP003_PERMANENT_QL_IDS)[number];

export type MalCp003PermanentFamilyId =
  | "EQUAL_REPLACEMENT_FINAL_STATE"
  | "INITIAL_COMPOSITION_FROM_FINAL"
  | "REMOVAL_QUANTITY_FROM_FINAL"
  | "EXACT_OPERATION_COUNT_FROM_FINAL"
  | "UNEQUAL_STAGE_FINAL_ORIGINAL"
  | "THREE_COMPONENT_STAGE_LEDGER"
  | "FINAL_COMPONENT_RATIO"
  | "VESSEL_CAPACITY_FROM_FINAL_RATIO"
  | "MINIMUM_OPERATIONS_THRESHOLD";

export type MalCp003PermanentAnswerSemantic =
  | "FINAL_COMPONENT_STATE"
  | "INITIAL_COMPONENT_QUANTITY"
  | "REMOVAL_QUANTITY_PER_OPERATION"
  | "EXACT_OPERATION_COUNT"
  | "FINAL_ORIGINAL_COMPONENT_QUANTITY"
  | "FINAL_THREE_COMPONENT_COMPOSITION"
  | "FINAL_ORDERED_COMPONENT_RATIO"
  | "VESSEL_CAPACITY"
  | "MINIMUM_OPERATION_COUNT";

export interface MalCp003PermanentAllocationEntry {
  qlId: MalCp003PermanentQlId;
  contractId: MalCp003Wave12ContractId;
  familyId: MalCp003PermanentFamilyId;
  label: string;
  difficulty: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp003PermanentAnswerSemantic;
  evidenceShape: string;
  decisiveInvariant: string;
}

export const MAL_CP003_PERMANENT_ALLOCATION:
  readonly MalCp003PermanentAllocationEntry[] = [
    {
      qlId: "MAL-QL-029",
      contractId: "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE",
      familyId: "EQUAL_REPLACEMENT_FINAL_STATE",
      label: "Find the final state after equal repeated replacements",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_COMPONENT_STATE",
      evidenceShape:
        "Vessel volume, equal removal quantity, operation count and requested final component representation",
      decisiveInvariant:
        "The original component is multiplied by the same retained fraction after every operation",
    },
    {
      qlId: "MAL-QL-030",
      contractId: "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL",
      familyId: "INITIAL_COMPOSITION_FROM_FINAL",
      label: "Recover the initial composition from final evidence",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "INITIAL_COMPONENT_QUANTITY",
      evidenceShape:
        "Vessel volume, equal replacement data and one final named-component quantity",
      decisiveInvariant:
        "Divide the final original-component quantity by the exact total retained fraction",
    },
    {
      qlId: "MAL-QL-031",
      contractId: "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL",
      familyId: "REMOVAL_QUANTITY_FROM_FINAL",
      label: "Recover the equal removal quantity from the final state",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "REMOVAL_QUANTITY_PER_OPERATION",
      evidenceShape:
        "Initial and final original-component quantities, vessel volume and operation count",
      decisiveInvariant:
        "The exact nth root of total retention gives the one-stage retained fraction",
    },
    {
      qlId: "MAL-QL-032",
      contractId: "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL",
      familyId: "EXACT_OPERATION_COUNT_FROM_FINAL",
      label: "Recover the exact number of equal replacement operations",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "EXACT_OPERATION_COUNT",
      evidenceShape:
        "Initial quantity, final exact quantity, vessel volume and equal removal quantity",
      decisiveInvariant:
        "Search the finite positive-operation domain by exact rational equality",
    },
    {
      qlId: "MAL-QL-033",
      contractId: "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL",
      familyId: "UNEQUAL_STAGE_FINAL_ORIGINAL",
      label: "Find the original component after unequal replacement stages",
      difficulty: "Hard",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_QUANTITY",
      evidenceShape:
        "A fixed vessel and two to four stages with different removal quantities",
      decisiveInvariant:
        "Multiply the stage-specific retained fractions in the stated process ledger",
    },
    {
      qlId: "MAL-QL-034",
      contractId: "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER",
      familyId: "THREE_COMPONENT_STAGE_LEDGER",
      label: "Track a three-component mixture through changing refill stages",
      difficulty: "Hard",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_THREE_COMPONENT_COMPOSITION",
      evidenceShape:
        "One vessel, a three-component initial state and stage-specific refill components",
      decisiveInvariant:
        "Retain every component proportionally, then add the named refill component at each stage",
    },
    {
      qlId: "MAL-QL-035",
      contractId: "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO",
      familyId: "FINAL_COMPONENT_RATIO",
      label: "Find the final ordered component ratio",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORDERED_COMPONENT_RATIO",
      evidenceShape:
        "A pure initial component, equal replacements and a requested ordered final ratio",
      decisiveInvariant:
        "Use retained original fraction and its complement, then preserve the requested ratio order",
    },
    {
      qlId: "MAL-QL-036",
      contractId: "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO",
      familyId: "VESSEL_CAPACITY_FROM_FINAL_RATIO",
      label: "Recover vessel capacity from a final component ratio",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "VESSEL_CAPACITY",
      evidenceShape:
        "Equal removal quantity, operation count and final original-to-refill ratio",
      decisiveInvariant:
        "Take the exact operation root of the final original fraction and reconstruct capacity",
    },
    {
      qlId: "MAL-QL-037",
      contractId: "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD",
      familyId: "MINIMUM_OPERATIONS_THRESHOLD",
      label: "Find the minimum operations required to cross a strict threshold",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "MINIMUM_OPERATION_COUNT",
      evidenceShape:
        "A pure initial vessel, equal replacements and a strict final-component threshold",
      decisiveInvariant:
        "The accepted count is the first exact stage that satisfies the inequality while the previous stage fails",
    },
  ] as const;

export const MAL_CP003_ENGLISH_RELEASE = Object.freeze({
  releaseId: "MAL-CP003-EN-v1" as const,
  packageId: "MAL-001" as const,
  canonicalProblemId: "MAL-CP-003" as const,
  runtimeId: MAL_CP003_PERMANENT_RUNTIME_ID,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  editorialStatus: "APPROVED_UNDER_COMPLETION_DIRECTIVE" as const,
  qlCount: MAL_CP003_PERMANENT_ALLOCATION.length,
  qlRange: "MAL-QL-029..MAL-QL-037" as const,
  reviewQuestionCount: MAL_CP003_PERMANENT_ALLOCATION.length * 4,
  approvedBy: "ExamTree product-owner completion directive" as const,
  approvedAt: "2026-08-05" as const,
  reviewMethod:
    "SOURCE_POLICY_CLOSURE_PLUS_1800_QUESTION_EDITORIAL_AUDIT_PLUS_PERMANENT_RELEASE_AUDIT" as const,
  approvalNote:
    "The completion directive authorizes the validated English runtime and controlled delivery. Hindi and Punjabi remain outside this release until separate localisation and parity audits pass.",
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  excludedLanguages: ["hi", "pa"] as const,
});

export type MalCp003ReleasedExplanation =
  MalCp003Wave12UnifiedQuestion["explanation"] & {
    layoutId: "MAL-CP003-EN-REPEATED-REPLACEMENT-V1";
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula";
      steps: "📝 Step-by-Step Solution";
      shortcut: "⚡ 10-Second Exam Shortcut";
      trap: "⚠️ Common Trap & Mistake Warning";
    };
    lines: string[];
  };

export type MalCp003ReleasedQuestion = Omit<
  MalCp003Wave12UnifiedQuestion,
  | "runtimeId"
  | "permanentQlId"
  | "questionLanguageId"
  | "difficulty"
  | "explanation"
  | "validation"
  | "maturity"
  | "allocationStatus"
  | "active"
  | "publiclyPublishable"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
> & {
  archetypeId: "MAL-001";
  runtimeId: typeof MAL_CP003_PERMANENT_RUNTIME_ID;
  sourceEditorialRuntimeId: MalCp003Wave12UnifiedQuestion["runtimeId"];
  permanentQlId: MalCp003PermanentQlId;
  questionLanguageId: MalCp003PermanentQlId;
  questionId: string;
  difficulty: MalDifficulty;
  difficultyBand: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp003PermanentAnswerSemantic;
  parameters: Record<string, unknown>;
  solution: Record<string, unknown>;
  explanationId: string;
  explanation: MalCp003ReleasedExplanation;
  reasoningGraph: MalReasoningGraph;
  maturity: "FROZEN";
  allocationStatus: "RELEASED_ENGLISH_V1";
  releaseStatus: "APPROVED";
  runtimeMode: "RELEASED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  questionBankStatus: "WRITABLE";
  testEligibility: "ELIGIBLE";
  permanentIdentityFrozen: true;
  active: true;
  publiclyPublishable: true;
  questionStudioDiscoverable: true;
  questionBankWritable: true;
  testEligible: true;
  validation: {
    ok: true;
    valid: true;
    errors: [];
    checks: readonly {
      name: string;
      passed: true;
      message: string;
    }[];
  };
  traceability: {
    packageId: "MAL-001";
    canonicalProblemId: "MAL-CP-003";
    questionLanguageId: MalCp003PermanentQlId;
    contractId: MalCp003Wave12ContractId;
    familyId: MalCp003PermanentFamilyId;
    releaseId: "MAL-CP003-EN-v1";
    sourceRuntimeKind: MalCp003Wave12UnifiedQuestion["sourceRuntimeKind"];
    sourceContractId: string;
    representationVariant: MalCp003Wave12UnifiedQuestion["representationVariant"];
    evidenceShape: string;
    decisiveInvariant: string;
    sourceEvidenceIds: readonly string[];
    taskDirection: MalTaskDirection;
    answerSemantic: MalCp003PermanentAnswerSemantic;
    difficulty: MalDifficulty;
    language: "en";
    locale: "en-IN";
    runtimeMode: "RELEASED";
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
    questionBankStatus: "WRITABLE";
    testEligibility: "ELIGIBLE";
    publiclyPublishable: true;
  };
};

const SECTION_TITLES = {
  coreConcept: "📌 Core Concept & Formula",
  steps: "📝 Step-by-Step Solution",
  shortcut: "⚡ 10-Second Exam Shortcut",
  trap: "⚠️ Common Trap & Mistake Warning",
} as const;

function allocationFor(
  qlId: MalCp003PermanentQlId,
): MalCp003PermanentAllocationEntry {
  const allocation = MAL_CP003_PERMANENT_ALLOCATION.find(
    (entry) => entry.qlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown MAL-CP-003 permanent QL: ${qlId}.`);
  return allocation;
}

function explanationLines(
  explanation: MalCp003Wave12UnifiedQuestion["explanation"],
): string[] {
  return [
    SECTION_TITLES.coreConcept,
    explanation.coreConcept,
    `Formula: ${explanation.formula}`,
    SECTION_TITLES.steps,
    ...explanation.steps,
    `Quick check: ${explanation.verification}`,
    `Final answer: ${explanation.conclusion}`,
    SECTION_TITLES.shortcut,
    explanation.examShortcut,
    SECTION_TITLES.trap,
    explanation.commonTrap.replace(/^Common trap:\s*/iu, ""),
  ];
}

function reasoningGraph(
  base: MalCp003Wave12UnifiedQuestion,
): MalReasoningGraph {
  const givenNodes = [
    {
      id: "given-1",
      kind: "GIVEN" as const,
      text: base.stem,
      dependsOn: [] as string[],
    },
    {
      id: "relation-1",
      kind: "RELATION" as const,
      text: base.explanation.coreConcept,
      mathLatex: base.explanation.formula,
      dependsOn: ["given-1"],
    },
  ];
  const derivations = base.explanation.steps.map((step, index) => ({
    id: `derivation-${index + 1}`,
    kind: "DERIVATION" as const,
    text: step,
    dependsOn: [index === 0 ? "relation-1" : `derivation-${index}`],
  }));
  const lastDerivation = derivations.at(-1)?.id ?? "relation-1";
  return {
    nodes: [
      ...givenNodes,
      ...derivations,
      {
        id: "verification-1",
        kind: "VERIFICATION" as const,
        text: base.explanation.verification,
        dependsOn: [lastDerivation],
      },
      {
        id: "conclusion-1",
        kind: "CONCLUSION" as const,
        text: base.explanation.conclusion,
        dependsOn: ["verification-1"],
      },
    ],
  };
}

export function generateMalCp003PermanentQuestion(
  qlId: MalCp003PermanentQlId,
  seed = `mal-cp003-release:${qlId}:default`,
): MalCp003ReleasedQuestion {
  const allocation = allocationFor(qlId);
  const base = generateMalCp003Wave12EditorialQuestion(
    allocation.contractId,
    seed,
  );
  if (!base.validation.ok) {
    throw new Error(
      `${qlId}/${seed}: Wave 12 validation failed: ${base.validation.errors.join("; ")}`,
    );
  }
  const explanation: MalCp003ReleasedExplanation = {
    ...base.explanation,
    layoutId: "MAL-CP003-EN-REPEATED-REPLACEMENT-V1",
    sectionTitles: SECTION_TITLES,
    lines: explanationLines(base.explanation),
  };
  const checks = [
    {
      name: "WAVE12_EDITORIAL_VALIDATION",
      passed: true as const,
      message: "The source editorial package passed its complete validation gate.",
    },
    {
      name: "PERMANENT_IDENTITY_ALLOCATION",
      passed: true as const,
      message: `${qlId} is the frozen identity for ${allocation.contractId}.`,
    },
    {
      name: "SOURCE_TRACEABILITY",
      passed: true as const,
      message: `${base.sourceEvidenceIds.length} evidence references remain attached.`,
    },
    {
      name: "DELIVERY_AUTHORIZATION",
      passed: true as const,
      message: "English release surfaces are enabled under the Wave 13 freeze.",
    },
  ];
  return {
    ...base,
    archetypeId: "MAL-001",
    runtimeId: MAL_CP003_PERMANENT_RUNTIME_ID,
    sourceEditorialRuntimeId: base.runtimeId,
    permanentQlId: qlId,
    questionLanguageId: qlId,
    questionId: `MAL-001:${qlId}:${seed}`,
    difficulty: allocation.difficulty,
    difficultyBand: allocation.difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    parameters: {
      contractId: allocation.contractId,
      sourceContractId: base.sourceContractId,
      sourceRuntimeKind: base.sourceRuntimeKind,
      representationVariant: base.representationVariant,
      sourceEvidenceIds: base.sourceEvidenceIds,
    },
    solution: {
      answer: base.answer,
      mathematicalFingerprint: base.mathematicalFingerprint,
      verification: base.explanation.verification,
    },
    explanationId: `${qlId}-EN-REPEATED-REPLACEMENT-V1`,
    explanation,
    reasoningGraph: reasoningGraph(base),
    mathematicalFingerprint: [
      qlId,
      base.mathematicalFingerprint,
    ].join("|"),
    maturity: "FROZEN",
    allocationStatus: "RELEASED_ENGLISH_V1",
    releaseStatus: "APPROVED",
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    permanentIdentityFrozen: true,
    active: true,
    publiclyPublishable: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    validation: {
      ok: true,
      valid: true,
      errors: [],
      checks,
    },
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-003",
      questionLanguageId: qlId,
      contractId: allocation.contractId,
      familyId: allocation.familyId,
      releaseId: MAL_CP003_ENGLISH_RELEASE.releaseId,
      sourceRuntimeKind: base.sourceRuntimeKind,
      sourceContractId: base.sourceContractId,
      representationVariant: base.representationVariant,
      evidenceShape: allocation.evidenceShape,
      decisiveInvariant: allocation.decisiveInvariant,
      sourceEvidenceIds: base.sourceEvidenceIds,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      difficulty: allocation.difficulty,
      language: "en",
      locale: "en-IN",
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
  };
}

export function runMalCp003EnglishReleasePipeline(input: {
  questionLanguageId: MalCp003PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp003ReleasedQuestion {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-003 English release does not support language '${language}'.`,
    );
  }
  return generateMalCp003PermanentQuestion(
    input.questionLanguageId,
    input.seed ?? `mal-cp003-release:${input.questionLanguageId}:default`,
  );
}
