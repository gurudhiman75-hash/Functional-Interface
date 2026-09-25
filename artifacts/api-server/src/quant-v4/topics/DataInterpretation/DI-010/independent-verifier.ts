import type { Di010Question, Di010QuestionSet } from "./types";

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function interval(set: Di010QuestionSet, index: number) {
  const item = set.stimulus.classes[index]!;
  return `${fmt(item.lower)}–${fmt(item.upper)}`;
}

function coordinate(x: number, y: number) {
  return `(${fmt(x)}, ${fmt(y)})`;
}

function percentage(numerator: number, denominator: number) {
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function ratio(left: number, right: number) {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function expectedAnswer(set: Di010QuestionSet, question: Di010Question): string {
  const classes = set.stimulus.classes;
  switch (question.kind) {
    case "CONSTRUCTION_PROPERTY":
      return "Class marks (midpoints)";
    case "READ_CLASS_FREQUENCY_CONTEXT":
      return String(classes[Number(question.evidence.targetIndex)]!.frequency);
    case "MODAL_CLASS_FROM_POLYGON": {
      const max = Math.max(...classes.map((item) => item.frequency));
      return interval(set, classes.findIndex((item) => item.frequency === max));
    }
    case "CLASS_INTERVAL_FROM_MARK":
      return interval(set, Number(question.evidence.targetIndex));
    case "TOTAL_FREQUENCY_FROM_POLYGON":
      return String(classes.reduce((sum, item) => sum + item.frequency, 0));
    case "CONSECUTIVE_RANGE_TOTAL_CONTEXT": {
      const start = Number(question.evidence.startIndex);
      const end = Number(question.evidence.endIndex);
      return String(classes.slice(start, end + 1).reduce((sum, item) => sum + item.frequency, 0));
    }
    case "FREQUENCY_DIFFERENCE_CONTEXT": {
      const high = classes[Number(question.evidence.highIndex)]!;
      const low = classes[Number(question.evidence.lowIndex)]!;
      return String(high.frequency - low.frequency);
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const target = classes[Number(question.evidence.targetIndex)]!;
      const total = classes.reduce((sum, item) => sum + item.frequency, 0);
      return percentage(target.frequency, total);
    }
    case "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON":
      return String(classes[Number(question.evidence.targetIndex)]!.frequency);
    case "ZERO_CLOSING_ENDPOINTS": {
      const first = classes[0]!;
      const last = classes[classes.length - 1]!;
      return `${coordinate(first.classMark - set.stimulus.classWidth, 0)} and ${coordinate(last.classMark + set.stimulus.classWidth, 0)}`;
    }
    case "RANGE_RATIO_FROM_POLYGON": {
      const leftStart = Number(question.evidence.leftStart);
      const rightStart = Number(question.evidence.rightStart);
      const leftTotal = classes.slice(leftStart, leftStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      const rightTotal = classes.slice(rightStart, rightStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      return ratio(leftTotal, rightTotal);
    }
    case "GROUPED_MEAN_FROM_POLYGON": {
      const total = classes.reduce((sum, item) => sum + item.frequency, 0);
      const weighted = classes.reduce((sum, item) => sum + item.classMark * item.frequency, 0);
      return String(Math.round(weighted / total));
    }
    case "MEDIAN_CLASS_FROM_POLYGON": {
      const total = classes.reduce((sum, item) => sum + item.frequency, 0);
      const target = total / 2;
      let cumulative = 0;
      for (let index = 0; index < classes.length; index += 1) {
        cumulative += classes[index]!.frequency;
        if (cumulative >= target) return interval(set, index);
      }
      throw new Error("DI-010 independent median verifier could not locate the median class.");
    }
  }
}

export function verifyDi010SetIndependently(set: Di010QuestionSet) {
  const failures: string[] = [];
  set.questions.forEach((question) => {
    const expected = expectedAnswer(set, question);
    if (expected !== question.answer) failures.push(`${question.questionId}: expected ${expected}, got ${question.answer}`);
    if (question.options[question.correctIndex] !== expected) failures.push(`${question.questionId}: correctIndex does not point to independently recomputed answer`);
  });
  return { valid: failures.length === 0, failures } as const;
}
