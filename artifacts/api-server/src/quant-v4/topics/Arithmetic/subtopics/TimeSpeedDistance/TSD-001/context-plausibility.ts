import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";

export type TsdContextQuestion = TsdCp001GeneratedQuestion | TsdCp002GeneratedQuestion;

const CONTEXT_REPLACEMENTS = Object.freeze([
  ["A cyclist covers part of a journey", "A motorcycle covers part of a journey"],
  ["A cyclist travels at", "A motorcycle travels at"],
  ["A rider", "A motorcyclist"],
  ["a rider", "a motorcyclist"],
  ["rider's speed", "motorcyclist's speed"],
  ["then rides at", "then continues at"],
  ["A courier covers", "During a controlled route test, a courier van covers"],
  ["A field engineer travels", "During a controlled road trial, a test vehicle travels"],
  ["A survey crew reaches", "During a controlled road trial, a survey vehicle reaches"],
  ["A machine carrier moves", "A transport vehicle moves"],
  ["A logistics carrier covers", "A logistics vehicle covers"],
  ["During a refrigerated delivery, a carrier covers", "During a refrigerated delivery, a delivery van covers"],
  ["During a controlled road trial, a test fleet spends", "During a controlled road trial, a test vehicle spends"],
  ["A maintenance team travels", "A maintenance vehicle travels"],
  ["An inspection team travels", "An inspection vehicle travels"],
] as const);

function remodelText(value: string): string {
  return CONTEXT_REPLACEMENTS.reduce(
    (current, [source, replacement]) => current.replace(source, replacement),
    value,
  );
}

export function remodelTsdContext<T extends TsdContextQuestion>(question: T): T {
  const stem = remodelText(question.stem);
  const stemMathJax = remodelText(question.stemMathJax);
  if (stem === question.stem && stemMathJax === question.stemMathJax) return question;
  return Object.freeze({
    ...question,
    stem,
    stemMathJax,
  }) as T;
}
