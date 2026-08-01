import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import {
  applyMalCp002SingleReplacement,
  reduceMalCp002StateRatio,
} from "./cp002-solver";
import {
  MAL_CP002_CONTEXT_LIBRARY,
  type MalCp002Context,
} from "./cp002-context-library";
import { generateMalCp002DiscoveryPrototype } from "./cp002-prototype-runtime";
import type {
  MalCp002ExecutablePrototypeId,
  MalCp002Ratio,
  MalCp002State,
} from "./cp002-types";
import type {
  MalDifficulty,
  MalReasoningGraph,
  Rational,
} from "./types";

export const MAL_CP002_PERMANENT_QL_IDS = [
  "MAL-QL-012",
  "MAL-QL-013",
  "MAL-QL-014",
  "MAL-QL-015",
  "MAL-QL-016",
  "MAL-QL-017",
  "MAL-QL-018",
  "MAL-QL-019",
  "MAL-QL-020",
  "MAL-QL-021",
  "MAL-QL-022",
  "MAL-QL-023",
  "MAL-QL-024",
  "MAL-QL-025",
  "MAL-QL-026",
  "MAL-QL-027",
  "MAL-QL-028",
] as const;

export type MalCp002PermanentQlId =
  (typeof MAL_CP002_PERMANENT_QL_IDS)[number];

export type MalCp002PermanentFamilyId =
  | "EXPLICIT_ADD_TO_TARGET"
  | "EXPLICIT_REMOVE_TO_TARGET"
  | "RATIO_AFTER_PURE_ADDITION"
  | "RATIO_AFTER_PURE_REMOVAL"
  | "ORIGINAL_RATIO_BEFORE_ADDITION"
  | "ORIGINAL_RATIO_BEFORE_REMOVAL"
  | "COMPONENTS_FROM_TOTAL_AND_RATIO"
  | "SINGLE_REPLACEMENT_TO_TARGET"
  | "TOTAL_RATIO_ADD_TO_TARGET"
  | "TOTAL_RATIO_REMOVE_TO_TARGET"
  | "OTHER_COMPONENT_FROM_ONE_COMPONENT_AND_RATIO"
  | "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT"
  | "ORIGINAL_TOTAL_FROM_REMOVAL_RATIO_SHIFT"
  | "RATIO_AFTER_SINGLE_REPLACEMENT"
  | "HOMOGENEOUS_REMOVAL_RATIO_INVARIANCE"
  | "REQUIRED_OPERATION_AND_QUANTITY"
  | "THREE_COMPONENT_COUPLED_ADDITION";

export type MalCp002AnswerSemantic =
  | "COMPONENT_QUANTITY"
  | "COMPONENT_RATIO"
  | "COMPONENT_QUANTITY_PAIR"
  | "TOTAL_MIXTURE_QUANTITY"
  | "OPERATION_AND_QUANTITY"
  | "THREE_COMPONENT_QUANTITY";

export interface MalCp002PermanentAllocationEntry {
  qlId: MalCp002PermanentQlId;
  familyId: MalCp002PermanentFamilyId;
  label: string;
  difficulty: MalDifficulty;
  taskDirection: "FORWARD" | "INVERSE" | "RECONSTRUCTION";
  answerSemantic: MalCp002AnswerSemantic;
  sourcePrototypeId?: MalCp002ExecutablePrototypeId;
  evidenceShape: string;
  decisiveInvariant: string;
}

export const MAL_CP002_PERMANENT_ALLOCATION:
  readonly MalCp002PermanentAllocationEntry[] = [
    {
      qlId: "MAL-QL-012",
      familyId: "EXPLICIT_ADD_TO_TARGET",
      label: "Add one pure component to reach a target ratio",
      difficulty: "Easy",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      sourcePrototypeId: "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      evidenceShape: "Explicit quantities of both components and target ratio",
      decisiveInvariant: "The unaltered component quantity remains fixed",
    },
    {
      qlId: "MAL-QL-013",
      familyId: "EXPLICIT_REMOVE_TO_TARGET",
      label: "Remove one pure component to reach a target ratio",
      difficulty: "Easy",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      sourcePrototypeId: "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
      evidenceShape: "Explicit quantities of both components and target ratio",
      decisiveInvariant: "The unaltered component quantity remains fixed",
    },
    {
      qlId: "MAL-QL-014",
      familyId: "RATIO_AFTER_PURE_ADDITION",
      label: "Find the ratio after adding one pure component",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_RATIO",
      sourcePrototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
      evidenceShape: "Explicit initial quantities and a known pure addition",
      decisiveInvariant: "Only the added component changes",
    },
    {
      qlId: "MAL-QL-015",
      familyId: "RATIO_AFTER_PURE_REMOVAL",
      label: "Find the ratio after removing one pure component",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_RATIO",
      sourcePrototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
      evidenceShape: "Explicit initial quantities and a known pure removal",
      decisiveInvariant: "Only the removed pure component changes",
    },
    {
      qlId: "MAL-QL-016",
      familyId: "ORIGINAL_RATIO_BEFORE_ADDITION",
      label: "Recover the original ratio before a pure addition",
      difficulty: "Medium",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_RATIO",
      sourcePrototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION",
      evidenceShape: "Explicit final quantities and a known prior addition",
      decisiveInvariant: "Undo the addition on the named component only",
    },
    {
      qlId: "MAL-QL-017",
      familyId: "ORIGINAL_RATIO_BEFORE_REMOVAL",
      label: "Recover the original ratio before a pure removal",
      difficulty: "Medium",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_RATIO",
      sourcePrototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL",
      evidenceShape: "Explicit final quantities and a known prior removal",
      decisiveInvariant: "Undo the removal on the named component only",
    },
    {
      qlId: "MAL-QL-018",
      familyId: "COMPONENTS_FROM_TOTAL_AND_RATIO",
      label: "Find both component quantities from total and ratio",
      difficulty: "Easy",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY_PAIR",
      sourcePrototypeId: "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
      evidenceShape: "Total mixture quantity and component ratio",
      decisiveInvariant: "Partition the total by the sum of ratio parts",
    },
    {
      qlId: "MAL-QL-019",
      familyId: "SINGLE_REPLACEMENT_TO_TARGET",
      label: "Find one remove-and-refill quantity for a target ratio",
      difficulty: "Hard",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      sourcePrototypeId: "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
      evidenceShape: "Explicit initial state, refill component and target ratio",
      decisiveInvariant: "Both original components retain the same one-stage fraction before refill",
    },
    {
      qlId: "MAL-QL-020",
      familyId: "TOTAL_RATIO_ADD_TO_TARGET",
      label: "Add a pure component from total-and-ratio evidence",
      difficulty: "Medium",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceShape: "Initial total, initial ratio and target ratio",
      decisiveInvariant: "Partition first, then conserve the counterpart component",
    },
    {
      qlId: "MAL-QL-021",
      familyId: "TOTAL_RATIO_REMOVE_TO_TARGET",
      label: "Remove a pure component from total-and-ratio evidence",
      difficulty: "Medium",
      taskDirection: "INVERSE",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceShape: "Initial total, initial ratio and target ratio",
      decisiveInvariant: "Partition first, then conserve the counterpart component",
    },
    {
      qlId: "MAL-QL-022",
      familyId: "OTHER_COMPONENT_FROM_ONE_COMPONENT_AND_RATIO",
      label: "Find the other component from one quantity and the ratio",
      difficulty: "Easy",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "COMPONENT_QUANTITY",
      evidenceShape: "One known component quantity and the component ratio",
      decisiveInvariant: "The known component fixes the value of one ratio part",
    },
    {
      qlId: "MAL-QL-023",
      familyId: "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT",
      label: "Find the original total from a known addition and two ratios",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "TOTAL_MIXTURE_QUANTITY",
      evidenceShape: "Original ratio, final ratio and known pure addition",
      decisiveInvariant: "The counterpart component has the same quantity in both ratio states",
    },
    {
      qlId: "MAL-QL-024",
      familyId: "ORIGINAL_TOTAL_FROM_REMOVAL_RATIO_SHIFT",
      label: "Find the original total from a known removal and two ratios",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "TOTAL_MIXTURE_QUANTITY",
      evidenceShape: "Original ratio, final ratio and known pure removal",
      decisiveInvariant: "The counterpart component has the same quantity in both ratio states",
    },
    {
      qlId: "MAL-QL-025",
      familyId: "RATIO_AFTER_SINGLE_REPLACEMENT",
      label: "Find the ratio after one remove-and-refill operation",
      difficulty: "Medium",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_RATIO",
      evidenceShape: "Initial state, one removed sample and pure refill component",
      decisiveInvariant: "Retain both original components proportionally, then add the refill",
    },
    {
      qlId: "MAL-QL-026",
      familyId: "HOMOGENEOUS_REMOVAL_RATIO_INVARIANCE",
      label: "Recognise ratio invariance after removing a mixed sample",
      difficulty: "Easy",
      taskDirection: "FORWARD",
      answerSemantic: "COMPONENT_RATIO",
      evidenceShape: "Initial ratio and removal of a well-mixed sample without refill",
      decisiveInvariant: "Both components are multiplied by the same retained fraction",
    },
    {
      qlId: "MAL-QL-027",
      familyId: "REQUIRED_OPERATION_AND_QUANTITY",
      label: "Choose the required pure-component operation and quantity",
      difficulty: "Medium",
      taskDirection: "INVERSE",
      answerSemantic: "OPERATION_AND_QUANTITY",
      evidenceShape: "Explicit initial state and target ratio, with no operation prescribed",
      decisiveInvariant: "The target share decides which component must be added or removed",
    },
    {
      qlId: "MAL-QL-028",
      familyId: "THREE_COMPONENT_COUPLED_ADDITION",
      label: "Recover a three-component quantity after coupled additions",
      difficulty: "Hard",
      taskDirection: "RECONSTRUCTION",
      answerSemantic: "THREE_COMPONENT_QUANTITY",
      evidenceShape: "Initial three-way ratio, two known additions and final three-way ratio",
      decisiveInvariant: "The unchanged third component links the two ratio scales",
    },
  ] as const;

export const MAL_CP002_ENGLISH_RELEASE = Object.freeze({
  releaseId: "MAL-CP002-EN-v1",
  packageId: "MAL-001",
  canonicalProblemId: "MAL-CP-002",
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  editorialStatus: "APPROVED_UNDER_COMPLETION_DIRECTIVE" as const,
  qlCount: MAL_CP002_PERMANENT_ALLOCATION.length,
  qlRange: "MAL-QL-012..MAL-QL-028",
  reviewQuestionCount: MAL_CP002_PERMANENT_ALLOCATION.length * 4,
  approvedBy: "ExamTree product-owner completion directive",
  approvedAt: "2026-08-01",
  reviewMethod: "EXECUTABLE_CORPUS_AUDIT_AND_PRODUCT_OWNER_COMPLETION_DIRECTIVE",
  approvalNote:
    "The completion directive authorizes the validated English runtime and controlled delivery. It does not claim a separate row-by-row product-owner review of every generated sample.",
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  excludedLanguages: ["hi", "pa"] as const,
});

export interface MalCp002RatioVisual {
  version: 1;
  kind: "TWO_COMPONENT" | "THREE_COMPONENT";
  title: string;
  quantityUnit: string;
  before: readonly {
    label: string;
    quantity: string;
  }[];
  operation: string;
  after: readonly {
    label: string;
    quantity: string;
  }[];
  beforeRatio: string;
  afterRatio: string;
  targetRatio?: string;
  note: string;
}

export interface MalCp002ReleasedQuestion {
  packageId: "MAL-001";
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-002";
  prototypeId: string;
  permanentQlId: MalCp002PermanentQlId;
  questionLanguageId: MalCp002PermanentQlId;
  questionId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  difficultyBand: MalDifficulty;
  taskDirection: "FORWARD" | "INVERSE" | "RECONSTRUCTION";
  answerSemantic: MalCp002AnswerSemantic;
  stem: string;
  parameters: Record<string, unknown>;
  solution: Record<string, unknown>;
  answer: string;
  options: string[];
  optionAudit: readonly {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
  correctIndex: number;
  explanationId: string;
  explanation: {
    layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1";
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula";
      steps: "📝 Step-by-Step Solution";
      shortcut: "⚡ 10-Second Exam Shortcut";
      trap: "⚠️ Common Trap & Mistake Warning";
    };
    coreConcept: string;
    formula: string;
    steps: string[];
    verification: string;
    conclusion: string;
    examShortcut: string;
    commonTrap: string;
    ratioVisual: MalCp002RatioVisual;
    lines: string[];
  };
  reasoningGraph: MalReasoningGraph;
  diagram: MalCp002RatioVisual;
  mathematicalFingerprint: string;
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
    canonicalProblemId: "MAL-CP-002";
    questionLanguageId: MalCp002PermanentQlId;
    familyId: MalCp002PermanentFamilyId;
    releaseId: "MAL-CP002-EN-v1";
    evidenceShape: string;
    decisiveInvariant: string;
    taskDirection: "FORWARD" | "INVERSE" | "RECONSTRUCTION";
    answerSemantic: MalCp002AnswerSemantic;
    difficulty: MalDifficulty;
    language: "en";
    runtimeMode: "RELEASED";
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
    questionBankStatus: "WRITABLE";
    testEligibility: "ELIGIBLE";
    publiclyPublishable: true;
  };
}

const SECTION_TITLES = {
  coreConcept: "📌 Core Concept & Formula",
  steps: "📝 Step-by-Step Solution",
  shortcut: "⚡ 10-Second Exam Shortcut",
  trap: "⚠️ Common Trap & Mistake Warning",
} as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

class DeterministicRandom {
  private state: number;

  constructor(seed: string) {
    this.state = hash(seed) || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }

  bool(): boolean {
    return (this.next() & 1) === 1;
  }
}

function selectContext(seed: string): MalCp002Context {
  return MAL_CP002_CONTEXT_LIBRARY[
    hash(`${seed}:context`) % MAL_CP002_CONTEXT_LIBRARY.length
  ]!;
}

function formatQuantity(value: Rational, unit: string): string {
  return `${formatRational(value)} ${unit}`;
}

function ratioText(ratio: MalCp002Ratio): string {
  const [a, b] = reduceRationalRatio(
    ratio.componentAPart,
    ratio.componentBPart,
  );
  return `${formatRational(a)} : ${formatRational(b)}`;
}

function stateRatioText(state: MalCp002State): string {
  return ratioText(reduceMalCp002StateRatio(state));
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/gu, "");
}

export const MAL_CP002_RATIO_VISUAL_DIRECTIVE =
  "EXAMTREE_RATIO_ADJUSTMENT_SVG_V1" as const;

export function serializeMalCp002RatioVisual(
  visual: MalCp002RatioVisual,
): string {
  return `[[${MAL_CP002_RATIO_VISUAL_DIRECTIVE}:${encodeBase64Url(
    JSON.stringify(visual),
  )}]]`;
}

function explanationLines(
  explanation: Omit<MalCp002ReleasedQuestion["explanation"], "lines">,
): string[] {
  return [
    explanation.sectionTitles.coreConcept,
    explanation.coreConcept,
    `Formula: ${explanation.formula}`,
    explanation.sectionTitles.steps,
    ...explanation.steps,
    `Quick check: ${explanation.verification}`,
    `Final answer: ${explanation.conclusion}`,
    explanation.sectionTitles.shortcut,
    serializeMalCp002RatioVisual(explanation.ratioVisual),
    explanation.examShortcut,
    explanation.sectionTitles.trap,
    explanation.commonTrap.replace(/^Common trap:\s*/u, ""),
  ];
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  const random = new DeterministicRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = random.int(0, index);
    [result[index], result[swapIndex]] = [
      result[swapIndex]!,
      result[index]!,
    ];
  }
  return result;
}

function buildOptions(
  answer: string,
  candidates: readonly { text: string; misconceptionId: string }[],
  seed: string,
): {
  options: string[];
  correctIndex: number;
  optionAudit: {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
} {
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  unique.set(answer, { text: answer, misconceptionId: "CORRECT" });
  for (const candidate of candidates) {
    if (!candidate.text.trim()) continue;
    if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  }
  let fallback = 1;
  while (unique.size < 4) {
    const text = `${answer} (${fallback})`;
    if (!unique.has(text)) {
      unique.set(text, {
        text,
        misconceptionId: "PLAUSIBLE_ARITHMETIC_SLIP",
      });
    }
    fallback += 1;
  }
  const selected = [...unique.values()].slice(0, 4);
  const shuffled = shuffle(selected, seed);
  const correctIndex = shuffled.findIndex((item) => item.text === answer);
  if (correctIndex < 0) throw new Error("Correct option was lost.");
  return {
    options: shuffled.map((item) => item.text),
    correctIndex,
    optionAudit: shuffled.map((item) => ({
      ...item,
      isCorrect: item.text === answer,
    })),
  };
}

function quantityOptions(
  answerValue: Rational,
  unit: string,
  seed: string,
  extraValues: readonly Rational[] = [],
) {
  const answer = formatQuantity(answerValue, unit);
  const values = [
    ...extraValues,
    addRational(answerValue, rational(1)),
    compareRational(answerValue, rational(1)) > 0
      ? subtractRational(answerValue, rational(1))
      : addRational(answerValue, rational(2)),
    multiplyRational(answerValue, rational(2)),
  ];
  return {
    answer,
    ...buildOptions(
      answer,
      values.map((value, index) => ({
        text: formatQuantity(value, unit),
        misconceptionId: [
          "INITIAL_QUANTITY_REPORTED",
          "ONE_PART_ERROR",
          "ADJUSTMENT_DIRECTION_REVERSED",
          "PLAUSIBLE_ARITHMETIC_SLIP",
        ][index % 4]!,
      })),
      seed,
    ),
  };
}

function ratioOptions(
  answerRatio: MalCp002Ratio,
  seed: string,
  candidates: readonly MalCp002Ratio[] = [],
) {
  const answer = ratioText(answerRatio);
  const reversed: MalCp002Ratio = {
    componentAPart: answerRatio.componentBPart,
    componentBPart: answerRatio.componentAPart,
  };
  const defaults: MalCp002Ratio[] = [
    reversed,
    {
      componentAPart: addRational(answerRatio.componentAPart, rational(1)),
      componentBPart: answerRatio.componentBPart,
    },
    {
      componentAPart: answerRatio.componentAPart,
      componentBPart: addRational(answerRatio.componentBPart, rational(1)),
    },
  ];
  return {
    answer,
    ...buildOptions(
      answer,
      [...candidates, ...defaults].map((value, index) => ({
        text: ratioText(value),
        misconceptionId: [
          "RATIO_REVERSED",
          "OPERATION_NOT_APPLIED",
          "WRONG_COMPONENT_CHANGED",
          "PLAUSIBLE_ARITHMETIC_SLIP",
        ][index % 4]!,
      })),
      seed,
    ),
  };
}

function buildGraph(
  givens: readonly string[],
  relation: string,
  derivations: readonly string[],
  verification: string,
  conclusion: string,
): MalReasoningGraph {
  const nodes = givens.map((text, index) => ({
    id: `given-${index + 1}`,
    kind: "GIVEN" as const,
    text,
    dependsOn: [] as string[],
  }));
  nodes.push({
    id: "relation",
    kind: "RELATION",
    text: relation,
    dependsOn: givens.map((_value, index) => `given-${index + 1}`),
  });
  derivations.forEach((text, index) => {
    nodes.push({
      id: `derivation-${index + 1}`,
      kind: "DERIVATION",
      text,
      dependsOn: [
        index === 0 ? "relation" : `derivation-${index}`,
      ],
    });
  });
  nodes.push({
    id: "verification",
    kind: "VERIFICATION",
    text: verification,
    dependsOn: [
      derivations.length === 0
        ? "relation"
        : `derivation-${derivations.length}`,
    ],
  });
  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: conclusion,
    dependsOn: ["verification"],
  });
  return { nodes };
}

function visualFromStates(
  context: MalCp002Context,
  title: string,
  before: readonly { label: string; quantity: Rational }[],
  operation: string,
  after: readonly { label: string; quantity: Rational }[],
  beforeRatio: string,
  afterRatio: string,
  targetRatio: string | undefined,
  note: string,
): MalCp002RatioVisual {
  return {
    version: 1,
    kind: before.length === 3 ? "THREE_COMPONENT" : "TWO_COMPONENT",
    title,
    quantityUnit: context.quantityUnit,
    before: before.map((item) => ({
      label: item.label,
      quantity: formatRational(item.quantity),
    })),
    operation,
    after: after.map((item) => ({
      label: item.label,
      quantity: formatRational(item.quantity),
    })),
    beforeRatio,
    afterRatio,
    targetRatio,
    note,
  };
}

type Draft = Omit<
  MalCp002ReleasedQuestion,
  | "validation"
  | "maturity"
  | "allocationStatus"
  | "releaseStatus"
  | "runtimeMode"
  | "reviewStatus"
  | "questionBankStatus"
  | "testEligibility"
  | "permanentIdentityFrozen"
  | "active"
  | "publiclyPublishable"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
  | "traceability"
>;

function releaseDraft(
  allocation: MalCp002PermanentAllocationEntry,
  draft: Draft,
): MalCp002ReleasedQuestion {
  const checks = [
    {
      name: "permanent-identity",
      passed:
        draft.permanentQlId === allocation.qlId &&
        MAL_CP002_PERMANENT_QL_IDS.includes(draft.permanentQlId),
      message: "The question uses one frozen MAL-CP-002 QL identity.",
    },
    {
      name: "answer-option-contract",
      passed:
        draft.options.length === 4 &&
        new Set(draft.options).size === 4 &&
        draft.options[draft.correctIndex] === draft.answer,
      message: "Four unique options contain the canonical answer.",
    },
    {
      name: "formula-first-method",
      passed:
        draft.explanation.steps.length >= 3 &&
        !/alligation/iu.test(
          [
            draft.explanation.coreConcept,
            draft.explanation.formula,
            ...draft.explanation.steps,
          ].join("\n"),
        ),
      message: "The main solution uses composition equations, not alligation.",
    },
    {
      name: "responsive-ratio-visual",
      passed:
        draft.explanation.ratioVisual.version === 1 &&
        draft.explanation.ratioVisual.before.length >= 2 &&
        draft.explanation.ratioVisual.after.length >= 2,
      message: "A structured responsive before/after ratio visual is present.",
    },
    {
      name: "reasoning-graph",
      passed:
        draft.reasoningGraph.nodes.length >= 5 &&
        draft.reasoningGraph.nodes.at(-1)?.kind === "CONCLUSION",
      message: "The reasoning graph ends with a verified conclusion.",
    },
    {
      name: "completion-release",
      passed:
        MAL_CP002_ENGLISH_RELEASE.status === "FROZEN" &&
        MAL_CP002_ENGLISH_RELEASE.editorialStatus ===
          "APPROVED_UNDER_COMPLETION_DIRECTIVE",
      message: "The English completion directive and executable audit gates apply.",
    },
  ];
  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `${allocation.qlId}/${draft.seed}: ${failures
        .map((item) => `${item.name}: ${item.message}`)
        .join("; ")}`,
    );
  }

  return {
    ...draft,
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
      checks: checks.map(({ name, message }) => ({
        name,
        passed: true as const,
        message,
      })),
    },
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      questionLanguageId: allocation.qlId,
      familyId: allocation.familyId,
      releaseId: "MAL-CP002-EN-v1",
      evidenceShape: allocation.evidenceShape,
      decisiveInvariant: allocation.decisiveInvariant,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      difficulty: allocation.difficulty,
      language: "en",
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
  };
}

function wrapDiscoveryPrototype(
  allocation: MalCp002PermanentAllocationEntry,
  seed: string,
): MalCp002ReleasedQuestion {
  if (!allocation.sourcePrototypeId) {
    throw new Error(`${allocation.qlId} has no source prototype.`);
  }
  const source = generateMalCp002DiscoveryPrototype(
    allocation.sourcePrototypeId,
    seed,
  );
  if (!source.validation.ok) {
    throw new Error(
      `${allocation.qlId}/${seed}: source prototype failed: ${source.validation.errors.join(
        "; ",
      )}`,
    );
  }
  const visual: MalCp002RatioVisual = {
    version: 1,
    kind: "TWO_COMPONENT",
    title: source.diagram.title,
    quantityUnit: source.diagram.quantityUnit,
    before: [
      {
        label: source.diagram.componentALabel,
        quantity: source.diagram.before.componentA,
      },
      {
        label: source.diagram.componentBLabel,
        quantity: source.diagram.before.componentB,
      },
    ],
    operation: source.diagram.operation.label,
    after: [
      {
        label: source.diagram.componentALabel,
        quantity: source.diagram.after.componentA,
      },
      {
        label: source.diagram.componentBLabel,
        quantity: source.diagram.after.componentB,
      },
    ],
    beforeRatio: source.diagram.before.ratio,
    afterRatio: source.diagram.after.ratio,
    targetRatio: source.diagram.targetRatio,
    note:
      source.diagram.operation.stage === "HOMOGENEOUS_REMOVE_REFILL"
        ? "Remove the mixed sample proportionally before adding the pure refill."
        : "Change only the named pure component; the counterpart stays fixed.",
  };
  const explanationWithoutLines = {
    ...source.explanation,
    layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
    ratioVisual: visual,
  };
  const explanation = {
    ...explanationWithoutLines,
    lines: explanationLines(explanationWithoutLines),
  };
  return releaseDraft(allocation, {
    packageId: "MAL-001",
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    prototypeId: allocation.sourcePrototypeId,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `MAL-001:${allocation.qlId}:${seed}`,
    language: "en",
    seed,
    difficulty: allocation.difficulty,
    difficultyBand: allocation.difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    stem: source.stem,
    parameters: {
      ...source.parameters,
      runtimeMode: "RELEASED",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
    },
    solution: source.solution as unknown as Record<string, unknown>,
    answer: source.answer,
    options: [...source.options],
    optionAudit: source.optionAudit.map((item) => ({
      text: item.text,
      misconceptionId: item.misconceptionId,
      isCorrect: item.isCorrect,
    })),
    correctIndex: source.correctIndex,
    explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
    explanation,
    reasoningGraph: source.reasoningGraph,
    diagram: visual,
    mathematicalFingerprint: `${allocation.qlId}|${source.mathematicalFingerprint}`,
  });
}

const RATIO_PAIRS = [
  [1, 2],
  [2, 1],
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [3, 5],
  [5, 3],
  [4, 5],
  [5, 4],
  [5, 7],
  [7, 5],
] as const;

function ratio(a: number, b: number): MalCp002Ratio {
  return {
    componentAPart: rational(a),
    componentBPart: rational(b),
  };
}

function state(a: number, b: number): MalCp002State {
  return {
    componentA: rational(a),
    componentB: rational(b),
  };
}

function generatedDraft(
  allocation: MalCp002PermanentAllocationEntry,
  seed: string,
): Draft {
  const random = new DeterministicRandom(`${allocation.qlId}:${seed}`);
  const context = selectContext(`${allocation.qlId}:${seed}`);
  const unit = context.quantityUnit;
  const [p, q] = random.pick(RATIO_PAIRS);
  const scale = random.int(6, 45);
  const initial = state(p * scale, q * scale);
  const initialRatio = ratio(p, q);

  if (
    allocation.familyId === "TOTAL_RATIO_ADD_TO_TARGET" ||
    allocation.familyId === "TOTAL_RATIO_REMOVE_TO_TARGET"
  ) {
    const kind =
      allocation.familyId === "TOTAL_RATIO_ADD_TO_TARGET" ? "ADD" : "REMOVE";
    const changedComponent = random.bool() ? "A" : "B";
    const current =
      changedComponent === "A" ? initial.componentA : initial.componentB;
    const maximum =
      kind === "REMOVE"
        ? Math.max(1, Math.min(Number(current.numerator) - 1, 24))
        : 24;
    const amount = rational(random.int(2, maximum));
    const finalState =
      changedComponent === "A"
        ? {
            componentA:
              kind === "ADD"
                ? addRational(initial.componentA, amount)
                : subtractRational(initial.componentA, amount),
            componentB: initial.componentB,
          }
        : {
            componentA: initial.componentA,
            componentB:
              kind === "ADD"
                ? addRational(initial.componentB, amount)
                : subtractRational(initial.componentB, amount),
          };
    const targetRatio = reduceMalCp002StateRatio(finalState);
    const total = addRational(initial.componentA, initial.componentB);
    const changedLabel =
      changedComponent === "A"
        ? context.componentALabel
        : context.componentBLabel;
    const counterpartLabel =
      changedComponent === "A"
        ? context.componentBLabel
        : context.componentALabel;
    const initialChanged =
      changedComponent === "A" ? initial.componentA : initial.componentB;
    const finalChanged =
      changedComponent === "A" ? finalState.componentA : finalState.componentB;
    const options = quantityOptions(amount, unit, `${seed}:options`, [
      initialChanged,
      finalChanged,
      total,
    ]);
    const stem = `${context.actor} has ${formatQuantity(
      total,
      unit,
    )} in a ${context.container}, with ${context.componentALabel} and ${
      context.componentBLabel
    } in the ratio ${ratioText(initialRatio)}. How much pure ${changedLabel} must be ${
      kind === "ADD" ? "added" : "removed"
    } so that the ratio becomes ${ratioText(targetRatio)}?`;
    const totalParts = p + q;
    const onePart = divideRational(total, rational(totalParts));
    const counterpart =
      changedComponent === "A" ? initial.componentB : initial.componentA;
    const targetChanged = finalChanged;
    const operationWord = kind === "ADD" ? "add" : "remove";
    const steps = [
      `Step 1: Total ratio parts = ${p} + ${q} = ${totalParts}.`,
      `Step 2: One part = ${formatRational(total)} ÷ ${totalParts} = ${formatRational(
        onePart,
      )} ${unit}.`,
      `Step 3: The unchanged ${counterpartLabel} quantity is ${formatRational(
        counterpart,
      )} ${unit}.`,
      `Step 4: Under the target ratio ${ratioText(
        targetRatio,
      )}, the required ${changedLabel} quantity is ${formatRational(
        targetChanged,
      )} ${unit}.`,
      `Step 5: Required amount to ${operationWord} = ${formatRational(
        amount,
      )} ${unit}.`,
    ];
    const verification = `After the operation, the quantities are ${formatRational(
      finalState.componentA,
    )} and ${formatRational(
      finalState.componentB,
    )}; their reduced ratio is ${ratioText(targetRatio)}.`;
    const conclusion = `${kind === "ADD" ? "Add" : "Remove"} ${options.answer} of pure ${changedLabel}.`;
    const visual = visualFromStates(
      context,
      `${kind === "ADD" ? "Addition" : "Removal"} from total-and-ratio evidence`,
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `${kind === "ADD" ? "+" : "−"} ${formatRational(amount)} ${unit} ${changedLabel}`,
      [
        { label: context.componentALabel, quantity: finalState.componentA },
        { label: context.componentBLabel, quantity: finalState.componentB },
      ],
      ratioText(initialRatio),
      ratioText(targetRatio),
      ratioText(targetRatio),
      `${counterpartLabel} stays unchanged.`,
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "First split the stated total by the initial ratio. Then change only the named pure component while keeping the other component fixed.",
      formula:
        "one ratio part = total ÷ sum of parts; required change = |required changed-component quantity − initial changed-component quantity|",
      steps,
      verification,
      conclusion,
      examShortcut: `Keep ${counterpartLabel} fixed and compare only the old and target quantities of ${changedLabel}.`,
      commonTrap:
        "Common trap: applying the target ratio directly to the original total. The total changes when a component is added or removed.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: `MAL-CP002-FINAL-${allocation.familyId}`,
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialTotal: total,
        initialRatio,
        changedComponent,
        adjustmentKind: kind,
        targetRatio,
        contextId: context.contextId,
      },
      solution: {
        quantity: amount,
        initialState: initial,
        finalState,
        targetRatio,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Initial total ${formatRational(total)} ${unit}`,
          `Initial ratio ${ratioText(initialRatio)}`,
          `Target ratio ${ratioText(targetRatio)}`,
        ],
        `${counterpartLabel} is conserved`,
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        rationalKey(total),
        ratioText(initialRatio),
        kind,
        changedComponent,
        rationalKey(amount),
        ratioText(targetRatio),
      ].join("|"),
    };
  }

  if (
    allocation.familyId ===
    "OTHER_COMPONENT_FROM_ONE_COMPONENT_AND_RATIO"
  ) {
    const knownComponent = random.bool() ? "A" : "B";
    const knownQuantity =
      knownComponent === "A" ? initial.componentA : initial.componentB;
    const answerValue =
      knownComponent === "A" ? initial.componentB : initial.componentA;
    const knownLabel =
      knownComponent === "A"
        ? context.componentALabel
        : context.componentBLabel;
    const answerLabel =
      knownComponent === "A"
        ? context.componentBLabel
        : context.componentALabel;
    const knownPart = knownComponent === "A" ? p : q;
    const answerPart = knownComponent === "A" ? q : p;
    const onePart = divideRational(knownQuantity, rational(knownPart));
    const options = quantityOptions(answerValue, unit, `${seed}:options`, [
      knownQuantity,
      onePart,
      addRational(knownQuantity, answerValue),
    ]);
    const stem = `In a ${context.container}, ${context.componentALabel} and ${
      context.componentBLabel
    } are in the ratio ${p} : ${q}. If the quantity of ${knownLabel} is ${formatQuantity(
      knownQuantity,
      unit,
    )}, what is the quantity of ${answerLabel}?`;
    const steps = [
      `Step 1: ${knownLabel} represents ${knownPart} ratio part${
        knownPart === 1 ? "" : "s"
      }.`,
      `Step 2: One part = ${formatRational(
        knownQuantity,
      )} ÷ ${knownPart} = ${formatRational(onePart)} ${unit}.`,
      `Step 3: ${answerLabel} represents ${answerPart} part${
        answerPart === 1 ? "" : "s"
      }.`,
      `Step 4: ${answerLabel} quantity = ${answerPart} × ${formatRational(
        onePart,
      )} = ${formatRational(answerValue)} ${unit}.`,
    ];
    const verification = `${formatRational(
      initial.componentA,
    )} : ${formatRational(initial.componentB)} reduces to ${p} : ${q}.`;
    const conclusion = `The quantity of ${answerLabel} is ${options.answer}.`;
    const visual = visualFromStates(
      context,
      "Scale the ratio from one known component",
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `Known ${knownLabel} fixes one-part value`,
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `${p} : ${q}`,
      `${p} : ${q}`,
      undefined,
      `One part equals ${formatRational(onePart)} ${unit}.`,
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "A known component quantity fixes the value of its ratio parts. Use that one-part value to find the other component.",
      formula:
        "one part = known quantity ÷ known ratio part; other quantity = one part × other ratio part",
      steps,
      verification,
      conclusion,
      examShortcut: `Scale ${p} : ${q} directly from the known ${knownLabel} quantity.`,
      commonTrap:
        "Common trap: multiplying the known quantity by the other ratio part without first dividing by the known part.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: "MAL-CP002-FINAL-ONE-COMPONENT-AND-RATIO",
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        ratio: initialRatio,
        knownComponent,
        knownQuantity,
        contextId: context.contextId,
      },
      solution: {
        otherQuantity: answerValue,
        fullState: initial,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Ratio ${p} : ${q}`,
          `${knownLabel} quantity ${formatRational(knownQuantity)} ${unit}`,
        ],
        "The known component fixes one ratio part",
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        knownComponent,
        rationalKey(knownQuantity),
        p,
        q,
        rationalKey(answerValue),
      ].join("|"),
    };
  }

  if (
    allocation.familyId ===
      "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT" ||
    allocation.familyId ===
      "ORIGINAL_TOTAL_FROM_REMOVAL_RATIO_SHIFT"
  ) {
    const kind =
      allocation.familyId ===
      "ORIGINAL_TOTAL_FROM_ADDITION_RATIO_SHIFT"
        ? "ADD"
        : "REMOVE";
    const changedComponent = random.bool() ? "A" : "B";
    const maximum =
      kind === "REMOVE"
        ? Math.max(
            2,
            Math.min(
              changedComponent === "A" ? p * scale - 1 : q * scale - 1,
              30,
            ),
          )
        : 30;
    const amount = rational(random.int(2, maximum));
    const finalState =
      changedComponent === "A"
        ? {
            componentA:
              kind === "ADD"
                ? addRational(initial.componentA, amount)
                : subtractRational(initial.componentA, amount),
            componentB: initial.componentB,
          }
        : {
            componentA: initial.componentA,
            componentB:
              kind === "ADD"
                ? addRational(initial.componentB, amount)
                : subtractRational(initial.componentB, amount),
          };
    const finalRatio = reduceMalCp002StateRatio(finalState);
    const originalTotal = addRational(initial.componentA, initial.componentB);
    const changedLabel =
      changedComponent === "A"
        ? context.componentALabel
        : context.componentBLabel;
    const options = quantityOptions(
      originalTotal,
      unit,
      `${seed}:options`,
      [
        addRational(finalState.componentA, finalState.componentB),
        amount,
        changedComponent === "A" ? initial.componentA : initial.componentB,
      ],
    );
    const stem = `${context.componentALabel} and ${
      context.componentBLabel
    } were initially in the ratio ${p} : ${q}. After ${formatQuantity(
      amount,
      unit,
    )} of pure ${changedLabel} was ${
      kind === "ADD" ? "added" : "removed"
    }, the ratio became ${ratioText(
      finalRatio,
    )}. What was the original total quantity of the mixture?`;
    const unchangedComponent = changedComponent === "A" ? "B" : "A";
    const unchangedOriginalPart = unchangedComponent === "A" ? p : q;
    const unchangedFinalPart =
      unchangedComponent === "A"
        ? Number(finalRatio.componentAPart.numerator)
        : Number(finalRatio.componentBPart.numerator);
    const changedOriginalPart = changedComponent === "A" ? p : q;
    const changedFinalPart =
      changedComponent === "A"
        ? Number(finalRatio.componentAPart.numerator)
        : Number(finalRatio.componentBPart.numerator);
    const operationSign = kind === "ADD" ? "+" : "−";
    const steps = [
      `Step 1: Let the original quantities be ${p}x and ${q}x.`,
      `Step 2: The unchanged component gives ${unchangedOriginalPart}x = ${unchangedFinalPart}y, where y is the final-ratio scale.`,
      `Step 3: The changed component gives ${changedOriginalPart}x ${operationSign} ${formatRational(
        amount,
      )} = ${changedFinalPart}y.`,
      `Step 4: Solving these two equations gives x = ${scale}.`,
      `Step 5: Original total = (${p} + ${q}) × ${scale} = ${formatRational(
        originalTotal,
      )} ${unit}.`,
    ];
    const verification = `The reconstructed original state is ${formatRational(
      initial.componentA,
    )} : ${formatRational(initial.componentB)}. Applying the stated ${
      kind === "ADD" ? "addition" : "removal"
    } produces ${ratioText(finalRatio)}.`;
    const conclusion = `The original total quantity was ${options.answer}.`;
    const visual = visualFromStates(
      context,
      `Original scale from a ratio shift`,
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `${operationSign} ${formatRational(amount)} ${unit} ${changedLabel}`,
      [
        { label: context.componentALabel, quantity: finalState.componentA },
        { label: context.componentBLabel, quantity: finalState.componentB },
      ],
      `${p} : ${q}`,
      ratioText(finalRatio),
      undefined,
      `The unchanged component connects the original scale x to the final scale y.`,
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "Use separate scale factors for the original and final ratios. The unchanged component links those scales.",
      formula:
        "original quantities = px, qx; final quantities = ry, sy; unchanged component equation + changed component equation",
      steps,
      verification,
      conclusion,
      examShortcut:
        "Match the unchanged component first. Then use the known addition or removal to obtain the original scale.",
      commonTrap:
        "Common trap: treating the same scale factor as valid before and after the operation. The ratio changes, so the two scales are generally different.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: `MAL-CP002-FINAL-${allocation.familyId}`,
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialRatio,
        finalRatio,
        changedComponent,
        adjustmentKind: kind,
        adjustmentQuantity: amount,
        contextId: context.contextId,
      },
      solution: {
        originalScale: rational(scale),
        originalState: initial,
        originalTotal,
        finalState,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Original ratio ${p} : ${q}`,
          `Final ratio ${ratioText(finalRatio)}`,
          `${kind} ${formatRational(amount)} ${unit} of ${changedLabel}`,
        ],
        "The counterpart component is unchanged",
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        p,
        q,
        changedComponent,
        kind,
        rationalKey(amount),
        ratioText(finalRatio),
        rationalKey(originalTotal),
      ].join("|"),
    };
  }

  if (allocation.familyId === "RATIO_AFTER_SINGLE_REPLACEMENT") {
    const total = addRational(initial.componentA, initial.componentB);
    const divisors = [4, 5, 6, 8, 10] as const;
    const divisor = random.pick(divisors);
    const amount = divideRational(total, rational(divisor));
    const replacementComponent = random.bool() ? "A" : "B";
    const finalState = applyMalCp002SingleReplacement(
      initial,
      replacementComponent,
      amount,
    );
    const finalRatio = reduceMalCp002StateRatio(finalState);
    const refillLabel =
      replacementComponent === "A"
        ? context.componentALabel
        : context.componentBLabel;
    const options = ratioOptions(finalRatio, `${seed}:options`, [
      initialRatio,
      {
        componentAPart:
          replacementComponent === "A"
            ? addRational(initial.componentA, amount)
            : initial.componentA,
        componentBPart:
          replacementComponent === "B"
            ? addRational(initial.componentB, amount)
            : initial.componentB,
      },
    ]);
    const retainedFraction = divideRational(
      subtractRational(total, amount),
      total,
    );
    const stem = `A ${context.container} contains ${formatQuantity(
      initial.componentA,
      unit,
    )} of ${context.componentALabel} and ${formatQuantity(
      initial.componentB,
      unit,
    )} of ${context.componentBLabel}. A well-mixed sample of ${formatQuantity(
      amount,
      unit,
    )} is removed once and replaced with the same quantity of pure ${refillLabel}. What is the final ratio of ${
      context.componentALabel
    } to ${context.componentBLabel}?`;
    const steps = [
      `Step 1: Total quantity = ${formatRational(
        total,
      )} ${unit}; retained fraction after removal = (${formatRational(
        total,
      )} − ${formatRational(amount)}) ÷ ${formatRational(
        total,
      )} = ${formatRational(retainedFraction)}.`,
      `Step 2: Retained ${context.componentALabel} = ${formatRational(
        initial.componentA,
      )} × ${formatRational(retainedFraction)} = ${formatRational(
        multiplyRational(initial.componentA, retainedFraction),
      )} ${unit}.`,
      `Step 3: Retained ${context.componentBLabel} = ${formatRational(
        initial.componentB,
      )} × ${formatRational(retainedFraction)} = ${formatRational(
        multiplyRational(initial.componentB, retainedFraction),
      )} ${unit}.`,
      `Step 4: Add ${formatRational(
        amount,
      )} ${unit} to the ${refillLabel} amount only.`,
      `Step 5: Final ratio = ${formatRational(
        finalState.componentA,
      )} : ${formatRational(finalState.componentB)} = ${ratioText(
        finalRatio,
      )}.`,
    ];
    const verification = `The final component quantities sum to ${formatRational(
      total,
    )} ${unit}, so the vessel total is restored correctly.`;
    const conclusion = `The final ratio is ${options.answer}.`;
    const visual = visualFromStates(
      context,
      "One remove-and-refill operation",
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `Remove ${formatRational(amount)} ${unit} mixed sample; refill pure ${refillLabel}`,
      [
        { label: context.componentALabel, quantity: finalState.componentA },
        { label: context.componentBLabel, quantity: finalState.componentB },
      ],
      ratioText(initialRatio),
      ratioText(finalRatio),
      undefined,
      "The removed sample has the current mixture composition.",
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "Removing a well-mixed sample reduces both original components by the same retained fraction. The pure refill is then added to one component.",
      formula:
        "retained amount = initial amount × (total − removed) ÷ total; final refill component = retained amount + refill",
      steps,
      verification,
      conclusion,
      examShortcut:
        "Apply the retained fraction to both components first; only then add the pure refill.",
      commonTrap:
        "Common trap: subtracting the whole removed quantity from one component. A homogeneous sample contains both components.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: "MAL-CP002-FINAL-RATIO-AFTER-SINGLE-REPLACEMENT",
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialState: initial,
        removedQuantity: amount,
        replacementComponent,
        contextId: context.contextId,
      },
      solution: {
        retainedFraction,
        finalState,
        finalRatio,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Initial state ${formatRational(
            initial.componentA,
          )} and ${formatRational(initial.componentB)} ${unit}`,
          `Removed and refilled quantity ${formatRational(amount)} ${unit}`,
          `Refill component ${refillLabel}`,
        ],
        "Both original components retain the same fraction before refill",
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        rationalKey(initial.componentA),
        rationalKey(initial.componentB),
        rationalKey(amount),
        replacementComponent,
        ratioText(finalRatio),
      ].join("|"),
    };
  }

  if (
    allocation.familyId ===
    "HOMOGENEOUS_REMOVAL_RATIO_INVARIANCE"
  ) {
    const total = addRational(initial.componentA, initial.componentB);
    const amount = divideRational(
      total,
      rational(random.pick([4, 5, 6, 8] as const)),
    );
    const retainedFraction = divideRational(
      subtractRational(total, amount),
      total,
    );
    const finalState = {
      componentA: multiplyRational(initial.componentA, retainedFraction),
      componentB: multiplyRational(initial.componentB, retainedFraction),
    };
    const finalRatio = reduceMalCp002StateRatio(finalState);
    const options = ratioOptions(finalRatio, `${seed}:options`, [
      {
        componentAPart: rational(p + 1),
        componentBPart: rational(q),
      },
      {
        componentAPart: rational(p),
        componentBPart: rational(q + 1),
      },
    ]);
    const stem = `A ${context.container} contains ${context.componentALabel} and ${
      context.componentBLabel
    } in the ratio ${p} : ${q}. A well-mixed sample of ${formatQuantity(
      amount,
      unit,
    )} is removed and nothing is added back. What is the ratio of ${
      context.componentALabel
    } to ${context.componentBLabel} in the remaining mixture?`;
    const steps = [
      `Step 1: A well-mixed sample has the same ${p} : ${q} composition as the vessel.`,
      `Step 2: Both component quantities are multiplied by the same retained fraction ${formatRational(
        retainedFraction,
      )}.`,
      `Step 3: The remaining quantities are ${formatRational(
        finalState.componentA,
      )} and ${formatRational(finalState.componentB)} ${unit}.`,
      `Step 4: Their ratio reduces to ${ratioText(finalRatio)}, unchanged from the initial ratio.`,
    ];
    const verification = `${formatRational(
      finalState.componentA,
    )} ÷ ${formatRational(
      finalState.componentB,
    )} equals ${p} ÷ ${q}.`;
    const conclusion = `The remaining mixture ratio is ${options.answer}.`;
    const visual = visualFromStates(
      context,
      "Homogeneous sample removal",
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      `Remove ${formatRational(amount)} ${unit} of well-mixed sample`,
      [
        { label: context.componentALabel, quantity: finalState.componentA },
        { label: context.componentBLabel, quantity: finalState.componentB },
      ],
      `${p} : ${q}`,
      ratioText(finalRatio),
      undefined,
      "Equal fractional reduction preserves the component ratio.",
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "Removing a homogeneous sample multiplies every component by the same retained fraction, so their ratio does not change.",
      formula:
        "new A : new B = A(1 − r/V) : B(1 − r/V) = A : B",
      steps,
      verification,
      conclusion,
      examShortcut:
        "If a well-mixed sample is removed and there is no refill, write the original ratio immediately.",
      commonTrap:
        "Common trap: subtracting the removed quantity from only one component. That would describe pure-component removal, not mixed-sample removal.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: "MAL-CP002-FINAL-HOMOGENEOUS-REMOVAL-INVARIANCE",
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialRatio,
        removedQuantity: amount,
        contextId: context.contextId,
      },
      solution: {
        retainedFraction,
        finalState,
        finalRatio,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Initial ratio ${p} : ${q}`,
          `A homogeneous sample is removed without refill`,
        ],
        "Both components receive the same retained multiplier",
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        p,
        q,
        rationalKey(amount),
        ratioText(finalRatio),
      ].join("|"),
    };
  }

  if (allocation.familyId === "REQUIRED_OPERATION_AND_QUANTITY") {
    const changedComponent = random.bool() ? "A" : "B";
    const kind = random.bool() ? "ADD" : "REMOVE";
    const current =
      changedComponent === "A" ? initial.componentA : initial.componentB;
    const maxAmount =
      kind === "REMOVE"
        ? Math.max(1, Math.min(Number(current.numerator) - 1, 20))
        : 20;
    const amount = rational(random.int(2, maxAmount));
    const finalState =
      changedComponent === "A"
        ? {
            componentA:
              kind === "ADD"
                ? addRational(initial.componentA, amount)
                : subtractRational(initial.componentA, amount),
            componentB: initial.componentB,
          }
        : {
            componentA: initial.componentA,
            componentB:
              kind === "ADD"
                ? addRational(initial.componentB, amount)
                : subtractRational(initial.componentB, amount),
          };
    const targetRatio = reduceMalCp002StateRatio(finalState);
    const changedLabel =
      changedComponent === "A"
        ? context.componentALabel
        : context.componentBLabel;
    const otherLabel =
      changedComponent === "A"
        ? context.componentBLabel
        : context.componentALabel;
    const operation = `${kind === "ADD" ? "Add" : "Remove"} ${formatQuantity(
      amount,
      unit,
    )} of pure ${changedLabel}`;
    const alternativeKind = kind === "ADD" ? "Remove" : "Add";
    const options = buildOptions(
      operation,
      [
        {
          text: `${alternativeKind} ${formatQuantity(
            amount,
            unit,
          )} of pure ${changedLabel}`,
          misconceptionId: "DIRECTION_REVERSED",
        },
        {
          text: `${kind === "ADD" ? "Add" : "Remove"} ${formatQuantity(
            amount,
            unit,
          )} of pure ${otherLabel}`,
          misconceptionId: "WRONG_COMPONENT_CHANGED",
        },
        {
          text: "No change is required",
          misconceptionId: "TARGET_TREATED_AS_INITIAL",
        },
      ],
      `${seed}:options`,
    );
    const stem = `A ${context.container} contains ${formatQuantity(
      initial.componentA,
      unit,
    )} of ${context.componentALabel} and ${formatQuantity(
      initial.componentB,
      unit,
    )} of ${context.componentBLabel}. Which single pure-component operation will change the ratio to ${ratioText(
      targetRatio,
    )}?`;
    const initialShare = divideRational(
      changedComponent === "A" ? initial.componentA : initial.componentB,
      addRational(initial.componentA, initial.componentB),
    );
    const finalShare = divideRational(
      changedComponent === "A" ? finalState.componentA : finalState.componentB,
      addRational(finalState.componentA, finalState.componentB),
    );
    const steps = [
      `Step 1: Compare the target share of ${changedLabel} with its initial share.`,
      `Step 2: Initial share = ${formatRational(initialShare)}; target share = ${formatRational(
        finalShare,
      )}.`,
      `Step 3: The share ${
        compareRational(finalShare, initialShare) > 0 ? "increases" : "decreases"
      }, so pure ${changedLabel} must be ${
        kind === "ADD" ? "added" : "removed"
      }.`,
      `Step 4: Keeping ${otherLabel} fixed, the required change is ${formatRational(
        amount,
      )} ${unit}.`,
    ];
    const verification = `The operation produces quantities ${formatRational(
      finalState.componentA,
    )} and ${formatRational(
      finalState.componentB,
    )}, whose ratio is ${ratioText(targetRatio)}.`;
    const conclusion = `${operation}.`;
    const visual = visualFromStates(
      context,
      "Choose the operation from the target share",
      [
        { label: context.componentALabel, quantity: initial.componentA },
        { label: context.componentBLabel, quantity: initial.componentB },
      ],
      operation,
      [
        { label: context.componentALabel, quantity: finalState.componentA },
        { label: context.componentBLabel, quantity: finalState.componentB },
      ],
      `${p} : ${q}`,
      ratioText(targetRatio),
      ratioText(targetRatio),
      `${otherLabel} remains fixed.`,
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "The target share tells whether a component must increase or decrease. Then use the unchanged counterpart to calculate the amount.",
      formula:
        "if target share is greater, add that component; if smaller, remove that component; conserve the counterpart",
      steps,
      verification,
      conclusion,
      examShortcut:
        "A component's share can rise only by adding it or removing the other component; use the option wording and fixed counterpart to identify the unique operation.",
      commonTrap:
        "Common trap: selecting the correct quantity with the wrong operation direction or the wrong component name.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: "MAL-CP002-FINAL-REQUIRED-OPERATION",
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialState: initial,
        targetRatio,
        contextId: context.contextId,
      },
      solution: {
        changedComponent,
        adjustmentKind: kind,
        quantity: amount,
        finalState,
      },
      answer: operation,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Initial state ${formatRational(
            initial.componentA,
          )} and ${formatRational(initial.componentB)} ${unit}`,
          `Target ratio ${ratioText(targetRatio)}`,
        ],
        "Compare the target component share with its initial share",
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        rationalKey(initial.componentA),
        rationalKey(initial.componentB),
        changedComponent,
        kind,
        rationalKey(amount),
        ratioText(targetRatio),
      ].join("|"),
    };
  }

  if (allocation.familyId === "THREE_COMPONENT_COUPLED_ADDITION") {
    const templates = [
      {
        initial: [2, 3, 4],
        final: [3, 4, 4],
        addA: 1,
        addB: 1,
      },
      {
        initial: [3, 4, 5],
        final: [5, 5, 5],
        addA: 2,
        addB: 1,
      },
      {
        initial: [1, 2, 3],
        final: [2, 4, 3],
        addA: 1,
        addB: 2,
      },
      {
        initial: [4, 5, 6],
        final: [5, 7, 6],
        addA: 1,
        addB: 2,
      },
    ] as const;
    const template = random.pick(templates);
    const x = random.int(5, 30);
    const initialA = rational(template.initial[0] * x);
    const initialB = rational(template.initial[1] * x);
    const initialC = rational(template.initial[2] * x);
    const addA = rational(template.addA * x);
    const addB = rational(template.addB * x);
    const finalA = addRational(initialA, addA);
    const finalB = addRational(initialB, addB);
    const finalC = initialC;
    const labels = [
      context.componentALabel,
      context.componentBLabel,
      context.domain === "ALLOY"
        ? "tin"
        : context.quantityUnit === "kg"
          ? "third grade"
          : "third liquid",
    ];
    const answerValue = finalC;
    const options = quantityOptions(
      answerValue,
      unit,
      `${seed}:options`,
      [
        addA,
        addB,
        addRational(addA, addB),
      ],
    );
    const initialRatioText = template.initial.join(" : ");
    const finalRatioText = template.final.join(" : ");
    const stem = `Three components ${labels[0]}, ${labels[1]} and ${
      labels[2]
    } are initially in the ratio ${initialRatioText}. After ${formatQuantity(
      addA,
      unit,
    )} of ${labels[0]} and ${formatQuantity(
      addB,
      unit,
    )} of ${labels[1]} are added, their ratio becomes ${finalRatioText}. What is the final quantity of ${labels[2]}?`;
    const steps = [
      `Step 1: Let the initial quantities be ${template.initial[0]}x, ${template.initial[1]}x and ${template.initial[2]}x.`,
      `Step 2: ${labels[2]} is unchanged. In the final ratio it is still ${template.final[2]} parts.`,
      `Step 3: Use the first addition: ${template.initial[0]}x + ${formatRational(
        addA,
      )} = ${template.final[0]}x.`,
      `Step 4: Therefore x = ${x}. The second addition checks: ${template.initial[1]} × ${x} + ${formatRational(
        addB,
      )} = ${template.final[1]} × ${x}.`,
      `Step 5: Final ${labels[2]} quantity = ${template.initial[2]} × ${x} = ${formatRational(
        answerValue,
      )} ${unit}.`,
    ];
    const verification = `${formatRational(finalA)} : ${formatRational(
      finalB,
    )} : ${formatRational(finalC)} reduces to ${finalRatioText}.`;
    const conclusion = `The final quantity of ${labels[2]} is ${options.answer}.`;
    const visual = visualFromStates(
      context,
      "Three-component coupled ratio adjustment",
      [
        { label: labels[0], quantity: initialA },
        { label: labels[1], quantity: initialB },
        { label: labels[2], quantity: initialC },
      ],
      `Add ${formatRational(addA)} ${unit} to ${labels[0]} and ${formatRational(
        addB,
      )} ${unit} to ${labels[1]}`,
      [
        { label: labels[0], quantity: finalA },
        { label: labels[1], quantity: finalB },
        { label: labels[2], quantity: finalC },
      ],
      initialRatioText,
      finalRatioText,
      finalRatioText,
      `${labels[2]} is the unchanged linking component.`,
    );
    const explanationWithoutLines = {
      layoutId: "MAL-CP002-EN-FORMULA-FIRST-SVG-V1" as const,
      sectionTitles: SECTION_TITLES,
      coreConcept:
        "Represent the initial ratio with one scale. The unchanged third component links the initial and final states, while either known addition determines the scale.",
      formula:
        "initial = ax, bx, cx; final = ry, sy, ty; cx = ty and ax + addition = ry",
      steps,
      verification,
      conclusion,
      examShortcut:
        "Use the component whose ratio part stays unchanged as the scale anchor; one addition then reveals the common scale immediately.",
      commonTrap:
        "Common trap: adding the two additions to the third component or using separate unrelated scales without the unchanged-component equation.",
      ratioVisual: visual,
    };
    return {
      packageId: "MAL-001",
      archetypeId: "MAL-001",
      canonicalProblemId: "MAL-CP-002",
      prototypeId: "MAL-CP002-FINAL-THREE-COMPONENT-COUPLED-ADDITION",
      permanentQlId: allocation.qlId,
      questionLanguageId: allocation.qlId,
      questionId: `MAL-001:${allocation.qlId}:${seed}`,
      language: "en",
      seed,
      difficulty: allocation.difficulty,
      difficultyBand: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stem,
      parameters: {
        initialRatio: template.initial,
        finalRatio: template.final,
        additionA: addA,
        additionB: addB,
        labels,
        contextId: context.contextId,
      },
      solution: {
        scale: rational(x),
        initialQuantities: [initialA, initialB, initialC],
        finalQuantities: [finalA, finalB, finalC],
        requestedQuantity: answerValue,
      },
      answer: options.answer,
      options: options.options,
      optionAudit: options.optionAudit,
      correctIndex: options.correctIndex,
      explanationId: `${allocation.qlId}-EN-FORMULA-RATIO-SVG-V1`,
      explanation: {
        ...explanationWithoutLines,
        lines: explanationLines(explanationWithoutLines),
      },
      reasoningGraph: buildGraph(
        [
          `Initial ratio ${initialRatioText}`,
          `Final ratio ${finalRatioText}`,
          `Known additions ${formatRational(addA)} and ${formatRational(
            addB,
          )} ${unit}`,
        ],
        `${labels[2]} is unchanged`,
        steps,
        verification,
        conclusion,
      ),
      diagram: visual,
      mathematicalFingerprint: [
        allocation.qlId,
        initialRatioText,
        finalRatioText,
        rationalKey(addA),
        rationalKey(addB),
        rationalKey(answerValue),
      ].join("|"),
    };
  }

  throw new Error(`No final generator for ${allocation.familyId}.`);
}

export function getMalCp002PermanentAllocation(
  qlId: MalCp002PermanentQlId,
): MalCp002PermanentAllocationEntry {
  const entry = MAL_CP002_PERMANENT_ALLOCATION.find(
    (candidate) => candidate.qlId === qlId,
  );
  if (!entry) throw new Error(`Unknown MAL-CP-002 permanent QL: ${qlId}.`);
  return entry;
}

export function runMalCp002EnglishReleasePipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002ReleasedQuestion {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-002 supports English only in this release; received ${language}.`,
    );
  }
  const qlId = input.questionLanguageId ?? MAL_CP002_PERMANENT_QL_IDS[0];
  const allocation = getMalCp002PermanentAllocation(qlId);
  const seed = input.seed ?? `mal-cp002:${qlId}:default`;
  return allocation.sourcePrototypeId
    ? wrapDiscoveryPrototype(allocation, seed)
    : releaseDraft(allocation, generatedDraft(allocation, seed));
}
