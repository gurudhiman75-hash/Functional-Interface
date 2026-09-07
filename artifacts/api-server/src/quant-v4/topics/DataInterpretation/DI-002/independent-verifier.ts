import type { Di002Question, Di002QuestionSet, Di002Row } from "./types";

function gcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}

function ratio(left: number, right: number): string {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-002 independent verifier received an invalid percentage fraction.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function applicants(row: Di002Row): number {
  const value = (row.selected * 100) / row.selectionPercent;
  if (!Number.isSafeInteger(value)) {
    throw new Error("DI-002 independent verifier found a non-integral reconstructed applicant count.");
  }
  return value;
}

export function independentlySolveDi002Question(set: Di002QuestionSet, question: Di002Question): string {
  const rows = set.stimulus.rows;
  const e = question.evidence;

  switch (question.kind) {
    case "MISSING_REVERSE_PERCENTAGE":
      return String(applicants(rows[e.hiddenIndex!]!));

    case "PERCENT_CHANGE_SELECTED": {
      const from = rows[e.fromIndex!]!.selected;
      const to = rows[e.toIndex!]!.selected;
      return percent(to - from, from);
    }

    case "SHARE_OF_TOTAL_SELECTED": {
      const pair = rows[e.firstIndex!]!.selected + rows[e.secondIndex!]!.selected;
      const total = rows.reduce((sum, row) => sum + row.selected, 0);
      return percent(pair, total);
    }

    case "COMBINED_SELECTED_RATIO": {
      const left = rows[e.leftA!]!.selected + rows[e.leftB!]!.selected;
      const right = rows[e.rightA!]!.selected + rows[e.rightB!]!.selected;
      return ratio(left, right);
    }

    case "RELATIVE_SELECTION_RATE_CHANGE": {
      const from = rows[e.fromIndex!]!.selectionPercent;
      const to = rows[e.toIndex!]!.selectionPercent;
      return percent(to - from, from);
    }
  }
}

export function independentlyVerifyDi002QuestionSet(set: Di002QuestionSet): boolean {
  if (set.questions.length !== 5) return false;
  if (set.stimulus.rows.length !== 5) return false;
  if (set.stimulus.rows.filter((row) => row.applicants === "?").length !== 1) return false;
  if (set.stimulus.rows[set.stimulus.hiddenApplicantIndex]?.applicants !== "?") return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi002Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === set.optionCount &&
      new Set(question.options).size === question.options.length &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
