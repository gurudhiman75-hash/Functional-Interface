import {
  generateMalCp004Wave05EditorialQuestion,
  MAL_CP004_WAVE05_RUNTIME_ID,
  type MalCp004Wave05EditorialQuestion,
} from "./cp004-editorial-runtime-wave05";
import type { MalCp004Wave03EffectiveContractId } from "./cp004-equivalence-authority-wave03";
import { MAL_CP004_WAVE04_RUNTIME_ID } from "./cp004-unified-runtime-wave04-types";
import type {
  MalDifficulty,
  MalReasoningGraph,
  MalTaskDirection,
} from "./types";

export const MAL_CP004_PERMANENT_RUNTIME_ID =
  "MAL-CP004-EN-PERMANENT-RUNTIME-V1" as const;

export const MAL_CP004_PERMANENT_QL_IDS = [
  "MAL-QL-038",
  "MAL-QL-039",
  "MAL-QL-040",
  "MAL-QL-041",
  "MAL-QL-042",
  "MAL-QL-043",
  "MAL-QL-044",
  "MAL-QL-045",
  "MAL-QL-046",
  "MAL-QL-047",
] as const;

export type MalCp004PermanentQlId =
  (typeof MAL_CP004_PERMANENT_QL_IDS)[number];

export type MalCp004PermanentFamilyId =
  | "COMPONENT_AMOUNT"
  | "CONCENTRATION"
  | "TOTAL_FROM_COMPONENT_RATE"
  | "SOLVENT_ADDITION_TARGET"
  | "PURE_SOLUTE_ADDITION_TARGET"
  | "EVAPORATION_TARGET"
  | "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE"
  | "INITIAL_TOTAL_FROM_EVAPORATION"
  | "MOISTURE_FORWARD"
  | "MOISTURE_INVERSE";

export type MalCp004PermanentAnswerSemantic =
  | "COMPONENT_QUANTITY"
  | "COMPONENT_CONCENTRATION"
  | "TOTAL_QUANTITY"
  | "SOLVENT_ADDED"
  | "PURE_SOLUTE_ADDED"
  | "EVAPORATION_RESULT"
  | "FINAL_CONCENTRATION"
  | "INITIAL_TOTAL_QUANTITY"
  | "FINAL_MASS_OR_MOISTURE_LOST"
  | "INITIAL_MASS";

export interface MalCp004PermanentAllocationEntry {
  qlId: MalCp004PermanentQlId;
  contractId: MalCp004Wave03EffectiveContractId;
  familyId: MalCp004PermanentFamilyId;
  label: string;
  difficulty: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp004PermanentAnswerSemantic;
  evidenceShape: string;
  decisiveInvariant: string;
}

export const MAL_CP004_PERMANENT_ALLOCATION:
  readonly MalCp004PermanentAllocationEntry[] = [
    {
      qlId: "MAL-QL-038",
      contractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
      familyId: "COMPONENT_AMOUNT",
      label: "Find a component quantity from total quantity and concentration",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceShape:
        "Complete mixture quantity, one component concentration and requested component",
      decisiveInvariant:
        "A named component quantity is the complete quantity multiplied by its fraction",
    },
    {
      qlId: "MAL-QL-039",
      contractId: "MAL-CP004-EFF-CONCENTRATION",
      familyId: "CONCENTRATION",
      label: "Find concentration from component and total quantities",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_CONCENTRATION",
      evidenceShape:
        "Complete quantities of the component and the whole mixture",
      decisiveInvariant:
        "Concentration is the named component divided by the complete mixture",
    },
    {
      qlId: "MAL-QL-040",
      contractId: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
      familyId: "TOTAL_FROM_COMPONENT_RATE",
      label: "Recover total quantity from a component and its concentration",
      difficulty: "Easy",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "TOTAL_QUANTITY",
      evidenceShape:
        "Known component quantity and the fraction represented by that component",
      decisiveInvariant:
        "The complete quantity equals the component quantity divided by its fraction",
    },
    {
      qlId: "MAL-QL-041",
      contractId: "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
      familyId: "SOLVENT_ADDITION_TARGET",
      label: "Find solvent added to reach a lower target concentration",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "SOLVENT_ADDED",
      evidenceShape:
        "Initial total, initial concentration and a lower target concentration",
      decisiveInvariant:
        "The solute amount remains unchanged while solvent and total quantity increase",
    },
    {
      qlId: "MAL-QL-042",
      contractId: "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
      familyId: "PURE_SOLUTE_ADDITION_TARGET",
      label: "Find pure solute added to reach a higher target concentration",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "PURE_SOLUTE_ADDED",
      evidenceShape:
        "Initial total, initial concentration and a higher target concentration",
      decisiveInvariant:
        "The solvent amount remains unchanged while pure solute and total quantity increase",
    },
    {
      qlId: "MAL-QL-043",
      contractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
      familyId: "EVAPORATION_TARGET",
      label: "Find the evaporation result required for a target concentration",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "EVAPORATION_RESULT",
      evidenceShape:
        "Initial total, initial concentration, higher target concentration and requested evaporation representation",
      decisiveInvariant:
        "The solute amount remains unchanged while solvent and total quantity decrease",
    },
    {
      qlId: "MAL-QL-044",
      contractId: "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
      familyId: "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE",
      label: "Find final concentration after a known solvent addition or evaporation",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_CONCENTRATION",
      evidenceShape:
        "Initial total, initial concentration and a stated solvent-only quantity change",
      decisiveInvariant:
        "The original solute is divided by the new total quantity after the solvent-only change",
    },
    {
      qlId: "MAL-QL-045",
      contractId: "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION",
      familyId: "INITIAL_TOTAL_FROM_EVAPORATION",
      label: "Recover initial total quantity from a stated evaporation",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "INITIAL_TOTAL_QUANTITY",
      evidenceShape:
        "Evaporated solvent quantity, initial concentration and final concentration",
      decisiveInvariant:
        "Equate the conserved solute before and after evaporation and solve for the original total",
    },
    {
      qlId: "MAL-QL-046",
      contractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
      familyId: "MOISTURE_FORWARD",
      label: "Find final mass or moisture lost after drying",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "FINAL_MASS_OR_MOISTURE_LOST",
      evidenceShape:
        "Initial mass, initial moisture percentage, final moisture percentage and requested representation",
      decisiveInvariant:
        "Dry matter remains unchanged while moisture and total mass decrease",
    },
    {
      qlId: "MAL-QL-047",
      contractId: "MAL-CP004-EFF-MOISTURE-INVERSE",
      familyId: "MOISTURE_INVERSE",
      label: "Recover initial mass from the final dried mass",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "INITIAL_MASS",
      evidenceShape:
        "Final mass, original moisture percentage and final moisture percentage",
      decisiveInvariant:
        "The same dry-matter quantity is represented by the initial and final masses",
    },
  ] as const;

export const MAL_CP004_ENGLISH_RELEASE = Object.freeze({
  releaseId: "MAL-CP004-EN-v1" as const,
  packageId: "MAL-001" as const,
  canonicalProblemId: "MAL-CP-004" as const,
  runtimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  sourceDiscoveryRuntimeId: MAL_CP004_WAVE04_RUNTIME_ID,
  sourceEditorialRuntimeId: MAL_CP004_WAVE05_RUNTIME_ID,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  editorialStatus: "APPROVED_UNDER_PRODUCT_OWNER_CONTINUATION" as const,
  qlCount: MAL_CP004_PERMANENT_ALLOCATION.length,
  qlRange: "MAL-QL-038..MAL-QL-047" as const,
  reviewQuestionCount: MAL_CP004_PERMANENT_ALLOCATION.length * 4,
  approvedBy: "ExamTree product-owner continuation directive" as const,
  approvedAt: "2026-08-07" as const,
  reviewMethod:
    "SOURCE_AND_EQUIVALENCE_CLOSURE_PLUS_2000_QUESTION_UNIFIED_AUDIT_PLUS_2400_QUESTION_FOUR_TIER_EDITORIAL_AUDIT_PLUS_PERMANENT_RELEASE_AUDIT" as const,
  approvalNote:
    "The validated English contracts are frozen for controlled delivery. Hindi and Punjabi remain excluded until separate localisation and parity audits pass.",
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  excludedLanguages: ["hi", "pa"] as const,
});

const SECTION_TITLES = {
  coreConcept: "📌 Core Concept & Formula",
  steps: "📝 Step-by-Step Solution",
  shortcut: "⚡ 10-Second Exam Shortcut",
  traps: "⚠️ Common Traps & Distractor Analysis",
} as const;

export type MalCp004ReleasedExplanation = Omit<
  MalCp004Wave05EditorialQuestion["explanation"],
  "layoutId"
> & {
  layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-RELEASE-V1";
  sectionTitles: typeof SECTION_TITLES;
  lines: string[];
};

export type MalCp004ReleasedQuestion = Omit<
  MalCp004Wave05EditorialQuestion,
  | "runtimeId"
  | "baseRuntimeId"
  | "permanentQlId"
  | "questionLanguageId"
  | "difficulty"
  | "explanation"
  | "validation"
  | "editorialValidation"
  | "maturity"
  | "allocationStatus"
  | "reviewStatus"
  | "active"
  | "publiclyPublishable"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
> & {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-004";
  runtimeId: typeof MAL_CP004_PERMANENT_RUNTIME_ID;
  sourceDiscoveryRuntimeId: typeof MAL_CP004_WAVE04_RUNTIME_ID;
  sourceEditorialRuntimeId: typeof MAL_CP004_WAVE05_RUNTIME_ID;
  permanentQlId: MalCp004PermanentQlId;
  questionLanguageId: MalCp004PermanentQlId;
  questionId: string;
  difficulty: MalDifficulty;
  difficultyBand: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp004PermanentAnswerSemantic;
  parameters: Record<string, unknown>;
  solution: Record<string, unknown>;
  explanationId: string;
  explanation: MalCp004ReleasedExplanation;
  reasoningGraph: MalReasoningGraph;
  sourceValidation: MalCp004Wave05EditorialQuestion["validation"];
  sourceEditorialValidation: MalCp004Wave05EditorialQuestion["editorialValidation"];
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
    canonicalProblemId: "MAL-CP-004";
    questionLanguageId: MalCp004PermanentQlId;
    contractId: MalCp004Wave03EffectiveContractId;
    familyId: MalCp004PermanentFamilyId;
    releaseId: "MAL-CP004-EN-v1";
    representationVariant: MalCp004Wave05EditorialQuestion["representationVariant"];
    evidenceShape: string;
    decisiveInvariant: string;
    sourceEvidenceIds: readonly string[];
    taskDirection: MalTaskDirection;
    answerSemantic: MalCp004PermanentAnswerSemantic;
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

function allocationFor(
  qlId: MalCp004PermanentQlId,
): MalCp004PermanentAllocationEntry {
  const allocation = MAL_CP004_PERMANENT_ALLOCATION.find(
    (entry) => entry.qlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown MAL-CP-004 permanent QL: ${qlId}.`);
  return allocation;
}

function explanationLines(
  explanation: MalCp004Wave05EditorialQuestion["explanation"],
): string[] {
  return [
    SECTION_TITLES.coreConcept,
    explanation.coreConceptAndFormula,
    SECTION_TITLES.steps,
    ...explanation.stepByStepSolution,
    `Quick check: ${explanation.verification}`,
    `Final answer: ${explanation.conclusion}`,
    SECTION_TITLES.shortcut,
    explanation.examSpeedShortcut,
    SECTION_TITLES.traps,
    ...explanation.distractorAnalysis.flatMap((trap) => [
      `${trap.optionLetter}. ${trap.displayedValue}: ${trap.misconceptionLabel}`,
      trap.wrongCalculation,
      trap.correction,
    ]),
  ];
}

function formulaFromConcept(value: string): string | undefined {
  return value.match(/\$([^$]+)\$/u)?.[1];
}

function reasoningGraph(
  base: MalCp004Wave05EditorialQuestion,
): MalReasoningGraph {
  const derivations = base.explanation.stepByStepSolution.map((step, index) => ({
    id: `derivation-${index + 1}`,
    kind: "DERIVATION" as const,
    text: step,
    dependsOn: [index === 0 ? "relation-1" : `derivation-${index}`],
  }));
  const lastDerivation = derivations.at(-1)?.id ?? "relation-1";
  return {
    nodes: [
      {
        id: "given-1",
        kind: "GIVEN",
        text: base.stem,
        dependsOn: [],
      },
      {
        id: "relation-1",
        kind: "RELATION",
        text: base.explanation.coreConceptAndFormula,
        mathLatex: formulaFromConcept(base.explanation.coreConceptAndFormula),
        dependsOn: ["given-1"],
      },
      ...derivations,
      {
        id: "verification-1",
        kind: "VERIFICATION",
        text: base.explanation.verification,
        dependsOn: [lastDerivation],
      },
      {
        id: "conclusion-1",
        kind: "CONCLUSION",
        text: base.explanation.conclusion,
        dependsOn: ["verification-1"],
      },
    ],
  };
}

export function generateMalCp004PermanentQuestion(
  qlId: MalCp004PermanentQlId,
  seed = `mal-cp004-release:${qlId}:default`,
): MalCp004ReleasedQuestion {
  const allocation = allocationFor(qlId);
  const base = generateMalCp004Wave05EditorialQuestion(
    allocation.contractId,
    seed,
  );
  if (!base.validation.ok || !base.editorialValidation.ok) {
    throw new Error(
      `${qlId}/${seed}: source editorial validation failed: ${[
        ...base.validation.errors,
        ...base.editorialValidation.errors,
      ].join("; ")}`,
    );
  }

  const explanation: MalCp004ReleasedExplanation = {
    ...base.explanation,
    layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-RELEASE-V1",
    sectionTitles: SECTION_TITLES,
    lines: explanationLines(base.explanation),
  };
  const checks = [
    {
      name: "WAVE05_EDITORIAL_VALIDATION",
      passed: true as const,
      message: "The source English editorial package passed its complete Wave 05 gate.",
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
      name: "FOUR_TIER_EXPLANATION",
      passed: true as const,
      message: "The release preserves concept, steps, shortcut and all displayed distractor analyses.",
    },
    {
      name: "DELIVERY_AUTHORIZATION",
      passed: true as const,
      message: "English Question Studio, Question Bank, test and publication surfaces are enabled under Wave 06.",
    },
  ];

  return {
    ...base,
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-004",
    runtimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
    sourceDiscoveryRuntimeId: MAL_CP004_WAVE04_RUNTIME_ID,
    sourceEditorialRuntimeId: MAL_CP004_WAVE05_RUNTIME_ID,
    permanentQlId: qlId,
    questionLanguageId: qlId,
    questionId: `MAL-001:${qlId}:${seed}`,
    difficulty: allocation.difficulty,
    difficultyBand: allocation.difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    parameters: {
      contractId: allocation.contractId,
      representationVariant: base.representationVariant,
      sourceEvidenceIds: base.sourceEvidenceIds,
      exactState: base.exactState,
    },
    solution: {
      answer: base.answer,
      answerValue: base.answerValue,
      mathematicalFingerprint: base.mathematicalFingerprint,
      verification: base.explanation.verification,
    },
    explanationId: `${qlId}-EN-CONSERVED-QUANTITY-V1`,
    explanation,
    reasoningGraph: reasoningGraph(base),
    sourceValidation: base.validation,
    sourceEditorialValidation: base.editorialValidation,
    mathematicalFingerprint: [qlId, base.mathematicalFingerprint].join("|"),
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
      canonicalProblemId: "MAL-CP-004",
      questionLanguageId: qlId,
      contractId: allocation.contractId,
      familyId: allocation.familyId,
      releaseId: MAL_CP004_ENGLISH_RELEASE.releaseId,
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

export function runMalCp004EnglishReleasePipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ReleasedQuestion {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-004 English release does not support language '${language}'.`,
    );
  }
  return generateMalCp004PermanentQuestion(
    input.questionLanguageId,
    input.seed ?? `mal-cp004-release:${input.questionLanguageId}:default`,
  );
}

export function malCp004PermanentStable(
  question: MalCp004ReleasedQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
