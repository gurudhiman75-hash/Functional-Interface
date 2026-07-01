import type {
  StructuredExplanationBlock,
} from "../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../solver";
import type { Pct001Parameters } from "../../types";
import {
  renderPercentOfKnownNumberBlocks,
} from "./block-renderer";
import { validatePercentOfKnownNumberBlocks } from "./block-validator";
import { validatePercentOfKnownNumberCompatibility } from "./compatibility-validator";
import { validatePercentOfKnownNumberEducation } from "./educational-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
} from "./english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { validatePercentOfKnownNumberGraph } from "./graph-validator";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "./language-renderer.v2";
import type { RenderedEnglishRoleSet } from "./language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "./planner";
import { validatePercentOfKnownNumberPlan } from "./plan-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "./trace-builder";
import { validatePercentOfKnownNumberTrace } from "./trace-validator";
import {
  TUTOR_AUDIT_CORPUS,
  type TutorAuditCorpusItem,
} from "./qualification/tutor-audit-corpus";

export type LanguageRevisionSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface LanguageRevisionFinding {
  auditId: string;
  severity: LanguageRevisionSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface LanguageRevisionExample {
  auditId: string;
  lines: readonly string[];
  findings: readonly LanguageRevisionFinding[];
  approved: boolean;
}

export interface LanguageRevisionReport {
  reportId: "ENG-006R1";
  totalExamples: number;
  criticalFindings: readonly LanguageRevisionFinding[];
  majorFindings: readonly LanguageRevisionFinding[];
  minorFindings: readonly LanguageRevisionFinding[];
  examplesRequiringImprovement: readonly LanguageRevisionExample[];
  examplesApproved: readonly LanguageRevisionExample[];
  openingFamilyCount: number;
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
      questionLanguageSource: "ENG-006R1",
      explanationSource: "ENG-006R1",
      variableRangeSource: "ENG-006R1",
      semanticSource: entity ? "ENG-006R1" : undefined,
    },
  };
}

function render(item: TutorAuditCorpusItem): {
  roles: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  target: number;
  validations: readonly { valid: boolean; failures: readonly { code: string }[] }[];
} {
  const solver = solvePct001(parametersFor(item));
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error(`${item.auditId}: evidence missing`);
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, item.detailMode);
  const roles = renderPercentOfKnownNumberEnglishV2(plan, trace);
  const blocks = renderPercentOfKnownNumberBlocks(
    plan,
    roles as unknown as RenderedEnglishRoleSet,
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
  return {
    roles,
    blocks,
    lines,
    target: evidence.derivedValues.targetQuantity,
    validations: [
      validatePercentOfKnownNumberTrace(trace),
      validatePercentOfKnownNumberGraph(graph, trace),
      validatePercentOfKnownNumberPlan(plan, graph),
      validatePercentOfKnownNumberBlocks(blocks, plan, graph, trace),
      validatePercentOfKnownNumberEducation(blocks, plan),
      validatePercentOfKnownNumberCompatibility(blocks, lines),
    ],
  };
}

function normalizedOpening(value: string): string {
  return value
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/₹/g, "money");
}

function audit(item: TutorAuditCorpusItem): LanguageRevisionExample {
  const output = render(item);
  const findings: LanguageRevisionFinding[] = [];
  const text = output.lines.join("\n");
  const add = (
    severity: LanguageRevisionSeverity,
    code: string,
    message: string,
    evidence: readonly string[],
  ) => findings.push({ auditId: item.auditId, severity, code, message, evidence });

  const validationFailures = output.validations.flatMap(
    (result) => result.failures,
  );
  if (validationFailures.length > 0) {
    add(
      "CRITICAL",
      "VALIDATION_REGRESSION",
      `The revised language failed frozen validators: ${validationFailures
        .map((failure) => failure.code)
        .join(", ")}.`,
      output.lines,
    );
  }
  if (!/1\\%/.test(text)) {
    add("CRITICAL", "MISSING_ONE_UNIT_STEP", "The 1% step is missing.", output.lines);
  }
  if (
    /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(text)
  ) {
    add("CRITICAL", "FORMULA_FIRST", "Formula-first wording returned.", output.lines);
  }
  if (/percentage points?|one percentage point/i.test(text)) {
    add("MAJOR", "PERCENTAGE_POINT_WORDING", "Technical percentage-point wording remains.", output.lines);
  }
  if (
    /belongs to|scale the value|required quantity corresponds|completing the arithmetic|notice that/i.test(
      text,
    )
  ) {
    add("MAJOR", "ENGINEERED_TONE", "Engineered or generic wording remains.", output.lines);
  }
  if (/\d+\.\d{7,}/.test(text)) {
    add("MAJOR", "PRECISION_LEAKAGE", "Raw floating-point precision is visible.", output.lines);
  }
  if (
    item.contextKind === "count" &&
    output.roles.roles
      .filter((role) =>
        [
          "KNOWN_UNIT_MAPPING",
          "SINGLE_UNIT_DERIVATION",
          "TARGET_UNIT_IDENTIFICATION",
          "TARGET_SCALE_DERIVATION",
          "ANSWER_INTERPRETATION",
        ].includes(role.roleKind),
      )
      .some(
        (role) =>
          !`${role.sentence} ${role.math ?? ""}`.includes(item.semanticUnit),
      )
  ) {
    add("MAJOR", "CONTEXT_DROPOUT", "The count context disappears during reasoning.", output.lines);
  }
  if (
    item.contextKind === "money" &&
    output.roles.roles
      .filter((role) =>
        [
          "KNOWN_UNIT_MAPPING",
          "SINGLE_UNIT_DERIVATION",
          "TARGET_SCALE_DERIVATION",
          "ANSWER_INTERPRETATION",
        ].includes(role.roleKind),
      )
      .some((role) => !`${role.sentence} ${role.math ?? ""}`.includes("₹"))
  ) {
    add("MAJOR", "MONEY_CONTEXT_DROPOUT", "Money notation disappears during reasoning.", output.lines);
  }
  if (
    item.detailMode === "short" &&
    output.lines.some(
      (line) =>
        line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean)
          .length > 13,
    )
  ) {
    add("MAJOR", "SHORT_MODE_DENSITY", "A short-mode sentence is still too dense.", output.lines);
  }
  if (
    output.lines.length >= 2 &&
    output.lines[0]!.includes(String(item.knownRate)) &&
    output.lines[1]!.includes(String(item.knownRate)) &&
    output.lines[0]!.includes(String(item.knownValue)) &&
    output.lines[1]!.includes(String(item.knownValue))
  ) {
    add("MINOR", "REPEATED_OPENING", "The opening repeats the known relationship.", output.lines.slice(0, 2));
  }
  const connectors = output.lines.filter((line) =>
    /^(therefore|hence|thus|notice that)\b/i.test(line),
  );
  if (connectors.length > 1) {
    add("MINOR", "CONNECTOR_FATIGUE", "Formal connectors are repeated.", connectors);
  }
  return {
    auditId: item.auditId,
    lines: output.lines,
    findings,
    approved: !findings.some(
      (finding) =>
        finding.severity === "CRITICAL" || finding.severity === "MAJOR",
    ),
  };
}

export function produceLanguageRevisionReport(): LanguageRevisionReport {
  const examples = TUTOR_AUDIT_CORPUS.map(audit);
  const findings = examples.flatMap((example) => example.findings);
  const openings = TUTOR_AUDIT_CORPUS.map((item) => {
    const output = render(item);
    return normalizedOpening(output.lines[0] ?? "");
  });
  return {
    reportId: "ENG-006R1",
    totalExamples: examples.length,
    criticalFindings: findings.filter(
      (finding) => finding.severity === "CRITICAL",
    ),
    majorFindings: findings.filter(
      (finding) => finding.severity === "MAJOR",
    ),
    minorFindings: findings.filter(
      (finding) => finding.severity === "MINOR",
    ),
    examplesRequiringImprovement: examples.filter(
      (example) => !example.approved,
    ),
    examplesApproved: examples.filter((example) => example.approved),
    openingFamilyCount: new Set(openings).size,
  };
}

export const LANGUAGE_REVISION_REPORT = produceLanguageRevisionReport();

