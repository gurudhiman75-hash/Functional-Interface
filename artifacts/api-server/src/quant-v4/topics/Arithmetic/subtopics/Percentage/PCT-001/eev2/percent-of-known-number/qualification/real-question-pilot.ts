import type {
  ExplanationPlan,
  RichReasoningGraph,
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
import type { PercentOfKnownNumberEvidence } from "../evidence";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import { parsePresentedNumbers } from "../number-formatting";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import type { RealQuestionPilotItem } from "./real-question-review-notes";

export type RealQuestionSeverity = "CRITICAL" | "MAJOR" | "MINOR";
export type RealQuestionDimension =
  | "TUTOR_REALISM"
  | "ONE_UNIT_VISIBILITY"
  | "STEM_ALIGNMENT"
  | "CONTEXT_PERSISTENCE"
  | "ANSWER_CONFIDENCE"
  | "WEAK_STUDENT_FRIENDLINESS"
  | "PLATFORM_COMPARISON"
  | "UNEXPECTED_MISMATCH";

export interface RealQuestionFinding {
  pilotId: string;
  dimension: RealQuestionDimension;
  severity: RealQuestionSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface FrozenRealQuestionRecord {
  pilotId: string;
  questionText: string;
  source: RealQuestionPilotItem["source"];
  difficulty: RealQuestionPilotItem["difficulty"];
  inputs: {
    knownRate: number;
    knownValue: number;
    targetRate: number;
  };
  solverEvidence: PercentOfKnownNumberEvidence;
  trace: TutorThinkingTrace;
  graph: RichReasoningGraph;
  plan: ExplanationPlan;
  renderedRoles: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  detailMode: RealQuestionPilotItem["detailMode"];
  locale: RealQuestionPilotItem["locale"];
  reviewerNotes: readonly string[];
  findings: readonly RealQuestionFinding[];
  approvalStatus: "APPROVED" | "REVIEW_REQUIRED";
}

function parametersFor(item: RealQuestionPilotItem): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: item.pilotId,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: item.locale,
    difficultyBand: item.difficulty,
    taskKind: "percentOfKnownNumber",
    answerType: "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: item.knownRate,
      value1: item.knownValue,
      rate2: item.targetRate,
    },
    sourceTrace: {
      questionLanguageSource: "QUAL-001-E0",
      explanationSource: "QUAL-001-E0",
      variableRangeSource: "QUAL-001-E0",
    },
  };
}

function roleText(
  roles: RenderedEnglishV2RoleSet,
  roleKind: string,
): string {
  const role = roles.roles.find((candidate) => candidate.roleKind === roleKind);
  return role ? `${role.sentence} ${role.math ?? ""}`.trim() : "";
}

function containsPresentedValue(text: string, expected: number): boolean {
  return parsePresentedNumbers(text).some(
    (value) => Math.abs(value - expected) <= Math.max(0.01, Math.abs(expected) * 1e-9),
  );
}

function finding(
  item: RealQuestionPilotItem,
  dimension: RealQuestionDimension,
  severity: RealQuestionSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): RealQuestionFinding {
  return { pilotId: item.pilotId, dimension, severity, code, message, evidence };
}

export function runRealQuestionPilot(
  corpus: readonly RealQuestionPilotItem[],
): readonly FrozenRealQuestionRecord[] {
  return corpus.map((item) => {
    const solved = solvePct001(parametersFor(item));
    const evidence = solved.educationalEvidence;
    if (!evidence) throw new Error(`${item.pilotId}: missing solver evidence`);
    const trace = buildPercentOfKnownNumberTrace(evidence);
    const graph = buildPercentOfKnownNumberGraph(trace);
    const plan = planPercentOfKnownNumberExplanation(graph, item.detailMode);
    const renderedRoles = renderPercentOfKnownNumberEnglishV2(plan, trace, {
      contextLabel: item.contextLabel,
    });
    const blocks = renderPercentOfKnownNumberBlocks(
      plan,
      renderedRoles as unknown as RenderedEnglishRoleSet,
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
    const text = lines.join("\n");
    const oneUnit = roleText(renderedRoles, "SINGLE_UNIT_DERIVATION");
    const targetScale = roleText(renderedRoles, "TARGET_SCALE_DERIVATION");
    const answer = roleText(renderedRoles, "ANSWER_INTERPRETATION");
    const findings: RealQuestionFinding[] = [];
    const add = (
      dimension: RealQuestionDimension,
      severity: RealQuestionSeverity,
      code: string,
      message: string,
      samples: readonly string[],
    ) => findings.push(finding(item, dimension, severity, code, message, samples));

    if (/\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(text)) {
      add("TUTOR_REALISM", "CRITICAL", "FORMULA_FIRST", "Formula-first language appears.", lines);
    }
    if (!/1(?:\\)?%/.test(oneUnit) && !/one-percent calculation is unnecessary/i.test(oneUnit)) {
      add("ONE_UNIT_VISIBILITY", "CRITICAL", "MISSING_ONE_UNIT_REASONING", "The one-unit method is not visible.", [oneUnit]);
    }
    const singleIndex = blocks.findIndex((block) => block.semanticRole === "SINGLE_UNIT_DERIVATION");
    const targetIndex = blocks.findIndex((block) => block.semanticRole === "TARGET_SCALE_DERIVATION");
    if (singleIndex < 0 || targetIndex <= singleIndex) {
      add("ANSWER_CONFIDENCE", "CRITICAL", "ANSWER_JUMP", "Target scaling bypasses the one-unit block.", lines);
    }
    if (!containsPresentedValue(answer, evidence.derivedValues.targetQuantity)) {
      add("ANSWER_CONFIDENCE", "CRITICAL", "WRONG_ANSWER", "The answer role does not expose the solver result.", [answer]);
    }
    if (!containsPresentedValue(text, item.knownValue) || !containsPresentedValue(text, item.targetRate)) {
      add("STEM_ALIGNMENT", "MAJOR", "NUMERIC_STEM_ALIGNMENT", "The explanation does not visibly retain the stem's known value and requested rate.", lines);
    }
    if (!answer.toLowerCase().includes("number")) {
      add("CONTEXT_PERSISTENCE", "MAJOR", "ANSWER_CONTEXT_LOST", "The answer drops the question's number context.", [answer]);
    }
    if (item.knownRate !== item.targetRate && !/\b(because|since)\b/i.test(oneUnit)) {
      add("WEAK_STUDENT_FRIENDLINESS", "MAJOR", "DIVISION_INTENT_MISSING", "Division is shown without its educational reason.", [oneUnit]);
    }
    if (item.knownRate !== item.targetRate && !/\b(because|since|once|use)\b/i.test(targetScale)) {
      add("WEAK_STUDENT_FRIENDLINESS", "MAJOR", "MULTIPLICATION_INTENT_MISSING", "Target scaling is shown without its educational reason.", [targetScale]);
    }
    const longLines = lines.filter(
      (line) => line.replace(/\$\$.*?\$\$/g, "").trim().split(/\s+/).filter(Boolean).length > 22,
    );
    if (longLines.length > 0) {
      add("TUTOR_REALISM", "MINOR", "LONG_SENTENCE", "A sentence is slightly dense for a weak student.", longLines);
    }

    const comparison =
      findings.length === 0
        ? "The explanation exposes the one-unit reason more explicitly than a typical answer-only platform solution."
        : "Direct platform preference requires review because this output has recorded findings.";
    const reviewerNotes = [
      ...item.reviewerNotes,
      comparison,
      item.questionText.includes("\\frac") || /(?:sixth|third|fourth|half|seventh)/i.test(item.questionText)
        ? "Fraction wording is a deliberate stem-alignment stress case."
        : "Percentage wording maps directly to the UNIT_VALUE evidence.",
    ];
    const approved = !findings.some(
      (entry) => entry.severity === "CRITICAL" || entry.severity === "MAJOR",
    );

    return {
      pilotId: item.pilotId,
      questionText: item.questionText,
      source: item.source,
      difficulty: item.difficulty,
      inputs: {
        knownRate: item.knownRate,
        knownValue: item.knownValue,
        targetRate: item.targetRate,
      },
      solverEvidence: evidence,
      trace,
      graph,
      plan,
      renderedRoles,
      blocks,
      lines,
      detailMode: item.detailMode,
      locale: item.locale,
      reviewerNotes,
      findings,
      approvalStatus: approved ? "APPROVED" : "REVIEW_REQUIRED",
    };
  });
}
