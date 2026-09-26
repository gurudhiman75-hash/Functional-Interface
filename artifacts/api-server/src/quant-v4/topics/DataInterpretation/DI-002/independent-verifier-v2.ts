import { ratioDisplay } from "../DI-001/exact";
import type { Di002V2Question, Di002V2QuestionSet } from "./advanced-table-v2-types";

function nearestWholePercent(numerator: number, denominator: number) {
  return Math.round((numerator * 100) / denominator);
}

function applicantsFor(set: Di002V2QuestionSet) {
  return set.stimulus.rows.map((row) => {
    const value = (row.selected * 100) / row.selectionPercent;
    if (!Number.isSafeInteger(value)) throw new Error("DI-002 V2 verifier found a non-integer applicant reconstruction.");
    return value;
  });
}

export function independentlyVerifyDi002V2Question(set: Di002V2QuestionSet, question: Di002V2Question) {
  const rows = set.stimulus.rows;
  const applicants = applicantsFor(set);
  const selected = rows.map((row) => row.selected);
  const rejected = rows.map((row, index) => applicants[index]! - selected[index]!);
  const totalSelected = selected.reduce((sum, value) => sum + value, 0);
  const ev = question.evidence;
  let expected = "";

  if (question.kind === "DIRECT_SELECTED_VALUE") {
    expected = String(selected[Number(ev.targetIndex)]!);
  } else if (question.kind === "DIRECT_SELECTION_RATE") {
    expected = `${rows[Number(ev.targetIndex)]!.selectionPercent}%`;
  } else if (question.kind === "MISSING_APPLICANTS_FROM_RATE") {
    expected = String(applicants[Number(ev.targetIndex)]!);
  } else if (question.kind === "REJECTED_COUNT") {
    expected = String(rejected[Number(ev.targetIndex)]!);
  } else if (question.kind === "SELECTED_DIFFERENCE") {
    expected = String(Math.abs(selected[Number(ev.firstIndex)]! - selected[Number(ev.secondIndex)]!));
  } else if (question.kind === "COMBINED_SELECTED") {
    expected = String(selected[Number(ev.firstIndex)]! + selected[Number(ev.secondIndex)]!);
  } else if (question.kind === "SELECTION_RATE_POINT_GAP") {
    expected = `${Math.abs(rows[Number(ev.firstIndex)]!.selectionPercent - rows[Number(ev.secondIndex)]!.selectionPercent)} percentage points`;
  } else if (question.kind === "SELECTED_SHARE_OF_TOTAL") {
    expected = `${nearestWholePercent(selected[Number(ev.targetIndex)]!, totalSelected)}%`;
  } else if (question.kind === "COMBINED_SELECTED_RATIO") {
    const left = selected[Number(ev.leftA)]! + selected[Number(ev.leftB)]!;
    const right = selected[Number(ev.rightA)]! + selected[Number(ev.rightB)]!;
    expected = ratioDisplay(left, right);
  } else if (question.kind === "RELATIVE_SELECTED_PERCENT_EXCESS") {
    const larger = selected[Number(ev.largerIndex)]!;
    const smaller = selected[Number(ev.smallerIndex)]!;
    expected = `${nearestWholePercent(larger - smaller, smaller)}%`;
  } else if (question.kind === "COMBINED_SELECTION_RATE") {
    const first = Number(ev.firstIndex);
    const second = Number(ev.secondIndex);
    expected = `${nearestWholePercent(selected[first]! + selected[second]!, applicants[first]! + applicants[second]!)}%`;
  } else if (question.kind === "REJECTED_TO_SELECTED_RATIO") {
    const first = Number(ev.firstIndex);
    const second = Number(ev.secondIndex);
    expected = ratioDisplay(rejected[first]! + rejected[second]!, selected[first]! + selected[second]!);
  } else {
    const exhaustive: never = question.kind;
    throw new Error(`Unknown DI-002 V2 task kind: ${String(exhaustive)}`);
  }

  return {
    valid: expected === question.answer
      && question.options[question.correctIndex] === question.answer
      && question.options.length === set.optionCount
      && new Set(question.options).size === set.optionCount,
    expected,
    actual: question.answer,
  } as const;
}

export function independentlyVerifyDi002V2Set(set: Di002V2QuestionSet) {
  const results = set.questions.map((question) => independentlyVerifyDi002V2Question(set, question));
  return {
    valid: results.every((result) => result.valid),
    results,
  } as const;
}
