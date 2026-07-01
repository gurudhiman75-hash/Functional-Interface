import type { StructuredExplanationBlock } from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { buildPercentOfKnownNumberRealismModel } from "../context-realism";
import { EntityConstraintError } from "../entity-constraints";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import { MoneyRealismError } from "../money-realism";
import { parsePresentedNumbers } from "../number-formatting";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import { ScenarioRealismError } from "../scenario-realism";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import type {
  ConfirmationCategory,
  ConfirmationCorpusItem,
} from "./confirmation-corpus";

export type ConfirmationDimension =
  | "TUTOR_REALISM"
  | "ONE_UNIT_VISIBILITY"
  | "DIVISION_INTENT"
  | "MULTIPLICATION_INTENT"
  | "ANSWER_CONFIDENCE"
  | "CONTEXT_PERSISTENCE"
  | "COMPOUND_LABELS"
  | "ENTITY_REALISM"
  | "MONEY_REALISM"
  | "NUMBER_FORMATTING"
  | "TRANSITION_QUALITY"
  | "PERSONALITY"
  | "TEMPLATE_FATIGUE"
  | "WEAK_STUDENT_FRIENDLINESS"
  | "NATURALNESS";

export type ConfirmationSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface ConfirmationFinding {
  confirmationId: string;
  category: ConfirmationCategory;
  dimension: ConfirmationDimension;
  severity: ConfirmationSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface ConfirmationExampleResult {
  confirmationId: string;
  category: ConfirmationCategory;
  lines: readonly string[];
  findings: readonly ConfirmationFinding[];
  approved: boolean;
  rejected: boolean;
  openingFamily: string;
  rhythmSignature: string;
}

export interface ConfirmationFatigueResult {
  totalExplanations: number;
  uniqueOpeningFamilies: number;
  uniqueRhythms: number;
  largestOpeningShare: number;
  largestRhythmShare: number;
  acceptable: boolean;
}

interface RenderedConfirmation {
  blocks: readonly StructuredExplanationBlock[];
  roles: RenderedEnglishV2RoleSet;
  lines: readonly string[];
  displayedTarget: number;
}

function parametersFor(item: ConfirmationCorpusItem): Pct001Parameters {
  const hasEntity = item.contextKind !== "abstract";
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: item.confirmationId,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType:
      item.contextKind === "count" || item.contextKind === "event"
        ? "COUNT"
        : "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: item.knownRate,
      value1: item.knownValue,
      rate2: item.targetRate,
    },
    semanticContext: hasEntity
      ? {
          scenario: item.contextLabel,
          entities: {
            quantity: {
              id: item.semanticUnit,
              en: item.semanticUnit,
              hi: item.semanticUnit,
              pa: item.semanticUnit,
              numberType:
                item.contextKind === "count" ||
                item.contextKind === "event"
                  ? "countable"
                  : "uncountable",
            },
          },
        }
      : undefined,
    sourceTrace: {
      questionLanguageSource: "QUAL-001-C1",
      explanationSource: "QUAL-001-C1",
      variableRangeSource: "QUAL-001-C1",
      semanticSource: hasEntity ? "QUAL-001-C1" : undefined,
    },
  };
}

function render(item: ConfirmationCorpusItem): RenderedConfirmation {
  const solved = solvePct001(parametersFor(item));
  const evidence = solved.educationalEvidence;
  if (!evidence) throw new Error(`${item.confirmationId}: missing evidence`);
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, item.detailMode);
  const roles = renderPercentOfKnownNumberEnglishV2(plan, trace, {
    contextLabel: item.contextLabel,
  });
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
  const model = buildPercentOfKnownNumberRealismModel(
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
  return {
    blocks,
    roles,
    lines: projectCompatibilityLines(blocks),
    displayedTarget: model.target.numericDisplay,
  };
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "")
    .replace(/₹?-?\d[\d,]*(?:\.\d+)?/g, "#")
    .replace(
      /\b(number|salary|income|profit|revenue|commission|bonus|expenses|savings|students?|workers?|employees?|books?|trees?|animals?|families|inventory|distance|area|weight|volume|production|population|marks)\b/g,
      "context",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function roleText(
  output: RenderedConfirmation,
  roleKind: string,
): string {
  const role = output.roles.roles.find(
    (candidate) => candidate.roleKind === roleKind,
  );
  return role ? `${role.sentence} ${role.math ?? ""}` : "";
}

function finding(
  item: ConfirmationCorpusItem,
  dimension: ConfirmationDimension,
  severity: ConfirmationSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): ConfirmationFinding {
  return {
    confirmationId: item.confirmationId,
    category: item.category,
    dimension,
    severity,
    code,
    message,
    evidence,
  };
}

function isPolicyError(
  error: unknown,
): error is ScenarioRealismError | MoneyRealismError | EntityConstraintError {
  return (
    error instanceof ScenarioRealismError ||
    error instanceof MoneyRealismError ||
    error instanceof EntityConstraintError
  );
}

function auditOne(
  item: ConfirmationCorpusItem,
): ConfirmationExampleResult {
  let output: RenderedConfirmation;
  try {
    output = render(item);
  } catch (error) {
    if (!isPolicyError(error)) throw error;
    const line = `Policy rejection: ${error.code} (${error.scenario})`;
    const findings =
      item.expectation === "REJECT"
        ? []
        : [
            finding(
              item,
              "TUTOR_REALISM",
              "MAJOR",
              "UNEXPECTED_POLICY_REJECTION",
              "A case expected to render was rejected by a realism policy.",
              [line],
            ),
          ];
    return {
      confirmationId: item.confirmationId,
      category: item.category,
      lines: [line],
      findings,
      approved: findings.length === 0,
      rejected: true,
      openingFamily: normalize(line),
      rhythmSignature: normalize(line),
    };
  }

  const findings: ConfirmationFinding[] = [];
  const text = output.lines.join("\n");
  const oneUnit = roleText(output, "SINGLE_UNIT_DERIVATION");
  const targetScale = roleText(output, "TARGET_SCALE_DERIVATION");
  const answer = roleText(output, "ANSWER_INTERPRETATION");
  const equalRate = item.knownRate === item.targetRate;
  const add = (
    dimension: ConfirmationDimension,
    severity: ConfirmationSeverity,
    code: string,
    message: string,
    evidence: readonly string[],
  ) =>
    findings.push(
      finding(item, dimension, severity, code, message, evidence),
    );

  if (item.expectation === "REJECT") {
    add(
      "TUTOR_REALISM",
      "MAJOR",
      "EXPECTED_REJECTION_NOT_ENFORCED",
      "An intentionally unrealistic case was rendered instead of rejected.",
      output.lines,
    );
  }
  if (
    !/1(?:\\)?%/.test(oneUnit) &&
    !/one-percent calculation is unnecessary/i.test(oneUnit)
  ) {
    add(
      "ONE_UNIT_VISIBILITY",
      "CRITICAL",
      "MISSING_ONE_UNIT_REASONING",
      "The explanation neither establishes 1% nor explains why it is unnecessary.",
      output.lines,
    );
  }
  if (
    /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(
      text,
    )
  ) {
    add(
      "NATURALNESS",
      "CRITICAL",
      "FORMULA_FIRST",
      "Formula-first language appears.",
      output.lines,
    );
  }
  const singleIndex = output.blocks.findIndex(
    (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
  );
  const targetIndex = output.blocks.findIndex(
    (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
  );
  if (singleIndex < 0 || targetIndex <= singleIndex) {
    add(
      "ANSWER_CONFIDENCE",
      "CRITICAL",
      "ANSWER_JUMP",
      "Target scaling bypasses the one-unit reasoning block.",
      output.lines,
    );
  }
  if (
    !parsePresentedNumbers(answer).some(
      (value) => value === output.displayedTarget,
    )
  ) {
    add(
      "ANSWER_CONFIDENCE",
      "CRITICAL",
      "WRONG_ANSWER",
      "The contextual answer does not contain the approved displayed result.",
      [answer],
    );
  }
  if (
    !equalRate &&
    !/\b(because|since)\b/i.test(oneUnit)
  ) {
    add(
      "DIVISION_INTENT",
      "MAJOR",
      "DIVISION_INTENT_MISSING",
      "Division is performed without an explicit reason.",
      [oneUnit],
    );
  }
  if (
    !equalRate &&
    !/\b(because|since|once)\b/i.test(targetScale) &&
    !/use the 1% value .* times to get/i.test(targetScale)
  ) {
    add(
      "MULTIPLICATION_INTENT",
      "MAJOR",
      "MULTIPLICATION_INTENT_MISSING",
      "Multiplication is performed without an explicit scaling reason.",
      [targetScale],
    );
  }
  if (
    item.contextKind !== "abstract" &&
    !answer.toLowerCase().includes(item.contextLabel.toLowerCase())
  ) {
    add(
      "CONTEXT_PERSISTENCE",
      "MAJOR",
      "ANSWER_CONTEXT_LOST",
      "The answer drops the scenario label.",
      [answer],
    );
  }
  if (
    item.contextLabel.includes(" ") &&
    output.roles.roles.filter(
      (role) =>
        role.visibility.state === "visible" &&
        role.sentence.toLowerCase().includes(item.contextLabel.toLowerCase()),
    ).length < 3
  ) {
    add(
      "COMPOUND_LABELS",
      "MAJOR",
      "COMPOUND_LABEL_WEAK",
      "The compound label is not sustained across enough teaching roles.",
      output.lines,
    );
  }
  if (/\b\d{6,}\b/.test(text)) {
    add(
      "NUMBER_FORMATTING",
      "MAJOR",
      "UNGROUPED_LARGE_NUMBER",
      "A large number is exposed without Indian grouping.",
      output.lines.filter((line) => /\b\d{6,}\b/.test(line)),
    );
  }
  if (/\d+\.\d{3,}/.test(text)) {
    add(
      "NUMBER_FORMATTING",
      "MAJOR",
      "DECIMAL_LEAKAGE",
      "More than two decimal places are visible.",
      output.lines.filter((line) => /\d+\.\d{3,}/.test(line)),
    );
  }
  if (
    item.weakStudent &&
    !equalRate &&
    (!/\bequal\b/i.test(oneUnit) || !/1(?:\\)?%/.test(oneUnit))
  ) {
    add(
      "WEAK_STUDENT_FRIENDLINESS",
      "MAJOR",
      "ONE_PART_MEANING_WEAK",
      "The weak-student explanation does not connect equal parts to 1%.",
      [oneUnit],
    );
  }
  if (!/\b(we|because|since|first|now|so|check)\b/i.test(text)) {
    add(
      "PERSONALITY",
      "MAJOR",
      "MECHANICAL_VOICE",
      "The explanation lacks a conversational teaching signal.",
      output.lines,
    );
  }
  const longLines = output.lines.filter(
    (line) =>
      line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean)
        .length > 22,
  );
  if (longLines.length > 0) {
    add(
      "NATURALNESS",
      "MINOR",
      "LONG_SENTENCE",
      "A sentence is slightly longer than necessary.",
      longLines,
    );
  }
  const connectors = output.lines.filter((line) =>
    /^(therefore|hence|thus|notice that)\b/i.test(line),
  );
  if (connectors.length > 1) {
    add(
      "TRANSITION_QUALITY",
      "MINOR",
      "CONNECTOR_REPETITION",
      "Formal connectors repeat.",
      connectors,
    );
  }

  return {
    confirmationId: item.confirmationId,
    category: item.category,
    lines: output.lines,
    findings,
    approved: !findings.some(
      (entry) =>
        entry.severity === "CRITICAL" || entry.severity === "MAJOR",
    ),
    rejected: false,
    openingFamily: normalize(output.lines[0] ?? ""),
    rhythmSignature: output.lines.map(normalize).join(" | "),
  };
}

export function runConfirmationAudit(
  corpus: readonly ConfirmationCorpusItem[],
): readonly ConfirmationExampleResult[] {
  return corpus.map(auditOne);
}

export function runConfirmationFatigueStudy(
  corpus: readonly ConfirmationCorpusItem[],
): ConfirmationFatigueResult {
  const results = runConfirmationAudit(corpus);
  const openings = new Map<string, number>();
  const rhythms = new Map<string, number>();
  for (const result of results) {
    openings.set(
      result.openingFamily,
      (openings.get(result.openingFamily) ?? 0) + 1,
    );
    rhythms.set(
      result.rhythmSignature,
      (rhythms.get(result.rhythmSignature) ?? 0) + 1,
    );
  }
  const largestOpening = Math.max(...openings.values());
  const largestRhythm = Math.max(...rhythms.values());
  const largestOpeningShare = largestOpening / corpus.length;
  const largestRhythmShare = largestRhythm / corpus.length;
  return {
    totalExplanations: corpus.length,
    uniqueOpeningFamilies: openings.size,
    uniqueRhythms: rhythms.size,
    largestOpeningShare,
    largestRhythmShare,
    acceptable:
      openings.size >= 8 &&
      rhythms.size >= 100 &&
      largestOpeningShare <= 0.2 &&
      largestRhythmShare <= 0.05,
  };
}
