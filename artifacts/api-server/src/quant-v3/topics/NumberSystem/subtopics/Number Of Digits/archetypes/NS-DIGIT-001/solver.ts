import { buildMathJax, digitCountOfNumber, digitCountOfPower, digitCountOfProduct, mathJaxPresent, nDigitBoundary, validExponentOptions } from "./math";
import type { NsDigit001Parameters, NsDigit001SolverResult } from "./types";

export function solveNsDigit001(parameters: NsDigit001Parameters): NsDigit001SolverResult {
  const solved = solveAnswer(parameters);
  return {
    ...solved,
    verification: {
      inputValid: inputValid(parameters),
      answerRecomputed: solved.answer === solveAnswer(parameters).answer,
      uniqueOptionValid: parameters.canonicalProblemId !== "CP-005" || solved.validOptions?.length === 1,
      mathJaxValid: mathJaxPresent(solved),
    },
  };
}

function solveAnswer(parameters: NsDigit001Parameters): Omit<NsDigit001SolverResult, "verification"> {
  let answer: number | string;
  let validOptions: number[] = [];
  if (parameters.canonicalProblemId === "CP-001") answer = digitCountOfNumber(requiredAny(parameters.number, "number"));
  else if (parameters.canonicalProblemId === "CP-002") answer = digitCountOfPower(required(parameters.base, "base"), required(parameters.exponent, "exponent"));
  else if (parameters.canonicalProblemId === "CP-003") answer = digitCountOfProduct(parameters.factors ?? []);
  else if (parameters.canonicalProblemId === "CP-004") answer = nDigitBoundary(required(parameters.digitCount, "digitCount"), parameters.boundType ?? "smallest");
  else {
    validOptions = validExponentOptions(required(parameters.base, "base"), required(parameters.digitCount, "digitCount"), parameters.options ?? []);
    answer = required(validOptions[0], "valid option");
  }
  return { answer, digitCount: typeof answer === "number" ? answer : undefined, validOptions, ...buildMathJax(parameters, answer, validOptions) };
}

function inputValid(parameters: NsDigit001Parameters) {
  if (parameters.canonicalProblemId === "CP-001") return typeof parameters.number === "string" || typeof parameters.number === "number";
  if (parameters.canonicalProblemId === "CP-002") return positive(parameters.base) && positive(parameters.exponent);
  if (parameters.canonicalProblemId === "CP-003") return Boolean(parameters.factors?.length && parameters.factors.every(positive));
  if (parameters.canonicalProblemId === "CP-004") return positive(parameters.digitCount) && Boolean(parameters.boundType);
  return positive(parameters.base) && positive(parameters.digitCount) && Boolean(parameters.options?.length);
}

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing ${name}.`);
  return value;
}

function requiredAny(value: number | string | undefined, name: string) {
  if (typeof value !== "number" && typeof value !== "string") throw new Error(`Missing ${name}.`);
  return value;
}
