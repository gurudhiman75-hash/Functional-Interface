import type {
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION } from "../english-language-family";
import { renderPercentOfKnownNumberEnglish } from "../language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import type { TutorAuditCorpusItem } from "./tutor-audit-corpus";

export type TutorAuditDimension =
  | "TUTOR_REALISM"
  | "ONE_UNIT_VISIBILITY"
  | "SIMPLICITY"
  | "COGNITIVE_LOAD"
  | "ANSWER_CONFIDENCE"
  | "TRANSITION_QUALITY"
  | "AI_SMELL"
  | "BOOK_SMELL";

export type TutorAuditSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface TutorAuditFinding {
  auditId: string;
  dimension: TutorAuditDimension;
  severity: TutorAuditSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface TutorAuditExampleResult {
  auditId: string;
  detailMode: TutorAuditCorpusItem["detailMode"];
  contextLabel: string;
  lines: readonly string[];
  findings: readonly TutorAuditFinding[];
  approved: boolean;
}

function parametersFor(item: TutorAuditCorpusItem): Pct001Parameters {
  const entity =
    item.contextKind === "abstract"
      ? undefined
      : {
          id: item.semanticUnit,
          en: item.semanticUnit,
          hi: item.semanticUnit,
          pa: item.semanticUnit,
          numberType: item.contextKind === "count" ? "countable" : "uncountable",
        };
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: item.auditId,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType: item.contextKind === "count" ? "COUNT" : "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: item.knownRate,
      value1: item.knownValue,
      rate2: item.targetRate,
    },
    semanticContext: entity
      ? {
          scenario: item.contextLabel,
          entities: { quantity: entity },
        }
      : undefined,
    sourceTrace: {
      questionLanguageSource: "QUAL-001-B",
      explanationSource: "QUAL-001-B",
      variableRangeSource: "QUAL-001-B",
      semanticSource: entity ? "QUAL-001-B" : undefined,
    },
  };
}

function render(item: TutorAuditCorpusItem): {
  trace: TutorThinkingTrace;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  expectedAnswer: number;
} {
  const solver = solvePct001(parametersFor(item));
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error(`${item.auditId}: missing UNIT_VALUE evidence`);
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, item.detailMode);
  const roles = renderPercentOfKnownNumberEnglish(plan, trace);
  const blocks = renderPercentOfKnownNumberBlocks(plan, roles, graph, {
    solverVersion: "PCT-001-solver-v1",
    traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
    graphVersion: graph.graphVersion,
    plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
    languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
  });
  return {
    trace,
    blocks,
    lines: projectCompatibilityLines(blocks),
    expectedAnswer: evidence.derivedValues.targetQuantity,
  };
}

function finding(
  item: TutorAuditCorpusItem,
  dimension: TutorAuditDimension,
  severity: TutorAuditSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): TutorAuditFinding {
  return { auditId: item.auditId, dimension, severity, code, message, evidence };
}

function visibleRole(
  blocks: readonly StructuredExplanationBlock[],
  role: string,
): StructuredExplanationBlock | undefined {
  return blocks.find(
    (block) =>
      block.semanticRole === role && block.visibility.state === "visible",
  );
}

function finalNumber(value: string): number | undefined {
  const match = [...value.matchAll(/-?\d+(?:\.\d+)?/g)].at(-1);
  return match ? Number(match[0]) : undefined;
}

export function auditTutorExample(
  item: TutorAuditCorpusItem,
): TutorAuditExampleResult {
  const output = render(item);
  const findings: TutorAuditFinding[] = [];
  const text = output.lines.join("\n");
  const oneUnit = visibleRole(output.blocks, "SINGLE_UNIT_DERIVATION");
  const target = visibleRole(output.blocks, "TARGET_SCALE_DERIVATION");
  const answer = visibleRole(output.blocks, "ANSWER_INTERPRETATION");

  if (!oneUnit?.renderedContent.mathLatex?.includes("1\\%")) {
    findings.push(finding(
      item, "ONE_UNIT_VISIBILITY", "CRITICAL", "MISSING_ONE_UNIT_STEP",
      "The explanation does not visibly establish the value of 1%.",
      output.lines,
    ));
  }
  if (
    /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(
      text,
    )
  ) {
    findings.push(finding(
      item, "BOOK_SMELL", "CRITICAL", "FORMULA_FIRST",
      "The explanation uses formula-first or symbolic-operation language.",
      output.lines,
    ));
  }
  if (
    target &&
    oneUnit &&
    output.blocks.indexOf(target) <= output.blocks.indexOf(oneUnit)
  ) {
    findings.push(finding(
      item, "ONE_UNIT_VISIBILITY", "MAJOR", "ANSWER_JUMP",
      "Target scaling appears before the one-unit idea.",
      output.lines,
    ));
  }
  const renderedAnswer = answer
    ? finalNumber(
        `${answer.renderedContent.text ?? ""} ${answer.renderedContent.mathLatex ?? ""}`,
      )
    : undefined;
  if (renderedAnswer !== output.expectedAnswer) {
    findings.push(finding(
      item, "ANSWER_CONFIDENCE", "CRITICAL", "WRONG_ANSWER",
      `The rendered answer ${renderedAnswer} does not match ${output.expectedAnswer}.`,
      answer?.renderedContent.text ? [answer.renderedContent.text] : output.lines,
    ));
  }

  const precisionLines = output.lines.filter((line) => /\d+\.\d{7,}/.test(line));
  if (precisionLines.length > 0) {
    findings.push(finding(
      item, "COGNITIVE_LOAD", "MAJOR", "PRECISION_LEAKAGE",
      "Raw repeating decimals make the working look computational rather than teachable.",
      precisionLines,
    ));
  }

  const percentagePointLines = output.lines.filter((line) =>
    /percentage points?|one percentage point/i.test(line),
  );
  if (percentagePointLines.length > 0) {
    findings.push(finding(
      item, "BOOK_SMELL", "MAJOR", "TECHNICAL_PERCENTAGE_POINT_WORDING",
      "The phrase “percentage point” is technically framed and unnatural for this elementary unit-value explanation.",
      percentagePointLines,
    ));
  }

  const unnaturalLines = output.lines.filter((line) =>
    /belongs to|shared equally across|scale the value|required quantity corresponds/i.test(
      line,
    ),
  );
  if (unnaturalLines.length > 0) {
    findings.push(finding(
      item, "TUTOR_REALISM", "MAJOR", "UNNATURAL_TUTOR_PHRASING",
      "The wording sounds engineered rather than spoken by a classroom tutor.",
      unnaturalLines,
    ));
  }

  if (
    item.contextKind !== "abstract" &&
    !output.lines.slice(0, 5).some((line) =>
      line.toLocaleLowerCase().includes(item.semanticUnit.toLocaleLowerCase()),
    )
  ) {
    findings.push(finding(
      item, "TUTOR_REALISM", "MAJOR", "CONTEXT_ARRIVES_ONLY_AT_ANSWER",
      `The ${item.contextLabel} context is absent from the reasoning and appears only in the conclusion.`,
      output.lines,
    ));
  }

  if (item.detailMode === "short" && output.lines.length > 5) {
    findings.push(finding(
      item, "COGNITIVE_LOAD", "MAJOR", "SHORT_MODE_TOO_DENSE",
      "Short mode still exposes six teaching sentences, including repeated setup.",
      output.lines,
    ));
  }

  if (
    output.lines.length >= 2 &&
    output.lines[0]!.includes(String(item.knownRate)) &&
    output.lines[0]!.includes(String(item.knownValue)) &&
    output.lines[1]!.includes(String(item.knownRate)) &&
    output.lines[1]!.includes(String(item.knownValue))
  ) {
    findings.push(finding(
      item, "SIMPLICITY", "MINOR", "REPEATED_KNOWN_RELATION",
      "The first two sentences repeat the same known percentage-value relationship.",
      output.lines.slice(0, 2),
    ));
  }

  const longLines = output.lines.filter(
    (line) =>
      line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean)
        .length > 18,
  );
  if (longLines.length > 0) {
    findings.push(finding(
      item, "SIMPLICITY", "MINOR", "LONG_TUTOR_SENTENCE",
      "A sentence is longer than needed for one educational idea.",
      longLines,
    ));
  }

  const connectorLines = output.lines.filter((line) =>
    /^(therefore|hence|thus|notice that)\b/i.test(line.trim()),
  );
  if (connectorLines.length > 1) {
    findings.push(finding(
      item, "TRANSITION_QUALITY", "MINOR", "CONNECTOR_FATIGUE",
      "Formal connectors are repeated more often than a natural tutor needs.",
      connectorLines,
    ));
  }

  const majorOrCritical = findings.some(
    (entry) => entry.severity === "CRITICAL" || entry.severity === "MAJOR",
  );
  return {
    auditId: item.auditId,
    detailMode: item.detailMode,
    contextLabel: item.contextLabel,
    lines: output.lines,
    findings,
    approved: !majorOrCritical,
  };
}

export function auditTutorCorpus(
  corpus: readonly TutorAuditCorpusItem[],
): readonly TutorAuditExampleResult[] {
  return corpus.map(auditTutorExample);
}

