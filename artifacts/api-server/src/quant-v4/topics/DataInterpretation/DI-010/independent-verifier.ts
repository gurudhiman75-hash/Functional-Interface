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

function expectedAnswer(set: Di010QuestionSet, question: Di010Question): string {
  const classes = set.stimulus.classes;
  switch (question.kind) {
    case "GRAPH_TYPE_IDENTIFICATION": return "Frequency polygon";
    case "CLASS_MARK_FROM_INTERVAL": return fmt(classes[Number(question.evidence.targetIndex)]!.classMark);
    case "POINT_COORDINATE_FOR_CLASS": {
      const item = classes[Number(question.evidence.targetIndex)]!;
      return coordinate(item.classMark, item.frequency);
    }
    case "READ_FREQUENCY_AT_CLASS_MARK": return String(classes[Number(question.evidence.targetIndex)]!.frequency);
    case "ZERO_CLOSING_ENDPOINTS": {
      const first = classes[0]!, last = classes[classes.length - 1]!;
      return `${coordinate(first.classMark - set.stimulus.classWidth, 0)} and ${coordinate(last.classMark + set.stimulus.classWidth, 0)}`;
    }
    case "TOTAL_FREQUENCY_FROM_POLYGON": return String(classes.reduce((sum, item) => sum + item.frequency, 0));
    case "MODAL_CLASS_FROM_POLYGON": {
      const max = Math.max(...classes.map((item) => item.frequency));
      return interval(set, classes.findIndex((item) => item.frequency === max));
    }
    case "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES": {
      const left = classes[Number(question.evidence.leftIndex)]!, right = classes[Number(question.evidence.rightIndex)]!;
      return String(Math.abs(left.frequency - right.frequency));
    }
    case "COMBINED_RANGE_TOTAL_FROM_POLYGON": {
      const start = Number(question.evidence.startIndex), end = Number(question.evidence.endIndex);
      return String(classes.slice(start, end + 1).reduce((sum, item) => sum + item.frequency, 0));
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
