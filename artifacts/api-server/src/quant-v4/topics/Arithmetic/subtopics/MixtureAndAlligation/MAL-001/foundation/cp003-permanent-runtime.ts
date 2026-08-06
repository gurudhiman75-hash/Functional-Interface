import {
  generateMalCp003EditorialV2Question,
  type MalCp003EditorialV2Question,
} from "./cp003-editorial-remediation-v2";
import type { MalCp003Wave12ContractId } from "./cp003-unified-runtime-wave12-editorial";
import type {
  MalDifficulty,
  MalReasoningGraph,
  MalTaskDirection,
} from "./types";

export const MAL_CP003_PERMANENT_RUNTIME_ID =
  "MAL-CP003-EN-PERMANENT-RUNTIME-V2" as const;

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
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_COMPONENT_STATE",
      evidenceShape: "Vessel volume, equal removal quantity, operation count and requested final representation",
      decisiveInvariant: "Multiply the original component by the one-operation retained fraction for every operation",
    },
    {
      qlId: "MAL-QL-030",
      contractId: "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL",
      familyId: "INITIAL_COMPOSITION_FROM_FINAL",
      label: "Recover the initial composition from final evidence",
      difficulty: "Medium",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "INITIAL_COMPONENT_QUANTITY",
      evidenceShape: "Complete vessel composition, equal replacement data and a final named-component quantity",
      decisiveInvariant: "Divide the final amount by the total retained fraction",
    },
    {
      qlId: "MAL-QL-031",
      contractId: "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL",
      familyId: "REMOVAL_QUANTITY_FROM_FINAL",
      label: "Recover the equal removal quantity from the final state",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "REMOVAL_QUANTITY_PER_OPERATION",
      evidenceShape: "Initial and final original-component quantities, vessel volume and operation count",
      decisiveInvariant: "The operation root of total retention gives the one-operation retained fraction",
    },
    {
      qlId: "MAL-QL-032",
      contractId: "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL",
      familyId: "EXACT_OPERATION_COUNT_FROM_FINAL",
      label: "Recover the exact number of equal replacement operations",
      difficulty: "Medium",
      taskDirection: "INVERSE",
      answerSemantic: "EXACT_OPERATION_COUNT",
      evidenceShape: "Complete initial composition, final exact quantity, vessel volume and equal removal quantity",
      decisiveInvariant: "Match successive retained-fraction powers to the stated final amount",
    },
    {
      qlId: "MAL-QL-033",
      contractId: "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL",
      familyId: "UNEQUAL_STAGE_FINAL_ORIGINAL",
      label: "Find the original component after unequal replacement stages",
      difficulty: "Hard",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORIGINAL_COMPONENT_QUANTITY",
      evidenceShape: "A complete initial composition and two to four different removal quantities",
      decisiveInvariant: "Apply each operation's retained fraction in the stated order",
    },
    {
      qlId: "MAL-QL-034",
      contractId: "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER",
      familyId: "THREE_COMPONENT_STAGE_LEDGER",
      label: "Track three liquids through changing replacement stages",
      difficulty: "Hard",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_THREE_COMPONENT_COMPOSITION",
      evidenceShape: "One vessel, a complete initial state and operation-specific replacement liquids",
      decisiveInvariant: "Reduce every present liquid proportionally, then add the named replacement liquid",
    },
    {
      qlId: "MAL-QL-035",
      contractId: "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO",
      familyId: "FINAL_COMPONENT_RATIO",
      label: "Find the final ordered component ratio",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_ORDERED_COMPONENT_RATIO",
      evidenceShape: "A pure initial liquid, equal replacements and a requested ratio order",
      decisiveInvariant: "Use the retained original fraction and its complement in the requested order",
    },
    {
      qlId: "MAL-QL-036",
      contractId: "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO",
      familyId: "VESSEL_CAPACITY_FROM_FINAL_RATIO",
      label: "Recover vessel capacity from a final component ratio",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "VESSEL_CAPACITY",
      evidenceShape: "Equal removal quantity, operation count and final original-to-replacement ratio",
      decisiveInvariant: "Convert ratio to fraction, take the operation root, and reconstruct capacity",
    },
    {
      qlId: "MAL-QL-037",
      contractId: "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD",
      familyId: "MINIMUM_OPERATIONS_THRESHOLD",
      label: "Find the minimum operations required to cross a strict threshold",
      difficulty: "Medium",
      taskDirection: "INVERSE",
      answerSemantic: "MINIMUM_OPERATION_COUNT",
      evidenceShape: "A pure initial vessel, equal replacements and a strict threshold",
      decisiveInvariant: "The previous operation fails and the selected operation is the first to satisfy the strict condition",
    },
  ] as const;

export const MAL_CP003_ENGLISH_RELEASE = Object.freeze({
  releaseId: "MAL-CP003-EN-v2" as const,
  supersedesReleaseId: "MAL-CP003-EN-v1" as const,
  packageId: "MAL-001" as const,
  canonicalProblemId: "MAL-CP-003" as const,
  runtimeId: MAL_CP003_PERMANENT_RUNTIME_ID,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  priorStatus: "CONDITIONAL_PASS_MAL_CP003_EDITORIAL_REMEDIATION_REQUIRED" as const,
  editorialStatus: "APPROVED_AFTER_EDITORIAL_REMEDIATION" as const,
  qlCount: MAL_CP003_PERMANENT_ALLOCATION.length,
  qlRange: "MAL-QL-029..MAL-QL-037" as const,
  reviewQuestionCount: MAL_CP003_PERMANENT_ALLOCATION.length * 4,
  editorialV2ReviewQuestionCount: MAL_CP003_PERMANENT_ALLOCATION.length * 10,
  approvedBy: "ExamTree product-owner editorial remediation directive" as const,
  approvedAt: "2026-08-06" as const,
  reviewMethod: "1800_QUESTION_EDITORIAL_V2_AUDIT_PLUS_90_QUESTION_HUMAN_REVIEW_EXPORT" as const,
  approvalNote:
    "The mathematical QL identities were retained. Student-facing English, value selection, distractors, explanations, grammar and corpus-diversity controls were remodelled before reactivation.",
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  excludedLanguages: ["hi", "pa"] as const,
});

export type MalCp003ReleasedExplanation =
  MalCp003EditorialV2Question["explanation"] & {
    layoutId: "MAL-CP003-EN-STUDENT-EDITORIAL-V2";
    sectionTitles: {
      concept: "Concept";
      calculation: "Calculation";
      answer: "Answer";
      fastMethod: "Fast Method";
      commonMistake: "Common Mistake";
      check: "Check";
    };
    lines: string[];
  };

export type MalCp003ReleasedQuestion = Omit<
  MalCp003EditorialV2Question,
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
  sourceEditorialRuntimeId: MalCp003EditorialV2Question["runtimeId"];
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
  allocationStatus: "RELEASED_ENGLISH_V2";
  releaseStatus: "APPROVED";
  runtimeMode: "RELEASED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V2";
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
    releaseId: "MAL-CP003-EN-v2";
    sourceRuntimeKind: MalCp003EditorialV2Question["sourceRuntimeKind"];
    sourceContractId: string;
    representationVariant: MalCp003EditorialV2Question["representationVariant"];
    evidenceShape: string;
    decisiveInvariant: string;
    sourceEvidenceIds: readonly string[];
    taskDirection: MalTaskDirection;
    answerSemantic: MalCp003PermanentAnswerSemantic;
    difficulty: MalDifficulty;
    language: "en";
    locale: "en-IN";
    runtimeMode: "RELEASED";
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V2";
    questionBankStatus: "WRITABLE";
    testEligibility: "ELIGIBLE";
    publiclyPublishable: true;
    editorialVersion: 2;
  };
};

const SECTION_TITLES = {
  concept: "Concept",
  calculation: "Calculation",
  answer: "Answer",
  fastMethod: "Fast Method",
  commonMistake: "Common Mistake",
  check: "Check",
} as const;

function allocationFor(qlId: MalCp003PermanentQlId): MalCp003PermanentAllocationEntry {
  const allocation = MAL_CP003_PERMANENT_ALLOCATION.find((entry) => entry.qlId === qlId);
  if (!allocation) throw new Error(`Unknown MAL-CP-003 permanent QL: ${qlId}.`);
  return allocation;
}

function explanationLines(explanation: MalCp003EditorialV2Question["explanation"]): string[] {
  const lines = [
    SECTION_TITLES.concept,
    explanation.coreConcept,
  ];
  if (explanation.formula.trim()) lines.push(`Formula: ${explanation.formula}`);
  lines.push(SECTION_TITLES.calculation, ...explanation.steps);
  if (explanation.verification.trim()) {
    lines.push(SECTION_TITLES.check, explanation.verification);
  }
  lines.push(SECTION_TITLES.answer, explanation.conclusion);
  if (explanation.examShortcut.trim()) {
    lines.push(SECTION_TITLES.fastMethod, explanation.examShortcut);
  }
  if (explanation.commonTrap.trim()) {
    lines.push(SECTION_TITLES.commonMistake, explanation.commonTrap.replace(/^Common trap:\s*/iu, ""));
  }
  return lines;
}

function reasoningGraph(base: MalCp003EditorialV2Question): MalReasoningGraph {
  const derivations = base.explanation.steps.map((step, index) => ({
    id: `calculation-${index + 1}`,
    kind: "DERIVATION" as const,
    text: step,
    dependsOn: [index === 0 ? "concept-1" : `calculation-${index}`],
  }));
  const last = derivations.at(-1)?.id ?? "concept-1";
  return {
    nodes: [
      { id: "given-1", kind: "GIVEN" as const, text: base.stem, dependsOn: [] },
      {
        id: "concept-1",
        kind: "RELATION" as const,
        text: base.explanation.coreConcept,
        mathLatex: base.explanation.formula,
        dependsOn: ["given-1"],
      },
      ...derivations,
      {
        id: "check-1",
        kind: "VERIFICATION" as const,
        text: base.explanation.verification,
        dependsOn: [last],
      },
      {
        id: "answer-1",
        kind: "CONCLUSION" as const,
        text: base.explanation.conclusion,
        dependsOn: ["check-1"],
      },
    ],
  };
}

export function generateMalCp003PermanentQuestion(
  qlId: MalCp003PermanentQlId,
  seed = `mal-cp003-release-v2:${qlId}:default`,
): MalCp003ReleasedQuestion {
  const allocation = allocationFor(qlId);
  const base = generateMalCp003EditorialV2Question(allocation.contractId, seed);
  if (!base.validation.ok) {
    throw new Error(`${qlId}/${seed}: editorial V2 validation failed: ${base.validation.errors.join("; ")}`);
  }
  const explanation: MalCp003ReleasedExplanation = {
    ...base.explanation,
    layoutId: "MAL-CP003-EN-STUDENT-EDITORIAL-V2",
    sectionTitles: SECTION_TITLES,
    lines: explanationLines(base.explanation),
  };
  const checks = [
    {
      name: "EDITORIAL_V2_VALIDATION",
      passed: true as const,
      message: "Natural language, numerical quality, distractor authority and explanation checks passed.",
    },
    {
      name: "PERMANENT_IDENTITY_RETAINED",
      passed: true as const,
      message: `${qlId} remains the mathematical identity for ${allocation.contractId}.`,
    },
    {
      name: "SOURCE_TRACEABILITY",
      passed: true as const,
      message: `${base.sourceEvidenceIds.length} evidence references remain attached.`,
    },
    {
      name: "DELIVERY_REAUTHORIZATION",
      passed: true as const,
      message: "English product surfaces are enabled only under the V2 remediation release.",
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
      editorialMetadata: base.editorialMetadata,
    },
    solution: {
      answer: base.answer,
      mathematicalFingerprint: base.mathematicalFingerprint,
      verification: base.explanation.verification,
    },
    explanationId: `${qlId}-EN-STUDENT-EDITORIAL-V2`,
    explanation,
    reasoningGraph: reasoningGraph(base),
    mathematicalFingerprint: `${qlId}|${base.mathematicalFingerprint}`,
    maturity: "FROZEN",
    allocationStatus: "RELEASED_ENGLISH_V2",
    releaseStatus: "APPROVED",
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V2",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    permanentIdentityFrozen: true,
    active: true,
    publiclyPublishable: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    validation: { ok: true, valid: true, errors: [], checks },
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
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V2",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      editorialVersion: 2,
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
    throw new Error(`MAL-CP-003 English release does not support language '${language}'.`);
  }
  return generateMalCp003PermanentQuestion(
    input.questionLanguageId,
    input.seed ?? `mal-cp003-release-v2:${input.questionLanguageId}:default`,
  );
}
