import { boundedShift, leftRank, midpointLetters, oppositeLetter } from "./foundation/alphabet";
import { unchangedRefs } from "./foundation/word";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "./types";

export interface AlpAmbiguityAudit {
  readonly accepted: boolean;
  readonly reasons: readonly string[];
}

export function auditAlpInstance(ql: AlpQuestionLogic, data: AlpInstanceData, solved: AlpSolverResult): AlpAmbiguityAudit {
  const reasons: string[] = [];
  if (!solved.answer.trim()) reasons.push("The independent solver produced an empty answer.");

  if (ql.solveMode.includes("BOUNDED") || ql.solveMode.startsWith("SHIFT_") || ql.solveMode.startsWith("POSITION_AFTER_SHIFT")) {
    if (data.letter && data.offset && data.direction) {
      const candidate = boundedShift(data.letter, data.direction === "RIGHT" ? data.offset : -data.offset);
      if (!candidate) reasons.push("A non-cyclic question crosses the alphabet boundary.");
    }
  }

  if (ql.solveMode === "CYCLIC_SHIFT_RIGHT_FROM_LETTER") {
    if (leftRank(data.letter!) + data.offset! <= 26) reasons.push("The cyclic-right QL does not actually exercise wrapping.");
  }
  if (ql.solveMode === "CYCLIC_SHIFT_LEFT_FROM_LETTER") {
    if (leftRank(data.letter!) - data.offset! >= 1) reasons.push("The cyclic-left QL does not actually exercise wrapping.");
  }

  if (ql.solveMode === "MIDPOINT_SINGLE" || ql.solveMode === "MIDPOINT_DISTANCE_FROM_ENDPOINTS" || ql.solveMode === "EQUAL_SIDE_GAP") {
    if (midpointLetters(data.letter!, data.secondLetter!).length !== 1) reasons.push("A single-middle task has two centre letters.");
  }
  if (ql.solveMode === "MIDPOINT_PAIR") {
    if (midpointLetters(data.letter!, data.secondLetter!).length !== 2) reasons.push("A double-middle task has one centre letter.");
  }

  if (ql.solveMode === "IDENTIFY_OPPOSITE_PAIR") {
    const matches = data.pairOptions!.filter(([first, second]) => oppositeLetter(first) === second);
    if (matches.length !== 1) reasons.push(`Opposite-pair selection has ${matches.length} valid options.`);
  }
  if (ql.solveMode === "IDENTIFY_PAIR_WITH_GAP" || ql.solveMode === "IDENTIFY_PAIR_WITH_DISTANCE") {
    const rendered = data.pairOptions!.map(([first, second]) => `${first}:${second}`);
    if (new Set(rendered).size !== rendered.length) reasons.push("Pair-selection options are duplicated.");
  }

  if (ql.solveMode.startsWith("WORD_POSITION_AFTER") && !data.occurrenceRef) {
    reasons.push("A repeated-letter-safe inverse word task lacks an occurrence reference.");
  }
  if (ql.solveMode === "WORD_IDENTIFY_UNCHANGED_ASC") {
    const unchanged = unchangedRefs(data.word!, data.wordTransformId!);
    if (unchanged.length === 0) reasons.push("The identify-unchanged task has no letter occurrence to identify.");
  }

  return { accepted: reasons.length === 0, reasons };
}
