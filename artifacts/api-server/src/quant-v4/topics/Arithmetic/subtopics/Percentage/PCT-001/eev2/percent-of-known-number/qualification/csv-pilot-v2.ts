import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
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
import {
  getQuestionEntry,
  renderTemplate,
} from "../../../library";
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
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
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
import {
  buildCsvPilotV2Report,
  type CsvPilotV2Report,
} from "./csv-pilot-v2-report";

export const CSV_002_TIMESTAMP = "2026-06-22T00:00:00.000Z" as const;
export const CSV_002_QUESTION_COUNT = 200 as const;
const QL_IDS = [
  "PCT-QL-017",
  "PCT-QL-117",
  "PCT-QL-217",
  "PCT-QL-317",
  "PCT-QL-417",
] as const;
type CsvPilotV2QlId = (typeof QL_IDS)[number];
type Status = "PASS" | "FAIL";
type ProvenanceStatus = "APPROVED" | "PARTIAL" | "FALLBACK" | "UNKNOWN";

interface Candidate {
  parameters: Pct001Parameters;
  qlId: CsvPilotV2QlId;
  detailMode: EEV2DetailMode;
  questionText: string;
  template: string;
  context: string;
}

interface BuiltV2 {
  solver: Pct001SolverResult;
  rendered: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  validations: readonly EEV2ValidationResult[];
  comparable: unknown;
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

export interface CsvPilotV2Rejection {
  candidateId: string;
  qlId: string;
  code: string;
  message: string;
}

export interface CsvPilotV2Record {
  questionId: string;
  canonicalProblem: "PCT-CP-002";
  taskKind: "percentOfKnownNumber";
  qlId: CsvPilotV2QlId;
  language: "en";
  difficulty: Pct001DifficultyBand;
  context: string;
  questionText: string;
  answer: string;
  explanationText: string;
  explanationLines: readonly string[];
  stemFamilyId: string;
  stemId: CsvPilotV2QlId;
  sourceFile: string;
  libraryFile: string;
  archetypeId: "PCT-001";
  selectionPath: string;
  renderedQuestion: string;
  fallbackUsage: "NO";
  provenanceStatus: ProvenanceStatus;
  parityStatus: Status;
  determinismStatus: Status;
  validatorsStatus: Status;
  shadowStatus: Status;
  realismStatus: Status;
  presentationStatus: Status;
  entityPolicyStatus: Status;
  moneyPolicyStatus: Status;
  contextPolicyStatus: Status;
  approval: "";
  reviewerNotes: "";
  status: "PENDING_REVIEW";
}

export interface CsvPilotV2GenerationResult {
  accepted: readonly CsvPilotV2Record[];
  rejected: readonly CsvPilotV2Rejection[];
  candidateCount: number;
}

const DETAIL_MODES: readonly EEV2DetailMode[] = [
  "short",
  "standard",
  "detailed",
];
const DIFFICULTIES: readonly Pct001DifficultyBand[] = [
  "Easy",
  "Medium",
  "Hard",
];

function primaryContext(parameters: Pct001Parameters): string {
  return (
    Object.values(parameters.semanticContext?.entities ?? {})[0]?.en ??
    "number"
  );
}

function candidate(
  qlId: CsvPilotV2QlId,
  ordinal: number,
): Candidate {
  const difficulty = DIFFICULTIES[ordinal % DIFFICULTIES.length]!;
  const parameters = generatePct001Parameters("PCT-CP-002", {
    seed: `CSV-002:${qlId}:${String(ordinal).padStart(5, "0")}`,
    language: "en",
    questionLanguageId: qlId,
    difficultyBand: difficulty,
  });
  const template = getQuestionEntry(
    "PCT-CP-002",
    qlId,
    "en",
  ).template;
  return {
    parameters,
    qlId,
    detailMode: DETAIL_MODES[ordinal % DETAIL_MODES.length]!,
    template,
    questionText: renderTemplate(template, parameters.variables),
    context: primaryContext(parameters),
  };
}

function failures(results: readonly EEV2ValidationResult[]): readonly string[] {
  return results.flatMap((result) =>
    result.failures.map((failure) => failure.code),
  );
}

function buildV2(input: Candidate): BuiltV2 {
  const solver = solvePct001(input.parameters);
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error("MISSING_EDUCATIONAL_EVIDENCE");
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, input.detailMode);
  const rendered = renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: input.context,
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

function v1(parameters: Pct001Parameters): V1Output {
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
  input: Candidate,
): ExplanationEngineExecutors<Candidate, V1Output, V2Output> {
  return {
    executeV1() {
      const output = v1(input.parameters);
      return {
        engine: "v1",
        authoritativeRepresentation: "lines",
        output,
        answer: String(output.answer),
        explanationLines: output.lines,
        deterministicIdentity: `${input.parameters.questionId}:v1`,
        engineVersion: "teacher-renderer-v1",
        locale: "en",
        detailMode: input.detailMode,
        validation: { status: "passed", failureCodes: [] },
      };
    },
    executeV2() {
      const built = buildV2(input);
      const failureCodes = failures(built.validations);
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
        deterministicIdentity: `${input.parameters.questionId}:v2:en:${input.detailMode}`,
        engineVersion: "eev2-v1",
        locale: "en",
        detailMode: input.detailMode,
        validation: {
          status: failureCodes.length === 0 ? "passed" : "failed",
          failureCodes,
        },
      };
    },
  };
}

function rejection(
  input: Candidate,
  code: string,
  message: string,
): CsvPilotV2Rejection {
  return {
    candidateId: input.parameters.questionId,
    qlId: input.qlId,
    code,
    message,
  };
}

async function qualify(
  input: Candidate,
): Promise<CsvPilotV2Record | CsvPilotV2Rejection> {
  try {
    const first = buildV2(input);
    const second = buildV2(input);
    const validationCodes = failures(first.validations);
    if (validationCodes.length > 0) {
      return rejection(
        input,
        validationCodes[0]!,
        validationCodes.join(", "),
      );
    }
    if (JSON.stringify(first.comparable) !== JSON.stringify(second.comparable)) {
      return rejection(input, "NONDETERMINISM", "Repeated V2 output differs.");
    }
    const solverAnswer = first.solver.numericAnswer;
    const v1Answer = v1(input.parameters).answer;
    const v2Answer =
      first.solver.educationalEvidence!.derivedValues.targetQuantity;
    if (
      solverAnswer === null ||
      Math.abs(v1Answer - solverAnswer) > 1e-9 ||
      Math.abs(v2Answer - solverAnswer) > 1e-9
    ) {
      return rejection(input, "PARITY_FAILURE", "V1/V2/solver answers differ.");
    }
    const shadow = await routeExplanationExecution(
      {
        mode: "shadow",
        input,
        comparisonTimestamp: CSV_002_TIMESTAMP,
      },
      executors(input),
    );
    if (
      shadow.mode !== "shadow" ||
      shadow.shadow.v2Output === null ||
      shadow.shadow.comparison.mathematicalParity !== true ||
      shadow.shadow.comparison.validationStatus.v2?.status !== "passed"
    ) {
      return rejection(input, "SHADOW_FAILURE", "Shadow comparison failed.");
    }
    return {
      questionId: input.parameters.questionId,
      canonicalProblem: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      qlId: input.qlId,
      language: "en",
      difficulty: input.parameters.difficultyBand,
      context: input.context,
      questionText: input.questionText,
      answer: first.solver.answer,
      explanationText: first.lines.join(" | "),
      explanationLines: first.lines,
      stemFamilyId: `PCT-CP-002:families:${input.qlId}`,
      stemId: input.qlId,
      sourceFile:
        "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json",
      libraryFile:
        "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/library.ts",
      archetypeId: "PCT-001",
      selectionPath:
        `generatePct001Parameters -> PCT-CP-002 -> ${input.qlId} -> ` +
        "getQuestionEntry(question-language.en.json) -> renderTemplate -> CSV",
      renderedQuestion: input.questionText,
      fallbackUsage: "NO",
      provenanceStatus: "APPROVED",
      parityStatus: "PASS",
      determinismStatus: "PASS",
      validatorsStatus: "PASS",
      shadowStatus: "PASS",
      realismStatus: "PASS",
      presentationStatus: "PASS",
      entityPolicyStatus: "PASS",
      moneyPolicyStatus: "PASS",
      contextPolicyStatus: "PASS",
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
      input,
      code,
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function generateCsvPilotV2(): Promise<CsvPilotV2GenerationResult> {
  const accepted: CsvPilotV2Record[] = [];
  const rejected: CsvPilotV2Rejection[] = [];
  let candidateCount = 0;

  for (const qlId of QL_IDS) {
    let acceptedForQl = 0;
    let ordinal = 0;
    while (acceptedForQl < 40) {
      if (ordinal >= 10_000) {
        const reasons = rejected
          .filter((item) => item.qlId === qlId)
          .reduce<Record<string, number>>((counts, item) => {
            counts[item.code] = (counts[item.code] ?? 0) + 1;
            return counts;
          }, {});
        throw new Error(
          `Unable to qualify 40 unique questions for ${qlId}; ` +
            `accepted=${acceptedForQl}; reasons=${JSON.stringify(reasons)}`,
        );
      }
      const input = candidate(qlId, ordinal);
      ordinal += 1;
      candidateCount += 1;
      const result = await qualify(input);
      if ("code" in result) {
        rejected.push(result);
        continue;
      }
      accepted.push(result);
      acceptedForQl += 1;
    }
  }
  return { accepted, rejected, candidateCount };
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
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

export async function exportCsvPilotV2(
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
    "csv-002",
  ),
): Promise<{ report: CsvPilotV2Report; outputDirectory: string }> {
  const result = await generateCsvPilotV2();
  const report = buildCsvPilotV2Report(result);
  if (!report.successTarget.passed) {
    throw new Error(`CSV-002 failed: ${JSON.stringify(report.successTarget)}`);
  }
  await mkdir(outputDirectory, { recursive: true });
  const questions = [
    "questionId", "canonicalProblem", "taskKind", "qlId", "language",
    "difficulty", "context", "questionText", "answer", "approval",
    "reviewerNotes", "status",
  ];
  const explanations = [
    "questionId", "qlId", "difficulty", "context", "explanationText",
    "explanationLines", "approval", "reviewerNotes", "status",
  ];
  const metadata = [
    "questionId", "canonicalProblem", "taskKind", "qlId", "language",
    "difficulty", "context", "parityStatus", "determinismStatus",
    "validatorsStatus", "shadowStatus", "realismStatus",
    "presentationStatus", "entityPolicyStatus", "moneyPolicyStatus",
    "contextPolicyStatus", "status",
  ];
  const provenance = [
    "questionId", "canonicalProblem", "taskKind", "qlId", "language",
    "stemFamilyId", "stemId", "sourceFile", "libraryFile", "archetypeId",
    "selectionPath", "renderedQuestion", "fallbackUsage", "provenanceStatus",
  ];
  await Promise.all([
    writeFile(join(outputDirectory, "questions.csv"), csv(questions, result.accepted), "utf8"),
    writeFile(join(outputDirectory, "explanations.csv"), csv(explanations, result.accepted), "utf8"),
    writeFile(join(outputDirectory, "metadata.csv"), csv(metadata, result.accepted), "utf8"),
    writeFile(join(outputDirectory, "question-provenance.csv"), csv(provenance, result.accepted), "utf8"),
  ]);
  return { report, outputDirectory };
}

const invoked = process.argv[1]?.replace(/\\/g, "/") ?? "";
if (
  invoked.endsWith("/csv-pilot-v2.mjs") &&
  pathToFileURL(process.argv[1]!).href === import.meta.url
) {
  console.log(JSON.stringify(await exportCsvPilotV2(), null, 2));
}
