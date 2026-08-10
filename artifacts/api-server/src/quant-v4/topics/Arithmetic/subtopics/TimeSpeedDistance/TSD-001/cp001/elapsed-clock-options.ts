import { add, isPositive, subtract, type Rational } from "../foundation/rational";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { DisplayContract, TsdCp001MisconceptionId, TsdCp001OptionAudit } from "./runtime-types";
import { authorityOrdinal, formatAnswer, r, trailingSeedOrdinal } from "./runtime-support";

interface OptionSet {
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
}

type ElapsedInput = Extract<TsdCp001SolveInput, { solveMode: "elapsedClockTime" }>;
type ScalarSolution = Extract<TsdCp001Solution, { answerKind: "TIME" }>;

function wrongCandidate(
  solution: ScalarSolution,
  display: DisplayContract,
  value: Rational,
  misconceptionId: TsdCp001MisconceptionId,
): TsdCp001OptionAudit {
  return {
    text: formatAnswer({ ...solution, value }, display),
    misconceptionId,
    isCorrect: false,
  };
}

export function elapsedClockOptionPackage(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  _input: ElapsedInput,
  solution: ScalarSolution,
  display: DisplayContract,
): OptionSet {
  const shorter = subtract(solution.value, r(60));
  const wrong: TsdCp001OptionAudit[] = [
    wrongCandidate(
      solution,
      display,
      isPositive(shorter) ? shorter : add(solution.value, r(90)),
      "DROP_ONE_HOUR_FROM_INTERVAL",
    ),
    wrongCandidate(solution, display, add(solution.value, r(60)), "ADD_ONE_HOUR_TO_INTERVAL"),
    wrongCandidate(solution, display, add(solution.value, r(30)), "MISREAD_TIME"),
  ];
  const correct: TsdCp001OptionAudit = {
    text: formatAnswer(solution, display),
    misconceptionId: "CORRECT",
    isCorrect: true,
  };
  const correctIndex = (trailingSeedOrdinal(seed) + authorityOrdinal(authority)) % 4;
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex,
  };
}
