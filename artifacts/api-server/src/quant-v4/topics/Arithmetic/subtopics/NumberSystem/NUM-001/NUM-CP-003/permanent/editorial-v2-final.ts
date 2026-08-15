import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import type { NumCp003PermanentQlId } from "./allocation";
import {
  NUM_CP003_EDITORIAL_V2_RELEASE,
  runNumCp003EditorialV2,
  type NumCp003EditorialV2Question,
} from "./editorial-v2";
import {
  conciseDivisibilityCheck,
  conciseDivisibilityEvidence,
} from "./editorial-v2-divisibility-evidence";
import type { NumCp003PermanentRuntimeInput } from "./runtime";

export { NUM_CP003_EDITORIAL_V2_RELEASE };
export type { NumCp003EditorialV2Question };

function math(value: string): string {
  return `\\(${value}\\)`;
}

function formatInteger(value: bigint): string {
  return value.toLocaleString("en-IN");
}

function directSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
): readonly string[] {
  return Object.freeze(state.divisorOptions.map((divisor) =>
    conciseDivisibilityCheck(state.number, divisor)));
}

function repeatedSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
): readonly string[] {
  const checks = state.divisorOptions.map((divisor) => conciseDivisibilityCheck(state.number, divisor));
  const first = checks[0] ?? "";
  return Object.freeze([
    `Repeating ${math(state.block)} ${state.repeats} times gives ${math(formatInteger(state.number))}. ${first}`,
    ...checks.slice(1),
  ].slice(0, 4));
}

function claimSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
): readonly string[] {
  return Object.freeze(state.claims.map((claim, index) => {
    const evidence = conciseDivisibilityEvidence(claim.number, claim.divisor);
    return `Claim ${index + 1}: ${claim.text} ${evidence} The claim is ${claim.isTrue ? "true" : "false"}.`;
  }));
}

function refineSolution(question: NumCp003EditorialV2Question): readonly string[] {
  const state = question.hiddenState;
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return directSolution(state);
    case "IMPLICIT_REPEATED_NUMERAL":
      return repeatedSolution(state);
    case "CLAIM_VALIDATION":
      return claimSolution(state);
    default:
      return question.explanation.solution;
  }
}

function refineQuestion(question: NumCp003EditorialV2Question): NumCp003EditorialV2Question {
  const solution = refineSolution(question);
  if (solution.length < 2 || solution.length > 4) {
    throw new Error(`${question.permanentQlId}/${question.seed}: final V2 solution must contain 2-4 lines`);
  }
  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      solution,
    }),
  });
}

export function runNumCp003EditorialV2Final(
  input: NumCp003PermanentRuntimeInput = {},
): NumCp003EditorialV2Question {
  return refineQuestion(runNumCp003EditorialV2(input));
}

export function runNumCp003EditorialV2FinalForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
): NumCp003EditorialV2Question {
  return runNumCp003EditorialV2Final({ questionLanguageId, seed, language: "en" });
}
