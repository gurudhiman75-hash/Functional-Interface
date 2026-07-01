import type { StructuredExplanationBlock } from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { buildPercentOfKnownNumberRealismModel } from "../context-realism";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import { ScenarioRealismError } from "../scenario-realism";
import { parsePresentedNumbers } from "../number-formatting";
import { MoneyRealismError } from "../money-realism";
import { EntityConstraintError } from "../entity-constraints";
import type {
  RedTeamCorpusItem,
  RedTeamCategory,
} from "./red-team-corpus";

export type RedTeamDimension =
  | "TUTOR_REALISM"
  | "ANSWER_CONFIDENCE"
  | "CONTEXT_PERSISTENCE"
  | "UNIT_REALISM"
  | "REPETITION_FATIGUE"
  | "TRANSITION_QUALITY"
  | "WEAK_STUDENT_FRIENDLINESS"
  | "PERSONALITY"
  | "NATURALNESS";

export type RedTeamSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface RedTeamFinding {
  redTeamId: string;
  category: RedTeamCategory;
  dimension: RedTeamDimension;
  severity: RedTeamSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface RedTeamExampleResult {
  redTeamId: string;
  category: RedTeamCategory;
  lines: readonly string[];
  findings: readonly RedTeamFinding[];
  approved: boolean;
  scenarioRejected: boolean;
  openingFamily: string;
  rhythmSignature: string;
}

export interface RedTeamFatigueResult {
  totalExplanations: number;
  uniqueOpeningFamilies: number;
  uniqueRhythms: number;
  largestOpeningFamily: number;
  largestRhythmFamily: number;
  largestOpeningShare: number;
  largestRhythmShare: number;
  acceptable: boolean;
}

interface RenderedRedTeamExample {
  blocks: readonly StructuredExplanationBlock[];
  roles: RenderedEnglishV2RoleSet;
  lines: readonly string[];
  exactTarget: number;
  displayedTarget: number;
}

function parametersFor(item: RedTeamCorpusItem): Pct001Parameters {
  const hasEntity = item.contextKind !== "abstract";
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: item.redTeamId,
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
                item.contextKind === "count" || item.contextKind === "event"
                  ? "countable"
                  : "uncountable",
            },
          },
        }
      : undefined,
    sourceTrace: {
      questionLanguageSource: "QUAL-001-C",
      explanationSource: "QUAL-001-C",
      variableRangeSource: "QUAL-001-C",
      semanticSource: hasEntity ? "QUAL-001-C" : undefined,
    },
  };
}

function render(item: RedTeamCorpusItem): RenderedRedTeamExample {
  const solver = solvePct001(parametersFor(item));
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error(`${item.redTeamId}: missing evidence`);
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
  return {
    blocks,
    roles,
    lines: projectCompatibilityLines(blocks),
    exactTarget: evidence.derivedValues.targetQuantity,
    displayedTarget: realism.target.numericDisplay,
  };
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "")
    .replace(/₹?\d+(?:\.\d+)?/g, "#")
    .replace(
      /\b(number|students?|workers?|famil(?:y|ies)|employees?|people|books?|trees?|animals?|salary|income|profit|savings|revenue|expenses|votes?|marriages?|accidents?|population|distance|area)\b/g,
      "context",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function roleText(
  output: RenderedRedTeamExample,
  roleKind: string,
): string {
  const role = output.roles.roles.find((candidate) => candidate.roleKind === roleKind);
  return role ? `${role.sentence} ${role.math ?? ""}` : "";
}

function finding(
  item: RedTeamCorpusItem,
  dimension: RedTeamDimension,
  severity: RedTeamSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): RedTeamFinding {
  return {
    redTeamId: item.redTeamId,
    category: item.category,
    dimension,
    severity,
    code,
    message,
    evidence,
  };
}

function containsDisplayedValue(text: string, expected: number): boolean {
  return parsePresentedNumbers(text).some((value) => value === expected);
}

function auditOne(item: RedTeamCorpusItem): RedTeamExampleResult {
  let output: RenderedRedTeamExample;
  try {
    output = render(item);
  } catch (error) {
    if (
      error instanceof ScenarioRealismError ||
      error instanceof MoneyRealismError ||
      error instanceof EntityConstraintError
    ) {
      const line = `Scenario rejected: ${error.code} (${error.scenario})`;
      return {
        redTeamId: item.redTeamId,
        category: item.category,
        lines: [line],
        findings: [],
        approved: true,
        scenarioRejected: true,
        openingFamily: normalize(line),
        rhythmSignature: normalize(line),
      };
    }
    throw error;
  }
  const findings: RedTeamFinding[] = [];
  const text = output.lines.join("\n");
  const single = roleText(output, "SINGLE_UNIT_DERIVATION");
  const answer = roleText(output, "ANSWER_INTERPRETATION");
  const add = (
    dimension: RedTeamDimension,
    severity: RedTeamSeverity,
    code: string,
    message: string,
    evidence: readonly string[],
  ) =>
    findings.push(
      finding(item, dimension, severity, code, message, evidence),
    );

  if (
    !/1(?:\\)?%/.test(single) &&
    !/one-percent calculation is unnecessary/i.test(single)
  ) {
    add(
      "WEAK_STUDENT_FRIENDLINESS",
      "CRITICAL",
      "MISSING_ONE_UNIT_REASONING",
      "The one-unit step is not visible.",
      output.lines,
    );
  }
  const oneUnitIndex = output.blocks.findIndex(
    (block) => block.semanticRole === "SINGLE_UNIT_DERIVATION",
  );
  const targetIndex = output.blocks.findIndex(
    (block) => block.semanticRole === "TARGET_SCALE_DERIVATION",
  );
  if (oneUnitIndex < 0 || targetIndex <= oneUnitIndex) {
    add(
      "ANSWER_CONFIDENCE",
      "CRITICAL",
      "ANSWER_JUMP",
      "Target scaling bypasses the one-unit step.",
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
      "FORMULA_FIRST_REGRESSION",
      "Formula-first language has returned.",
      output.lines,
    );
  }
  if (!containsDisplayedValue(answer, output.displayedTarget)) {
    add(
      "ANSWER_CONFIDENCE",
      "CRITICAL",
      "WRONG_DISPLAYED_ANSWER",
      `The answer does not contain the approved displayed value ${output.displayedTarget}.`,
      [answer],
    );
  }

  if (
    (item.contextKind === "count" || item.contextKind === "event") &&
    !Number.isInteger(output.exactTarget) &&
    (!/\babout\b/i.test(answer) || /\d+\.\d+\s+[a-z]/i.test(answer))
  ) {
    add(
      "UNIT_REALISM",
      "MAJOR",
      "AWKWARD_COUNT_APPROXIMATION",
      "A fractional discrete result is not presented as a natural rounded approximation.",
      [answer],
    );
  }
  if (
    (!Number.isInteger(item.knownRate) ||
      !Number.isInteger(item.targetRate)) &&
    /equal percentage parts/i.test(single)
  ) {
    add(
      "NATURALNESS",
      "MAJOR",
      "FRACTIONAL_PERCENT_PARTS",
      "The wording treats a fractional percentage as a count of equal parts.",
      [single],
    );
  }
  if (item.knownRate === item.targetRate) {
    const equalRateDetour =
      /\$\$1\\%|divide .* by|multiply .* by/i.test(text) ||
      !/no need to find 1%|unnecessary|both percentages are equal|already (?:given|known|provided)|same \d+%/i.test(
        text,
      );
    if (equalRateDetour) {
      add(
        "WEAK_STUDENT_FRIENDLINESS",
        "MAJOR",
        "EQUAL_RATE_OVEREXPLAINED",
        "The explanation performs a full one-unit detour even though the requested percentage is already given.",
        output.lines,
      );
    }
  }
  if (
    item.category === "LARGE_VALUES" &&
    /\b\d{6,}\b/.test(text) &&
    !/\d{1,2}(?:,\d{2})*,\d{3}/.test(text)
  ) {
    add(
      "ANSWER_CONFIDENCE",
      "MAJOR",
      "LARGE_NUMBER_UNGROUPED",
      "Large values are rendered without digit grouping.",
      output.lines.filter((line) => /\b\d{6,}\b/.test(line)),
    );
  }
  if (
    item.contextKind !== "abstract" &&
    !answer.toLowerCase().includes(item.contextLabel.toLowerCase())
  ) {
    add(
      "CONTEXT_PERSISTENCE",
      "MAJOR",
      "CONTEXT_LOST_IN_ANSWER",
      "The real-world context disappears before the answer.",
      [answer],
    );
  }
  if (
    item.weakStudent &&
    item.knownRate !== item.targetRate &&
    !/\b(because|since|equal|sharing|splitting|comes from)\b/i.test(single)
  ) {
    add(
      "WEAK_STUDENT_FRIENDLINESS",
      "MAJOR",
      "DIVISION_NOT_EXPLAINED",
      "The learner is told to divide but not why division gives 1%.",
      [single],
    );
  }
  if (!/\b(we|first|now|so|because|since|check)\b/i.test(text)) {
    add(
      "PERSONALITY",
      "MAJOR",
      "MECHANICAL_VOICE",
      "The explanation lacks a conversational teaching signal.",
      output.lines,
    );
  }
  if (/\d+\.\d{3,}/.test(text)) {
    add(
      "ANSWER_CONFIDENCE",
      "MAJOR",
      "PRECISION_LEAKAGE",
      "More than two decimal places are exposed.",
      output.lines.filter((line) => /\d+\.\d{3,}/.test(line)),
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
      "Formal connectors repeat in one explanation.",
      connectors,
    );
  }
  const longLines = output.lines.filter(
    (line) =>
      line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean)
        .length > 18,
  );
  if (longLines.length > 0) {
    add(
      "NATURALNESS",
      "MINOR",
      "LONG_SENTENCE",
      "A sentence is longer than necessary for a weak student.",
      longLines,
    );
  }

  return {
    redTeamId: item.redTeamId,
    category: item.category,
    lines: output.lines,
    findings,
    approved: !findings.some(
      (entry) =>
        entry.severity === "CRITICAL" || entry.severity === "MAJOR",
    ),
    scenarioRejected: false,
    openingFamily: normalize(output.lines[0] ?? ""),
    rhythmSignature: output.lines.map(normalize).join(" | "),
  };
}

export function runRedTeamAudit(
  corpus: readonly RedTeamCorpusItem[],
): readonly RedTeamExampleResult[] {
  return corpus.map(auditOne);
}

export function runRedTeamFatigueStudy(
  corpus: readonly RedTeamCorpusItem[],
): RedTeamFatigueResult {
  const outputs = corpus.map(auditOne);
  const openings = new Map<string, number>();
  const rhythms = new Map<string, number>();
  for (const output of outputs) {
    openings.set(
      output.openingFamily,
      (openings.get(output.openingFamily) ?? 0) + 1,
    );
    rhythms.set(
      output.rhythmSignature,
      (rhythms.get(output.rhythmSignature) ?? 0) + 1,
    );
  }
  const largestOpeningFamily = Math.max(...openings.values());
  const largestRhythmFamily = Math.max(...rhythms.values());
  const largestOpeningShare = largestOpeningFamily / corpus.length;
  const largestRhythmShare = largestRhythmFamily / corpus.length;
  return {
    totalExplanations: corpus.length,
    uniqueOpeningFamilies: openings.size,
    uniqueRhythms: rhythms.size,
    largestOpeningFamily,
    largestRhythmFamily,
    largestOpeningShare,
    largestRhythmShare,
    acceptable:
      openings.size >= 8 &&
      rhythms.size >= 100 &&
      largestOpeningShare <= 0.2 &&
      largestRhythmShare <= 0.05,
  };
}
