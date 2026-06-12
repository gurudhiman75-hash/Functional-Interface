import {
  buildMathJax,
  cycleForBase,
  cyclePattern,
  cyclePosition,
  lastDigit,
  lastDigitOfPower,
  lastDigitOfProduct,
  lastDigitOfTower,
  mathJaxPresent,
  towerModulo,
  validExponentOptions,
} from "./math";
import type { NsLastdig001Parameters, NsLastdig001SolverResult } from "./types";

export function solveNsLastdig001(parameters: NsLastdig001Parameters): NsLastdig001SolverResult {
  const solved = solveAnswer(parameters);
  return {
    ...solved,
    verification: {
      inputValid: inputValid(parameters),
      answerRecomputed: solved.answer === solveAnswer(parameters).answer,
      uniqueOptionValid: parameters.canonicalProblemId !== "CP-005" || (solved.validOptions?.length === 1 && solved.validOptions[0] === solved.answer),
      mathJaxValid: mathJaxPresent(solved),
    },
  };
}

function solveAnswer(parameters: NsLastdig001Parameters): Omit<NsLastdig001SolverResult, "verification"> {
  if (parameters.canonicalProblemId === "CP-001") {
    const base = required(parameters.base, "base");
    const exponent = required(parameters.exponent, "exponent");
    const cycle = cycleForBase(base);
    const position = cyclePosition(exponent, cycle.length);
    const answer = lastDigitOfPower(base, exponent);
    return { answer, baseLastDigit: lastDigit(base), cycle, cycleLength: cycle.length, cyclePosition: position, ...buildMathJax({ base, exponent, cycle, cyclePositionValue: position }) };
  }
  if (parameters.canonicalProblemId === "CP-002") {
    const terms = parameters.powerTerms ?? [];
    const termLastDigits = terms.map((term) => lastDigitOfPower(term.base, term.exponent));
    const answer = lastDigitOfProduct(terms);
    const cycle = terms[0] ? cycleForBase(terms[0].base) : [];
    return { answer, baseLastDigit: terms[0] ? lastDigit(terms[0].base) : undefined, cycle, cycleLength: cycle.length, termLastDigits, ...buildMathJax({ cycle, powerTerms: terms, termLastDigits, productLastDigit: answer }) };
  }
  if (parameters.canonicalProblemId === "CP-003") {
    const bases = parameters.towerBases ?? [];
    const cycle = cycleForBase(required(bases[0], "tower base"));
    const effective = towerModulo(bases.slice(1), cycle.length);
    const position = effective === 0 ? cycle.length : effective;
    const answer = lastDigitOfTower(bases);
    return { answer, baseLastDigit: lastDigit(bases[0]), cycle, cycleLength: cycle.length, cyclePosition: position, effectiveExponent: position, ...buildMathJax({ base: bases[0], cycle, cyclePositionValue: position, effectiveExponent: position, towerBases: bases }) };
  }
  if (parameters.canonicalProblemId === "CP-004") {
    const base = required(parameters.base, "base");
    const cycle = cycleForBase(base);
    const answer = cyclePattern(base);
    return { answer, baseLastDigit: lastDigit(base), cycle, cycleLength: cycle.length, ...buildMathJax({ base, cycle }) };
  }
  const base = required(parameters.base, "base");
  const target = required(parameters.targetLastDigit, "targetLastDigit");
  const options = parameters.options ?? [];
  const cycle = cycleForBase(base);
  const validOptions = validExponentOptions(base, target, options);
  const answer = required(validOptions[0], "valid option");
  const position = cycle.indexOf(target) + 1;
  return { answer, baseLastDigit: lastDigit(base), cycle, cycleLength: cycle.length, cyclePosition: position, validOptions, ...buildMathJax({ base, cycle, cyclePositionValue: position }) };
}

function inputValid(parameters: NsLastdig001Parameters) {
  if (parameters.canonicalProblemId === "CP-001") return positive(parameters.base) && positive(parameters.exponent);
  if (parameters.canonicalProblemId === "CP-002") return Boolean(parameters.powerTerms?.length && parameters.powerTerms.every((term) => positive(term.base) && positive(term.exponent)));
  if (parameters.canonicalProblemId === "CP-003") return Boolean(parameters.towerBases?.length && parameters.towerBases.every(positive));
  if (parameters.canonicalProblemId === "CP-004") return positive(parameters.base);
  return positive(parameters.base) && typeof parameters.targetLastDigit === "number" && Boolean(parameters.options?.length);
}

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing ${name}.`);
  return value;
}
