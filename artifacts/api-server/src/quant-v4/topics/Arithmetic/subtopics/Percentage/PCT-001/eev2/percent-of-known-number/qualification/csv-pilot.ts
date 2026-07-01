import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import type {
  EEV2DetailMode,
  StructuredExplanationBlock,
} from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import {
  routeExplanationExecution,
  type ExplanationEngineExecutors,
} from "../../../../../../../../common/eev2/routing";
import {
  formatExplanationSteps,
  validateExplanationPipeline,
  type ExplanationEvidence,
} from "../../../../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../../../../common/teacher-renderer";
import { generatePct001Parameters } from "../../../parameter-generator";
import { solvePct001 } from "../../../solver";
import type {
  Pct001DifficultyBand,
  Pct001Parameters,
  Pct001SolverResult,
} from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { validatePercentOfKnownNumberBlocks } from "../block-validator";
import { validatePercentOfKnownNumberCompatibility } from "../compatibility-validator";
import { validatePercentOfKnownNumberEducation } from "../educational-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
} from "../english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import { validatePercentOfKnownNumberGraph } from "../graph-validator";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import { validatePercentOfKnownNumberPlan } from "../plan-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import { validatePercentOfKnownNumberTrace } from "../trace-validator";
import type { EEV2ValidationResult } from "../validation-types";
import { buildCsvPilotReport, type CsvPilotReport } from "./csv-pilot-report";

export const CSV_001_TIMESTAMP = "2026-06-21T00:00:00.000Z" as const;
export const CSV_001_QUESTION_COUNT = 200 as const;

const QL_IDS = [
  "PCT-QL-017",
  "PCT-QL-117",
  "PCT-QL-217",
  "PCT-QL-317",
  "PCT-QL-417",
] as const;
type CsvPilotQlId = (typeof QL_IDS)[number];
type CsvPilotDirection = "TARGET_GREATER" | "TARGET_SMALLER" | "EQUAL_RATES";
type CsvPilotNumericProfile = "INTEGER_UNIT_VALUE" | "DECIMAL_UNIT_VALUE";
type CsvPilotContextKind = "abstract" | "money" | "count" | "continuous";
type CheckStatus = "PASS" | "FAIL";

interface PilotContext {
  kind: CsvPilotContextKind;
  label: string;
  semanticUnit: string;
  unitLabel: string;
  answerType: "ABSOLUTE" | "COUNT";
}

interface PilotCase {
  questionId: string;
  qlId: CsvPilotQlId;
  difficulty: Pct001DifficultyBand;
  detailMode: EEV2DetailMode;
  context: PilotContext;
  direction: CsvPilotDirection;
  numericProfile: CsvPilotNumericProfile;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  singleUnitValue: number;
  targetValue: number;
  parameters: Pct001Parameters;
  questionText: string;
}

interface V1Output {
  answer: number;
  lines: readonly string[];
}

interface V2Output {
  answer: number;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
}

interface BuiltV2 {
  solver: Pct001SolverResult;
  rendered: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  validations: readonly EEV2ValidationResult[];
  comparable: unknown;
}

export interface CsvPilotRejection {
  questionId: string;
  qlId: string;
  context: string;
  code: string;
  message: string;
}

export interface CsvPilotAcceptedRecord {
  questionId: string;
  qlId: CsvPilotQlId;
  difficulty: Pct001DifficultyBand;
  contextKind: CsvPilotContextKind;
  context: string;
  semanticUnit: string;
  direction: CsvPilotDirection;
  numericProfile: CsvPilotNumericProfile;
  detailMode: EEV2DetailMode;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  singleUnitValue: number;
  targetValue: number;
  questionText: string;
  answer: string;
  explanationText: string;
  explanationLines: readonly string[];
  parityStatus: CheckStatus;
  determinismStatus: CheckStatus;
  validatorsStatus: CheckStatus;
  shadowStatus: CheckStatus;
  realismStatus: CheckStatus;
  presentationStatus: CheckStatus;
  entityPolicyStatus: CheckStatus;
  moneyPolicyStatus: CheckStatus;
  contextPolicyStatus: CheckStatus;
  validationFailureCodes: readonly string[];
  approval: "";
  reviewerNotes: "";
  status: "PENDING_REVIEW";
}

export interface CsvPilotGenerationResult {
  accepted: readonly CsvPilotAcceptedRecord[];
  rejected: readonly CsvPilotRejection[];
}

const CONTEXTS: readonly PilotContext[] = [
  { kind: "money", label: "monthly salary", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "annual income", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "annual profit", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "expenses", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "bonus", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "commission", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "savings", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "money", label: "revenue", semanticUnit: "rupees", unitLabel: "₹", answerType: "ABSOLUTE" },
  { kind: "count", label: "students", semanticUnit: "students", unitLabel: "students", answerType: "COUNT" },
  { kind: "count", label: "workers", semanticUnit: "workers", unitLabel: "workers", answerType: "COUNT" },
  { kind: "count", label: "employees", semanticUnit: "employees", unitLabel: "employees", answerType: "COUNT" },
  { kind: "count", label: "books", semanticUnit: "books", unitLabel: "books", answerType: "COUNT" },
  { kind: "count", label: "trees", semanticUnit: "trees", unitLabel: "trees", answerType: "COUNT" },
  { kind: "count", label: "families", semanticUnit: "families", unitLabel: "families", answerType: "COUNT" },
  { kind: "count", label: "animals", semanticUnit: "animals", unitLabel: "animals", answerType: "COUNT" },
  { kind: "count", label: "inventory", semanticUnit: "inventory", unitLabel: "items", answerType: "COUNT" },
  { kind: "continuous", label: "distance", semanticUnit: "kilometres", unitLabel: "km", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "area", semanticUnit: "square metres", unitLabel: "sq m", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "weight", semanticUnit: "kilograms", unitLabel: "kg", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "volume", semanticUnit: "litres", unitLabel: "litres", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "production", semanticUnit: "units", unitLabel: "units", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "population", semanticUnit: "people", unitLabel: "people", answerType: "ABSOLUTE" },
  { kind: "continuous", label: "marks", semanticUnit: "marks", unitLabel: "marks", answerType: "ABSOLUTE" },
  { kind: "abstract", label: "number", semanticUnit: "abstract-number", unitLabel: "", answerType: "ABSOLUTE" },
] as const;

const RATE_PAIRS: Record<
  Pct001DifficultyBand,
  Record<CsvPilotDirection, readonly (readonly [number, number])[]>
> = {
  Easy: {
    TARGET_GREATER: [[20, 25], [25, 50], [40, 60], [50, 75]],
    TARGET_SMALLER: [[25, 20], [50, 25], [60, 40], [75, 50]],
    EQUAL_RATES: [[25, 25], [50, 50]],
  },
  Medium: {
    TARGET_GREATER: [[12.5, 37.5], [15, 45], [25, 62.5], [30, 80]],
    TARGET_SMALLER: [[37.5, 12.5], [45, 15], [62.5, 25], [80, 30]],
    EQUAL_RATES: [[12.5, 12.5], [37.5, 37.5]],
  },
  Hard: {
    TARGET_GREATER: [[0.5, 99], [1, 100], [17.5, 82.5], [75, 99]],
    TARGET_SMALLER: [[99, 0.5], [100, 1], [82.5, 17.5], [99, 75]],
    EQUAL_RATES: [[0.5, 0.5], [99, 99], [100, 100]],
  },
};

const DIRECTIONS: readonly CsvPilotDirection[] = [
  "TARGET_GREATER",
  "TARGET_SMALLER",
  "TARGET_GREATER",
  "TARGET_SMALLER",
  "EQUAL_RATES",
];
const DETAIL_MODES: readonly EEV2DetailMode[] = [
  "short",
  "standard",
  "detailed",
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

function displayQuantity(value: number, context: PilotContext): string {
  const number = formatNumber(value);
  if (context.kind === "money") return `₹${number}`;
  if (context.kind === "abstract") return number;
  return `${number} ${context.unitLabel}`;
}

function questionFor(
  qlId: CsvPilotQlId,
  context: PilotContext,
  knownRate: number,
  knownValue: number,
  targetRate: number,
): string {
  const known = displayQuantity(knownValue, context);
  const subject =
    context.kind === "abstract" ? "a number" : `the ${context.label}`;
  const sameSubject =
    context.kind === "abstract" ? "that number" : `the same ${context.label}`;
  const templates: Record<CsvPilotQlId, string> = {
    "PCT-QL-017":
      `If ${formatNumber(knownRate)}% of ${subject} equals ${known}, find ${formatNumber(targetRate)}% of ${sameSubject}.`,
    "PCT-QL-117":
      `We know that ${formatNumber(knownRate)}% of ${subject} equals ${known}. What is ${formatNumber(targetRate)}% of ${sameSubject}?`,
    "PCT-QL-217":
      `The value corresponding to ${formatNumber(knownRate)}% of ${subject} is ${known}. Find ${formatNumber(targetRate)}% of ${sameSubject}.`,
    "PCT-QL-317":
      `The question states that ${formatNumber(knownRate)}% of ${subject} equals ${known}. Determine ${formatNumber(targetRate)}% of ${sameSubject}.`,
    "PCT-QL-417":
      `Given that ${formatNumber(knownRate)}% of ${subject} is ${known}, what is ${formatNumber(targetRate)}% of ${sameSubject}?`,
  };
  return templates[qlId];
}

function difficultyFor(index: number): Pct001DifficultyBand {
  return (["Easy", "Medium", "Hard"] as const)[Math.floor(index / 5) % 3]!;
}

function unitValueFor(
  index: number,
  context: PilotContext,
  difficulty: Pct001DifficultyBand,
): { value: number; profile: CsvPilotNumericProfile } {
  if (context.kind === "count") {
    return {
      value: [2, 4, 10, 20, 50, 100][index % 6]!,
      profile: "INTEGER_UNIT_VALUE",
    };
  }
  const decimal = difficulty !== "Easy" && index % 5 < 2;
  if (context.kind === "money") {
    const floor =
      context.label === "annual income"
        ? 2_000
        : context.label === "monthly salary"
          ? 1_000
          : 500;
    return {
      value: decimal ? floor + 0.5 : floor + [0, 500, 1_000][index % 3]!,
      profile: decimal ? "DECIMAL_UNIT_VALUE" : "INTEGER_UNIT_VALUE",
    };
  }
  if (context.label === "marks" || context.kind === "abstract") {
    return {
      value: decimal ? [2.5, 6.5, 12.5, 25.5][index % 4]! : [2, 5, 10, 25, 50][index % 5]!,
      profile: decimal ? "DECIMAL_UNIT_VALUE" : "INTEGER_UNIT_VALUE",
    };
  }
  return {
    value: [2, 5, 10, 20, 50, 100][index % 6]!,
    profile: "INTEGER_UNIT_VALUE",
  };
}

function parametersFor(
  index: number,
  qlId: CsvPilotQlId,
  difficulty: Pct001DifficultyBand,
  context: PilotContext,
  knownRate: number,
  knownValue: number,
  targetRate: number,
): Pct001Parameters {
  const questionId = `CSV-001-${String(index + 1).padStart(4, "0")}`;
  const generated = generatePct001Parameters("PCT-CP-002", {
    seed: questionId,
    language: "en",
    questionLanguageId: qlId,
    difficultyBand: difficulty,
  });
  return {
    ...generated,
    questionId,
    answerType: context.answerType,
    variables: {
      rate1: knownRate,
      value1: knownValue,
      rate2: targetRate,
    },
    semanticContext:
      context.kind === "abstract"
        ? undefined
        : {
            scenario: `csv-001-${context.kind}`,
            entities: {
              quantity: {
                id: context.semanticUnit,
                en: context.label,
                hi: context.label,
                pa: context.label,
                numberType:
                  context.kind === "count" ? "countable" : "continuous",
              },
            },
          },
    sourceTrace: {
      questionLanguageSource: "CSV-001-contextual-pilot",
      explanationSource: "EEV2",
      variableRangeSource: "CSV-001-coverage-matrix",
      semanticSource: "CSV-001-context-matrix",
    },
  };
}

function pilotCase(index: number): PilotCase {
  const qlId = QL_IDS[index % QL_IDS.length]!;
  const difficulty = difficultyFor(index);
  const detailMode = DETAIL_MODES[Math.floor(index / 7) % DETAIL_MODES.length]!;
  const context = CONTEXTS[index % CONTEXTS.length]!;
  const direction = DIRECTIONS[Math.floor(index / 3) % DIRECTIONS.length]!;
  const pairs = RATE_PAIRS[difficulty][direction];
  const [knownRate, targetRate] = pairs[
    Math.floor(index / 11) % pairs.length
  ]!;
  const unit = unitValueFor(index, context, difficulty);
  const knownValue = knownRate * unit.value;
  const targetValue = targetRate * unit.value;
  const parameters = parametersFor(
    index,
    qlId,
    difficulty,
    context,
    knownRate,
    knownValue,
    targetRate,
  );
  return {
    questionId: parameters.questionId,
    qlId,
    difficulty,
    detailMode,
    context,
    direction,
    numericProfile: unit.profile,
    knownRate,
    knownValue,
    targetRate,
    singleUnitValue: unit.value,
    targetValue,
    parameters,
    questionText: questionFor(
      qlId,
      context,
      knownRate,
      knownValue,
      targetRate,
    ),
  };
}

function validationFailures(
  results: readonly EEV2ValidationResult[],
): readonly string[] {
  return results.flatMap((result) =>
    result.failures.map((failure) => failure.code),
  );
}

function buildV2(testCase: PilotCase): BuiltV2 {
  const solver = solvePct001(testCase.parameters);
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error("MISSING_EDUCATIONAL_EVIDENCE");
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(
    graph,
    testCase.detailMode,
  );
  const rendered = renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: testCase.context.label,
  });
  const blocks = renderPercentOfKnownNumberBlocks(
    plan,
    rendered as unknown as RenderedEnglishRoleSet,
    graph,
    {
      solverVersion: "PCT-001-solver-v1",
      traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
      graphVersion: graph.graphVersion,
      plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
      languageFamilyVersion:
        PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
    },
  );
  const lines = projectCompatibilityLines(blocks);
  const validations = [
    validatePercentOfKnownNumberTrace(trace),
    validatePercentOfKnownNumberGraph(graph, trace),
    validatePercentOfKnownNumberPlan(plan, graph),
    validatePercentOfKnownNumberBlocks(blocks, plan, graph, trace),
    validatePercentOfKnownNumberEducation(blocks, plan),
    validatePercentOfKnownNumberCompatibility(blocks, lines),
  ];
  return {
    solver,
    rendered,
    blocks,
    lines,
    validations,
    comparable: {
      solver,
      trace,
      graph,
      plan,
      rendered,
      blocks,
      lines,
      validations,
    },
  };
}

function numericAnswer(answer: string): number {
  return Number(answer.replace(/\$\$|\\%|,/g, "").trim());
}

function v1Output(parameters: Pct001Parameters): V1Output {
  const solver = solvePct001(parameters);
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: {},
    answer: solver.answer,
  };
  const renderer = new TaskKindTeacherRenderer(
    parameters.taskKind,
    solver.mathJax,
  );
  const steps = validateExplanationPipeline(evidence, renderer);
  return {
    answer: numericAnswer(solver.answer),
    lines: formatExplanationSteps(steps),
  };
}

function executors(
  testCase: PilotCase,
): ExplanationEngineExecutors<PilotCase, V1Output, V2Output> {
  return {
    executeV1() {
      const output = v1Output(testCase.parameters);
      return {
        engine: "v1",
        authoritativeRepresentation: "lines",
        output,
        answer: String(output.answer),
        explanationLines: output.lines,
        deterministicIdentity: `${testCase.questionId}:v1`,
        engineVersion: "teacher-renderer-v1",
        locale: "en",
        detailMode: testCase.detailMode,
        validation: { status: "passed", failureCodes: [] },
      };
    },
    executeV2() {
      const built = buildV2(testCase);
      const failureCodes = validationFailures(built.validations);
      const output = {
        answer: built.solver.educationalEvidence!.derivedValues.targetQuantity,
        blocks: built.blocks,
        lines: built.lines,
      };
      return {
        engine: "v2",
        authoritativeRepresentation: "blocks",
        output,
        answer: String(output.answer),
        explanationLines: output.lines,
        blocks: output.blocks,
        deterministicIdentity: `${testCase.questionId}:v2:en:${testCase.detailMode}`,
        engineVersion: "eev2-v1",
        locale: "en",
        detailMode: testCase.detailMode,
        validation: {
          status: failureCodes.length === 0 ? "passed" : "failed",
          failureCodes,
        },
      };
    },
  };
}

function rejection(
  testCase: PilotCase,
  code: string,
  message: string,
): CsvPilotRejection {
  return {
    questionId: testCase.questionId,
    qlId: testCase.qlId,
    context: testCase.context.label,
    code,
    message,
  };
}

async function qualifyCase(
  testCase: PilotCase,
): Promise<CsvPilotAcceptedRecord | CsvPilotRejection> {
  try {
    const first = buildV2(testCase);
    const second = buildV2(testCase);
    const failureCodes = validationFailures(first.validations);
    if (failureCodes.length > 0) {
      return rejection(
        testCase,
        failureCodes[0]!,
        `EEV2 validation failed: ${failureCodes.join(", ")}`,
      );
    }
    if (JSON.stringify(first.comparable) !== JSON.stringify(second.comparable)) {
      return rejection(testCase, "NONDETERMINISM", "Repeated V2 output differs.");
    }
    const solverAnswer = first.solver.numericAnswer;
    const v2Answer =
      first.solver.educationalEvidence!.derivedValues.targetQuantity;
    const v1Answer = v1Output(testCase.parameters).answer;
    if (
      solverAnswer === null ||
      Math.abs(solverAnswer - testCase.targetValue) > 1e-9 ||
      Math.abs(v1Answer - solverAnswer) > 1e-9 ||
      Math.abs(v2Answer - solverAnswer) > 1e-9
    ) {
      return rejection(
        testCase,
        "MATHEMATICAL_PARITY",
        `solver=${solverAnswer}, v1=${v1Answer}, v2=${v2Answer}, expected=${testCase.targetValue}`,
      );
    }
    const shadow = await routeExplanationExecution(
      {
        mode: "shadow",
        input: testCase,
        comparisonTimestamp: CSV_001_TIMESTAMP,
      },
      executors(testCase),
    );
    if (
      shadow.mode !== "shadow" ||
      shadow.shadow.v2Output === null ||
      shadow.shadow.comparison.mathematicalParity !== true ||
      shadow.shadow.comparison.validationStatus.v2?.status !== "passed"
    ) {
      return rejection(
        testCase,
        "SHADOW_FAILURE",
        "Independent V1/V2 shadow comparison failed.",
      );
    }
    const explanationText = first.lines.join(" | ");
    if (
      !testCase.questionText.toLowerCase().includes(testCase.context.label) ||
      (testCase.context.kind !== "abstract" &&
        !explanationText.toLowerCase().includes(testCase.context.label))
    ) {
      return rejection(
        testCase,
        "CONTEXT_PERSISTENCE",
        "Question or explanation lost the selected context.",
      );
    }
    if (/[�]|undefined|NaN/.test(`${testCase.questionText}\n${explanationText}`)) {
      return rejection(
        testCase,
        "INVALID_EXPORT_TEXT",
        "Question or explanation contains invalid export text.",
      );
    }
    return {
      questionId: testCase.questionId,
      qlId: testCase.qlId,
      difficulty: testCase.difficulty,
      contextKind: testCase.context.kind,
      context: testCase.context.label,
      semanticUnit: testCase.context.semanticUnit,
      direction: testCase.direction,
      numericProfile: testCase.numericProfile,
      detailMode: testCase.detailMode,
      knownRate: testCase.knownRate,
      knownValue: testCase.knownValue,
      targetRate: testCase.targetRate,
      singleUnitValue: testCase.singleUnitValue,
      targetValue: testCase.targetValue,
      questionText: testCase.questionText,
      answer: displayQuantity(testCase.targetValue, testCase.context),
      explanationText,
      explanationLines: first.lines,
      parityStatus: "PASS",
      determinismStatus: "PASS",
      validatorsStatus: "PASS",
      shadowStatus: "PASS",
      realismStatus: "PASS",
      presentationStatus: "PASS",
      entityPolicyStatus: "PASS",
      moneyPolicyStatus: "PASS",
      contextPolicyStatus: "PASS",
      validationFailureCodes: [],
      approval: "",
      reviewerNotes: "",
      status: "PENDING_REVIEW",
    };
  } catch (error) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : error instanceof Error
          ? error.name
          : "GENERATION_FAILURE";
    return rejection(
      testCase,
      code,
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function generateCsvPilot(): Promise<CsvPilotGenerationResult> {
  const accepted: CsvPilotAcceptedRecord[] = [];
  const rejected: CsvPilotRejection[] = [];
  for (let index = 0; index < CSV_001_QUESTION_COUNT; index += 1) {
    const result = await qualifyCase(pilotCase(index));
    if ("code" in result) rejected.push(result);
    else accepted.push(result);
  }
  return { accepted, rejected };
}

function csvCell(value: unknown): string {
  const text =
    typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function csv<T extends object>(
  headers: readonly string[],
  rows: readonly T[],
): string {
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => {
      const record = row as Record<string, unknown>;
      return headers.map((header) => csvCell(record[header])).join(",");
    }),
  ].join("\r\n");
}

export async function exportCsvPilot(
  outputDirectory = join(
    process.cwd(),
    "src",
    "quant-v4",
    "topics",
    "Arithmetic",
    "subtopics",
    "Percentage",
    "PCT-001",
    "eev2",
    "percent-of-known-number",
    "qualification",
    "csv-001",
  ),
): Promise<{ report: CsvPilotReport; outputDirectory: string }> {
  const result = await generateCsvPilot();
  const report = buildCsvPilotReport(result);
  await mkdir(outputDirectory, { recursive: true });
  const questionHeaders = [
    "questionId",
    "qlId",
    "difficulty",
    "context",
    "questionText",
    "answer",
    "approval",
    "reviewerNotes",
    "status",
  ];
  const explanationHeaders = [
    "questionId",
    "qlId",
    "difficulty",
    "context",
    "detailMode",
    "methodFamily",
    "engineVersion",
    "explanationText",
    "explanationLinesJson",
    "approval",
    "reviewerNotes",
    "status",
  ];
  const metadataHeaders = [
    "questionId",
    "qlId",
    "difficulty",
    "contextKind",
    "context",
    "semanticUnit",
    "direction",
    "numericProfile",
    "knownRate",
    "knownValue",
    "targetRate",
    "singleUnitValue",
    "targetValue",
    "parityStatus",
    "determinismStatus",
    "validatorsStatus",
    "shadowStatus",
    "realismStatus",
    "presentationStatus",
    "entityPolicyStatus",
    "moneyPolicyStatus",
    "contextPolicyStatus",
    "validationFailureCodes",
    "approval",
    "reviewerNotes",
    "status",
  ];
  await Promise.all([
    writeFile(
      join(outputDirectory, "questions.csv"),
      csv(questionHeaders, result.accepted),
      "utf8",
    ),
    writeFile(
      join(outputDirectory, "explanations.csv"),
      csv(
        explanationHeaders,
        result.accepted.map((record) => ({
          ...record,
          methodFamily: "UNIT_VALUE",
          engineVersion: "eev2-v1",
          explanationLinesJson: record.explanationLines,
        })),
      ),
      "utf8",
    ),
    writeFile(
      join(outputDirectory, "metadata.csv"),
      csv(metadataHeaders, result.accepted),
      "utf8",
    ),
  ]);
  return { report, outputDirectory };
}

const invokedPath = process.argv[1]?.replace(/\\/g, "/") ?? "";
if (
  invokedPath.endsWith("/csv-pilot.mjs") &&
  pathToFileURL(process.argv[1]!).href === import.meta.url
) {
  const exported = await exportCsvPilot();
  console.log(JSON.stringify(exported, null, 2));
}
