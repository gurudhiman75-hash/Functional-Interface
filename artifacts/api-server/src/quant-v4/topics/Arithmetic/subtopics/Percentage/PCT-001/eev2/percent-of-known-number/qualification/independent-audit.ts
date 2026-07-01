import type { StructuredExplanationBlock } from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import { buildPercentOfKnownNumberRealismModel } from "../context-realism";
import { parsePresentedNumbers } from "../number-formatting";
import { MoneyRealismError } from "../money-realism";
import { ScenarioRealismError } from "../scenario-realism";
import { EntityConstraintError } from "../entity-constraints";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import type { IndependentAuditCorpusItem } from "./independent-audit-corpus";

export type IndependentAuditDimension =
  | "TUTOR_REALISM"
  | "ONE_UNIT_VISIBILITY"
  | "SIMPLICITY"
  | "COGNITIVE_LOAD"
  | "ANSWER_CONFIDENCE"
  | "TRANSITION_QUALITY"
  | "AI_SMELL"
  | "BOOK_SMELL"
  | "REPETITION_FATIGUE"
  | "TUTOR_PERSONALITY";

export type IndependentAuditSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface IndependentAuditFinding {
  auditId: string;
  dimension: IndependentAuditDimension;
  severity: IndependentAuditSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface IndependentAuditExampleResult {
  auditId: string;
  lines: readonly string[];
  findings: readonly IndependentAuditFinding[];
  fullyApproved: boolean;
  openingFamily: string;
  rhythmSignature: string;
}

interface RenderedAuditExample {
  blocks: readonly StructuredExplanationBlock[];
  roles: RenderedEnglishV2RoleSet;
  lines: readonly string[];
  exactTarget: number;
  expectedDisplayedTarget: number;
}

function parametersFor(item: IndependentAuditCorpusItem): Pct001Parameters {
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
      questionLanguageSource: "QUAL-001-B1",
      explanationSource: "QUAL-001-B1",
      variableRangeSource: "QUAL-001-B1",
      semanticSource: entity ? "QUAL-001-B1" : undefined,
    },
  };
}

function render(item: IndependentAuditCorpusItem): RenderedAuditExample {
  const solver = solvePct001(parametersFor(item));
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error(`${item.auditId}: missing educational evidence`);
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, item.detailMode);
  const roles = renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: item.contextLabel,
  });
  const realism = buildPercentOfKnownNumberRealismModel(
    {
      contextLabel: item.contextLabel,
      semanticUnit: item.semanticUnit,
    },
    {
      knownUnitCount: evidence.sourceValues.knownUnitCount,
      knownQuantity: evidence.sourceValues.knownQuantity,
      targetUnitCount: evidence.sourceValues.targetUnitCount,
      singleUnitValue: evidence.derivedValues.singleUnitValue,
      targetQuantity: evidence.derivedValues.targetQuantity,
    },
  );
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
  return {
    blocks,
    roles,
    lines: projectCompatibilityLines(blocks),
    exactTarget: evidence.derivedValues.targetQuantity,
    expectedDisplayedTarget: realism.target.numericDisplay,
  };
}

function finding(
  item: IndependentAuditCorpusItem,
  dimension: IndependentAuditDimension,
  severity: IndependentAuditSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): IndependentAuditFinding {
  return { auditId: item.auditId, dimension, severity, code, message, evidence };
}

function normalizeSentence(value: string): string {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "")
    .replace(/₹?\d+(?:\.\d+)?/g, "#")
    .replace(
      /\b(students|workers|books|trees|families|animals|rupees)\b/g,
      "unit",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function roleText(
  output: RenderedAuditExample,
  roleKind: string,
): string {
  const role = output.roles.roles.find((candidate) => candidate.roleKind === roleKind);
  return role ? `${role.sentence} ${role.math ?? ""}` : "";
}

function finalDisplayedNumber(value: string): number | undefined {
  return parsePresentedNumbers(value).at(-1);
}

function auditOne(
  item: IndependentAuditCorpusItem,
): IndependentAuditExampleResult {
  let output: RenderedAuditExample;
  try {
    output = render(item);
  } catch (error) {
    if (
      error instanceof MoneyRealismError ||
      error instanceof ScenarioRealismError ||
      error instanceof EntityConstraintError
    ) {
      const line = `Scenario rejected: ${error.code} (${error.scenario})`;
      return {
        auditId: item.auditId,
        lines: [line],
        findings: [],
        fullyApproved: true,
        openingFamily: normalizeSentence(line),
        rhythmSignature: normalizeSentence(line),
      };
    }
    throw error;
  }
  const findings: IndependentAuditFinding[] = [];
  const text = output.lines.join("\n");
  const add = (
    dimension: IndependentAuditDimension,
    severity: IndependentAuditSeverity,
    code: string,
    message: string,
    evidence: readonly string[],
  ) => findings.push(finding(item, dimension, severity, code, message, evidence));

  const oneUnit = roleText(output, "SINGLE_UNIT_DERIVATION");
  const target = roleText(output, "TARGET_SCALE_DERIVATION");
  const answer = roleText(output, "ANSWER_INTERPRETATION");
  if (
    !/1(?:\\)?%/.test(oneUnit) &&
    !/one-percent calculation is unnecessary/i.test(oneUnit)
  ) {
    add(
      "ONE_UNIT_VISIBILITY",
      "CRITICAL",
      "MISSING_ONE_UNIT_REASONING",
      "The explanation does not visibly establish 1%.",
      output.lines,
    );
  }
  if (
    /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(
      text,
    )
  ) {
    add(
      "BOOK_SMELL",
      "CRITICAL",
      "FORMULA_FIRST",
      "Formula-first or symbolic-operation language appears.",
      output.lines,
    );
  }
  if (
    output.blocks.findIndex(
      (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
    ) <=
    output.blocks.findIndex(
      (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
    )
  ) {
    add(
      "ONE_UNIT_VISIBILITY",
      "CRITICAL",
      "ANSWER_JUMP",
      "Target scaling appears before one-unit reasoning.",
      output.lines,
    );
  }

  const displayedAnswer = finalDisplayedNumber(answer);
  if (displayedAnswer !== output.expectedDisplayedTarget) {
    add(
      "ANSWER_CONFIDENCE",
      "CRITICAL",
      "WRONG_ANSWER",
      `The displayed answer ${displayedAnswer} does not match the approved presentation value ${output.expectedDisplayedTarget}.`,
      [answer],
    );
  }

  if (/\d+\.\d{7,}/.test(text)) {
    add(
      "COGNITIVE_LOAD",
      "MAJOR",
      "RAW_DECIMAL_LEAK",
      "Raw floating-point digits are visible.",
      output.lines.filter((line) => /\d+\.\d{7,}/.test(line)),
    );
  }
  if (
    !Number.isInteger(output.exactTarget) &&
    item.contextKind === "count" &&
    (!/\babout\b/i.test(answer) || /\d+\.\d+/.test(answer))
  ) {
    add(
      "ANSWER_CONFIDENCE",
      "MAJOR",
      "FRACTIONAL_COUNT_RESULT",
      "The explanation presents an approximate fractional count without discussing whether a partial person or object is meaningful.",
      [answer],
    );
  }
  if (
    item.contextKind === "money" &&
    !text.toLowerCase().includes(item.contextLabel.toLowerCase())
  ) {
    add(
      "TUTOR_REALISM",
      "MAJOR",
      "SCENARIO_IDENTITY_LOST",
      `The question is about ${item.contextLabel}, but the explanation reduces it to a generic amount.`,
      output.lines,
    );
  }
  if (
    /lots of|rebuilding the given|returns to|the two percentages are based on/i.test(
      text,
    )
  ) {
    add(
      "TUTOR_REALISM",
      "MAJOR",
      "AWKWARD_SPOKEN_PHRASE",
      "At least one phrase sounds constructed rather than naturally spoken.",
      output.lines.filter((line) =>
        /lots of|rebuilding the given|returns to|the two percentages are based on/i.test(
          line,
        ),
      ),
    );
  }
  const longSentences = output.lines.filter(
    (line) =>
      line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean)
        .length > 17,
  );
  if (longSentences.length > 0) {
    add(
      "SIMPLICITY",
      "MINOR",
      "LONG_SENTENCE",
      "A sentence is longer than a weak student needs.",
      longSentences,
    );
  }
  const connectors = output.lines.filter((line) =>
    /^(therefore|hence|thus|notice that)\b/i.test(line),
  );
  if (connectors.length > 1) {
    add(
      "TRANSITION_QUALITY",
      "MINOR",
      "CONNECTOR_FATIGUE",
      "Formal connectors repeat within one explanation.",
      connectors,
    );
  }

  const personalSignals =
    /\b(first|now|we|check|because|so)\b/i.test(text);
  if (!personalSignals) {
    add(
      "TUTOR_PERSONALITY",
      "MAJOR",
      "COLD_PROCEDURAL_VOICE",
      "The explanation gives instructions without any conversational teaching signal.",
      output.lines,
    );
  }

  return {
    auditId: item.auditId,
    lines: output.lines,
    findings,
    fullyApproved: !findings.some(
      (entry) =>
        entry.severity === "CRITICAL" || entry.severity === "MAJOR",
    ),
    openingFamily: normalizeSentence(output.lines[0] ?? ""),
    rhythmSignature: output.lines.map(normalizeSentence).join(" | "),
  };
}

function appendCorpusFindings(
  results: readonly IndependentAuditExampleResult[],
): readonly IndependentAuditExampleResult[] {
  const openingCounts = new Map<string, number>();
  const rhythmCounts = new Map<string, number>();
  for (const result of results) {
    openingCounts.set(
      result.openingFamily,
      (openingCounts.get(result.openingFamily) ?? 0) + 1,
    );
    rhythmCounts.set(
      result.rhythmSignature,
      (rhythmCounts.get(result.rhythmSignature) ?? 0) + 1,
    );
  }
  return results.map((result) => {
    const findings = [...result.findings];
    const openingCount = openingCounts.get(result.openingFamily) ?? 0;
    const rhythmCount = rhythmCounts.get(result.rhythmSignature) ?? 0;
    if (rhythmCount >= 3) {
      findings.push({
        auditId: result.auditId,
        dimension: "REPETITION_FATIGUE",
        severity: "MAJOR",
        code: "REPEATED_FULL_RHYTHM",
        message: `The same normalized explanation rhythm appears ${rhythmCount} times.`,
        evidence: result.lines,
      });
    } else if (openingCount >= 6) {
      findings.push({
        auditId: result.auditId,
        dimension: "REPETITION_FATIGUE",
        severity: "MINOR",
        code: "REPEATED_OPENING_FAMILY",
        message: `The same opening family appears ${openingCount} times.`,
        evidence: [result.lines[0] ?? ""],
      });
    }
    return {
      ...result,
      findings,
      fullyApproved: !findings.some(
        (entry) =>
          entry.severity === "CRITICAL" || entry.severity === "MAJOR",
      ),
    };
  });
}

export function runIndependentAudit(
  corpus: readonly IndependentAuditCorpusItem[],
): readonly IndependentAuditExampleResult[] {
  return appendCorpusFindings(corpus.map(auditOne));
}
